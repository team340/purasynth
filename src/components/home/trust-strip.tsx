import { CountUp } from '@/components/motion/count-up'
import { RevealItem, Stagger } from '@/components/motion/reveal'
import { Container } from '@/components/ui/container'
import { site } from '@/lib/site'

/**
 * Four numbers, all of them checkable against the spec sheet.
 *
 * Nothing here counts customers, orders or years in business — a strip of
 * invented social proof is the fastest way to lose a buyer who then finds the
 * real spec sheet says something else.
 */
interface Fact {
  readonly value: number
  readonly suffix: string
  readonly label: string
  readonly note: string
  readonly accent: string
}

const facts: readonly Fact[] = [
  {
    value: 4500,
    suffix: ' lb',
    label: 'Load rating',
    note: 'Per wheel, every set',
    accent: 'text-volt-deep',
  },
  {
    value: 6,
    suffix: '',
    label: 'Wheels per set',
    note: 'Two front, four rear',
    accent: 'text-coral-deep',
  },
  {
    value: 22,
    suffix: '"',
    label: 'Diameter',
    note: '22x8.25 across the line',
    accent: 'text-ink',
  },
  {
    value: site.warrantyYears,
    suffix: ' yr',
    label: 'Warranty',
    note: 'Structural and finish',
    accent: 'text-volt-deep',
  },
]

export function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-strip-heading"
      className="border-y-2 border-ink/10 bg-volt-soft py-14 sm:py-16 lg:py-20"
    >
      <Container size="wide">
        <h2 id="trust-strip-heading" className="sr-only">
          Purasynth dually wheel specifications at a glance
        </h2>

        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {facts.map((fact) => (
            <RevealItem key={fact.label}>
              <div className="flex flex-col gap-2 border-l-2 border-ink/15 pl-5 lg:pl-7">
                <span
                  className={`font-mono text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${fact.accent}`}
                >
                  <CountUp to={fact.value} suffix={fact.suffix} />
                </span>
                <span className="font-display text-lg font-bold text-ink sm:text-xl">
                  {fact.label}
                </span>
                <span className="font-mono text-[0.7rem] tracking-[0.14em] text-slate uppercase">
                  {fact.note}
                </span>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
