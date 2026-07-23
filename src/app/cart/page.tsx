import type { Metadata } from 'next'

import { CartPageContent } from '@/components/cart/cart-page-content'
import { Reveal } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { breadcrumbSchema, buildMetadata, webPageSchema } from '@/lib/seo'

const PAGE_TITLE = 'Your Cart'
const PAGE_DESCRIPTION =
  'Review your Purasynth dually wheel sets before placing an order. No card details are collected — we confirm fitment, then email an invoice with a secure payment link.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/cart',
  noIndex: true,
})

export default function CartPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Cart', path: '/cart' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/cart',
          }),
        ]}
      />

      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-80 w-[42rem] -translate-x-1/2 rounded-blob bg-haze motion-safe:animate-blob"
        />

        <Container size="wide">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone="lime">Step 1 of 2</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">
              Your cart
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
              Check the finish, the fitment and the count. Nothing is charged
              here — the next step collects shipping details so the bolt pattern
              can be confirmed before a pallet is booked.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28 lg:pb-32">
        <Container size="wide">
          <CartPageContent />
        </Container>
      </section>
    </>
  )
}
