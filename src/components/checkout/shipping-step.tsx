'use client'

import { ChevronDown } from 'lucide-react'

import { Field, inputClass } from '@/components/checkout/checkout-fields'
import type {
  FormValues,
  TextFieldName,
} from '@/components/checkout/checkout-values'
import { US_STATES, type OrderFieldErrors } from '@/lib/order-schema'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

interface ShippingStepProps {
  readonly values: FormValues
  readonly fieldErrors: OrderFieldErrors
  readonly onChange: (name: TextFieldName, value: string) => void
  readonly fieldId: (name: string) => string
}

/** Step 1. Contact details, the delivery address and the truck. */
export function ShippingStep({
  values,
  fieldErrors,
  onChange,
  fieldId,
}: ShippingStepProps) {
  return (
    <div className="flex flex-col gap-8">
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
              onChange={(event) => onChange('firstName', event.target.value)}
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
              onChange={(event) => onChange('lastName', event.target.value)}
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
              onChange={(event) => onChange('email', event.target.value)}
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
              onChange={(event) => onChange('phone', event.target.value)}
              aria-invalid={fieldErrors.phone ? true : undefined}
              aria-describedby={describedBy}
              className={inputClass(Boolean(fieldErrors.phone))}
            />
          )}
        </Field>
      </div>

      <div className="flex flex-col gap-6 border-t-2 border-dashed border-ink/15 pt-8">
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
              onChange={(event) => onChange('addressLine1', event.target.value)}
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
              onChange={(event) => onChange('addressLine2', event.target.value)}
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
                onChange={(event) => onChange('city', event.target.value)}
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
                  onChange={(event) => onChange('state', event.target.value)}
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
                onChange={(event) => onChange('zip', event.target.value)}
                aria-invalid={fieldErrors.zip ? true : undefined}
                aria-describedby={describedBy}
                className={inputClass(Boolean(fieldErrors.zip))}
                placeholder="77377"
              />
            )}
          </Field>
        </div>

        <p className="rounded-lg bg-haze px-5 py-4 text-[0.84rem] leading-relaxed text-slate">
          Freight is free to the lower 48. Alaska, Hawaii and anywhere outside
          the US are quoted individually, so email {site.email} before ordering
          and a real number comes back.
        </p>
      </div>

      <div className="flex flex-col gap-6 border-t-2 border-dashed border-ink/15 pt-8">
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
              onChange={(event) => onChange('vehicle', event.target.value)}
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
              onChange={(event) => onChange('notes', event.target.value)}
              aria-invalid={fieldErrors.notes ? true : undefined}
              aria-describedby={describedBy}
              className={cn(inputClass(Boolean(fieldErrors.notes)), 'resize-y')}
              placeholder="No forklift here, curbside is fine."
            />
          )}
        </Field>
      </div>
    </div>
  )
}
