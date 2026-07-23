import 'server-only'

import type { OrderInput } from '@/lib/order-schema'
import type { PricedOrder } from '@/lib/order-types'
import { site } from '@/lib/site'
import { formatPrice } from '@/lib/utils'

/**
 * Order alerts by email, via Web3Forms.
 *
 * Deliberately best-effort: the order is already in the database by the time
 * this runs, so a mail outage must never turn a saved order into an error for
 * the customer. Failures are logged and swallowed, and the caller reports the
 * outcome so the route can note it without failing the request.
 *
 * Web3Forms is used because it needs no SMTP credentials and no verified
 * sending domain — one access key, tied to the inbox that receives alerts.
 * Leave WEB3FORMS_ACCESS_KEY unset and alerts are skipped silently; orders
 * still land in Supabase and in /admin.
 */

const ENDPOINT = 'https://api.web3forms.com/submit'
/**
 * The customer is waiting on this. Awaiting it is still correct — serverless
 * kills work that outlives the response, so a fire-and-forget send would be
 * cut off mid-flight — but the timeout has to stay small enough that an
 * unreachable provider cannot become the checkout's response time. An abort
 * lands in the catch below and returns 'failed' like any other send failure.
 */
const TIMEOUT_MS = 2_500

export type NotifyResult = 'sent' | 'skipped' | 'failed'

export function isNotifyConfigured(): boolean {
  return Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim())
}

function notificationInbox(): string {
  return process.env.ORDER_NOTIFICATION_EMAIL?.trim() || site.email
}

function buildBody(order: OrderInput, priced: PricedOrder): string {
  const lines = priced.lines
    .map(
      (line) =>
        `  • ${line.qty} x ${line.product.name}\n` +
        `      SKU ${line.product.sku}\n` +
        `      Fitment: ${line.fitmentLabel}\n` +
        `      Line total: ${formatPrice(line.lineTotal)}`
    )
    .join('\n')

  const address = [
    order.addressLine1,
    order.addressLine2,
    `${order.city}, ${order.state} ${order.zip}`,
  ]
    .filter(Boolean)
    .join('\n      ')

  return [
    `NEW ORDER — ${priced.orderNumber}`,
    '',
    'CUSTOMER',
    `  Name:  ${order.firstName} ${order.lastName}`,
    `  Email: ${order.email}`,
    `  Phone: ${order.phone}`,
    '',
    'SHIP TO',
    `      ${address}`,
    '',
    'VEHICLE',
    `  ${order.vehicle || 'Not supplied — confirm fitment before shipping.'}`,
    '',
    'ITEMS',
    lines,
    '',
    'TOTALS',
    `  Subtotal: ${formatPrice(priced.subtotal)}`,
    `  Freight:  ${
      priced.shippingFee === 0 ? 'Free (lower 48)' : formatPrice(priced.shippingFee)
    }`,
    `  Total:    ${formatPrice(priced.total)}`,
    '',
    `PAYMENT PREFERENCE: ${order.paymentPreference}`,
    '',
    'NOTES',
    `  ${order.notes || '—'}`,
    '',
    '---',
    'No payment has been taken. Confirm fitment, then send the invoice.',
    `Dashboard: ${site.url}/admin`,
  ].join('\n')
}

/**
 * Fire the alert. Never throws.
 * Returns 'skipped' when no key is configured, 'failed' when the send did not
 * go through, 'sent' on success.
 */
export async function notifyNewOrder(
  order: OrderInput,
  priced: PricedOrder
): Promise<NotifyResult> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
  if (!accessKey) return 'skipped'

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New Purasynth order ${priced.orderNumber} — ${formatPrice(
          priced.total
        )}`,
        from_name: 'Purasynth orders',
        to: notificationInbox(),
        replyto: order.email,
        message: buildBody(order, priced),
      }),
    })

    if (!response.ok) {
      console.error(
        `[purasynth] Order alert for ${priced.orderNumber} failed: HTTP ${response.status}`
      )
      return 'failed'
    }

    return 'sent'
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown failure'
    console.error(
      `[purasynth] Order alert for ${priced.orderNumber} failed: ${reason}`
    )
    return 'failed'
  } finally {
    clearTimeout(timer)
  }
}
