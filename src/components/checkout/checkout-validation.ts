import { US_STATES, type OrderFieldErrors } from '@/lib/order-schema'
import { paymentMethods } from '@/lib/payment-methods'

import {
  CHECKOUT_STEPS,
  type FormValues,
  type ValidatedField,
} from '@/components/checkout/checkout-values'

/**
 * A client-side mirror of `orderSchema`, one step at a time.
 *
 * The server stays the authority — this exists so a customer is not made to
 * round-trip a typo. Every rule and every message below is copied from
 * `src/lib/order-schema.ts` deliberately: if the two ever disagree, the
 * customer sees one message here and a different one after submitting, which
 * reads like the form is broken. Change them together.
 */

const US_ZIP = /^\d{5}(-\d{4})?$/
const PHONE_CHARS = /^[\d\s+()./-]+$/
/**
 * Deliberately loose. Zod owns the real check; this only needs to catch the
 * obvious misses (no @, no dot, a stray space) before a request is spent.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function required(value: string, message: string): string | undefined {
  return value.trim().length === 0 ? message : undefined
}

function tooLong(
  value: string,
  max: number,
  message: string
): string | undefined {
  return value.trim().length > max ? message : undefined
}

type FieldCheck = (values: FormValues) => string | undefined

const CHECKS: Readonly<Record<ValidatedField, FieldCheck>> = {
  firstName: (values) =>
    required(values.firstName, 'Please enter your first name.') ??
    tooLong(
      values.firstName,
      60,
      'Please keep your first name under 60 characters.'
    ),

  lastName: (values) =>
    required(values.lastName, 'Please enter your last name.') ??
    tooLong(
      values.lastName,
      60,
      'Please keep your last name under 60 characters.'
    ),

  // The schema validates the email before it caps the length, so this does too.
  email: (values) =>
    (EMAIL.test(values.email)
      ? undefined
      : 'Please enter a valid email address.') ??
    (values.email.length > 160
      ? 'Please enter a shorter email address.'
      : undefined),

  phone: (values) =>
    (values.phone.trim().length < 7
      ? 'Please enter a phone number the freight carrier can use.'
      : undefined) ??
    tooLong(values.phone, 24, 'Please enter a shorter phone number.') ??
    (PHONE_CHARS.test(values.phone.trim())
      ? undefined
      : 'Please enter a valid phone number.'),

  addressLine1: (values) =>
    required(values.addressLine1, 'Please enter your street address.') ??
    tooLong(
      values.addressLine1,
      160,
      'Please keep this line under 160 characters.'
    ),

  addressLine2: (values) =>
    tooLong(
      values.addressLine2,
      160,
      'Please keep this line under 160 characters.'
    ),

  city: (values) =>
    required(values.city, 'Please enter your city.') ??
    tooLong(values.city, 80, 'Please keep this under 80 characters.'),

  state: (values) =>
    (US_STATES as readonly string[]).includes(values.state)
      ? undefined
      : 'Please choose your state.',

  zip: (values) => {
    const zip = values.zip.trim()

    if (zip.length < 5 || zip.length > 10) {
      return 'Please enter a valid US ZIP code.'
    }

    return US_ZIP.test(zip)
      ? undefined
      : 'Please enter a valid US ZIP code, e.g. 77377.'
  },

  vehicle: (values) =>
    tooLong(values.vehicle, 120, 'Please keep this under 120 characters.'),

  notes: (values) =>
    tooLong(
      values.notes,
      1000,
      'Please keep delivery notes under 1000 characters.'
    ),

  paymentPreference: (values) =>
    paymentMethods.some((method) => method.id === values.paymentPreference)
      ? undefined
      : 'Please choose how you would like to pay.',

  agreeToTerms: (values) =>
    values.agreeToTerms
      ? undefined
      : 'Please confirm you have read the terms before placing the order.',
}

/** Errors for one step only, so Continue never reports a field further on. */
export function validateStep(
  step: number,
  values: FormValues
): OrderFieldErrors {
  const meta = CHECKOUT_STEPS[step]
  if (!meta) return {}

  const errors: OrderFieldErrors = {}

  for (const field of meta.fields) {
    const message = CHECKS[field](values)
    if (message) errors[field] = message
  }

  return errors
}
