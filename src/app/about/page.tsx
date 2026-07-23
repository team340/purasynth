import type { Metadata } from 'next'
import {
  ArrowRight,
  Hammer,
  Mail,
  MapPin,
  Package,
  Quote,
  Ruler,
  Wrench,
} from 'lucide-react'

import { CountUp } from '@/components/motion/count-up'
import { Magnetic } from '@/components/motion/magnetic'
import { Marquee } from '@/components/motion/marquee'
import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { TiltCard } from '@/components/motion/tilt-card'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SectionHeading } from '@/components/ui/section-heading'
import { products } from '@/lib/products'
import { breadcrumbSchema, buildMetadata, webPageSchema } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Our Story: One Person, Two Wheel Sets, Tomball Texas'
const PAGE_DESCRIPTION =
  'Purasynth is independently run out of Tomball, Texas by one person. Why dually wheels, why only two sets to start, what flow-formed actually means, and why nobody takes your card details on this site.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/about',
  keywords: [
    'about Purasynth',
    'independent dually wheel shop',
    'dually wheels Tomball Texas',
    'flow-formed dually wheels',
    'sole proprietor wheel shop',
  ],
})

const TIMELINE = [
  {
    marker: String(site.foundedYear),
    title: 'A bad set of wheels and a long drive home',
    body: 'It started with a set that looked right in the photos and rang like a bell at 65 with a trailer behind me. Wrong center bore, hidden behind a plastic ring. The seller had never asked what I drove. The order page never had a box for it.',
  },
  {
    marker: 'Then',
    title: 'Learning what actually matters on a one-ton',
    body: 'Bolt pattern, hub bore, load rating, offset. Four numbers that decide whether a dually tracks straight or hunts across a lane. Most of the sites selling them treat all four as an afterthought, and the buyer finds out at highway speed.',
  },
  {
    marker: 'Now',
    title: 'Two sets, spec’d properly, checked by a person',
    body: `That is the whole idea behind Purasynth. ${products.length} sets, both 22x8.25, both rated to 4,500 lb per wheel, and a real person reading the year, make and model on every order before a pallet is booked out of Tomball.`,
  },
  {
    marker: 'Next',
    title: 'More finishes, once these two are right',
    body: 'New sizes and finishes get added when they are worth adding, not to make the catalogue look busy. If something is coming, it will show up on the shop page and nowhere else first.',
  },
] as const

const FACTS = [
  { value: 4500, suffix: ' lb', label: 'Load rating per wheel' },
  { value: 6, suffix: ' wheels', label: 'In every set' },
  { value: 22, suffix: '"', label: 'Diameter, 8.25" wide' },
  { value: site.warrantyYears, suffix: ' yr', label: 'Structural + finish warranty' },
] as const

const FLOW_FORM_STEPS = [
  {
    icon: Package,
    title: 'It starts as a casting',
    body: 'Molten A356 aluminum is poured into a mould. That alone would be a cast wheel: cheap, heavy, and thick-walled because cast grain is not especially strong.',
  },
  {
    icon: Hammer,
    title: 'The barrel gets spun',
    body: 'The casting is heated and spun while rollers press the barrel outward. The metal stretches and the grain lines up along the direction of the force instead of sitting randomly.',
  },
  {
    icon: Ruler,
    title: 'Thinner wall, same strength',
    body: 'Aligned grain lets the same strength live in a thinner wall, so the finished wheel is lighter than the cast version it started as while still carrying 4,500 lb.',
  },
] as const

const ORDER_STEPS = [
  {
    title: 'You place the order',
    body: 'Name, address, your truck, which set. No card fields exist on this site, so nothing can be charged at this point even by accident.',
  },
  {
    title: 'I check the fitment',
    body: 'Your year, make, model and trim against the bolt pattern and hub bore. If something does not line up, you hear about it before money is involved.',
  },
  {
    title: 'An invoice arrives',
    body: `An emailed invoice with a payment link, inside ${site.responseWindow}. Pay it and the pallet gets booked. Ignore it and nothing happens. No charge, no chasing.`,
  },
] as const

const MARQUEE_WORDS = [
  'Independently run',
  'Tomball, Texas',
  'Fitment checked by a person',
  'No call centre',
  'Wheels only, no tires',
  'Free freight, lower 48',
]

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Our Story', path: '/about' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/about',
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-20 h-80 w-80 rounded-blob bg-coral-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -left-28 h-72 w-72 rounded-blob bg-lime-soft motion-safe:animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Our Story' }]}
            className="mb-8"
          />

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow tone="coral">One person, one inbox</Eyebrow>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-5 text-5xl sm:text-7xl lg:text-8xl">
                  I sell the wheels{' '}
                  <span className="text-gradient">I wish I&rsquo;d bought</span>{' '}
                  the first time.
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
                  Purasynth is independently run out of Tomball, Texas. No call
                  centre, no sales floor, no ticket queue. When you email, the
                  person who packed the last pallet is the person who writes
                  back.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <ButtonLink href="/shop" size="lg">
                      See both sets
                      <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
                    </ButtonLink>
                  </Magnetic>
                  <ButtonLink href="/contact" variant="outline" size="lg">
                    Email the owner
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            <Reveal direction="scale" delay={0.2}>
              <TiltCard className="relative mx-auto aspect-square w-full max-w-md">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-dashed border-volt/40 motion-safe:animate-spin-slower"
                />
                {/* chrome-sheen owns the `animation` shorthand, so pairing it
                    with a spin utility silently drops one of the two. The
                    sheen wins here: the dashed ring outside already carries
                    the rotation, and spinning a gradient behind the centred
                    text would fight with it. */}
                <div
                  aria-hidden="true"
                  className="chrome-sheen absolute inset-8 rounded-full border-2 border-ink"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] text-volt-deep uppercase">
                    Shipped from
                  </span>
                  <span className="font-display text-4xl leading-none font-extrabold sm:text-5xl">
                    Tomball
                  </span>
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] text-slate uppercase">
                    {site.address.region}
                  </span>
                  <MapPin
                    className="mt-2 h-6 w-6 text-coral"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </Container>
      </section>

      <div className="border-y-2 border-ink bg-lime py-3">
        <Marquee itemClassName="gap-10 pr-10">
          {MARQUEE_WORDS.map((word) => (
            <span
              key={word}
              className="flex items-center gap-3 font-mono text-[0.72rem] font-bold tracking-[0.2em] whitespace-nowrap text-ink uppercase"
            >
              <span aria-hidden="true">◆</span>
              {word}
            </span>
          ))}
        </Marquee>
      </div>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="default">
          <SectionHeading
            eyebrow="Why dually wheels"
            title="Because the trucks that work hardest get the worst options."
            tone="volt"
          />

          <div className="mt-10 flex max-w-3xl flex-col gap-6 text-lg leading-relaxed text-slate">
            <Reveal>
              <p>
                Half-ton trucks have a thousand wheel options. Move up to a
                one-ton dually and the market thins out fast: six wheels
                instead of four, two different faces, a hub bore that has to be
                machined rather than shimmed, and a load rating that actually
                has to mean something because you are hauling with it.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <p>
                So dually owners end up choosing between factory steel and
                whatever a marketplace listing says fits. That listing usually
                never asks what you drive. Mine does, and then I check the
                answer myself.
              </p>
            </Reveal>
          </div>

          <Reveal direction="scale" delay={0.1}>
            <figure className="mt-14 rounded-xl border-2 border-ink bg-volt-soft p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-12">
              <Quote
                className="h-9 w-9 text-volt-deep"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <blockquote className="mt-6">
                <p className="font-display text-3xl leading-tight font-extrabold text-ink sm:text-4xl lg:text-5xl">
                  A wheel that fits is not a feature. It is the whole product.
                </p>
              </blockquote>
              {/* Named as first-person editorial, not attributed praise —
                  Purasynth carries no testimonials, and a pull-quote with a
                  bare name under it reads like one. */}
              <figcaption className="mt-6 font-mono text-[0.7rem] font-bold tracking-[0.18em] text-slate uppercase">
                In my own words: I run Purasynth
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-cream py-20 sm:py-28 lg:py-32">
        <Container size="default">
          <SectionHeading
            eyebrow="How it got here"
            title="The short version"
            description="No origin myth. Four steps, in order, and none of them involve a factory. Purasynth specs and sells the wheels. It does not forge them."
            tone="coral"
          />

          <Stagger className="mt-14 flex flex-col">
            {TIMELINE.map((entry, index) => (
              <RevealItem key={entry.title}>
                <div className="relative flex gap-6 pb-12 last:pb-0 sm:gap-10">
                  <div className="relative flex flex-col items-center">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper font-mono text-[0.62rem] font-bold tracking-[0.08em] text-ink uppercase">
                      {entry.marker}
                    </span>
                    {index === TIMELINE.length - 1 ? null : (
                      <span
                        aria-hidden="true"
                        className="mt-2 w-0.5 flex-1 rounded-full bg-line"
                      />
                    )}
                  </div>

                  <div className="pt-2 pb-2">
                    <h3 className="font-display text-2xl font-extrabold sm:text-3xl">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-slate">
                      {entry.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <SectionHeading
            eyebrow="Plain english"
            title={
              <>
                What <span className="text-gradient">flow-formed</span> actually
                means
              </>
            }
            description="It is on every spec sheet in the wheel trade and almost nobody explains it. Here it is without the marketing."
            tone="sky"
          />

          <Stagger className="mt-14 grid gap-6 lg:grid-cols-3">
            {FLOW_FORM_STEPS.map((step, index) => (
              <RevealItem key={step.title}>
                <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-ink bg-paper p-7 transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft">
                      <step.icon
                        className="h-5 w-5 text-ink"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-mono text-2xl font-bold text-slate">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold">
                    {step.title}
                  </h3>
                  <p className="text-[0.92rem] leading-relaxed text-slate">
                    {step.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-3xl rounded-lg border-2 border-line bg-cream p-6 text-[1.02rem] leading-relaxed text-slate">
              Flow-formed sits between plain cast and fully forged, on weight
              and on price. That is the honest description, and it is the one
              used on the product pages too. Purasynth does not forge anything.
              The sets are built to spec and the center caps carry the maker&rsquo;s
              own marks.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <RevealItem key={fact.label}>
                <div className="rounded-lg border-2 border-ink bg-haze p-6 text-center">
                  <p className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                    <CountUp to={fact.value} suffix={fact.suffix} />
                  </p>
                  <p className="mt-3 font-mono text-[0.65rem] font-bold tracking-[0.16em] text-slate uppercase">
                    {fact.label}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-lime-soft py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Why there is no checkout gateway"
                title="Nobody should be able to charge you before the wheels are confirmed."
                description="It looks like a missing feature. It is deliberate, and it is the part of this shop I would change last."
                tone="lime"
              />
            </Reveal>

            <Stagger className="flex flex-col gap-5">
              {ORDER_STEPS.map((step, index) => (
                <RevealItem key={step.title}>
                  <div className="flex gap-5 rounded-lg border-2 border-ink bg-paper p-6 sm:p-7">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lime font-mono text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-extrabold">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="default">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-paper p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-12 lg:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-blob bg-volt-soft motion-safe:animate-blob"
              />

              <div className="relative">
                <Eyebrow tone="volt">Talk to me</Eyebrow>
                <h2 className="mt-5 text-4xl sm:text-5xl">
                  One address. It is the only one there is.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
                  There is no phone line. I would rather answer properly in
                  writing than half-answer while a pallet strap is in my other
                  hand. Send the truck details and you get a straight answer
                  within {site.responseWindow}.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <ButtonLink
                      href={`mailto:${site.email}?subject=${encodeURIComponent('Question for Purasynth')}`}
                      external
                      size="lg"
                    >
                      <Mail className="h-5 w-5" strokeWidth={2.6} />
                      {site.email}
                    </ButtonLink>
                  </Magnetic>
                  <ButtonLink href="/fitment" variant="outline" size="lg">
                    <Wrench className="h-5 w-5" strokeWidth={2.4} />
                    Check my fitment
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
