'use client'

import Link from 'next/link'
import { FileText, Pencil } from 'lucide-react'
import type { ReactNode } from 'react'

import { FieldError } from '@/components/checkout/checkout-fields'
import { OrderRecap } from '@/components/checkout/order-summary'
import { PaymentMethodMarks } from '@/components/checkout/payment-method-marks'
import type { FormValues } from '@/components/checkout/checkout-values'
import type { OrderFieldErrors } from '@/lib/order-schema'
import { paymentMethods } from '@/lib/payment-methods'
import { site } from '@/lib/site'

interface ReviewStepProps {
  readonly values: FormValues
  readonly fieldErrors: OrderFieldErrors
  readonly onEdit: (step: number) => void
  readonly onToggleTerms: (agreed: boolean) => void
  readonly fieldId: (name: string) => string
}

interface RowProps {
  readonly label: string
  readonly value: string
}

function Row({ label, value }: RowProps) {
  const filled = value.trim().length > 0

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
      <dt className="font-mono text-[0.62rem] font-bold tracking-[0.14em] text-slate uppercase sm:w-44 sm:shrink-0 sm:pt-[0.2rem]">
        {label}
      </dt>
      <dd
        className={
          filled
            ? 'text-[0.95rem] leading-relaxed font-medium break-words whitespace-pre-line text-ink'
            : 'text-[0.95rem] leading-relaxed text-slate italic'
        }
      >
        {filled ? value : 'Not given'}
      </dd>
    </div>
  )
}

interface SectionProps {
  readonly title: string
  readonly editLabel: string
  readonly onEdit: () => void
  readonly children: ReactNode
}

function Section({ title, editLabel, onEdit, children }: SectionProps) {
  return (
    <section className="rounded-lg border-2 border-ink bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-extrabold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-4 py-2 font-mono text-[0.62rem] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:bg-volt-soft hover:text-volt-deep"
        >
          <Pencil className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          Edit
        </button>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  )
}

/** Step 3. Everything the customer said, then the one button that sends it. */
export function ReviewStep({
  values,
  fieldErrors,
  onEdit,
  onToggleTerms,
  fieldId,
}: ReviewStepProps) {
  const method = paymentMethods.find(
    (entry) => entry.id === values.paymentPreference
  )

  const address = [
    values.addressLine1,
    values.addressLine2,
    [values.city, values.state].filter(Boolean).join(', '),
    values.zip,
  ]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join('\n')

  return (
    <div className="flex flex-col gap-5">
      <Section
        title="Where it ships"
        editLabel="Edit where it ships"
        onEdit={() => onEdit(0)}
      >
        <dl className="flex flex-col gap-4">
          <Row
            label="Name"
            value={`${values.firstName} ${values.lastName}`.trim()}
          />
          <Row label="Email" value={values.email} />
          <Row label="Phone" value={values.phone} />
          <Row label="Address" value={address} />
          <Row label="Truck" value={values.vehicle} />
          <Row label="Notes" value={values.notes} />
        </dl>
      </Section>

      <Section
        title="How you would like to pay"
        editLabel="Edit how you would like to pay"
        onEdit={() => onEdit(1)}
      >
        {method ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-[1.1rem] leading-tight font-extrabold text-ink">
                {method.label}
              </span>
              <span className="text-[0.85rem] leading-relaxed text-slate">
                {method.blurb}
              </span>
            </div>

            <PaymentMethodMarks id={method.id} />

            <p className="rounded-md bg-haze px-4 py-3 text-[0.82rem] leading-relaxed text-slate">
              Nothing is collected here. The invoice arrives by email once your
              fitment is confirmed, set up for this method.
            </p>
          </div>
        ) : (
          <p className="text-[0.95rem] text-slate italic">Not chosen yet</p>
        )}
      </Section>

      <OrderRecap />

      <div className="flex flex-col gap-6 rounded-lg border-2 border-ink bg-lime-soft p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <FileText
            className="mt-0.5 h-6 w-6 shrink-0 text-ink"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-xl font-extrabold sm:text-2xl">
              Nothing is charged when you press this button
            </h3>
            <p className="text-[0.92rem] leading-relaxed text-graphite">
              There is no card form on this site and no payment gateway behind
              it. You place the order, the owner checks your bolt pattern against
              the year, make and model, and then an invoice with a secure payment
              link is emailed within {site.responseWindow}. Cancel any time
              before you pay it and it costs you nothing.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-ink bg-paper p-5">
            <input
              id={fieldId('agreeToTerms')}
              type="checkbox"
              name="agreeToTerms"
              checked={values.agreeToTerms}
              onChange={(event) => onToggleTerms(event.target.checked)}
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
            <FieldError
              id={`${fieldId('agreeToTerms')}-error`}
              message={fieldErrors.agreeToTerms}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
