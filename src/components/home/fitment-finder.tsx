'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { ArrowRight, Check, RotateCcw, Search } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { allFitments, type Fitment } from '@/lib/products'
import { cn } from '@/lib/utils'

/** The catch-all entry is the fallback result, not a pickable make. */
const UNKNOWN_FITMENT_ID = 'not-sure'

interface FitmentOption {
  readonly id: string
  readonly make: string
  readonly models: string
  readonly years: readonly string[]
  readonly bolt: string
  readonly trucks: string
}

/**
 * A fitment label reads "<make><separator><bolt pattern>". Which separator the
 * catalogue uses is a copy decision that can change, so cut on any of them and
 * then drop the pattern itself plus whatever punctuation it left behind.
 */
function makeFromLabel(label: string): string {
  const [head = label] = label.split(/\s*[—–:|]\s*/)

  return head
    .replace(/\d.*$/, '')
    .replace(/[^A-Za-z]+$/, '')
    .trim()
}

/**
 * The pickers are derived from `allFitments` at module scope, so products.ts
 * stays the single source of truth and the finder never calls a server.
 *
 * Every `trucks` string is written as "<model list>, <note>", and the note
 * carries the first supported year where there is one — that is all the
 * structure the three steps need.
 */
function toOption(fitment: Fitment): FitmentOption {
  const [models = fitment.trucks, note = ''] = fitment.trucks.split(/,\s*/)
  const firstYear = note.match(/\b(?:19|20)\d{2}\b/)?.[0]

  return {
    id: fitment.id,
    make: makeFromLabel(fitment.label),
    models: models.replace(/\s+dually$/i, ''),
    years: firstYear
      ? [`${firstYear} and newer`, `Before ${firstYear}`]
      : ['All years'],
    bolt: fitment.bolt,
    trucks: fitment.trucks,
  }
}

const options: readonly FitmentOption[] = allFitments
  .filter((fitment) => fitment.id !== UNKNOWN_FITMENT_ID)
  .map(toOption)

const makes: readonly string[] = [...new Set(options.map((o) => o.make))]

interface PillGroupProps {
  readonly step: string
  readonly label: string
  readonly choices: readonly string[]
  readonly value: string | null
  readonly hint: string
  readonly onSelect: (choice: string) => void
}

function PillGroup({
  step,
  label,
  choices,
  value,
  hint,
  onSelect,
}: PillGroupProps) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="flex items-center gap-3 pb-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-[0.7rem] font-bold text-paper">
          {step}
        </span>
        <span className="font-display text-lg font-bold text-ink">{label}</span>
      </legend>

      {choices.length === 0 ? (
        <p className="font-mono text-[0.7rem] tracking-[0.14em] text-slate uppercase">
          {hint}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {choices.map((choice) => {
            const active = choice === value

            return (
              <button
                key={choice}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(choice)}
                className={cn(
                  'rounded-full border-2 px-5 py-2.5 text-[0.9rem] font-semibold',
                  'transition-[transform,background-color,box-shadow] duration-200',
                  'ease-[cubic-bezier(0.22,1.2,0.36,1)] hover:-translate-y-0.5',
                  active
                    ? 'border-ink bg-ink text-paper shadow-[0_4px_0_0_var(--color-volt)]'
                    : 'border-ink/20 bg-paper text-graphite hover:border-ink hover:bg-lime-soft'
                )}
              >
                {choice}
              </button>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}

export function FitmentFinder() {
  const reduceMotion = useReducedMotion()
  const [make, setMake] = useState<string | null>(null)
  const [model, setModel] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)

  const modelChoices = options
    .filter((option) => option.make === make)
    .map((option) => option.models)

  const selected = options.find(
    (option) => option.make === make && option.models === model
  )

  const yearChoices = selected ? selected.years : []
  const complete = Boolean(make && model && year)
  // Only the first year band on a fitment is a supported one; anything older
  // has to be looked at by hand rather than guessed at here.
  const matched = complete && selected ? year === selected.years[0] : false

  // Read out instead of the panel itself. A bare "8x200mm" answers nothing
  // without the truck it belongs to, and announcing the whole panel would drag
  // two buttons and a paragraph of prose along with it.
  const announcement = !complete
    ? ''
    : matched && selected
      ? `Bolt pattern found. ${make} ${model}, ${year}: ${selected.bolt}. Both wheel sets are machined to this pattern.`
      : `No match yet. ${make} ${model}, ${year} is not on the list, so the bolt pattern has to be looked up by hand. Email the year, make, model and trim for a checked answer.`

  function chooseMake(next: string) {
    setMake(next)
    setModel(null)
    setYear(null)
  }

  function chooseModel(next: string) {
    setModel(next)
    setYear(null)
  }

  function reset() {
    setMake(null)
    setModel(null)
    setYear(null)
  }

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Fitment finder"
              title="Will they fit your truck?"
              description="Three taps and you have your bolt pattern. Every order is checked against your year, make and model by hand before an invoice goes out, so this is a head start, not the final word."
              tone="lime"
            />

            <div className="mt-8 flex items-center gap-3 rounded-lg border-2 border-ink/10 bg-paper px-5 py-4">
              <Search
                className="h-5 w-5 shrink-0 text-volt"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <p className="font-mono text-[0.7rem] leading-relaxed tracking-[0.12em] text-slate uppercase">
                Runs entirely in your browser. Nothing is sent anywhere
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <div className="rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_6px_0_0_var(--color-ink)] sm:p-9">
              <div className="flex flex-col gap-9">
                <PillGroup
                  step="01"
                  label="Pick your make"
                  choices={makes}
                  value={make}
                  hint=""
                  onSelect={chooseMake}
                />

                <PillGroup
                  step="02"
                  label="Pick your model family"
                  choices={modelChoices}
                  value={model}
                  hint="Choose a make first"
                  onSelect={chooseModel}
                />

                <PillGroup
                  step="03"
                  label="Pick your year"
                  choices={yearChoices}
                  value={year}
                  hint="Choose a model family first"
                  onSelect={setYear}
                />
              </div>

              {/*
                Always mounted, never conditional: a live region added to the
                page at the same moment as its text is not announced, and the
                result panel below only exists once all three picks are in.
              */}
              <p aria-live="polite" className="visually-hidden">
                {announcement}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                {complete ? (
                  <motion.div
                    key={matched ? `match-${selected?.id}` : 'no-match'}
                    initial={
                      reduceMotion ? false : { opacity: 0, height: 0, y: 12 }
                    }
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        'mt-9 rounded-lg border-2 border-ink p-6 sm:p-7',
                        matched ? 'bg-lime-soft' : 'bg-volt-soft'
                      )}
                    >
                      {matched && selected ? (
                        <div className="flex flex-col gap-4">
                          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-lime px-4 py-1.5 font-mono text-[0.65rem] font-bold tracking-[0.16em] text-ink uppercase">
                            <Check
                              className="h-3.5 w-3.5"
                              strokeWidth={3.2}
                              aria-hidden="true"
                            />
                            Bolt pattern found
                          </span>
                          <p className="font-mono text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                            {selected.bolt}
                          </p>
                          <p className="text-[0.95rem] leading-relaxed text-graphite">
                            Covers {selected.trucks}. Both wheel sets are
                            machined hub-centric to this pattern and ship with
                            matching lug hardware.
                          </p>
                          <div className="flex flex-wrap items-center gap-4 pt-1">
                            <ButtonLink href="/shop" size="md">
                              Shop wheels that fit
                              <ArrowRight
                                className="h-5 w-5"
                                strokeWidth={2.4}
                              />
                            </ButtonLink>
                            <button
                              type="button"
                              onClick={reset}
                              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-graphite uppercase underline-offset-4 hover:underline"
                            >
                              <RotateCcw
                                className="h-3.5 w-3.5"
                                strokeWidth={2.6}
                                aria-hidden="true"
                              />
                              Start over
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-volt px-4 py-1.5 font-mono text-[0.65rem] font-bold tracking-[0.16em] text-paper uppercase">
                            We&rsquo;ll check it for you
                          </span>
                          <p className="font-display text-2xl font-bold text-ink sm:text-3xl">
                            That one is not on the list yet.
                          </p>
                          <p className="text-[0.95rem] leading-relaxed text-graphite">
                            Older trucks and cab &amp; chassis conversions run
                            patterns that need looking up rather than guessing.
                            Send the year, make, model and trim and you get a
                            straight answer before you spend anything.
                          </p>
                          <div className="flex flex-wrap items-center gap-4 pt-1">
                            <ButtonLink
                              href="/contact"
                              variant="outline"
                              size="md"
                            >
                              Ask about my truck
                              <ArrowRight
                                className="h-5 w-5"
                                strokeWidth={2.4}
                              />
                            </ButtonLink>
                            <button
                              type="button"
                              onClick={reset}
                              className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-graphite uppercase underline-offset-4 hover:underline"
                            >
                              <RotateCcw
                                className="h-3.5 w-3.5"
                                strokeWidth={2.6}
                                aria-hidden="true"
                              />
                              Start over
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
