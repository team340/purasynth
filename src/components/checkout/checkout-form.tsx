'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { useCart } from '@/components/cart/cart-provider'
import { CheckoutAlert } from '@/components/checkout/checkout-alert'
import { CheckoutNav } from '@/components/checkout/checkout-nav'
import { CheckoutStepHeading } from '@/components/checkout/checkout-step-heading'
import { CheckoutStepper } from '@/components/checkout/checkout-stepper'
import {
  CHECKOUT_STEPS,
  FIELD_ORDER,
  INITIAL_VALUES,
  LAST_STEP_INDEX,
  stepForField,
  type FormValues,
  type TextFieldName,
} from '@/components/checkout/checkout-values'
import { validateStep } from '@/components/checkout/checkout-validation'
import { HoneypotField } from '@/components/checkout/honeypot-field'
import { rememberPaymentMethod } from '@/components/checkout/last-payment-method'
import { PaymentStep } from '@/components/checkout/payment-step'
import { ReviewStep } from '@/components/checkout/review-step'
import { ShippingStep } from '@/components/checkout/shipping-step'
import type { OrderApiResponse, OrderFieldErrors } from '@/lib/order-schema'
import type { PaymentMethodId } from '@/lib/payment-methods'
import { site } from '@/lib/site'

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

/** Same reasoning: repeating a focus request has to count as a new value. */
interface FocusRequest {
  readonly id: string
}

/** How many frames to wait for an element that is still animating in. */
const FOCUS_ATTEMPTS = 60

/**
 * The order form, in three steps.
 *
 * It collects contact, shipping and fitment details, then a payment
 * preference. There is no card field anywhere, because there is no payment
 * gateway — the owner confirms fitment and emails an invoice with a link for
 * the chosen method afterwards.
 *
 * One request goes out, on the final submit. Everything before that is local.
 */
export function CheckoutForm() {
  const router = useRouter()
  const { cart, hydrated, clear } = useCart()
  const reduceMotion = useReducedMotion()

  const base = useId()
  const alertRef = useRef<HTMLDivElement>(null)
  // Read by the failure effect to decide whether the alert or an input should
  // take focus. A ref rather than state so that effect does not re-run.
  const pendingFocusRef = useRef<string | null>(null)

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>({})
  const [failure, setFailure] = useState<SubmitFailure | null>(null)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null)

  const meta = CHECKOUT_STEPS[step]
  const submitting = status !== 'idle'

  const fieldId = (name: string): string => `${base}-${name}`
  const headingId = (index: number): string => `${base}-step-${index}`

  // An empty cart has nothing to order. Wait for hydration first, or the
  // redirect fires before localStorage has been read.
  useEffect(() => {
    if (!hydrated || status === 'done') return
    if (cart.length === 0) router.replace('/cart')
  }, [hydrated, cart.length, status, router])

  // The element being focused may still be mounting: a step that is animating
  // out has not handed over yet. Retry across a few frames rather than firing
  // once into an empty document and silently leaving focus on the button.
  useEffect(() => {
    if (!focusRequest) return

    let frame = 0
    let attempts = 0

    const attempt = () => {
      const element = document.getElementById(focusRequest.id)

      if (element) {
        element.focus({ preventScroll: true })
        element.scrollIntoView({ block: 'center', behavior: 'smooth' })
        pendingFocusRef.current = null
        setFocusRequest(null)
        return
      }

      attempts += 1

      if (attempts > FOCUS_ATTEMPTS) {
        pendingFocusRef.current = null
        setFocusRequest(null)
        return
      }

      frame = requestAnimationFrame(attempt)
    }

    frame = requestAnimationFrame(attempt)
    return () => cancelAnimationFrame(frame)
  }, [focusRequest])

  // The alert sits at the top of the form. Bring it into view and read it out.
  // When a specific field also failed, that field wins the focus instead: it
  // is the thing that needs changing, and the assertive live region announces
  // the summary either way.
  useEffect(() => {
    if (!failure) return
    if (pendingFocusRef.current) return

    alertRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    alertRef.current?.focus()
  }, [failure])

  function requestFocus(id: string) {
    pendingFocusRef.current = id
    setFocusRequest({ id })
  }

  function setValue(name: TextFieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current,
    )
  }

  function choosePayment(id: PaymentMethodId) {
    setValues((current) => ({ ...current, paymentPreference: id }))
    setFieldErrors((current) =>
      current.paymentPreference
        ? { ...current, paymentPreference: undefined }
        : current,
    )
  }

  function toggleTerms(agreed: boolean) {
    setValues((current) => ({ ...current, agreeToTerms: agreed }))
    setFieldErrors((current) =>
      current.agreeToTerms ? { ...current, agreeToTerms: undefined } : current,
    )
  }

  /** Replace one step's errors wholesale, leaving the other steps alone. */
  function applyStepErrors(index: number, errors: OrderFieldErrors) {
    setFieldErrors((current) => {
      const next: OrderFieldErrors = { ...current }

      for (const field of CHECKOUT_STEPS[index].fields) {
        const message = errors[field]
        if (message) next[field] = message
        else delete next[field]
      }

      return next
    })
  }

  function goToStep(next: number) {
    if (next === step || next < 0 || next > LAST_STEP_INDEX) return

    setDirection(next > step ? 1 : -1)
    setStep(next)
    requestFocus(headingId(next))
  }

  /** Move to whichever step owns `field`, then put the cursor in it. */
  function jumpToField(field: string) {
    const target = stepForField(field)

    if (target >= 0 && target !== step) {
      setDirection(target > step ? 1 : -1)
      setStep(target)
    }

    requestFocus(fieldId(field))
  }

  function advance() {
    const errors = validateStep(step, values)
    applyStepErrors(step, errors)

    const firstBad = CHECKOUT_STEPS[step].fields.find((field) => errors[field])

    if (firstBad) {
      jumpToField(firstBad)
      return
    }

    goToStep(step + 1)
  }

  async function sendOrder() {
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
        const errors = data.fieldErrors ?? {}
        const firstBad = FIELD_ORDER.find((field) => errors[field])

        setFieldErrors(errors)

        // Never leave someone staring at a step while the problem sits on
        // another one. Anything keyed to a field the form cannot show (a cart
        // error, say) has no step, so the alert keeps the focus instead.
        if (firstBad) jumpToField(firstBad)

        setFailure({
          message:
            data.error ??
            `We could not place that order. Please email ${site.email} and it will be taken directly.`,
        })
        setStatus('idle')
        return
      }

      setStatus('done')
      if (values.paymentPreference)
        rememberPaymentMethod(values.paymentPreference)
      clear()
      router.push(
        `/order-confirmed?order=${encodeURIComponent(data.orderNumber)}`,
      )
    } catch {
      setFailure({
        message: `We could not reach the server. Check your connection and try again, or email ${site.email}.`,
      })
      setStatus('idle')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status !== 'idle') return

    // Enter inside a text input submits the form. On the first two steps that
    // should carry on to the next one, not send the order.
    if (step < LAST_STEP_INDEX) {
      advance()
      return
    }

    const errors = CHECKOUT_STEPS.reduce<OrderFieldErrors>(
      (all, _, index) => ({ ...all, ...validateStep(index, values) }),
      {},
    )
    const firstBad = FIELD_ORDER.find((field) => errors[field])

    if (firstBad) {
      setFieldErrors(errors)
      jumpToField(firstBad)
      return
    }

    void sendOrder()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <div
        ref={alertRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className="focus-visible:outline-none"
      >
        <CheckoutAlert
          message={failure?.message ?? null}
          reduceMotion={Boolean(reduceMotion)}
        />
      </div>

      <CheckoutStepper
        steps={CHECKOUT_STEPS}
        current={step}
        onSelect={goToStep}
      />

      <div className="overflow-hidden rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        {/*
         * Keyed on the step id, with no AnimatePresence around it.
         *
         * This deliberately animates the entrance only. An earlier version
         * wrapped this in <AnimatePresence mode="wait">, which deadlocked: the
         * outgoing step's exit animation never reported completion, so the
         * incoming step was never mounted and the form was stuck showing step
         * one while the stepper had already advanced. Because correctness here
         * depended on an animation callback firing, one missed callback broke
         * checkout entirely.
         *
         * Changing the key makes React unmount and remount the subtree, so the
         * right step is on screen whether or not any animation runs, and
         * `initial` still gives it a slide in. Motion is decoration again
         * rather than a prerequisite for rendering the correct content.
         */}
        <motion.div
          key={meta.id}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 48 }
          }
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-7"
        >
          <CheckoutStepHeading
            id={headingId(step)}
            index={step}
            total={CHECKOUT_STEPS.length}
            heading={meta.heading}
            blurb={meta.blurb}
          />

          {step === 0 ? (
            <ShippingStep
              values={values}
              fieldErrors={fieldErrors}
              onChange={setValue}
              fieldId={fieldId}
            />
          ) : null}

          {step === 1 ? (
            <PaymentStep
              value={values.paymentPreference}
              error={fieldErrors.paymentPreference}
              onSelect={choosePayment}
              fieldId={fieldId}
            />
          ) : null}

          {step === 2 ? (
            <ReviewStep
              values={values}
              fieldErrors={fieldErrors}
              onEdit={goToStep}
              onToggleTerms={toggleTerms}
              fieldId={fieldId}
            />
          ) : null}
        </motion.div>
      </div>

      <HoneypotField
        id={fieldId('website')}
        value={values.website}
        onChange={(value) => setValue('website', value)}
      />

      <CheckoutNav
        step={step}
        lastStep={LAST_STEP_INDEX}
        submitting={submitting}
        onBack={() => goToStep(step - 1)}
        onContinue={advance}
      />

      <p aria-live="polite" className="visually-hidden">
        {submitting ? 'Sending your order, please wait.' : ''}
      </p>

      <p className="text-center text-[0.8rem] leading-relaxed text-slate">
        Questions before you send it? Email {site.email} and the owner replies
        within {site.responseWindow}.
      </p>
    </form>
  )
}
