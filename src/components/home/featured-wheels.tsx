import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { TiltCard } from '@/components/motion/tilt-card'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { products, type Product } from '@/lib/products'
import { formatPrice } from '@/lib/utils'

interface AccentStyle {
  readonly halo: string
  readonly pill: string
  readonly tick: string
  readonly badge: string
  readonly button: 'primary' | 'lime' | 'coral'
}

/**
 * `product.accent` is a catalogue-level choice, so the card palette is looked
 * up from it rather than hard-coded per slug. Adding a third wheel set means
 * adding a row here, not editing this component.
 */
const accents: Record<Product['accent'], AccentStyle> = {
  violet: {
    halo: 'from-volt-soft via-paper to-haze',
    pill: 'bg-volt-soft text-volt-deep',
    tick: 'bg-volt text-paper',
    badge: 'bg-volt text-paper',
    button: 'primary',
  },
  lime: {
    halo: 'from-lime-soft via-paper to-chrome-100',
    pill: 'bg-lime-soft text-ink',
    tick: 'bg-lime text-ink',
    badge: 'bg-lime text-ink',
    button: 'lime',
  },
  coral: {
    halo: 'from-coral-soft via-paper to-haze',
    // Anything holding text takes coral-deep — plain coral is 3.1:1 against
    // paper and 2.6:1 against coral-soft, so it can only fill a shape.
    pill: 'bg-coral-soft text-coral-deep',
    tick: 'bg-coral-deep text-paper',
    badge: 'bg-coral-deep text-paper',
    button: 'coral',
  },
}

export function FeaturedWheels() {
  return (
    <section id="featured-wheels" className="bg-paper py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="The line-up"
            title={
              <>
                Two sets. Same heavy
                <br className="hidden sm:block" /> bones underneath.
              </>
            }
            description="Both are 22x8.25, flow-formed A356-T6 and rated to 4,500 lb per wheel. The only real decision is how loud you want the finish to be."
            tone="volt"
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          {products.map((product, index) => {
            const accent = accents[product.accent]

            return (
              <Reveal key={product.slug} delay={index * 0.12} direction="up">
                <TiltCard max={5} className="h-full">
                  <article className="group/card flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[0_6px_0_0_var(--color-ink)] transition-transform duration-300 hover:-translate-y-2">
                    <div
                      className={`relative bg-gradient-to-br ${accent.halo} px-6 pt-8 pb-6 sm:px-10 sm:pt-12`}
                    >
                      {product.badge ? (
                        <span
                          className={`absolute top-5 left-5 z-10 rounded-full border-2 border-ink px-4 py-1.5 font-mono text-[0.65rem] font-bold tracking-[0.16em] uppercase ${accent.badge}`}
                        >
                          {product.badge}
                        </span>
                      ) : null}

                      <div className="relative mx-auto aspect-square w-full max-w-[24rem]">
                        <div
                          aria-hidden="true"
                          className="absolute inset-[6%] rounded-full border-2 border-dashed border-ink/15 motion-safe:animate-spin-slower"
                        />
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 60vw, 80vw"
                          className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1.2,0.36,1)] group-hover/card:scale-[1.06]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-5 border-t-2 border-ink px-6 py-8 sm:px-10 sm:py-10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center rounded-full px-4 py-1.5 font-mono text-[0.7rem] font-bold tracking-[0.16em] uppercase ${accent.pill}`}
                        >
                          {product.finish}
                        </span>
                        <span className="font-mono text-[0.7rem] tracking-[0.16em] text-slate uppercase">
                          {product.diameter} x {product.width}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="text-3xl sm:text-4xl">
                          {product.shortName}
                        </h3>
                        <p className="font-display text-lg font-bold text-volt-deep">
                          {product.tagline}
                        </p>
                        <p className="text-base leading-relaxed text-slate">
                          {product.description}
                        </p>
                      </div>

                      <ul className="flex flex-col gap-3">
                        {product.highlights.slice(0, 3).map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-3 text-[0.95rem] font-medium text-graphite"
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${accent.tick}`}
                            >
                              <Check
                                className="h-3 w-3"
                                strokeWidth={3.2}
                                aria-hidden="true"
                              />
                            </span>
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-slate uppercase">
                            Complete set
                          </span>
                          <span className="flex items-baseline gap-3">
                            <span className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
                              {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice ? (
                              <span className="font-mono text-sm text-slate line-through">
                                {formatPrice(product.compareAtPrice)}
                              </span>
                            ) : null}
                          </span>
                        </div>

                        <ButtonLink
                          href={`/product/${product.slug}`}
                          variant={accent.button}
                          size="md"
                          ariaLabel={`View the ${product.name}`}
                        >
                          View the set
                          <ArrowUpRight
                            className="h-5 w-5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                            strokeWidth={2.4}
                          />
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
