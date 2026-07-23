import type { NextRequest } from 'next/server'

import { ADMIN_COOKIE, sessionCookieOptions } from '@/lib/admin-auth'

/**
 * Sign out. Clears the session cookie and sends the browser to the sign-in
 * page, so the dashboard's sign-out control can be a plain form and needs no
 * client-side JavaScript.
 *
 * POST only: a GET would let a prefetch or an image tag sign the owner out.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clearedCookie(): string {
  return [
    `${ADMIN_COOKIE}=`,
    `Path=${sessionCookieOptions.path}`,
    'Max-Age=0',
    'SameSite=Lax',
    'HttpOnly',
    sessionCookieOptions.secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export function POST(request: NextRequest): Response {
  return new Response(null, {
    // 303 so the browser follows with a GET rather than re-posting.
    status: 303,
    headers: {
      Location: new URL('/admin/login', request.url).toString(),
      'Set-Cookie': clearedCookie(),
      'Cache-Control': 'no-store',
    },
  })
}
