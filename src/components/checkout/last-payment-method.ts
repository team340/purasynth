import { paymentMethods, type PaymentMethodId } from '@/lib/payment-methods'

/**
 * Carries the chosen payment method from the checkout to the confirmation
 * page, so the "what happens next" copy can name it.
 *
 * sessionStorage rather than the URL: the redirect stays exactly
 * `/order-confirmed?order=NUMBER`, and a preference does not need to travel in
 * a link that might be pasted into a chat window. Every call is wrapped
 * because storage throws outright in a locked-down browser, and losing one
 * line of copy is not worth breaking the page over.
 */

const STORAGE_KEY = 'purasynth:last-payment-method'

export function rememberPaymentMethod(id: PaymentMethodId): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Private mode, a full quota or a blocked origin. Nothing depends on it.
  }
}

/**
 * Null when nothing was stored, or when what was stored is no longer a method.
 *
 * Safe as a `useSyncExternalStore` snapshot: the return value is a string or
 * null, so repeated calls compare equal and React does not re-render forever.
 */
export function readLastPaymentMethod(): PaymentMethodId | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    const match = paymentMethods.find((method) => method.id === stored)

    return match ? match.id : null
  } catch {
    return null
  }
}

/**
 * Nothing writes to this key while the confirmation page is open, so there is
 * genuinely nothing to listen to. The subscription exists only so the value
 * can be read through `useSyncExternalStore` instead of an effect, which is
 * what keeps the server render and the first client render in step.
 */
export function subscribeToLastPaymentMethod(): () => void {
  return () => {}
}

/** No sessionStorage on the server, so the method is simply not known yet. */
export function getLastPaymentMethodServerSnapshot(): PaymentMethodId | null {
  return null
}
