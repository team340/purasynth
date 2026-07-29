'use client'

import { useEffect, useRef } from 'react'

import { readOrderTotal } from '@/components/checkout/last-order-total'
import { orderConversionTarget } from '@/lib/google-ads'
import { site } from '@/lib/site'

/**
 * Reports a placed order to Google Ads as a conversion.
 *
 * Renders nothing. It sits on the confirmation page and fires once, after the
 * order number is known.
 *
 * Dormant until `ORDER_CONVERSION_LABEL` is filled in. The base tag alone
 * cannot record a conversion: Google needs the per-action label, and sending
 * an event without one either goes nowhere or lands on the wrong action. So
 * `orderConversionTarget()` returns null and this does nothing until the label
 * exists, rather than shipping something that silently misreports.
 *
 * `transaction_id` is the order number, which is how Google deduplicates. A
 * customer who refreshes the confirmation page, or opens it twice, must not
 * produce two conversions and double the reported revenue.
 */

interface OrderConversionProps {
  readonly orderNumber: string
}

/** The one gtag signature used here. */
type GtagFn = (
  command: 'event',
  eventName: string,
  params: Record<string, unknown>
) => void

export function OrderConversion({ orderNumber }: OrderConversionProps) {
  // Survives the effect re-running (React 18 mounts twice in development) so
  // one order cannot be reported twice.
  const reported = useRef(false)

  useEffect(() => {
    if (reported.current) return
    if (!orderNumber) return

    const target = orderConversionTarget()
    if (!target) return

    const gtag = (window as unknown as { gtag?: GtagFn }).gtag
    if (typeof gtag !== 'function') return

    reported.current = true

    const cents = readOrderTotal(orderNumber)

    gtag('event', 'conversion', {
      send_to: target,
      transaction_id: orderNumber,
      currency: site.currency,
      // Omitted rather than sent as 0 when the total is unknown, because a
      // zero-value conversion drags down the reported value of the campaign
      // that produced it.
      ...(cents === null ? {} : { value: cents / 100 }),
    })
  }, [orderNumber])

  return null
}
