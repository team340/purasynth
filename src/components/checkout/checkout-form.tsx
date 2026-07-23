'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Loader2,
} from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import {
  PAYMENT_PREFERENCES,
  US_STATES,
  type OrderApiResponse,
  type OrderFieldErrors,
  type OrderInput,
} from '@/lib/order-schema'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

interface FormValues {
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
  readonly paymentPreference: OrderInput['paymentPreference']
  readonly agreeToTerms: boolean
  /** Honeypot. Real customers never see it, so it must stay empty. */
  readonly website: string
}

type TextFieldName = Exclude<
  keyof FormValues,
  'paymentPreference' | 'agreeToTerms'
>

type SubmitStatus = 'idle' | 'submitting' | 'done'

/**
 * A top-level failure, held as an object rather than a bare string so that
 * every rejected attempt is a new value. Two identical failures in a row would
 * otherwise leave state untouched, and the alert would neither move focus nor
 * re-announce — the form would read as if the button had done nothing.
 */
interface SubmitFailure {
  readonly message: string
}

const INITIAL_VALUES: FormValues = {
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
  paymentPreference: 'card-link',
  agreeToTerms: false,
  website: '',
}

const inputBase =
  'w-full rounded-md border-2 bg-paper px-5 py-3.5 text-[0.95rem] font-medium text-ink ' +
  // `mist` is a hairline/icon tone (~2.5:1 on paper) and must not carry text.
  // Placeholder text is text: it needs the same 4.5:1 the accessibility page
  // promises, so it uses `slate` like every other secondary string.
  'transition-colors placeholder:font-normal placeholder:text-slate'

function inputClass(hasError: boolean): string {
  return cn(
    inputBase,
    hasError ? 'border-coral bg-coral-soft/50' : 'border-ink hover:bg-haze/60'
  )
}

interface FieldProps {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly hint?: string
  readonly optional?: boolean
  readonly className?: string
  readonly children: (describedBy: string | undefined) => ReactNode
}

/** Label, optional hint, control and error message, wired up for a11y. */
function Field({
  id,
  label,
  error,
  hint,
  optional = false,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className="font-mono text-[0.66rem] font-bold tracking-[0.16em] text-ink uppercase"
      >
        {label}
        {optional ? (
          <span className="ml-2 font-normal text-slate normal-case">optional</span>
        ) : (
          <span className="ml-1 text-coral-deep">*</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-[0.8rem] leading-relaxed text-slate">
          {hint}
        </p>
      ) : null}

      {children(describedBy)}

      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-2 text-[0.82rem] font-semibold text-coral-deep"
        >
          <AlertCircle
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            strokeWidth={2.8}
            aria-hidden="true"
          />
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * The order form.
 *
 * It collects contact, shipping and fitment details only. There is no card
 * field anywhere, because there is no payment gateway — the owner confirms
 * fitment and emails an invoice with a secure payment link afterwards.
 */
export function CheckoutForm() {
  const router = useRouter()
  const { cart, hydrated, clear } = useCart()
  const reduceMotion = useReducedMotion()

  const base = useId()
  const alertRef = useRef<HTMLDivElement>(null)

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>({})
  const [failure, setFailure] = useState<SubmitFailure | null>(null)
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const fieldId = (name: string): string => `${base}-${name}`

  // An empty cart has nothing to order. Wait for hydration first, or the
  // redirect fires before localStorage has been read.
  useEffect(() => {
    if (!hydrated || status === 'done') return
    if (cart.length === 0) router.replace('/cart')
  }, [hydrated, cart.length, status, router])

  function setValue(name: TextFieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'idle') return

    setStatus('submitting')
    setFailure(null)
    setFieldErrors({})

    const payload = {
      ...values,
      items: cart.map((line) => ({
        slug: line.slug,
        qty: line.qty,
        fitment: line.fitment,
      })),
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as OrderApiResponse

      if (!response.ok || !data.success || !data.orderNumber) {
        setFieldErrors(data.fieldErrors ?? {})
        setFailure({
          message:
            data.error ??
            `We could not place that order. Please email ${site.email} and it will be taken directly.`,
        })
        setStatus('idle')
        return
      }

      setStatus('done')
      clear()
      router.push(`/order-confirmed?order=${encodeURIComponent(data.orderNumber)}`)
    } catch {
      setFailure({
        message: `We could not reach the server. Check your connection and try again, or email ${site.email}.`,
      })
      setStatus('idle')
    }
  }

  // The submit button sits at the end of a long form and the alert at the top
  // of it, so bring the failure into view and move focus onto it. Focusing the
  // alert is what reads it out to someone who cannot see the page scroll, and
  // it is also where an `items` error from the server lands — that key has no
  // field of its own to render beside.
  useEffect(() => {
    if (!failure) return
    alertRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    alertRef.current?.focus()
  }, [failure])

  // 'done' keeps the button locked while the confirmation route loads.
  const submitting = status !== 'idle'

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <div
        ref={alertRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className="focus-visible:outline-none"
      >
        <AnimatePresence initial={false}>
          {failure ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 rounded-lg border-2 border-coral bg-coral-soft px-5 py-4 text-[0.92rem] font-semibold text-coral-deep"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              {failure.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <fieldset className="flex flex-col gap-6 rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <legend className="ml-2 rounded-full bg-volt px-5 py-2 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-paper uppercase">
          01 — Who you are
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id={fieldId('firstName')}
            label="First name"
            error={fieldErrors.firstName}
          >
            {(describedBy) => (
              <input
                id={fieldId('firstName')}
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(event) => setValue('firstName', event.target.value)}
                aria-invalid={fieldErrors.firstName ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.firstName))}
                placeholder="Dakota"
              />
            )}
          </Field>

          <Field
            id={fieldId('lastName')}
            label="Last name"
            error={fieldErrors.lastName}
          >
            {(describedBy) => (
              <input
                id={fieldId('lastName')}
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(event) => setValue('lastName', event.target.value)}
                aria-invalid={fieldErrors.lastName ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.lastName))}
                placeholder="Reyes"
              />
            )}
          </Field>

          <Field
            id={fieldId('email')}
            label="Email"
            hint="Your invoice and tracking number land here."
            error={fieldErrors.email}
          >
            {(describedBy) => (
              <input
                id={fieldId('email')}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setValue('email', event.target.value)}
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.email))}
                placeholder="you@example.com"
              />
            )}
          </Field>

          <Field
            id={fieldId('phone')}
            label="Phone"
            hint="The freight carrier calls this number to book your curbside drop-off. It is not used for anything else."
            error={fieldErrors.phone}
          >
            {(describedBy) => (
              <input
                id={fieldId('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => setValue('phone', event.target.value)}
                aria-invalid={fieldErrors.phone ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.phone))}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-6 rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <legend className="ml-2 rounded-full bg-coral-deep px-5 py-2 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-paper uppercase">
          02 — Where the pallet goes
        </legend>

        <Field
          id={fieldId('addressLine1')}
          label="Street address"
          error={fieldErrors.addressLine1}
        >
          {(describedBy) => (
            <input
              id={fieldId('addressLine1')}
              name="addressLine1"
              type="text"
              autoComplete="address-line1"
              value={values.addressLine1}
              onChange={(event) => setValue('addressLine1', event.target.value)}
              aria-invalid={fieldErrors.addressLine1 ? true : undefined}
              aria-describedby={describedBy}
              className={inputClass(Boolean(fieldErrors.addressLine1))}
              placeholder="1180 Ranch Road"
            />
          )}
        </Field>

        <Field
          id={fieldId('addressLine2')}
          label="Apartment, suite, shop name"
          optional
          error={fieldErrors.addressLine2}
        >
          {(describedBy) => (
            <input
              id={fieldId('addressLine2')}
              name="addressLine2"
              type="text"
              autoComplete="address-line2"
              value={values.addressLine2}
              onChange={(event) => setValue('addressLine2', event.target.value)}
              aria-invalid={fieldErrors.addressLine2 ? true : undefined}
              aria-describedby={describedBy}
              className={inputClass(Boolean(fieldErrors.addressLine2))}
              placeholder="Bay 4"
            />
          )}
        </Field>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
          <Field id={fieldId('city')} label="City" error={fieldErrors.city}>
            {(describedBy) => (
              <input
                id={fieldId('city')}
                name="city"
                type="text"
                autoComplete="address-level2"
                value={values.city}
                onChange={(event) => setValue('city', event.target.value)}
                aria-invalid={fieldErrors.city ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.city))}
                placeholder="Tomball"
              />
            )}
          </Field>

          <Field id={fieldId('state')} label="State" error={fieldErrors.state}>
            {(describedBy) => (
              <div className="relative">
                <select
                  id={fieldId('state')}
                  name="state"
                  autoComplete="address-level1"
                  value={values.state}
                  onChange={(event) => setValue('state', event.target.value)}
                  aria-invalid={fieldErrors.state ? true : undefined}
                  aria-describedby={describedBy}
                  className={cn(
                    inputClass(Boolean(fieldErrors.state)),
                    'appearance-none pr-11'
                  )}
                >
                  <option value="">Pick…</option>
                  {US_STATES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </div>
            )}
          </Field>

          <Field id={fieldId('zip')} label="ZIP" error={fieldErrors.zip}>
            {(describedBy) => (
              <input
                id={fieldId('zip')}
                name="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={values.zip}
                onChange={(event) => setValue('zip', event.target.value)}
                aria-invalid={fieldErrors.zip ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.zip))}
                placeholder="77377"
              />
            )}
          </Field>
        </div>

        <p className="rounded-lg bg-haze px-5 py-4 text-[0.84rem] leading-relaxed text-slate">
          Freight is free to the lower 48. Alaska, Hawaii and anywhere outside the
          US are quoted individually — email {site.email} before ordering and a
          real number comes back.
        </p>
      </fieldset>

      <fieldset className="flex flex-col gap-6 rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <legend className="ml-2 rounded-full bg-lime px-5 py-2 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-ink uppercase">
          03 — Your truck
        </legend>

        <Field
          id={fieldId('vehicle')}
          label="Year, make, model and trim"
          optional
          hint="The fastest way to get fitment confirmed first time. Example: 2021 Ford F-350 Lariat DRW."
          error={fieldErrors.vehicle}
        >
          {(describedBy) => (
            <input
              id={fieldId('vehicle')}
              name="vehicle"
              type="text"
              value={values.vehicle}
              onChange={(event) => setValue('vehicle', event.target.value)}
              aria-invalid={fieldErrors.vehicle ? true : undefined}
              aria-describedby={describedBy}
              className={inputClass(Boolean(fieldErrors.vehicle))}
              placeholder="2021 Ford F-350 Lariat DRW"
            />
          )}
        </Field>

        <Field
          id={fieldId('notes')}
          label="Anything we should know"
          optional
          hint="Gate codes, forklift on site, best delivery days, a question about the finish."
          error={fieldErrors.notes}
        >
          {(describedBy) => (
            <textarea
              id={fieldId('notes')}
              name="notes"
              rows={4}
              value={values.notes}
              onChange={(event) => setValue('notes', event.target.value)}
              aria-invalid={fieldErrors.notes ? true : undefined}
              aria-describedby={describedBy}
              className={cn(inputClass(Boolean(fieldErrors.notes)), 'resize-y')}
              placeholder="No forklift here — curbside is fine."
            />
          )}
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-5 rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <legend className="ml-2 rounded-full bg-ink px-5 py-2 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-paper uppercase">
          04 — How you would rather settle up
        </legend>

        <p className="text-[0.9rem] leading-relaxed text-slate">
          This is a preference, not a charge. Whatever you pick comes back with
          the invoice once your bolt pattern is confirmed.
        </p>

        <div
          role="radiogroup"
          aria-label="Payment preference"
          aria-describedby={
            fieldErrors.paymentPreference
              ? `${fieldId('paymentPreference')}-error`
              : undefined
          }
          className="grid gap-3 sm:grid-cols-2"
        >
          {PAYMENT_PREFERENCES.map((option) => {
            const selected = values.paymentPreference === option.id

            return (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer gap-3 rounded-lg border-2 p-5 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5',
                  'focus-within:[outline:3px_solid_var(--color-volt)] focus-within:[outline-offset:3px]',
                  selected
                    ? 'border-ink bg-volt-soft'
                    : 'border-line bg-paper hover:border-ink'
                )}
              >
                <input
                  type="radio"
                  name="paymentPreference"
                  value={option.id}
                  checked={selected}
                  onChange={() =>
                    setValues((current) => ({
                      ...current,
                      paymentPreference: option.id,
                    }))
                  }
                  className="visually-hidden"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink',
                    selected ? 'bg-ink' : 'bg-paper'
                  )}
                >
                  {selected ? (
                    <Check className="h-3 w-3 text-paper" strokeWidth={4} />
                  ) : null}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[0.95rem] font-bold text-ink">
                    {option.label}
                  </span>
                  <span className="text-[0.82rem] leading-relaxed text-slate">
                    {option.hint}
                  </span>
                </span>
              </label>
            )
          })}
        </div>

        {fieldErrors.paymentPreference ? (
          <p
            id={`${fieldId('paymentPreference')}-error`}
            className="flex items-start gap-2 text-[0.82rem] font-semibold text-coral-deep"
          >
            <AlertCircle
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              strokeWidth={2.8}
              aria-hidden="true"
            />
            {fieldErrors.paymentPreference}
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-6 rounded-xl border-2 border-ink bg-lime-soft p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <div className="flex items-start gap-3">
          <FileText
            className="mt-0.5 h-6 w-6 shrink-0 text-ink"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-extrabold">
              Nothing is charged when you press this button
            </h2>
            <p className="text-[0.95rem] leading-relaxed text-graphite">
              There is no card form on this site and no payment gateway behind
              it. You place the order, the owner checks your bolt pattern against
              the year, make and model, and then an invoice with a secure payment
              link is emailed within {site.responseWindow}. Cancel any time before
              you pay it and it costs you nothing.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-ink bg-paper p-5">
            <input
              id={fieldId('agreeToTerms')}
              type="checkbox"
              name="agreeToTerms"
              checked={values.agreeToTerms}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  agreeToTerms: event.target.checked,
                }))
              }
              aria-invalid={fieldErrors.agreeToTerms ? true : undefined}
              aria-describedby={
                fieldErrors.agreeToTerms
                  ? `${fieldId('agreeToTerms')}-error`
                  : undefined
              }
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-volt)]"
            />
            <span className="text-[0.9rem] leading-relaxed font-medium text-graphite">
              I understand this places an order rather than a payment, and that
              Purasynth will confirm fitment before invoicing. I have read the{' '}
              <Link
                href="/terms"
                className="font-bold text-volt-deep underline underline-offset-2"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/returns-policy"
                className="font-bold text-volt-deep underline underline-offset-2"
              >
                Returns Policy
              </Link>
              .
            </span>
          </label>

          {fieldErrors.agreeToTerms ? (
            <p
              id={`${fieldId('agreeToTerms')}-error`}
              className="flex items-start gap-2 text-[0.82rem] font-semibold text-coral-deep"
            >
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                strokeWidth={2.8}
                aria-hidden="true"
              />
              {fieldErrors.agreeToTerms}
            </p>
          ) : null}
        </div>

        {/* Honeypot. Hidden from people, irresistible to bots. */}
        <div aria-hidden="true" className="visually-hidden">
          <label htmlFor={fieldId('website')}>Leave this field empty</label>
          <input
            id={fieldId('website')}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => setValue('website', event.target.value)}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2
                className="h-5 w-5 motion-safe:animate-spin"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              Sending your order…
            </>
          ) : (
            <>
              Place order — no payment now
              <ArrowRight className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
            </>
          )}
        </Button>

        <p aria-live="polite" className="visually-hidden">
          {submitting ? 'Sending your order, please wait.' : ''}
        </p>

        <p className="text-center text-[0.8rem] leading-relaxed text-slate">
          Questions before you send it? Email {site.email} and the owner replies
          within {site.responseWindow}.
        </p>
      </div>
    </form>
  )
}
