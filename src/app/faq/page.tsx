import type { Metadata } from 'next'
import { ArrowRight, Mail } from 'lucide-react'

import { FaqAccordion } from '@/components/faq/faq-accordion'
import { Marquee } from '@/components/motion/marquee'
import { Reveal } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { allFaqs, faqGroups } from '@/lib/faqs'
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  webPageSchema,
} from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'FAQ — Dually Wheel Fitment, Payment, Freight & Returns'
const PAGE_DESCRIPTION =
  'Every question asked about Purasynth dually wheels: how checkout works without a payment gateway, which trucks the 8x200, 8x210 and 8x165.1 patterns fit, what is in a set, freight timings and the returns window.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/faq',
  keywords: [
    'dually wheel FAQ',
    'dually wheel fitment questions',
    'do dually wheels come with tires',
    'flow formed vs forged wheels',
    'dually wheel shipping time',
  ],
})

const TICKER = [
  `${allFaqs.length} answers`,
  'No card details, ever',
  'Wheels only, no tires',
  'Hub-centric fitment',
  'Free freight, lower 48',
]

/** Stable anchor id for a group title, e.g. "Ordering & payment". */
function groupId(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(allFaqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/faq',
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-blob bg-lime-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-blob bg-coral-soft motion-safe:animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone="lime">Everything, answered</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
              The <span className="text-gradient">questions</span> before the
              purchase.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
              Fitment, payment, freight and returns — {allFaqs.length} answers
              written the way they would be said out loud. If yours is not here,
              it gets answered by email within {site.responseWindow}.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <nav aria-label="FAQ sections" className="mt-9">
              <ul className="flex flex-wrap gap-2.5">
                {faqGroups.map((group) => (
                  <li key={group.title}>
                    <a
                      href={`#${groupId(group.title)}`}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-5 py-2.5 text-[0.88rem] font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime-soft"
                    >
                      {group.title}
                      <span className="font-mono text-[0.65rem] text-slate">
                        {group.entries.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
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

      <section className="py-20 sm:py-24 lg:py-28">
        <Container size="default">
          <div className="flex flex-col gap-16 lg:gap-20">
            {faqGroups.map((group, index) => (
              <section
                key={group.title}
                id={groupId(group.title)}
                className="scroll-mt-28"
              >
                <Reveal>
                  <div className="flex flex-wrap items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-sm font-bold text-slate"
                    >
                      0{index + 1}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl">
                      {group.title}
                    </h2>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="mt-8">
                  <FaqAccordion
                    entries={group.entries}
                    idPrefix={groupId(group.title)}
                    defaultOpenIndex={index === 0 ? 0 : null}
                  />
                </Reveal>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t-2 border-ink bg-cream py-20 sm:py-28">
        <Container size="default">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-paper p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full border-2 border-dashed border-coral/40 motion-safe:animate-spin-slower"
              />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Eyebrow tone="coral">Still stuck?</Eyebrow>
                  <h2 className="mt-5 text-3xl sm:text-4xl">
                    Ask the awkward one.
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate">
                    Odd wheelbase, aftermarket hub, a trailer setup nobody
                    writes guides about — send it over. A written answer beats a
                    guess, and it costs you nothing to ask before ordering.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink
                    href={`mailto:${site.email}?subject=${encodeURIComponent('Question from the FAQ page')}`}
                    external
                    size="lg"
                  >
                    <Mail className="h-5 w-5" strokeWidth={2.6} />
                    Email the owner
                  </ButtonLink>
                  <ButtonLink href="/fitment" variant="outline" size="lg">
                    Fitment guide
                    <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
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
