'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

import type { Product } from '@/lib/products'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  readonly product: Product
  readonly className?: string
}

const plates: Readonly<Record<Product['accent'], string>> = {
  violet: 'bg-volt-soft',
  lime: 'bg-lime-soft',
  coral: 'bg-coral-soft',
}

const rings: Readonly<Record<Product['accent'], string>> = {
  violet: 'border-volt/25',
  lime: 'border-lime/60',
  coral: 'border-coral/30',
}

/**
 * Product photography plate.
 *
 * One studio shot per set, so this is a single framed image rather than a
 * thumbnail carousel that would only ever hold one slide. The zoom toggle is
 * a real control — it scales the photo inside the frame both ways.
 */
export function ProductGallery({ product, className }: ProductGalleryProps) {
  const [zoomed, setZoomed] = useState(false)
  const reduceMotion = useReducedMotion()

  const stats: readonly { readonly label: string; readonly value: string }[] = [
    { label: 'Diameter', value: product.diameter },
    { label: 'Width', value: product.width },
    { label: 'Per wheel', value: product.loadRating },
  ]

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border-2 border-ink shadow-[0_8px_0_0_var(--color-ink)]',
          plates[product.accent]
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed motion-safe:animate-spin-slower',
            rings[product.accent]
          )}
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-blob bg-paper/60 motion-safe:animate-blob"
        />

        <motion.div
          className="relative aspect-square w-full"
          animate={{ scale: zoomed ? 1.28 : 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 200, damping: 26 }
          }
        >
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-contain p-8 sm:p-14"
          />
        </motion.div>

        <span className="absolute top-5 left-5 rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.16em] uppercase">
          {product.finish}
        </span>

        <button
          type="button"
          onClick={() => setZoomed((current) => !current)}
          aria-pressed={zoomed}
          aria-label={zoomed ? 'Zoom photo out' : 'Zoom photo in'}
          className="absolute right-5 bottom-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-paper transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime-soft"
        >
          {zoomed ? (
            <Minimize2 className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
          ) : (
            <Maximize2 className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
          )}
        </button>

        <span className="absolute bottom-5 left-5 rounded-full bg-ink px-4 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-paper uppercase motion-safe:animate-float-slow">
          6 wheels per set
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border-2 border-ink bg-paper px-4 py-3.5 text-center"
          >
            <dt className="font-mono text-[0.6rem] font-bold tracking-[0.16em] text-slate uppercase">
              {stat.label}
            </dt>
            <dd className="mt-1 font-display text-xl font-extrabold sm:text-2xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="rounded-lg bg-haze px-5 py-4 text-[0.85rem] leading-relaxed text-slate">
        Studio photo of the set, front and rear faces shown. Center caps and lug
        hardware are matched to your bolt pattern before the pallet is booked.
      </p>
    </div>
  )
}
