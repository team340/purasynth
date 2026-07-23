'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FileText, Pencil, Truck } from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { site } from '@/lib/site'
import { formatPrice } from '@/lib/utils'

/**
 * Read-only recap of the basket beside the checkout form.
 *
 * Quantities are not editable here on purpose — mid-form edits are how people
 * lose what they have typed. The cart page is one click away for changes.
 */
export function OrderSummary() {
  const { totals, hydrated } = useCart()

  if (!hydrated) {
    return (
      <div className="h-96 rounded-xl border-2 border-line bg-haze motion-safe:animate-pulse" />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border-2 border-ink bg-cream p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl">Your order</h2>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 rounded-full bg-paper px-4 py-2 font-mono text-[0.65rem] font-bold tracking-[0.14em] text-ink uppercase transition-colors hover:bg-volt-soft hover:text-volt-deep"
          >
            <Pencil className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            Edit
          </Link>
        </div>

        <ul className="mt-6 flex flex-col gap-4">
          {totals.lines.map((line) => (
            <li key={line.key} className="flex gap-4 border-b border-dashed border-ink/15 pb-4 last:border-0 last:pb-0">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 border-ink bg-paper">
                <Image
                  src={line.product.image}
                  alt={line.product.imageAlt}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
                <span className="absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-ink bg-volt px-1 font-mono text-[0.65rem] font-bold text-paper">
                  {line.qty}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-display text-[1.05rem] leading-tight font-bold">
                  {line.product.shortName}
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.12em] text-slate uppercase">
                  {line.product.finish}
                </span>
                <span className="font-mono text-[0.62rem] tracking-[0.12em] text-volt-deep uppercase">
                  {line.fitmentLabel}
                </span>
              </div>

              <span className="shrink-0 font-display text-lg font-extrabold">
                {formatPrice(line.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-ink/20 pt-5 text-[0.95rem]">
          <div className="flex justify-between gap-4">
            <dt className="text-slate">Subtotal</dt>
            <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate">Freight</dt>
            <dd className="font-semibold text-volt-deep">
              {totals.shipping === 0
                ? 'Free — lower 48'
                : formatPrice(totals.shipping)}
            </dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t-2 border-dashed border-ink/20 pt-4">
            <dt className="font-display text-2xl font-extrabold">Total</dt>
            <dd className="font-display text-2xl font-extrabold">
              {formatPrice(totals.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 font-mono text-[0.62rem] leading-relaxed tracking-[0.1em] text-slate uppercase">
          Amount to pay today: {formatPrice(0)}
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border-2 border-ink bg-volt-soft px-5 py-4">
        <FileText
          className="mt-0.5 h-5 w-5 shrink-0 text-volt-deep"
          strokeWidth={2.4}
          aria-hidden="true"
        />
        <p className="text-[0.86rem] leading-relaxed font-medium text-graphite">
          <span className="font-bold">Invoice comes later.</span> This form places
          an order, not a charge. Fitment gets confirmed first, then an invoice
          with a secure payment link is emailed within {site.responseWindow}.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border-2 border-ink bg-lime-soft px-5 py-4">
        <Truck
          className="mt-0.5 h-5 w-5 shrink-0 text-ink"
          strokeWidth={2.4}
          aria-hidden="true"
        />
        <p className="text-[0.86rem] leading-relaxed font-medium text-graphite">
          <span className="font-bold">Free freight, lower 48.</span> Pallets ship
          from {site.address.locality}, {site.address.regionCode} within 1–2
          business days of a paid invoice.
        </p>
      </div>
    </div>
  )
}
