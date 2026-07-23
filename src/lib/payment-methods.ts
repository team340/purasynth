/**
 * How a customer can settle up.
 *
 * IMPORTANT: nothing is charged in the browser. This site takes no card
 * details at any point. The customer picks how they would like to pay, the
 * owner confirms fitment, and an invoice goes out by email with a link or
 * account details for the chosen method.
 *
 * Copy anywhere these appear must reflect that. It is fine to show which
 * methods are accepted; it is not fine to imply a payment happens at
 * checkout, so avoid words like "pay now", "secure checkout" or "charged".
 */

import type { OrderInput } from '@/lib/order-schema'

/**
 * Derived from the schema rather than declared twice, so the radio group and
 * the value the server will accept can never drift apart. Adding a method
 * means adding it to the zod enum first, and TypeScript then insists the list
 * below covers it.
 */
export type PaymentMethodId = OrderInput['paymentPreference']

export interface PaymentMethod {
  readonly id: PaymentMethodId
  readonly label: string
  readonly blurb: string
}

export const paymentMethods: readonly PaymentMethod[] = [
  {
    id: 'card',
    label: 'Credit or debit card',
    blurb:
      'Visa, Mastercard or American Express. A secure card link arrives with your invoice.',
  },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    blurb: 'Open the invoice on your iPhone and confirm with Face ID.',
  },
  {
    id: 'google-pay',
    label: 'Google Pay',
    blurb: 'Two taps on your phone once the invoice link arrives.',
  },
  {
    id: 'bank-transfer',
    label: 'Bank transfer or ACH',
    blurb: 'Account details arrive with your invoice. No card needed.',
  },
]

export const paymentMethodIds: readonly PaymentMethodId[] = paymentMethods.map(
  (method) => method.id
)

/**
 * Falls back to the raw value rather than throwing, so an order stored under
 * an id that has since been retired still renders in the dashboard.
 */
export function paymentMethodLabel(id: string): string {
  return paymentMethods.find((method) => method.id === id)?.label ?? id
}
