import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Single-operator auth for the order dashboard.
 *
 * There is one password (ADMIN_PASSWORD) and no user accounts, because one
 * person runs this shop. A successful login sets an HMAC-signed, HttpOnly
 * cookie holding only an expiry timestamp — there is no session store to keep
 * in sync and nothing useful in the cookie if it leaks after expiry.
 */

export const ADMIN_COOKIE = 'purasynth_admin'

const SESSION_TTL_MS = 12 * 60 * 60 * 1000
const MIN_PASSWORD_LENGTH = 12

/** Compare two strings without leaking their contents through timing. */
function safeEqual(a: string, b: string): boolean {
  // timingSafeEqual throws on length mismatch, which would itself be a leak.
  // Hashing first gives both sides a fixed 32-byte length.
  const hashA = createHmac('sha256', 'compare').update(a, 'utf8').digest()
  const hashB = createHmac('sha256', 'compare').update(b, 'utf8').digest()

  return timingSafeEqual(hashA, hashB)
}

function sessionSecret(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim()
  if (explicit && explicit.length >= 16) return explicit

  // Fall back to deriving the signing key from the password, so the dashboard
  // needs one environment variable instead of two. Anyone who knows the
  // password could log in anyway, so deriving from it costs nothing — and
  // changing the password rotates the key, signing every session out.
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (password && password.length >= MIN_PASSWORD_LENGTH) {
    return createHmac('sha256', 'purasynth.admin.session.v1')
      .update(password)
      .digest('hex')
  }

  return null
}

function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim()
  return password && password.length >= MIN_PASSWORD_LENGTH ? password : null
}

/**
 * The dashboard refuses to run unless both secrets are set and long enough.
 * A short or missing password must lock the door, never open it.
 */
export function isAdminConfigured(): boolean {
  return adminPassword() !== null && sessionSecret() !== null
}

export function verifyPassword(input: string): boolean {
  const expected = adminPassword()
  if (!expected) return false

  return safeEqual(input, expected)
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSessionToken(): string | null {
  const secret = sessionSecret()
  if (!secret) return null

  const expiresAt = String(Date.now() + SESSION_TTL_MS)
  return `${expiresAt}.${sign(expiresAt, secret)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = sessionSecret()
  if (!secret || !token) return false

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return false

  const expiresAt = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  if (!safeEqual(signature, sign(expiresAt, secret))) return false

  const expiry = Number(expiresAt)
  return Number.isFinite(expiry) && expiry > Date.now()
}

/** Read and validate the session cookie on the current request. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_MS / 1000,
} as const
