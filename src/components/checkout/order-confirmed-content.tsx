'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { Check, Copy, Mail, PartyPopper } from 'lucide-react'

import {
  getLastPaymentMethodServerSnapshot,
  readLastPaymentMethod,
  subscribeToLastPaymentMethod,
} from '@/components/checkout/last-payment-method'
import { PaymentMethodMarks } from '@/components/checkout/payment-method-marks'
import { ButtonLink } from '@/components/ui/button'
import { paymentMethodLabel } from '@/lib/payment-methods'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

interface OrderConfirmedContentProps {
  /** From ?order=. Null when someone lands here without placing an order. */
  readonly orderNumber: string | null
}

interface ConfettiPiece {
  readonly left: number
  readonly delay: number
  readonly rotate: number
  readonly color: string
  readonly round: boolean
}

/**
 * Fixed confetti layout rather than random values: this component is rendered
 * on the server too, and Math.random() would produce a different arrangement
 * on each side and trip a hydration mismatch.
 */
const CONFETTI: readonly ConfettiPiece[] = [
  { left: 6, delay: 0, rotate: 18, color: 'bg-volt', round: false },
  { left: 14, delay: 0.14, rotate: -32, color: 'bg-lime', round: true },
  { left: 23, delay: 0.05, rotate: 46, color: 'bg-coral', round: false },
  { left: 31, delay: 0.28, rotate: -12, color: 'bg-sky', round: true },
  { left: 39, delay: 0.1, rotate: 62, color: 'bg-volt-deep', round: false },
  { left: 47, delay: 0.34, rotate: -48, color: 'bg-lime', round: false },
  { left: 55, delay: 0.02, rotate: 24, color: 'bg-coral', round: true },
  { left: 63, delay: 0.22, rotate: -66, color: 'bg-volt', round: false },
  { left: 71, delay: 0.4, rotate: 36, color: 'bg-sky', round: false },
  { left: 79, delay: 0.08, rotate: -20, color: 'bg-lime', round: true },
  { left: 87, delay: 0.3, rotate: 54, color: 'bg-volt-deep', round: false },
  { left: 94, delay: 0.18, rotate: -40, color: 'bg-coral', round: false },
]

const STEPS = [
  {
    title: 'Order received',
    body: 'It is logged against the number below. Nothing has been charged and no card details were collected anywhere on this site.',
    tone: 'bg-volt-soft',
  },
  {
    title: 'Fitment confirmed',
    body: `The owner checks your bolt pattern against the year, make and model you gave us, and comes back within ${site.responseWindow}. If anything changes the fitment, you hear about it before an invoice exists.`,
    tone: 'bg-lime-soft',
  },
  {
    title: 'Invoice, then freight',
    body: 'An invoice with a secure payment link arrives by email. Pay it whenever you are ready. The pallet books within 1 to 2 business days after that, free to the lower 48.',
    tone: 'bg-coral-soft',
  },
] as const

/** The step whose card names the payment method the customer picked. */
const PAYMENT_STEP_INDEX = 2

export function OrderConfirmedContent({
  orderNumber,
}: OrderConfirmedContentProps) {
  const reduceMotion = useReducedMotion()
  const [copied, setCopied] = useState(false)

  // sessionStorage does not exist on the server, so the method resolves on the
  // client only. Someone who reopens this link in a fresh session gets null,
  // and the card then says nothing about a method rather than guessing one.
  const method = useSyncExternalStore(
    subscribeToLastPaymentMethod,
    readLastPaymentMethod,
    getLastPaymentMethodServerSnapshot
  )

  useEffect(() => {
    if (!copied) return

    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyOrderNumber() {
    if (!orderNumber) return

    try {
      await navigator.clipboard.writeText(orderNumber)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context or a denied permission). The
      // number is on screen in a selectable block, so nothing is lost.
    }
  }

  return (
    <div className="flex flex-col gap-14">
      <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-paper px-6 py-14 shadow-[0_8px_0_0_var(--color-ink)] sm:px-12 sm:py-20">
        {!reduceMotion ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {CONFETTI.map((piece) => (
              <motion.span
                key={piece.left}
                initial={{ y: -60, opacity: 0, rotate: 0 }}
                animate={{
                  y: ['-10%', '120%'],
                  opacity: [0, 1, 1, 0],
                  rotate: piece.rotate * 6,
                }}
                transition={{
                  duration: 2.8,
                  delay: piece.delay,
                  ease: 'easeIn',
                }}
                style={{ left: `${piece.left}%` }}
                className={cn(
                  'absolute top-0 h-3 w-3',
                  piece.round ? 'rounded-full' : 'rounded-[2px]',
                  piece.color
                )}
              />
            ))}
          </div>
        ) : null}

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-7 text-center">
          <motion.span
            initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 340, damping: 18 }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink bg-lime"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-lime motion-safe:animate-pulse-ring"
            />
            <PartyPopper
              className="h-10 w-10 text-ink"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </motion.span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl">
            {orderNumber ? (
              <>
                That&rsquo;s <span className="text-gradient">locked in.</span>
              </>
            ) : (
              'Order page'
            )}
          </h1>

          {orderNumber ? (
            <>
              <p className="text-lg leading-relaxed text-slate">
                Your order is with us. Nothing has been charged. The next thing
                you get is a fitment confirmation, and only then an invoice.
              </p>

              <div className="w-full max-w-md">
                <p className="font-mono text-[0.66rem] font-bold tracking-[0.2em] text-slate uppercase">
                  Your order number
                </p>

                <div className="mt-3 flex items-stretch gap-2">
                  <code className="flex flex-1 items-center justify-center rounded-md border-2 border-ink bg-haze px-5 py-4 font-mono text-lg font-bold tracking-[0.1em] break-all text-ink sm:text-xl">
                    {orderNumber}
                  </code>

                  <button
                    type="button"
                    onClick={copyOrderNumber}
                    aria-label={`Copy order number ${orderNumber}`}
                    className={cn(
                      'flex w-14 shrink-0 items-center justify-center rounded-md border-2 border-ink transition-colors',
                      copied ? 'bg-lime' : 'bg-paper hover:bg-lime-soft'
                    )}
                  >
                    {copied ? (
                      <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <Copy className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                    )}
                  </button>
                </div>

                <p aria-live="polite" className="mt-2 h-5 text-[0.8rem] font-semibold text-volt-deep">
                  {copied ? 'Copied to your clipboard.' : ''}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed text-slate">
                There is no order number in this link, so there is nothing to show
                here. If you just placed an order, the number is in the
                confirmation you received on screen. If you did not, nothing has
                been charged either way.
              </p>
              <p className="text-lg leading-relaxed text-slate">
                Email {site.email} with your name and we will find it.
              </p>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Back to the shop front
            </ButtonLink>
            <ButtonLink
              href={`mailto:${site.email}`}
              external
              variant="outline"
              size="lg"
            >
              <Mail className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
              Email the owner
            </ButtonLink>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-4xl sm:text-5xl">What happens next</h2>

        <ol className="mt-10 grid gap-5 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.2 + index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                'flex flex-col gap-4 rounded-lg border-2 border-ink p-6 sm:p-7',
                step.tone
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-paper font-display text-xl font-extrabold">
                {index + 1}
              </span>
              <h3 className="font-display text-2xl font-extrabold">
                {step.title}
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-graphite">
                {step.body}
              </p>

              {index === PAYMENT_STEP_INDEX && method ? (
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border-2 border-ink bg-paper px-4 py-3">
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.14em] text-slate uppercase">
                    Paying by
                  </span>
                  <span className="text-[0.9rem] font-bold text-ink">
                    {paymentMethodLabel(method)}
                  </span>
                  <PaymentMethodMarks id={method} markClassName="h-6 w-auto" />
                </div>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border-2 border-dashed border-ink bg-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-extrabold">
            Need to change something?
          </h2>
          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-slate">
            Address wrong, wrong finish, changed your mind entirely: reply any
            time before you pay the invoice and it costs you nothing. Purasynth is
            independently run, so the reply comes from the person who packs the
            pallet.
          </p>
        </div>

        <ButtonLink
          href={`mailto:${site.email}`}
          external
          variant="coral"
          size="md"
          className="shrink-0"
        >
          {site.email}
        </ButtonLink>
      </div>
    </div>
  )
}
