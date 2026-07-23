import { ArrowRight, Mail } from 'lucide-react'

import { Magnetic } from '@/components/motion/magnetic'
import { Marquee } from '@/components/motion/marquee'
import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { addressLines, site } from '@/lib/site'

/** Brand words for the ticker. Facts and finishes only, no claims. */
const BRAND_WORDS: readonly string[] = [
  'Purasynth',
  '22x8.25',
  'Gloss black',
  'Flow-formed',
  'Mirror polish',
  '4,500 lb',
  'Free freight',
  'Tomball, Texas',
]

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-lime-soft py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 noise-overlay opacity-60"
      />

      <div className="relative flex flex-col gap-12 lg:gap-16">
        <Marquee className="mask-fade-x" speed="slow" itemClassName="gap-8 pr-8">
          {BRAND_WORDS.map((word, index) => (
            <span
              key={word}
              className={
                index % 2 === 0
                  ? 'font-display text-5xl font-extrabold whitespace-nowrap text-ink sm:text-7xl lg:text-8xl'
                  : 'text-stroke font-display text-5xl font-extrabold whitespace-nowrap sm:text-7xl lg:text-8xl'
              }
            >
              {word}
            </span>
          ))}
        </Marquee>

        <Container size="default">
          <Reveal direction="scale">
            <div className="flex flex-col items-center gap-8 rounded-xl border-2 border-ink bg-paper px-6 py-12 text-center shadow-[0_8px_0_0_var(--color-ink)] sm:px-12 sm:py-16">
              <h2 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
                Ready when your{' '}
                <span className="text-gradient">truck is.</span>
              </h2>

              <p className="max-w-2xl text-lg leading-relaxed text-slate">
                Pick a finish, place the order, and get a straight answer on
                fitment before a single dollar moves. No card fields, no call
                centre. Just an invoice with a payment link, once you are happy.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Magnetic>
                  <ButtonLink href="/shop" size="lg">
                    Shop the sets
                    <ArrowRight
                      className="h-5 w-5 transition-transform duration-200 group-hover/btn:translate-x-1"
                      strokeWidth={2.4}
                    />
                  </ButtonLink>
                </Magnetic>

                <Magnetic>
                  <ButtonLink
                    href={`mailto:${site.email}`}
                    external
                    variant="outline"
                    size="lg"
                    ariaLabel={`Email Purasynth at ${site.email}`}
                  >
                    <Mail className="h-5 w-5" strokeWidth={2.4} />
                    {site.email}
                  </ButtonLink>
                </Magnetic>
              </div>

              {/* Framed as the origin of the freight, not somewhere to turn
                  up. The contact page handles the by-appointment detail. */}
              <p className="max-w-md font-mono text-[0.7rem] leading-relaxed tracking-[0.14em] text-slate uppercase">
                Pallets ship from {addressLines.join(' · ')}. No showroom, no
                counter, nothing on display
              </p>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  )
}
