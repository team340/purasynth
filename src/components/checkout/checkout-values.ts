import type { PaymentMethodId } from '@/lib/payment-methods'

/**
 * Shape of the checkout, and the map of which step owns which field.
 *
 * Every value lives in one object rather than inside the step that renders it,
 * so a step can unmount during the transition without losing what was typed
 * into it, and the final submit still has the whole picture.
 */

export interface FormValues {
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly addressLine1: string
  readonly addressLine2: string
  readonly city: string
  readonly state: string
  readonly zip: string
  readonly vehicle: string
  readonly notes: string
  /** Empty until the customer picks one, so step 2 has something to check. */
  readonly paymentPreference: PaymentMethodId | ''
  readonly agreeToTerms: boolean
  /** Honeypot. Real customers never see it, so it must stay empty. */
  readonly website: string
}

export type TextFieldName = Exclude<
  keyof FormValues,
  'paymentPreference' | 'agreeToTerms'
>

/** Every field a customer can get wrong, and therefore has to be shown. */
export type ValidatedField = Exclude<keyof FormValues, 'website'>

export const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  vehicle: '',
  notes: '',
  paymentPreference: '',
  agreeToTerms: false,
  website: '',
}

export interface CheckoutStepMeta {
  readonly id: string
  /** Short label for the progress indicator. */
  readonly title: string
  /** Full heading above the panel. */
  readonly heading: string
  readonly blurb: string
  /** Fields validated before this step will let go. */
  readonly fields: readonly ValidatedField[]
}

export const CHECKOUT_STEPS: readonly CheckoutStepMeta[] = [
  {
    id: 'shipping',
    title: 'Where it ships',
    heading: 'Where it ships',
    blurb: 'Your name, your email and the address the pallet rolls up to.',
    fields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'zip',
      'vehicle',
      'notes',
    ],
  },
  {
    id: 'payment',
    title: 'How you would like to pay',
    heading: 'How you would like to pay',
    blurb: 'A preference, not a charge. Nothing is collected on this page.',
    fields: ['paymentPreference'],
  },
  {
    id: 'review',
    title: 'Check and place',
    heading: 'Check it over, then place it',
    blurb: 'One last look before it reaches the owner.',
    fields: ['agreeToTerms'],
  },
]

export const LAST_STEP_INDEX = CHECKOUT_STEPS.length - 1

/** Flat field order, used to decide which error a customer meets first. */
export const FIELD_ORDER: readonly ValidatedField[] = CHECKOUT_STEPS.flatMap(
  (step) => [...step.fields]
)

/** Index of the step that renders `field`, or -1 when nothing renders it. */
export function stepForField(field: string): number {
  return CHECKOUT_STEPS.findIndex((step) =>
    (step.fields as readonly string[]).includes(field)
  )
}
