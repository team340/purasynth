import type { Metadata } from 'next'
import { ArrowRight, Boxes, Gauge, Ruler, ShieldCheck, Truck } from 'lucide-react'

import { Marquee } from '@/components/motion/marquee'
import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { ProductCard } from '@/components/product/product-card'
import { JsonLd } from '@/components/seo/json-ld'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SectionHeading } from '@/components/ui/section-heading'
import { products } from '@/lib/products'
import {
  breadcrumbSchema,
  buildMetadata,
  itemListSchema,
  webPageSchema,
} from '@/lib/seo'

const PAGE_TITLE = 'Shop Dually Wheels — Gloss Black & Mirror Polished Sets'
const PAGE_DESCRIPTION =
  'Two 22x8.25 dually wheel sets for Ford, RAM and GM one-ton trucks. Six wheels per set, 4,500 lb load rating per wheel, caps and lug hardware included, free freight to the lower 48.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/shop',
  keywords: [
    'dually wheels for sale',
    '22x8.25 dually wheel set',
    'gloss black dually wheels',
    'polished dually wheels',
    'Ford F-350 dually wheels',
    'RAM 3500 dually wheels',
  ],
})

const SET_CONTENTS = [
  {
    icon: Boxes,
    label: 'Six wheels',
    detail: 'Two front, four rear — a complete axle set, never a partial.',
  },
  {
    icon: Ruler,
    label: 'Caps both ends',
    detail: 'Front and rear center caps, machined for the same application.',
  },
  {
    icon: Gauge,
    label: 'Lug hardware',
    detail: 'Matched to your bolt pattern, with a torque sequence card.',
  },
  {
    icon: Truck,
    label: 'Free freight',
    detail: 'Curbside pallet delivery anywhere in the lower 48.',
  },
  {
    icon: ShieldCheck,
    label: 'Two-year warranty',
    detail: 'Structural and finish, from the day the pallet lands.',
  },
] as const

const TICKER = [
  '22 x 8.25',
  '4,500 lb per wheel',
  'Flow-formed A356-T6',
  '6 wheels per set',
  'Hub-centric',
  'Free freight',
]

export default function ShopPage() {
  return (
    <>
      <JsonLd
        data={[
          itemListSchema(products),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Wheels', path: '/shop' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/shop',
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-blob bg-lime-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-blob bg-coral-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Wheels' }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone="volt">Two sets. Both heavy.</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
              Wheels that make a{' '}
              <span className="text-gradient">one-ton</span> look intentional.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
              The whole catalogue, on one screen. Two finishes of the same
              heavy-duty 22x8.25 dually set — pick the look, tell us the truck,
              and the bolt pattern gets confirmed before a pallet is booked.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="/fitment" variant="outline" size="md">
                Check my fitment
                <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
              </ButtonLink>
              <span className="rounded-full border-2 border-ink bg-paper px-5 py-3 font-mono text-[0.7rem] font-bold tracking-[0.16em] uppercase">
                No card details, ever
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      <div className="border-y-2 border-ink bg-lime py-3">
        <Marquee itemClassName="gap-10 pr-10">
          {TICKER.map((item) => (
            <span
              key={item}
              className="flex items-center gap-3 font-mono text-[0.72rem] font-bold tracking-[0.2em] whitespace-nowrap text-ink uppercase"
            >
              <span aria-hidden="true">◆</span>
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <SectionHeading
            eyebrow={`${products.length} sets in the line`}
            title="Pick your finish"
            description="Same bones, same 4,500 lb rating, same six-piece set. The only real decision is whether your truck reads as blacked out or lit up."
            tone="lime"
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={index * 0.1} amount={0.15}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-cream py-20 sm:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="What's in a set"
            title="Six wheels and everything that bolts them on"
            description="A set is a complete axle set. Nothing here is an upsell at the invoice stage — the price on the card is the price of the whole pallet."
            tone="coral"
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SET_CONTENTS.map((item) => (
              <RevealItem key={item.label}>
                <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-volt-soft">
                    <item.icon
                      className="h-5 w-5 text-volt-deep"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="font-display text-xl font-extrabold">
                    {item.label}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-slate">
                    {item.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-volt-soft p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-12 lg:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full border-2 border-dashed border-volt/40 motion-safe:animate-spin-slow"
              />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Eyebrow tone="volt">Before you order</Eyebrow>
                  <h2 className="mt-5 text-4xl sm:text-5xl">
                    One wrong bolt pattern ruins a good weekend.
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate">
                    Ford runs 8x200mm, GM runs 8x210mm, RAM runs 8x165.1mm, and
                    cab-and-chassis trucks do their own thing entirely. Take
                    thirty seconds on the fitment guide, or pick &ldquo;Not
                    sure&rdquo; at checkout and we do the looking up for you.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink href="/fitment" size="lg">
                    Open fitment guide
                    <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="outline" size="lg">
                    Ask the owner
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
