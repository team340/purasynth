import type { ReactNode } from 'react'
import { ArrowRight, Mail } from 'lucide-react'

import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { breadcrumbSchema, webPageSchema } from '@/lib/seo'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * Shared shell for every policy page.
 *
 * The pages themselves are data — a list of sections built from the block
 * types below — so the prose styling, the heading order and the jump list can
 * never drift apart between one policy and the next. The table of contents is
 * generated from the same section list that renders the body, which means a
 * new section cannot be added without also appearing in the nav.
 */

type Tone = 'volt' | 'lime' | 'coral' | 'sky'

export interface LegalTerm {
  readonly term: string
  readonly detail: ReactNode
}

export type LegalBlock =
  | { readonly kind: 'text'; readonly value: ReactNode }
  | { readonly kind: 'subheading'; readonly value: string }
  | { readonly kind: 'bullets'; readonly items: readonly ReactNode[] }
  | { readonly kind: 'steps'; readonly items: readonly ReactNode[] }
  | { readonly kind: 'terms'; readonly items: readonly LegalTerm[] }
  | { readonly kind: 'callout'; readonly value: ReactNode; readonly tone?: Tone }

export interface LegalSection {
  /** Anchor id — also the target of the table of contents link. */
  readonly id: string
  readonly heading: string
  readonly blocks: readonly LegalBlock[]
}

export interface LegalUpdated {
  /** Machine-readable date for the <time> element. */
  readonly iso: string
  readonly label: string
}

/**
 * Publication date for policies that have not changed since launch.
 *
 * `updated` is a per-page prop rather than a single site-wide constant on
 * purpose. Bumping one date for all seven pages would claim documents changed
 * on a day they did not, and on a privacy policy that stamp is the thing a
 * reader uses to decide whether to read it again.
 */
export const LEGAL_UPDATED: LegalUpdated = {
  iso: '2026-07-23',
  label: '23 July 2026',
}

/**
 * The day the Google Ads tag was added.
 *
 * Used by the cookie policy and the privacy policy, which both changed
 * materially that day: advertising cookies, a third-party script, and a CPRA
 * sharing disclosure with an opt-out route. The other five policies are
 * untouched and keep `LEGAL_UPDATED`.
 */
export const LEGAL_UPDATED_ADS: LegalUpdated = {
  iso: '2026-07-29',
  label: '29 July 2026',
}

interface LegalPageProps {
  readonly title: string
  readonly eyebrow: string
  readonly intro: string
  readonly path: string
  readonly description: string
  readonly updated: LegalUpdated
  readonly sections: readonly LegalSection[]
  readonly tone?: Tone
}

const calloutTones: Record<Tone, string> = {
  volt: 'border-volt bg-volt-soft',
  lime: 'border-ink bg-lime-soft',
  coral: 'border-coral bg-coral-soft',
  sky: 'border-sky bg-sky-soft',
}

function LegalBlockView({ block }: { readonly block: LegalBlock }) {
  switch (block.kind) {
    case 'subheading':
      return (
        <h3 className="mt-10 mb-3 font-display text-xl font-extrabold text-ink sm:text-2xl">
          {block.value}
        </h3>
      )

    case 'bullets':
      return (
        <ul className="my-5 flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3 text-[1.02rem] leading-relaxed text-slate">
              <span
                aria-hidden="true"
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-volt"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol className="my-5 flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-4 text-[1.02rem] leading-relaxed text-slate">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lime font-mono text-[0.7rem] font-bold text-ink">
                {index + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      )

    case 'terms':
      return (
        <dl className="my-6 grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <div
              key={item.term}
              className="rounded-md border-2 border-line bg-cream p-5 transition-colors duration-300 hover:border-ink"
            >
              <dt className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-volt-deep uppercase">
                {item.term}
              </dt>
              <dd className="mt-2 text-[0.95rem] leading-relaxed text-slate">
                {item.detail}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'callout':
      return (
        <p
          className={cn(
            'my-6 rounded-lg border-2 p-6 text-[1.02rem] leading-relaxed font-medium text-ink',
            calloutTones[block.tone ?? 'volt']
          )}
        >
          {block.value}
        </p>
      )

    default:
      return (
        <p className="my-4 text-[1.02rem] leading-relaxed text-slate">
          {block.value}
        </p>
      )
  }
}

export function LegalPage({
  title,
  eyebrow,
  intro,
  path,
  description,
  updated,
  sections,
  tone = 'volt',
}: LegalPageProps) {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`${title} question`)}`

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: title, path },
          ]),
          webPageSchema({ name: title, description, path }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-blob bg-volt-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-blob bg-lime-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: title }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-4xl sm:text-6xl lg:text-7xl">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate">
              {intro}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full border-2 border-ink bg-paper px-5 py-2.5 font-mono text-[0.68rem] font-bold tracking-[0.16em] uppercase">
              <span className="text-slate">Last updated</span>
              <time dateTime={updated.iso} className="text-ink">
                {updated.label}
              </time>
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-8 md:grid-cols-[15rem_1fr] md:gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
            {/*
             * The two column split starts at `md`, not `lg`.
             *
             * It used to start at `lg` (1024px). Anything narrower stacked the
             * contents list above the copy, where it ran about 380px tall and
             * pushed the first section clean off the bottom of the screen. A
             * visitor landing on a policy page at, say, 1000px wide saw a wall
             * of link text, blank space beside it, and no policy at all. It
             * read as a broken page rather than a contents list, and 768 to
             * 1023px is an ordinary laptop window once display scaling is on.
             *
             * When it does still stack, below `md`, the list scrolls inside a
             * capped box instead. Two columns was tried first and did not
             * help: at 375px the headings wrap so hard that two columns came
             * out taller than one. Capping the height is what actually gets
             * the copy near the top of the screen on a phone.
             */}
            <nav
              aria-label="On this page"
              className="h-max max-h-52 overflow-y-auto rounded-lg border-2 border-line bg-cream p-5 md:sticky md:top-28 md:max-h-none md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0"
            >
              <p className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-slate uppercase">
                On this page
              </p>
              <ol className="mt-4 flex flex-col gap-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-start gap-3 rounded-md px-3 py-2 text-[0.88rem] leading-snug font-semibold text-slate transition-colors hover:bg-volt-soft hover:text-volt-deep"
                    >
                      <span className="mt-0.5 font-mono text-[0.65rem] text-slate">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="min-w-0">
              <Stagger className="flex flex-col gap-14">
                {sections.map((section) => (
                  <RevealItem key={section.id}>
                    <section
                      id={section.id}
                      className="scroll-mt-28 border-t-2 border-line pt-8 first:border-t-0 first:pt-0"
                    >
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl">
                        {section.heading}
                      </h2>
                      {section.blocks.map((block, index) => (
                        <LegalBlockView key={index} block={block} />
                      ))}
                    </section>
                  </RevealItem>
                ))}
              </Stagger>

              <Reveal direction="scale" className="mt-16">
                <div className="relative overflow-hidden rounded-xl border-2 border-ink bg-cream p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-10">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full border-2 border-dashed border-volt/40 motion-safe:animate-spin-slower"
                  />

                  <div className="relative">
                    <h2 className="text-2xl sm:text-3xl">
                      Something here affect you?
                    </h2>
                    <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-slate">
                      Purasynth is independently run, so a policy question goes
                      straight to the owner rather than a ticket queue. Email
                      and you get a written answer within{' '}
                      {site.responseWindow}.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <ButtonLink href={mailto} external size="md">
                        <Mail className="h-4 w-4" strokeWidth={2.6} />
                        {site.email}
                      </ButtonLink>
                      <ButtonLink href="/contact" variant="outline" size="md">
                        Contact page
                        <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
