import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { isAdminAuthenticated } from '@/lib/admin-auth'
import { ORDER_STATUSES, type OrderRecord } from '@/lib/order-types'
import { listOrders, updateOrderStatus } from '@/lib/orders'

/**
 * Read and update orders.
 *
 * Both handlers check the session before touching the body or the database.
 * Everything here returns customer names, addresses and phone numbers, so an
 * unauthenticated request must stop at the door.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const patchSchema = z.object({
  id: z.uuid('Unknown order.'),
  status: z.enum(ORDER_STATUSES, { error: 'Unknown status.' }),
})

interface AdminOrdersResponse {
  readonly success: boolean
  readonly orders?: readonly OrderRecord[]
  readonly error?: string
}

/**
 * Every reply from this route is either customer PII or a signal about who is
 * signed in, so nothing here may be stored by a browser, proxy or CDN.
 */
function json(body: AdminOrdersResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

function unauthorised(): Response {
  return json({ success: false, error: 'Not signed in.' }, 401)
}

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) return unauthorised()

  try {
    const orders = await listOrders()
    return json({ success: true, orders }, 200)
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown failure'
    console.error(`[purasynth] Could not list orders: ${reason}`)

    return json(
      { success: false, error: 'Could not load orders. Please try again.' },
      502
    )
  }
}

export async function PATCH(request: NextRequest): Promise<Response> {
  if (!(await isAdminAuthenticated())) return unauthorised()

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ success: false, error: 'We could not read that request.' }, 400)
  }

  const parsed = patchSchema.safeParse(payload)

  if (!parsed.success) {
    return json(
      {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Invalid request.',
      },
      400
    )
  }

  try {
    await updateOrderStatus(parsed.data.id, parsed.data.status)
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown failure'
    console.error(`[purasynth] Status update failed: ${reason}`)

    return json(
      { success: false, error: 'Could not update that order. Please try again.' },
      502
    )
  }

  return json({ success: true }, 200)
}
