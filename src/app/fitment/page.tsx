import type { Metadata } from 'next'
import { ArrowRight, Gauge, Mail, Ruler, Target, TriangleAlert } from 'lucide-react'

import { FaqAccordion } from '@/components/faq/faq-accordion'
import { Marquee } from '@/components/motion/marquee'
import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SectionHeading } from '@/components/ui/section-heading'
import { fitmentFaqs } from '@/lib/faqs'
import { allFitments } from '@/lib/products'
import { breadcrumbSchema, buildMetadata, webPageSchema } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Dually Wheel Fitment Guide: Bolt Patterns, Hub Bore & Load Rating'
const PAGE_DESCRIPTION =
  'How to work out dually wheel fitment: 8x200mm Ford, 8x210mm GM and 8x165.1mm RAM bolt patterns, hub-centric versus lug-centric mounting, load rating, offset, and exactly what to measure before ordering a 22x8.25 set.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/fitment',
  keywords: [
    'dually wheel fitment guide',
    '8x200 bolt pattern',
    '8x210 bolt pattern',
    '8x165.1 bolt pattern',
    'hub centric vs lug centric',
    'dually wheel bolt pattern chart',
    'F-350 dually wheel fitment',
    'RAM 3500 bolt pattern',
  ],
})

const FOUR_NUMBERS = [
  {
    icon: Target,
    title: 'Bolt pattern',
    body: 'Eight studs, and the circle they sit on. Ford, GM and RAM all use eight, and all three circles are different. A wheel that is 10mm out will start on two studs and never seat.',
  },
  {
    icon: Ruler,
    title: 'Center bore',
    body: 'The hole in the middle. On a hub-centric wheel it is machined to sit tight on the hub flange so the hub carries the weight instead of the studs.',
  },
  {
    icon: Gauge,
    title: 'Load rating',
    body: 'What one wheel is rated to carry. Multiply by the wheels on the axle and it has to clear the axle rating on your door-jamb sticker.',
  },
  {
    icon: TriangleAlert,
    title: 'Offset',
    body: 'Where the mounting face sits in the barrel. On a dually it also sets rear track width and how far the outer wheel stands out under the fender.',
  },
] as const

const MEASURE_STEPS = [
  'Park on level ground, chock the front wheels, and work on one rear hub at a time. You are measuring the hub, not the wheel that is currently on it. An aftermarket wheel already on the truck may itself be wrong.',
  'Count the studs. Every truck on this page is an eight-stud pattern. If you count six or ten, the sets sold here are not for that truck.',
  'On an eight-lug hub, measure straight across the circle from the center of one stud to the center of the stud directly opposite it. That distance is the bolt circle diameter: 200mm, 210mm or 165.1mm on the trucks listed below.',
  'Measure the raised metal ring on the hub face that the wheel slides over. That diameter is the center bore your wheels have to match.',
  'Photograph the door-jamb sticker. It carries the gross axle weight ratings, which is what the wheel load rating has to clear.',
] as const

const MISTAKES = [
  {
    title: 'Trusting the wheel that is already on it',
    body: 'If the truck was bought used, the current wheels may already be the wrong spec. Measure the hub, not the hardware someone else chose.',
  },
  {
    title: 'Reading 8x6.5" as 8x165mm and calling it close enough',
    body: '8x6.5" is exactly 165.1mm, so those two are the same pattern. 8x170mm is not, and it is a different vehicle family entirely.',
  },
  {
    title: 'Filling a loose center bore with plastic rings',
    body: 'Plastic centering rings are a fitment aid on light cars. On a loaded one-ton they let the studs take shear load they were never meant to carry.',
  },
  {
    title: 'Reusing lug nuts with the wrong seat',
    body: 'Conical, spherical and flat-seat lug nuts are not interchangeable. Every set here ships with hardware matched to the bolt pattern for exactly that reason.',
  },
  {
    title: 'Skipping the re-torque',
    body: 'Aluminum settles against the hub face over the first few heat cycles. Re-torque at 50 to 100 miles or the clamp load quietly drops.',
  },
  {
    title: 'Assuming cab and chassis is the same truck',
    body: 'An F-450 pickup and an F-450 cab and chassis do not share a wheel. The chassis trucks run their own, larger pattern.',
  },
] as const

const TICKER = [
  '8x200mm Ford',
  '8x210mm GM',
  '8x165.1mm RAM',
  '10x225mm cab & chassis',
  'Hub-centric',
  '4,500 lb per wheel',
]

export default function FitmentPage() {
  return (
    <>
      {/* No faqSchema here. /faq carries the one canonical FAQPage — these
          questions also appear there, and the same markup on several URLs
          risks all of them being dropped. The accordion below still renders. */}
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Fitment', path: '/fitment' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/fitment',
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-blob bg-sky-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-blob bg-lime-soft motion-safe:animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Fitment' }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone="sky">Fitment guide</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
              Get the <span className="text-gradient">bolt pattern</span> right
              once.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
              Everything a dually owner needs to know before ordering wheels:
              what the numbers mean, what to measure, which trucks run which
              pattern, and how to get it checked by a person instead of guessing.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href="#chart" size="md">
                Jump to the chart
                <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="md">
                Have it checked for me
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <div className="border-y-2 border-ink bg-sky py-3">
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
            eyebrow="Start here"
            title="Four numbers decide whether a wheel fits"
            description="Everything else on a spec sheet is styling. These four are the ones that stop a set going on, or stop it staying on."
            tone="volt"
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FOUR_NUMBERS.map((item, index) => (
              <RevealItem key={item.title}>
                <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-volt-soft">
                      <item.icon
                        className="h-5 w-5 text-volt-deep"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-mono text-2xl font-bold text-slate">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold">
                    {item.title}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-slate">
                    {item.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h3 className="text-2xl sm:text-3xl">
                What a bolt pattern actually describes
              </h3>
              <div className="mt-5 flex flex-col gap-4 text-[1.02rem] leading-relaxed text-slate">
                <p>
                  A bolt pattern is written as two numbers: how many studs, and
                  the diameter of the imaginary circle their centers sit on.
                  &ldquo;8x200mm&rdquo; means eight studs on a 200mm circle. It
                  is the single most common reason a wheel order goes wrong,
                  because three different one-ton trucks use three circles that
                  are within 45mm of each other and none of them interchange.
                </p>
                <p>
                  Ford Super Duty duallys from 2005 onward run 8x200mm. GM 3500
                  duallys from 2011 onward run 8x210mm. RAM 3500 and up have run
                  8x165.1mm (the same thing as 8x6.5&Prime; in imperial) since
                  1994. A 200mm wheel will start onto a 210mm hub on two or
                  three studs and feel like it is nearly right. It is not. Stop.
                </p>
                <p>
                  Cab and chassis trucks are their own category. An F-450 or
                  F-550 chassis cab runs a 10x225mm pattern, shared with some
                  medium-duty trucks, and has nothing in common with the pickup
                  wearing the same badge.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.08}>
              <h3 className="text-2xl sm:text-3xl">
                Hub-centric versus lug-centric
              </h3>
              <div className="mt-5 flex flex-col gap-4 text-[1.02rem] leading-relaxed text-slate">
                <p>
                  This is the difference between a wheel that is held in place
                  by the hub and one that is held in place by the studs. On a{' '}
                  <strong className="font-semibold text-ink">
                    hub-centric
                  </strong>{' '}
                  wheel the center bore is machined to sit snugly over the
                  raised flange on the hub. The wheel is centered by that
                  flange, and the vertical load of the truck passes through it.
                  The lug nuts do one job: clamping.
                </p>
                <p>
                  On a{' '}
                  <strong className="font-semibold text-ink">lug-centric</strong>{' '}
                  wheel the bore is deliberately oversized and the wheel is
                  centered by the taper of the lug nuts as they are tightened.
                  It works, it is common on heavy trucks with the right hardware,
                  and it is far less forgiving: uneven torque leaves the wheel
                  slightly off-center, and off-center on a loaded dually shows up
                  as a vibration you cannot balance out.
                </p>
                <p>
                  Every Purasynth wheel is hub-centric, with the bore machined to
                  the application rather than run oversized and shimmed with
                  plastic rings. That is deliberate. Rings are fine on a
                  commuter car and out of their depth under 4,500 lb.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-cream py-20 sm:py-28">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Five minutes in the driveway"
                title="What to measure"
                description="You need a tape measure, a phone camera and level ground. Nothing has to come off the truck."
                tone="lime"
              />
            </Reveal>

            <Stagger className="flex flex-col gap-4">
              {MEASURE_STEPS.map((step, index) => (
                <RevealItem key={step}>
                  <div className="flex gap-5 rounded-lg border-2 border-ink bg-paper p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lime font-mono text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="pt-1.5 text-[0.95rem] leading-relaxed text-slate">
                      {step}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.1}>
            <p className="mt-12 max-w-3xl rounded-lg border-2 border-volt bg-volt-soft p-6 text-[1.02rem] leading-relaxed font-medium text-ink">
              An eight-lug pattern is the easy one to measure, because the studs
              sit in opposing pairs. Five-lug patterns need the offset method,
              but no dually on this page has five lugs, so you can ignore all of
              that.
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="chart" className="scroll-mt-28 py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <SectionHeading
            eyebrow="The chart"
            title="Every fitment offered, and what it covers"
            description="These are the options that appear at checkout. Both wheel sets are available in every pattern listed here."
            tone="coral"
          />

          <Reveal delay={0.08}>
            <div className="mt-12 overflow-x-auto rounded-lg border-2 border-ink bg-paper">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">
                  Dually wheel bolt patterns offered by Purasynth, with the
                  trucks each one covers
                </caption>
                <thead>
                  <tr className="border-b-2 border-ink bg-haze">
                    <th
                      scope="col"
                      className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-ink uppercase"
                    >
                      Make
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-ink uppercase"
                    >
                      Bolt pattern
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-ink uppercase"
                    >
                      Trucks covered
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allFitments.map((fitment) => (
                    <tr
                      key={fitment.id}
                      className="border-b border-line transition-colors last:border-b-0 hover:bg-lime-soft"
                    >
                      <th
                        scope="row"
                        className="px-6 py-5 font-display text-base font-extrabold text-ink"
                      >
                        {fitment.label}
                      </th>
                      <td className="px-6 py-5 font-mono text-sm font-bold text-volt-deep">
                        {fitment.bolt}
                      </td>
                      <td className="px-6 py-5 text-[0.92rem] leading-relaxed text-slate">
                        {fitment.trucks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-lg border-2 border-line bg-cream p-6">
                <h3 className="font-display text-xl font-extrabold">
                  Both sets, every pattern
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">
                  The A127 Innovator in gloss black and the Mesh 8 in mirror
                  polish are the same 22x8.25 platform underneath. Choosing a
                  finish does not limit which trucks it fits.
                </p>
              </div>
              <div className="rounded-lg border-2 border-line bg-cream p-6">
                <h3 className="font-display text-xl font-extrabold">
                  Offset is set by the pattern
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">
                  Offset and center bore are application-specific and machined to
                  match the pattern you choose. There is no offset dropdown to
                  get wrong.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-haze py-20 sm:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="Avoid these"
            title="Six ways a dually wheel order goes wrong"
            description="Every one of these has cost someone a weekend. None of them are hard to avoid once you know they exist."
            tone="coral"
          />

          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MISTAKES.map((item) => (
              <RevealItem key={item.title}>
                <div className="flex h-full flex-col gap-3 rounded-lg border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1.5">
                  <TriangleAlert
                    className="h-6 w-6 text-coral"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-lg font-extrabold">
                    {item.title}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-slate">
                    {item.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-20 sm:py-28 lg:py-32">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl">
                After the wheels are on
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-[1.02rem] leading-relaxed text-slate">
                <p>
                  Fitment does not end when the lug nuts are snug. Aluminum
                  wheels bed into the hub face over the first few heat cycles,
                  and the clamp load drops as they do. Torque to the truck
                  manufacturer&rsquo;s figure in a star pattern, drive 50 to 100
                  miles, then re-torque every nut to the same figure. It takes
                  ten minutes and it is the single most skipped step in the
                  whole process.
                </p>
                <p>
                  Purasynth ships wheels only: no tires and no TPMS sensors.
                  Existing sensors usually transfer, but the sensor style should
                  be checked by whoever mounts the tires before the swap starts.
                  Mount and balance is a job for a shop with a dually-capable
                  machine, and professional installation is a condition of the
                  warranty.
                </p>
                <p>
                  Match tire load rating to the wheel and to the axle ratings on
                  the door-jamb sticker. A 4,500 lb wheel under a 3,000 lb tire
                  is still a 3,000 lb corner.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.08}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl">
                Not sure? That is the normal answer.
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-[1.02rem] leading-relaxed text-slate">
                <p>
                  Nobody expects a buyer to know their center bore off the top of
                  their head. At checkout there is an option called{' '}
                  <strong className="font-semibold text-ink">
                    &ldquo;Not sure, check my fitment&rdquo;
                  </strong>
                  . Choose it, put your year, make, model and trim in the vehicle
                  box, and the pattern gets worked out here and confirmed in
                  writing before anything is booked onto a pallet.
                </p>
                <p>
                  Because no card details are collected anywhere on this site,
                  choosing that option costs nothing and commits nothing. The
                  order is a request. An invoice with a payment link only goes
                  out once the fitment is confirmed, so the money moves after the
                  question is settled rather than before it.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Fitment check: year / make / model')}`}
                  external
                  size="lg"
                >
                  <Mail className="h-5 w-5" strokeWidth={2.6} />
                  Have my fitment checked
                </ButtonLink>
                <ButtonLink href="/shop" variant="outline" size="lg">
                  See both sets
                  <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t-2 border-ink bg-cream py-20 sm:py-28 lg:py-32">
        <Container size="default">
          <SectionHeading
            eyebrow="Fitment questions"
            title="Asked most often"
            description="The five that decide whether a set fits. Here they are in full."
            align="center"
            tone="volt"
          />

          <Reveal delay={0.08} className="mt-12">
            <FaqAccordion
              entries={fitmentFaqs}
              idPrefix="fitment-faq"
              defaultOpenIndex={0}
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-10 text-center text-[0.95rem] text-slate">
              Something not covered? Email{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-volt-deep underline underline-offset-4 hover:text-ink"
              >
                {site.email}
              </a>{' '}
              and you get a written answer within {site.responseWindow}.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
