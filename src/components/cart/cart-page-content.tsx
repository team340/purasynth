'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { ButtonLink } from '@/components/ui/button'
import { MAX_QTY_PER_LINE } from '@/lib/cart-store'
import { site } from '@/lib/site'
import { formatPrice } from '@/lib/utils'

/**
 * The full-page cart.
 *
 * Everything here reads from the same provider as the drawer, so the two can
 * never disagree. Nothing renders line data until `hydrated` is true, because
 * the cart lives in localStorage and the server has no idea what is in it.
 */
export function CartPageContent() {
  const { totals, hydrated, update, remove } = useCart()
  const reduceMotion = useReducedMotion()

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-40 rounded-xl border-2 border-line bg-haze motion-safe:animate-pulse"
            />
          ))}
        </div>
        <div className="h-72 rounded-xl border-2 border-line bg-haze motion-safe:animate-pulse" />
      </div>
    )
  }

  if (totals.lines.length === 0) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-xl border-2 border-ink bg-paper px-6 py-16 text-center shadow-[0_8px_0_0_var(--color-ink)] sm:px-12 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-12 h-52 w-52 rounded-blob bg-volt-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -bottom-16 h-52 w-52 rounded-blob bg-lime-soft motion-safe:animate-blob"
        />

        <div className="relative mx-auto flex max-w-lg flex-col items-center gap-6">
          <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-haze motion-safe:animate-float">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-volt/40 motion-safe:animate-pulse-ring"
            />
            <ShoppingBag
              className="h-11 w-11 text-volt"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <h2 className="text-4xl sm:text-5xl">Nothing in here yet</h2>

          <p className="text-lg leading-relaxed text-slate">
            Two sets in the line, both rated 4,500 lb per wheel. Pick a finish,
            tell us the truck, and the bolt pattern gets checked before anything
            ships.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Browse the wheels
              <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
            </ButtonLink>
            <ButtonLink href="/fitment" variant="outline" size="lg">
              Check fitment first
            </ButtonLink>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
      <ul className="flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {totals.lines.map((line) => (
            <motion.li
              key={line.key}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[0_6px_0_0_var(--color-ink)]"
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:gap-6 sm:p-6">
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-haze sm:h-36 sm:w-36"
                >
                  <Image
                    src={line.product.image}
                    alt={line.product.imageAlt}
                    fill
                    sizes="(min-width: 640px) 144px, 100vw"
                    className="object-contain p-3"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/product/${line.product.slug}`}
                        className="font-display text-2xl leading-tight font-extrabold transition-colors hover:text-volt-deep"
                      >
                        {line.product.shortName}
                      </Link>
                      <span className="font-mono text-[0.68rem] font-bold tracking-[0.14em] text-slate uppercase">
                        {line.product.finish} · SKU {line.product.sku}
                      </span>
                      <span className="w-fit rounded-full bg-volt-soft px-3.5 py-1.5 font-mono text-[0.65rem] font-bold tracking-[0.12em] text-volt-deep uppercase">
                        {line.fitmentLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      aria-label={`Remove ${line.product.shortName} from your cart`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line text-slate transition-colors hover:border-coral hover:bg-coral-soft hover:text-coral-deep"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center rounded-full border-2 border-ink">
                      <button
                        type="button"
                        onClick={() => update(line.key, line.qty - 1)}
                        aria-label={`Decrease quantity of ${line.product.shortName}`}
                        className="flex h-11 w-11 items-center justify-center rounded-l-full transition-colors hover:bg-haze"
                      >
                        <Minus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                      </button>
                      <span className="w-10 text-center font-mono text-base font-bold">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => update(line.key, line.qty + 1)}
                        disabled={line.qty >= MAX_QTY_PER_LINE}
                        aria-label={`Increase quantity of ${line.product.shortName}`}
                        className="flex h-11 w-11 items-center justify-center rounded-r-full transition-colors hover:bg-haze disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-display text-2xl font-extrabold">
                        {formatPrice(line.lineTotal)}
                      </span>
                      <span className="font-mono text-[0.65rem] tracking-[0.12em] text-slate uppercase">
                        {formatPrice(line.product.price)} × {line.qty} ·{' '}
                        {line.qty * 6} wheels
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-xl border-2 border-ink bg-cream p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
          <h2 className="text-3xl">Order summary</h2>

          <dl className="mt-6 flex flex-col gap-3 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-slate">
                Subtotal ({totals.itemCount} set
                {totals.itemCount === 1 ? '' : 's'})
              </dt>
              <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Freight</dt>
              <dd className="font-semibold text-volt-deep">
                {totals.shipping === 0
                  ? 'Free to the lower 48'
                  : formatPrice(totals.shipping)}
              </dd>
            </div>
            <div className="mt-2 flex justify-between gap-4 border-t-2 border-dashed border-ink/20 pt-4">
              <dt className="font-display text-2xl font-extrabold">Total</dt>
              <dd className="font-display text-2xl font-extrabold">
                {formatPrice(totals.total)}
              </dd>
            </div>
          </dl>

          <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
            Continue to order details
            <ArrowRight className="h-5 w-5" strokeWidth={2.8} />
          </ButtonLink>

          <p className="mt-4 text-[0.82rem] leading-relaxed text-slate">
            Nothing is charged at this step. You give us the shipping and fitment
            details, we confirm the bolt pattern, then an invoice with a secure
            payment link arrives by email within {site.responseWindow}.
          </p>

          <ButtonLink
            href="/shop"
            variant="ghost"
            size="sm"
            className="mt-3 w-full"
          >
            Keep looking
          </ButtonLink>
        </div>

        <div className="flex items-start gap-3 rounded-lg border-2 border-ink bg-lime-soft px-5 py-4">
          <Truck
            className="mt-0.5 h-5 w-5 shrink-0 text-ink"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <p className="text-[0.88rem] leading-relaxed font-medium text-graphite">
            <span className="font-bold">Freight is on us.</span> Every set ships
            free to any address in the lower 48. Alaska, Hawaii and outside the US
            are quoted individually, so email {site.email} before ordering.
          </p>
        </div>
      </div>
    </div>
  )
}
