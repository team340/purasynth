'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ClipboardList,
  Clock,
  Copy,
  Mail,
  MapPin,
  Ruler,
} from 'lucide-react'

import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { addressLines, site } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * The contact surface. There is no contact form anywhere on this site — no
 * endpoint exists to receive one, and a form that silently drops a message is
 * worse than no form. Instead the mailto is made as useful as possible: pick
 * what the message is about and the subject line and body skeleton are filled
 * in, so the reply can be a real answer instead of five follow-up questions.
 */

interface ContactTopic {
  readonly id: string
  readonly label: string
  readonly subject: string
  readonly body: readonly string[]
}

const TOPICS: readonly ContactTopic[] = [
  {
    id: 'fitment',
    label: 'Will these fit my truck?',
    subject: 'Fitment check: year / make / model',
    body: [
      'Truck (year, make, model, trim):',
      'Dually or single rear wheel:',
      'Which set I am looking at (A127 Innovator / Mesh 8):',
      'Current wheel and tire size, if known:',
      'Shipping ZIP:',
    ],
  },
  {
    id: 'order',
    label: 'A question about my order',
    subject: 'Order question: order number',
    body: [
      'Order number:',
      'Name on the order:',
      'What I need help with:',
    ],
  },
  {
    id: 'freight',
    label: 'Freight, AK/HI or international',
    subject: 'Freight quote: delivery address',
    body: [
      'Delivery city, state and ZIP:',
      'Residential or commercial address:',
      'Which set (A127 Innovator / Mesh 8):',
      'Anything the driver should know (gate, narrow street, no forklift):',
    ],
  },
  {
    id: 'warranty',
    label: 'Warranty or damage claim',
    subject: 'Warranty claim: order number',
    body: [
      'Order number:',
      'Date the pallet arrived:',
      'What happened:',
      'Photos attached (please attach wide shots and close-ups):',
    ],
  },
]

const CHECKLIST = [
  {
    icon: Ruler,
    title: 'Your truck, in full',
    detail:
      'Year, make, model and trim. An F-350 Lariat and an F-450 cab and chassis do not share a bolt pattern.',
  },
  {
    icon: ClipboardList,
    title: 'Which set you want',
    detail:
      'A127 Innovator in gloss black, or Mesh 8 in mirror polish. Both are 22x8.25 six-wheel sets.',
  },
  {
    icon: MapPin,
    title: 'Your shipping ZIP',
    detail:
      'Freight is free to the lower 48, but the ZIP is what confirms transit time and whether a truck can reach you.',
  },
  {
    icon: Clock,
    title: 'When you need it',
    detail:
      'If there is a date you are working toward, say so. It changes what gets recommended.',
  },
] as const

function buildMailto(topic: ContactTopic): string {
  const body = [
    ...topic.body,
    '',
    '---',
    'Sent from the Purasynth contact page.',
  ].join('\n')

  return `mailto:${site.email}?subject=${encodeURIComponent(topic.subject)}&body=${encodeURIComponent(body)}`
}

export function ContactPanel() {
  const [topicId, setTopicId] = useState<string>(TOPICS[0].id)
  const [copied, setCopied] = useState(false)

  const topic = TOPICS.find((item) => item.id === topicId) ?? TOPICS[0]

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard access can be blocked by the browser. The address is on
      // screen either way, so there is nothing useful to report here.
      setCopied(false)
    }
  }

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <Reveal direction="scale">
              <div className="relative h-full overflow-hidden rounded-xl border-2 border-ink bg-volt-soft p-8 shadow-[0_8px_0_0_var(--color-ink)] sm:p-10 lg:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full border-2 border-dashed border-volt/40 motion-safe:animate-spin-slower"
                />

                <div className="relative">
                  <Eyebrow tone="volt">Email the owner</Eyebrow>

                  <p className="mt-6 font-display text-3xl leading-tight font-extrabold break-words sm:text-4xl">
                    {site.email}
                  </p>

                  <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-slate">
                    One person reads this inbox. Pick what your message is
                    about and the subject line and a short checklist get filled
                    in for you. Answer the lines you can and send it.
                  </p>

                  <fieldset className="mt-8">
                    <legend className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-volt-deep uppercase">
                      What is it about?
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {TOPICS.map((item) => {
                        const active = item.id === topic.id

                        return (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setTopicId(item.id)}
                            className={cn(
                              'rounded-full border-2 px-5 py-2.5 text-[0.88rem] font-semibold transition-[transform,background-color,color]',
                              'duration-200 hover:-translate-y-0.5',
                              active
                                ? 'border-ink bg-ink text-paper'
                                : 'border-ink bg-paper text-ink hover:bg-lime-soft'
                            )}
                          >
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-8 rounded-lg border-2 border-ink bg-paper p-5 sm:p-6">
                    <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] text-slate uppercase">
                      Subject line
                    </p>
                    <p className="mt-2 font-semibold text-ink">{topic.subject}</p>

                    <p className="mt-5 font-mono text-[0.65rem] font-bold tracking-[0.18em] text-slate uppercase">
                      Message skeleton
                    </p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {topic.body.map((line) => (
                        <li key={line} className="text-[0.9rem] text-slate">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <ButtonLink href={buildMailto(topic)} external size="lg">
                      <Mail className="h-5 w-5" strokeWidth={2.6} />
                      Open a prefilled email
                    </ButtonLink>

                    <button
                      type="button"
                      onClick={copyEmail}
                      className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-paper px-7 text-[0.95rem] font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime-soft sm:h-16 sm:px-9 sm:text-base"
                    >
                      {copied ? (
                        <Check
                          className="h-5 w-5"
                          strokeWidth={2.8}
                          aria-hidden="true"
                        />
                      ) : (
                        <Copy
                          className="h-5 w-5"
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                      )}
                      {copied ? 'Address copied' : 'Copy the address'}
                    </button>
                    <span aria-live="polite" className="sr-only">
                      {copied ? `${site.email} copied to clipboard` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col gap-6">
              <Reveal direction="left" delay={0.1}>
                <div className="rounded-xl border-2 border-ink bg-lime p-8 shadow-[0_8px_0_0_var(--color-ink)]">
                  <Clock className="h-8 w-8" strokeWidth={2.4} aria-hidden="true" />
                  <h2 className="mt-5 text-2xl sm:text-3xl">
                    Replies inside {site.responseWindow}
                  </h2>
                  <p className="mt-4 text-[0.98rem] leading-relaxed text-graphite">
                    Messages are answered in the order they land, Monday to
                    Friday. If a question needs a measurement from your truck,
                    the reply will say exactly what to measure rather than
                    guessing on your behalf.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.18}>
                {/*
                  The card is a div and only the postal lines are the <address>:
                  the content model for <address> forbids heading descendants,
                  and an h2 nested in one is dropped from the headings list.
                */}
                <div className="rounded-xl border-2 border-ink bg-paper p-8 shadow-soft">
                  <MapPin
                    className="h-7 w-7 text-volt-deep"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                  <h2 className="mt-5 text-2xl">Where orders ship from</h2>
                  <address className="mt-4 flex flex-col gap-0.5 font-mono text-[0.85rem] leading-relaxed text-slate not-italic">
                    {addressLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <p className="mt-5 rounded-md border-2 border-coral bg-coral-soft p-4 text-[0.88rem] leading-relaxed font-semibold text-ink">
                    Business address, not a walk-in showroom. There is no
                    counter, no display floor and no stock to browse. Visits are
                    by appointment only, arranged by email first.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y-2 border-ink bg-cream py-20 sm:py-24">
        <Container size="wide">
          <Reveal>
            <Eyebrow tone="coral">Put this in the message</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-5xl">
              Four lines that turn one email into an answer.
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKLIST.map((item) => (
              <RevealItem key={item.title}>
                <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-ink bg-paper p-6 transition-transform duration-300 hover:-translate-y-1.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft">
                    <item.icon
                      className="h-5 w-5 text-ink"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="font-display text-xl font-extrabold">
                    {item.title}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-slate">
                    {item.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <ButtonLink href="/fitment" variant="outline" size="md">
                Fitment guide
                <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
              </ButtonLink>
              <ButtonLink href="/faq" variant="outline" size="md">
                Read the FAQ
                <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
