import { z } from 'zod'

/**
 * Shape of an incoming order.
 *
 * Prices are NOT accepted from the client — only slugs, quantities and a
 * fitment id. The server prices the basket itself from the catalogue so a
 * tampered payload cannot change what an order is worth.
 *
 * Every constraint carries an explicit message. Without one Zod emits its
 * internal wording ("Too big: expected string to have <=10 characters"),
 * which would end up rendered next to the customer's input.
 */

const US_ZIP = /^\d{5}(-\d{4})?$/
const PHONE_CHARS = /^[\d\s+()./-]+$/

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI',
  'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
  'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY',
] as const

export type UsState = (typeof US_STATES)[number]

export const orderLineSchema = z.object({
  slug: z
    .string({ error: 'That item is not recognized.' })
    .min(1, 'That item is not recognized.')
    .max(120, 'That item is not recognized.'),
  qty: z
    .number({ error: 'Please choose a quantity.' })
    .int('Please choose a whole number of sets.')
    .min(1, 'Please choose at least one set.')
    .max(10, 'Ten sets per item is the maximum online — email us for more.'),
  fitment: z
    .string({ error: 'Please choose your truck.' })
    .min(1, 'Please choose your truck so we ship the right bolt pattern.')
    .max(60, 'That fitment is not recognized.'),
})

export const orderSchema = z.object({
  firstName: z
    .string({ error: 'Please enter your first name.' })
    .trim()
    .min(1, 'Please enter your first name.')
    .max(60, 'Please keep your first name under 60 characters.'),
  lastName: z
    .string({ error: 'Please enter your last name.' })
    .trim()
    .min(1, 'Please enter your last name.')
    .max(60, 'Please keep your last name under 60 characters.'),
  email: z
    .email('Please enter a valid email address.')
    .max(160, 'Please enter a shorter email address.'),
  phone: z
    .string({ error: 'Please enter a contact number.' })
    .trim()
    .min(7, 'Please enter a number we can reach you on about freight.')
    .max(24, 'Please enter a shorter phone number.')
    .regex(PHONE_CHARS, 'Please enter a valid phone number.'),
  addressLine1: z
    .string({ error: 'Please enter your street address.' })
    .trim()
    .min(1, 'Please enter your street address.')
    .max(160, 'Please keep this line under 160 characters.'),
  addressLine2: z
    .string()
    .trim()
    .max(160, 'Please keep this line under 160 characters.')
    .optional()
    .or(z.literal('')),
  city: z
    .string({ error: 'Please enter your city.' })
    .trim()
    .min(1, 'Please enter your city.')
    .max(80, 'Please keep this under 80 characters.'),
  state: z.enum(US_STATES, { error: 'Please choose your state.' }),
  zip: z
    .string({ error: 'Please enter your ZIP code.' })
    .trim()
    .min(5, 'Please enter a valid US ZIP code.')
    .max(10, 'Please enter a valid US ZIP code.')
    .regex(US_ZIP, 'Please enter a valid US ZIP code, e.g. 77377.'),
  /** Helps confirm fitment before anything ships. */
  vehicle: z
    .string()
    .trim()
    .max(120, 'Please keep this under 120 characters.')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(1000, 'Please keep delivery notes under 1000 characters.')
    .optional()
    .or(z.literal('')),
  /**
   * How the customer would like to settle up. This is a preference, not a
   * charge — no card details are collected anywhere on this site. An invoice
   * with a secure payment link is emailed once fitment is confirmed.
   */
  paymentPreference: z.enum(['card-link', 'bank-transfer', 'financing'], {
    error: 'Please choose how you would like to pay.',
  }),
  /** Explicit consent that this places an order, not a charge. */
  agreeToTerms: z.literal(true, {
    error: 'Please confirm you have read the terms before placing the order.',
  }),
  items: z
    .array(orderLineSchema)
    .min(1, 'Your cart is empty.')
    .max(10, 'That is more items than we can take in one online order.'),
  /**
   * Hidden field. Bots fill it in; real customers never see it.
   * Deliberately permissive so the request reaches the route handler, which
   * fakes a success rather than telling the bot it was caught.
   */
  website: z.string().max(200).optional(),
})

export type OrderInput = z.infer<typeof orderSchema>
export type OrderLineInput = z.infer<typeof orderLineSchema>

/** Field-level errors keyed by input name, for rendering next to each field. */
export type OrderFieldErrors = Partial<Record<keyof OrderInput, string>>

export interface OrderApiResponse {
  readonly success: boolean
  readonly orderNumber?: string
  readonly error?: string
  readonly fieldErrors?: OrderFieldErrors
}

export interface PaymentPreferenceOption {
  readonly id: OrderInput['paymentPreference']
  readonly label: string
  readonly hint: string
}

export const PAYMENT_PREFERENCES: readonly PaymentPreferenceOption[] = [
  {
    id: 'card-link',
    label: 'Secure card link by email',
    hint: 'We email an invoice with a card link once fitment is confirmed.',
  },
  {
    id: 'bank-transfer',
    label: 'Bank transfer / ACH',
    hint: 'Account details arrive with your invoice.',
  },
  {
    /**
     * A question, not a product. No financing facility is offered here, so the
     * wording has to read as raising the subject rather than promising terms.
     */
    id: 'financing',
    label: 'Ask about payment terms',
    hint: 'Flags the question on your order. Whatever can be arranged comes back with the invoice — nothing is promised up front.',
  },
]
