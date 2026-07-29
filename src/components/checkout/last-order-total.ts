/**
 * Carries the order total from the checkout to the confirmation page, so the
 * Google Ads conversion can report a value rather than a bare count.
 *
 * Mirrors `last-payment-method.ts`: sessionStorage rather than the URL, so the
 * redirect stays exactly `/order-confirmed?order=NUMBER`. Putting a purchase
 * amount in a query string would leak it into browser history, referrer
 * headers and anything the customer pastes into a chat window.
 *
 * Every call is wrapped because storage throws outright in a locked-down
 * browser, and losing a conversion value is not worth breaking the
 * confirmation page over.
 */

const STORAGE_KEY = 'purasynth:last-order-total'

/** Store the total in cents, keyed to the order it belongs to. */
export function rememberOrderTotal(orderNumber: string, cents: number): void {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ orderNumber, cents })
    )
  } catch {
    // Private mode, a full quota or a blocked origin. Nothing depends on it.
  }
}

/**
 * The total for `orderNumber`, in cents, or null.
 *
 * Returns null when the stored entry belongs to a different order, which is
 * what happens if someone reloads an older confirmation URL after placing a
 * second order. Reporting the wrong basket value is worse than reporting none.
 */
export function readOrderTotal(orderNumber: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null

    const entry = parsed as Record<string, unknown>

    if (entry.orderNumber !== orderNumber) return null
    if (typeof entry.cents !== 'number' || !Number.isFinite(entry.cents)) {
      return null
    }

    return entry.cents
  } catch {
    return null
  }
}
