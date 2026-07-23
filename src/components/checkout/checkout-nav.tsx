'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

import { Button, ButtonLink } from '@/components/ui/button'

interface CheckoutNavProps {
  readonly step: number
  readonly lastStep: number
  readonly submitting: boolean
  readonly onBack: () => void
  readonly onContinue: () => void
}

/**
 * Back and forward for the whole flow.
 *
 * Back is a link to the cart on the first step and a button everywhere else,
 * because leaving the form and rewinding it are different actions and should
 * not look like the same one only when you read the label. The forward control
 * is a plain button until the final step, where it becomes the submit.
 */
export function CheckoutNav({
  step,
  lastStep,
  submitting,
  onBack,
  onContinue,
}: CheckoutNavProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {step === 0 ? (
        <ButtonLink href="/cart" variant="outline" size="md">
          <ArrowLeft className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
          Back to cart
        </ButtonLink>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onBack}
          disabled={submitting}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
          Back
        </Button>
      )}

      {step < lastStep ? (
        <Button
          type="button"
          size="lg"
          variant="primary"
          onClick={onContinue}
          className="w-full sm:w-auto sm:min-w-64"
        >
          Continue
          <ArrowRight className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={submitting}
          className="w-full sm:w-auto sm:min-w-72"
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
              Place order, no payment now
              <ArrowRight
                className="h-5 w-5"
                strokeWidth={2.8}
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
