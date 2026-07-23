'use client'

import { Check, ShieldOff } from 'lucide-react'

import { FieldError } from '@/components/checkout/checkout-fields'
import { PaymentMethodMarks } from '@/components/checkout/payment-method-marks'
import { paymentMethods, type PaymentMethodId } from '@/lib/payment-methods'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

interface PaymentStepProps {
  readonly value: PaymentMethodId | ''
  readonly error?: string
  readonly onSelect: (id: PaymentMethodId) => void
  readonly fieldId: (name: string) => string
}

/**
 * Step 2. A preference, never a payment.
 *
 * The marks are here so a customer can see their method is accepted before
 * they commit. Nothing on this page collects a card number, and the copy above
 * the group says so in the plainest words available.
 */
export function PaymentStep({
  value,
  error,
  onSelect,
  fieldId,
}: PaymentStepProps) {
  const groupId = fieldId('paymentPreference')
  const errorId = error ? `${groupId}-error` : undefined

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-lg border-2 border-ink bg-volt-soft px-5 py-4">
        <ShieldOff
          className="mt-0.5 h-5 w-5 shrink-0 text-volt-deep"
          strokeWidth={2.4}
          aria-hidden="true"
        />
        <p className="text-[0.88rem] leading-relaxed font-medium text-graphite">
          <span className="font-bold">No card details are taken on this site.</span>{' '}
          There is no card field anywhere in this form. Pick how you would rather
          settle up and, once your fitment is confirmed, an invoice with a link
          for that method is emailed to you within {site.responseWindow}.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="How you would like to pay"
        aria-describedby={errorId}
        className="grid gap-4 sm:grid-cols-2"
      >
        {paymentMethods.map((method, index) => {
          const selected = value === method.id

          return (
            <label
              key={method.id}
              className={cn(
                // `relative` matters: the radio itself is visually hidden and
                // absolutely positioned, so without it the browser would scroll
                // to wherever the nearest positioned ancestor happens to be
                // when focus lands on this option.
                'relative flex cursor-pointer flex-col gap-4 rounded-lg border-2 p-5 sm:p-6',
                'transition-[background-color,border-color,transform,box-shadow] duration-200',
                'hover:-translate-y-[2px] focus-within:[outline:3px_solid_var(--color-volt)] focus-within:[outline-offset:3px]',
                selected
                  ? 'border-ink bg-volt-soft shadow-[0_5px_0_0_var(--color-ink)]'
                  : 'border-line bg-paper hover:border-ink'
              )}
            >
              <span className="flex gap-3">
                <input
                  id={index === 0 ? groupId : `${groupId}-${method.id}`}
                  type="radio"
                  name="paymentPreference"
                  value={method.id}
                  checked={selected}
                  onChange={() => onSelect(method.id)}
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
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-[1.1rem] leading-tight font-extrabold text-ink">
                    {method.label}
                  </span>
                  <span className="text-[0.83rem] leading-relaxed text-slate">
                    {method.blurb}
                  </span>
                </span>
              </span>

              <PaymentMethodMarks id={method.id} className="pl-8" />
            </label>
          )
        })}
      </div>

      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
    </div>
  )
}
