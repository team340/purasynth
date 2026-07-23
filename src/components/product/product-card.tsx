import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

import { TiltCard } from '@/components/motion/tilt-card'
import { ButtonLink } from '@/components/ui/button'
import type { Product } from '@/lib/products'
import { cn, formatPrice } from '@/lib/utils'

interface AccentStyle {
  readonly plate: string
  readonly badge: string
  readonly ring: string
  readonly dot: string
}

const accents: Readonly<Record<Product['accent'], AccentStyle>> = {
  violet: {
    plate: 'bg-volt-soft',
    badge: 'bg-volt text-paper',
    ring: 'border-volt/25',
    dot: 'bg-volt',
  },
  lime: {
    plate: 'bg-lime-soft',
    badge: 'bg-lime text-ink',
    ring: 'border-lime/60',
    dot: 'bg-lime',
  },
  coral: {
    plate: 'bg-coral-soft',
    // coral-deep, not coral: this badge carries text, and paper on plain coral
    // is 3.1:1. The ring and dot are shapes, so they keep the brighter tone.
    badge: 'bg-coral-deep text-paper',
    ring: 'border-coral/30',
    dot: 'bg-coral',
  },
}

interface ProductCardProps {
  readonly product: Product
  /** Card index — the first two images are above the fold on /shop. */
  readonly index?: number
  readonly className?: string
}

/**
 * Catalogue tile. Server-rendered; the tilt wrapper is the only client part,
 * and it stands down for reduced-motion visitors and non-mouse pointers.
 */
export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const accent = accents[product.accent]
  const saving =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : null

  return (
    <TiltCard className={cn('h-full', className)} max={5}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[0_8px_0_0_var(--color-ink)] transition-transform duration-300 ease-[cubic-bezier(0.22,1.2,0.36,1)] hover:-translate-y-1.5">
        <div className={cn('relative overflow-hidden', accent.plate)}>
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed motion-safe:animate-spin-slower',
              accent.ring
            )}
          />
          <div
            aria-hidden="true"
            className="noise-overlay pointer-events-none absolute inset-0 opacity-60"
          />

          {product.badge ? (
            <span
              className={cn(
                'absolute top-5 left-5 z-10 -rotate-3 rounded-full border-2 border-ink px-4 py-1.5 font-mono text-[0.7rem] font-bold tracking-[0.16em] uppercase',
                accent.badge
              )}
            >
              {product.badge}
            </span>
          ) : null}

          {saving ? (
            <span className="absolute top-5 right-5 z-10 rotate-3 rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-ink uppercase">
              Save {formatPrice(saving)}
            </span>
          ) : null}

          <div className="relative aspect-square w-full">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 90vw, 100vw"
              className="object-contain p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1.2,0.36,1)] group-hover:scale-[1.06] sm:p-12"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 border-t-2 border-ink p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-slate uppercase">
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn('h-2 w-2 rounded-full', accent.dot)}
              />
              {product.finish}
            </span>
            <span aria-hidden="true" className="text-mist">
              /
            </span>
            <span>
              {product.diameter} x {product.width}
            </span>
            <span aria-hidden="true" className="text-mist">
              /
            </span>
            <span>6 wheels</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-3xl sm:text-4xl">
              <Link
                href={`/product/${product.slug}`}
                className="transition-colors after:absolute after:inset-0 hover:text-volt-deep"
              >
                {product.shortName}
              </Link>
            </h3>
            <p className="font-display text-lg font-bold text-volt-deep">
              {product.tagline}
            </p>
          </div>

          <p className="text-[0.95rem] leading-relaxed text-slate">
            {product.description}
          </p>

          <ul className="flex flex-col gap-2">
            {product.highlights.slice(0, 3).map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2.5 text-[0.9rem] font-medium text-graphite"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                  strokeWidth={3}
                  aria-hidden="true"
                />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t-2 border-dashed border-line pt-5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] text-slate uppercase">
                Set of six
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-3xl font-extrabold sm:text-4xl">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice ? (
                  <span className="font-mono text-sm text-slate line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                ) : null}
              </div>
            </div>

            <ButtonLink
              href={`/product/${product.slug}`}
              variant={product.accent === 'lime' ? 'lime' : 'primary'}
              size="sm"
              className="relative z-10"
            >
              See the set
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.8} />
            </ButtonLink>
          </div>
        </div>
      </article>
    </TiltCard>
  )
}
