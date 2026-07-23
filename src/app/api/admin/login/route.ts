import type { NextRequest } from 'next/server'

import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminConfigured,
  sessionCookieOptions,
  verifyPassword,
} from '@/lib/admin-auth'

/**
 * Sign in to the order dashboard.
 *
 * Every failure returns the same sentence. Telling someone their password was
 * "too short" or "close" hands a guesser a free hint, and there is only one
 * password protecting every customer's address on this site.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WINDOW_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5
const GENERIC_FAILURE = 'That password is not right.'

/** Per-instance throttle. Enough to make online guessing impractical. */
const attempts = new Map<string, number[]>()

/**
 * Identify the caller for throttling.
 *
 * Counter-intuitive but load-bearing: `x-forwarded-for` is append-only. Each
 * proxy adds its view of the previous hop to the END, so the FIRST entry is
 * whatever the client sent — rotate it and the brute-force throttle is gone.
 * The LAST entry was written by the edge itself and is the only one a client
 * cannot forge, so that is the one to key on. Do not "fix" this back to [0].
 *
 * Duplicated from `api/order/route.ts` rather than shared: both are route
 * files, and a lib module would be a third place to look for one small rule.
 */
function clientKey(request: NextRequest): string {
  // Netlify sets this itself and overwrites any client-supplied copy.
  const edgeIp = request.headers.get('x-nf-client-connection-ip')?.trim()
  if (edgeIp) return edgeIp

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const hops = forwarded.split(',')
    const nearest = hops[hops.length - 1]?.trim()
    if (nearest) return nearest
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

function isThrottled(key: string): boolean {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((at) => now - at < WINDOW_MS)

  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(key, recent)
    return true
  }

  attempts.set(key, [...recent, now])

  // Keep the map from growing without bound on a long-lived instance.
  if (attempts.size > 500) {
    for (const [entryKey, stamps] of attempts) {
      if (stamps.every((at) => now - at >= WINDOW_MS)) {
        attempts.delete(entryKey)
      }
    }
  }

  return false
}

function sessionCookie(token: string): string {
  return [
    `${ADMIN_COOKIE}=${token}`,
    `Path=${sessionCookieOptions.path}`,
    `Max-Age=${sessionCookieOptions.maxAge}`,
    'SameSite=Lax',
    'HttpOnly',
    sessionCookieOptions.secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isAdminConfigured()) {
    // Anyone can reach this endpoint, so the reply stays generic. The operator
    // is the only person who can act on the detail, and reads it in the log.
    console.error(
      '[purasynth] Admin sign-in refused: ADMIN_PASSWORD is missing or shorter than 12 characters. See the README for the required environment.'
    )

    return Response.json(
      {
        success: false,
        error: 'This dashboard is not configured yet. See the README.',
      },
      { status: 503 }
    )
  }

  if (isThrottled(clientKey(request))) {
    return Response.json(
      { success: false, error: 'Too many attempts. Try again in a few minutes.' },
      { status: 429 }
    )
  }

  let password = ''
  try {
    const body: unknown = await request.json()
    if (typeof body === 'object' && body !== null) {
      const candidate = (body as Record<string, unknown>).password
      if (typeof candidate === 'string') password = candidate
    }
  } catch {
    return Response.json(
      { success: false, error: 'We could not read that request.' },
      { status: 400 }
    )
  }

  if (!verifyPassword(password)) {
    return Response.json(
      { success: false, error: GENERIC_FAILURE },
      { status: 401 }
    )
  }

  const token = createSessionToken()
  if (!token) {
    return Response.json(
      { success: false, error: 'The dashboard is not configured.' },
      { status: 503 }
    )
  }

  // Never let a shared cache hold on to a response that carries a session.
  const response = Response.json(
    { success: true },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  )
  response.headers.append('Set-Cookie', sessionCookie(token))

  return response
}
