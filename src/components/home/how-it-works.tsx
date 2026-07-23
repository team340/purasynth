import {
  CircleDot,
  ClipboardCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { site } from '@/lib/site'

interface Step {
  readonly number: string
  readonly title: string
  readonly body: string
  readonly icon: LucideIcon
}

/**
 * There is no payment gateway on this site, so the flow has to be spelled out
 * rather than implied — a visitor who expects a card form at checkout and does
 * not find one assumes the site is broken.
 */
const steps: readonly Step[] = [
  {
    number: '01',
    title: 'Pick your set',
    body: 'Gloss black or mirror polish, both 22x8.25. Six wheels, caps and lug hardware are in the box either way — you only choose the finish and your bolt pattern.',
    icon: CircleDot,
  },
  {
    number: '02',
    title: 'Place the order',
    body: 'Checkout takes your shipping address and truck details. There are no card fields anywhere on this site, nothing is charged and no payment details are stored.',
    icon: ClipboardCheck,
  },
  {
    number: '03',
    title: 'Fitment gets confirmed',
    body: `The bolt pattern is checked by hand against your year, make and model, with a reply inside ${site.responseWindow}. Anything that does not line up is raised before money is discussed.`,
    icon: Wrench,
  },
  {
    number: '04',
    title: 'Invoice, then freight',
    body: 'An invoice with a secure payment link arrives by email. Pay it when you are happy, and the pallet goes out free to anywhere in the lower 48.',
    icon: Truck,
  },
]

export function HowItWorks() {
  return (
    <section className="bg-haze py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="How ordering works"
            title="No card fields. No surprises."
            description="Wheels are a fitment purchase, not an impulse buy, so the money comes last. Here is the whole flow, start to finish."
            tone="sky"
          />
        </Reveal>

        <div className="relative mt-14 lg:mt-20">
          {/* Dashed rail behind the numerals, decorative only. */}
          <div
            aria-hidden="true"
            className="absolute top-9 right-0 left-0 hidden border-t-2 border-dashed border-ink/20 lg:block"
          />

          <Stagger
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            stagger={0.12}
          >
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <RevealItem key={step.number}>
                  <div className="group relative flex h-full flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <span className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper font-mono text-2xl font-bold text-ink shadow-[0_4px_0_0_var(--color-volt)] transition-transform duration-300 group-hover:-translate-y-1">
                        {step.number}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-ink">
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-[1.6rem]">{step.title}</h3>

                    <p className="text-[0.95rem] leading-relaxed text-slate">
                      {step.body}
                    </p>
                  </div>
                </RevealItem>
              )
            })}
          </Stagger>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-14 rounded-lg border-2 border-ink bg-lime px-6 py-5 text-center font-mono text-[0.75rem] leading-relaxed font-bold tracking-[0.14em] text-ink uppercase sm:text-sm">
            Nothing is charged at checkout. Payment only happens on an invoice
            you choose to pay.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
