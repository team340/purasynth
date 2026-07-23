import type { NextRequest } from 'next/server'

import { MAX_QTY_PER_LINE, lineKey } from '@/lib/cart-store'
import {
  orderSchema,
  type OrderApiResponse,
  type OrderFieldErrors,
  type OrderInput,
} from '@/lib/order-schema'
import type { PricedLine, PricedOrder } from '@/lib/order-types'
import { saveOrder } from '@/lib/orders'
import { getFitment, getProductBySlug } from '@/lib/products'
import { site } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const MAX_BODY_BYTES = 16_000
/** Hex characters after the date. 12 gives 2^48 values per day. */
const ORDER_RANDOM_HEX = 12

const UNAVAILABLE_MESSAGE =
  'One of the items in your cart is no longer available in that fitment. Please review your cart and try again.'

/**
 * Best-effort in-memory throttle. On serverless this is per-instance, so it
 * slows down casual abuse rather than guaranteeing a global limit. Move to a
 * shared store (Upstash, Vercel KV) if the site ever gets real traffic.
 */
const requestLog = new Map<string, number[]>()

/**
 * Identify the caller for throttling.
 *
 * Counter-intuitive but load-bearing: `x-forwarded-for` is append-only. Each
 * proxy adds its view of the previous hop to the END, so the FIRST entry is
 * whatever the client sent and can be rotated freely to reset the limit. The
 * LAST entry was written by the edge itself and is the only one a client
 * cannot forge — that is the one to key on. Do not "fix" this back to [0].
 *
 * The same helper is duplicated in `api/admin/login/route.ts`; both are
 * server-only route files and neither imports from the other.
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

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  )

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recent)
    return true
  }

  requestLog.set(key, [...recent, now])

  // Keep the map from growing without bound on a long-lived instance.
  if (requestLog.size > 500) {
    for (const [entryKey, stamps] of requestLog) {
      if (stamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(entryKey)
      }
    }
  }

  return false
}

/**
 * PSY-YYYYMMDD-XXXXXXXXXXXX, e.g. PSY-20260723-4F1B9C2E7A05.
 *
 * `order_number` is UNIQUE, so a collision is a failed order for a real
 * customer rather than a merged one. The random segment is wide enough that
 * a day's orders will not realistically meet.
 */
function buildOrderNumber(): string {
  const now = new Date()
  const datePart = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
  ].join('')
  const randomPart = crypto
    .randomUUID()
    .replace(/-/g, '')
    .slice(0, ORDER_RANDOM_HEX)
    .toUpperCase()

  return `PSY-${datePart}-${randomPart}`
}

type PricingResult =
  | { readonly ok: true; readonly priced: PricedOrder }
  | { readonly ok: false; readonly error: string }

/**
 * Price the basket from the catalogue. Client-supplied prices are ignored
 * entirely, and an unknown slug or a fitment that does not belong to that
 * product fails the whole order rather than being quietly dropped.
 *
 * Lines are merged on `slug::fitment` — the cart's own key — before anything
 * is priced. The schema caps quantity per array entry, so ten entries of the
 * same wheel at ten sets each would otherwise buy a hundred sets under a rule
 * that says ten.
 */
function priceOrder(order: OrderInput): PricingResult {
  const merged = new Map<
    string,
    { readonly slug: string; readonly fitment: string; readonly qty: number }
  >()

  for (const item of order.items) {
    const key = lineKey(item.slug, item.fitment)
    const existing = merged.get(key)

    merged.set(key, {
      slug: item.slug,
      fitment: item.fitment,
      qty: (existing?.qty ?? 0) + item.qty,
    })
  }

  const lines: PricedLine[] = []

  for (const item of merged.values()) {
    const product = getProductBySlug(item.slug)
    if (!product) return { ok: false, error: UNAVAILABLE_MESSAGE }

    const fitment = getFitment(product, item.fitment)
    if (!fitment) return { ok: false, error: UNAVAILABLE_MESSAGE }

    if (item.qty > MAX_QTY_PER_LINE) {
      return {
        ok: false,
        error: `${MAX_QTY_PER_LINE} sets of ${product.name} in ${fitment.label} is the most one online order can take. Please lower the quantity, or email ${site.email} for a bigger run.`,
      }
    }

    lines.push({
      product,
      qty: item.qty,
      fitmentId: fitment.id,
      fitmentLabel: fitment.label,
      lineTotal: product.price * item.qty,
    })
  }

  if (lines.length === 0) return { ok: false, error: UNAVAILABLE_MESSAGE }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const shippingFee =
    subtotal >= site.freeShippingThreshold ? 0 : site.standardShippingFee

  return {
    ok: true,
    priced: {
      orderNumber: buildOrderNumber(),
      lines,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    },
  }
}

function json(body: OrderApiResponse, status: number): Response {
  return Response.json(body, { status })
}

export async function POST(request: NextRequest): Promise<Response> {
  if (isRateLimited(clientKey(request))) {
    return json(
      {
        success: false,
        error: 'Too many attempts. Please wait a minute and try again.',
      },
      429
    )
  }

  // Cheap early reject only. The header is absent on a chunked request and is
  // NaN for a junk value, and both compare false against the cap, so the real
  // enforcement is on the bytes actually received below.
  const declaredBytes = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
    return json({ success: false, error: 'That request was too large.' }, 413)
  }

  let raw: string
  try {
    raw = await request.text()
  } catch {
    return json({ success: false, error: 'We could not read that request.' }, 400)
  }

  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return json({ success: false, error: 'That request was too large.' }, 413)
  }

  let payload: unknown
  try {
    payload = JSON.parse(raw) as unknown
  } catch {
    return json({ success: false, error: 'We could not read that request.' }, 400)
  }

  const parsed = orderSchema.safeParse(payload)

  if (!parsed.success) {
    const fieldErrors: OrderFieldErrors = {}
    let cartError: string | undefined

    for (const issue of parsed.error.issues) {
      const field = issue.path[0]
      if (typeof field !== 'string') continue

      // Never name the honeypot back to the caller. An error rendered beside
      // that input would tell a bot exactly which field is the trap.
      if (field === 'website') continue

      // The form has no slot for an `items` error, so one keyed there would
      // render nowhere and read as a dead button. Promote it to the top-level
      // message, which does have a live region.
      if (field === 'items') {
        cartError ??= issue.message
        continue
      }

      if (!(field in fieldErrors)) {
        fieldErrors[field as keyof OrderInput] = issue.message
      }
    }

    const hasFieldErrors = Object.keys(fieldErrors).length > 0
    const error = cartError
      ? hasFieldErrors
        ? `${cartError} Please also check the highlighted fields.`
        : cartError
      : 'Please check the highlighted fields and try again.'

    return json({ success: false, error, fieldErrors }, 400)
  }

  const order = parsed.data

  // Honeypot: only a bot fills a field that is hidden from real users. The
  // reply has to be indistinguishable from a real one — same status, same body
  // shape, a plausible order number — or the bot learns which field caught it
  // and simply stops filling it. Keep this status in sync with the success
  // response at the end of this handler.
  if (order.website && order.website.length > 0) {
    return json({ success: true, orderNumber: buildOrderNumber() }, 201)
  }

  const pricing = priceOrder(order)

  if (!pricing.ok) {
    return json({ success: false, error: pricing.error }, 400)
  }

  const priced = pricing.priced

  try {
    await saveOrder(order, priced)
  } catch (error: unknown) {
    // Never swallow this — reporting success for an order that was not stored
    // means the customer waits for a confirmation that will never come.
    const reason = error instanceof Error ? error.message : 'Unknown failure'
    console.error(`[purasynth] Order ${priced.orderNumber} was not saved: ${reason}`)

    // A failed insert is usually the database being unreachable, but it is
    // also how an order-number collision surfaces, and that one clears on a
    // retry because the next attempt draws a fresh number. Say so, so the
    // customer's next move is obvious either way.
    return json(
      {
        success: false,
        error: `We could not save your order just now. Please try again in a moment — nothing has been charged and each attempt gets a new order number — or email ${site.email} and it will be taken directly.`,
      },
      502
    )
  }

  // Stored is the whole job. There is no email step: the dashboard at /admin
  // reads straight from the same table, so an order is visible the moment this
  // insert commits, and there is no delivery provider in between to fail.
  return json({ success: true, orderNumber: priced.orderNumber }, 201)
}
