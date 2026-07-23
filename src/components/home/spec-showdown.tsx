import { Fragment } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { products, type Product } from '@/lib/products'
import { cn, formatPrice } from '@/lib/utils'

/**
 * The rows below are spec labels, not spec values — every value is read back
 * out of products.ts so the comparison can never drift from the product pages.
 */
const COMPARED_SPECS: readonly string[] = [
  'Finish',
  'Construction',
  'Load rating',
  'Diameter',
  'Width',
  'Center bore',
  'Set contents',
  'Warranty',
]

/** Shared column template, so the sticky header lines up with the rows. */
const GRID =
  'grid grid-cols-2 gap-x-4 sm:gap-x-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)_minmax(0,1fr)]'

function specValue(product: Product, label: string): string {
  return (
    product.specs.find((spec) => spec.label === label)?.value ?? 'Not listed'
  )
}

const columnTints: readonly string[] = ['bg-volt-soft/50', 'bg-lime-soft/60']

export function SpecShowdown() {
  return (
    <section className="bg-paper py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Head to head"
            title="Black or polished, side by side."
            description="Same barrel, same rating, same box contents. Read down the column and the only line that really changes is the finish."
            tone="coral"
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14 lg:mt-20">
          <div className="overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[0_6px_0_0_var(--color-ink)]">
            <div className="border-b-2 border-ink bg-cream px-5 py-6 sm:px-8">
              <div className={GRID}>
                <div className="hidden lg:block" />

                {products.map((product, index) => (
                  <div key={product.slug} className="flex min-w-0 flex-col gap-2">
                    <span
                      className={cn(
                        'w-fit rounded-full px-3 py-1 font-mono text-[0.6rem] font-bold tracking-[0.16em] uppercase',
                        index === 0
                          ? 'bg-volt-soft text-volt-deep'
                          : 'bg-lime-soft text-ink'
                      )}
                    >
                      {product.finish}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl">
                      {product.shortName}
                    </h3>
                    <span className="font-mono text-sm font-bold text-graphite">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <dl className={cn(GRID, 'gap-y-0 px-5 sm:px-8')}>
              {COMPARED_SPECS.map((label) => (
                <Fragment key={label}>
                  <dt className="col-span-2 border-t-2 border-line pt-5 font-mono text-[0.65rem] tracking-[0.2em] text-slate uppercase lg:col-span-1 lg:border-t lg:py-5">
                    {label}
                  </dt>

                  {products.map((product, index) => (
                    <dd
                      key={`${label}-${product.slug}`}
                      className={cn(
                        // min-w-0 so a long spec value wraps instead of forcing
                        // the two-column track wider than a 360px screen.
                        'min-w-0 py-3 text-[0.95rem] leading-relaxed font-medium text-graphite lg:border-t lg:border-line lg:py-5',
                        columnTints[index],
                        'px-3 lg:px-4'
                      )}
                    >
                      {specValue(product, label)}
                    </dd>
                  ))}
                </Fragment>
              ))}
            </dl>

            <div className={cn(GRID, 'border-t-2 border-ink px-5 py-8 sm:px-8')}>
              <div className="col-span-2 mb-6 flex flex-col gap-2 lg:col-span-1 lg:mb-0">
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-slate uppercase">
                  What you get
                </span>
                <p className="text-sm leading-relaxed text-slate">
                  Six wheels, caps and hardware, freight included.
                </p>
              </div>

              {products.map((product) => (
                <div
                  key={`cta-${product.slug}`}
                  className="flex min-w-0 flex-col gap-4 px-3 lg:px-4"
                >
                  <ul className="flex flex-wrap gap-2">
                    {product.highlights.slice(0, 2).map((highlight) => (
                      <li
                        key={highlight}
                        className="scroll-pop rounded-full border border-ink/15 bg-cream px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.12em] text-graphite uppercase"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <ButtonLink
                    href={`/product/${product.slug}`}
                    variant={product.accent === 'lime' ? 'lime' : 'primary'}
                    size="sm"
                    className="w-full"
                    ariaLabel={`See full specs for the ${product.name}`}
                  >
                    See full specs
                  </ButtonLink>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
