import type { Metadata } from 'next'

import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { Reveal } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: 'Place Your Order',
  description:
    'Give us your shipping details and fitment. No card details are collected — Purasynth confirms your bolt pattern, then emails an invoice with a secure payment link.',
  path: '/checkout',
  noIndex: true,
})

const STEPS = [
  { number: '01', label: 'You place the order', detail: 'No charge, no card fields.' },
  { number: '02', label: 'Fitment confirmed', detail: 'Checked against your truck.' },
  { number: '03', label: 'Invoice emailed', detail: 'Secure payment link, your call.' },
] as const

export default function CheckoutPage() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-blob bg-volt-soft motion-safe:animate-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-80 w-80 translate-x-1/3 rounded-blob bg-lime-soft motion-safe:animate-blob"
      />

      <Container size="wide">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Order details' },
          ]}
          className="mb-8"
        />

        <Reveal>
          <Eyebrow tone="coral">Step 2 of 2</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
            Tell us where it goes.
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            This form places an order, not a payment. Fill it in, and the owner
            confirms your bolt pattern before an invoice goes anywhere near your
            inbox — normally inside {site.responseWindow}.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <ol className="mt-10 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="flex items-start gap-3 rounded-lg border-2 border-ink bg-paper px-5 py-4"
              >
                <span className="font-display text-2xl font-extrabold text-volt">
                  {step.number}
                </span>
                <span className="flex flex-col">
                  <span className="text-[0.92rem] font-bold text-ink">
                    {step.label}
                  </span>
                  <span className="text-[0.8rem] text-slate">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* DOM order matches visual order at every breakpoint — the summary
            follows the form rather than being reordered by CSS, so a screen
            reader and a sighted visitor meet the two blocks in the same
            sequence. */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <CheckoutForm />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary />
          </div>
        </div>
      </Container>
    </section>
  )
}
