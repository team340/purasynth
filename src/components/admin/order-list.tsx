'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Truck,
} from 'lucide-react'

import { PAYMENT_PREFERENCES } from '@/lib/order-schema'
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  type OrderRecord,
  type OrderStatus,
  type PaymentPreference,
} from '@/lib/order-types'
import { cn, formatDateTime, formatPrice } from '@/lib/utils'

/**
 * The order table.
 *
 * Nothing on this screen has been charged — the flow is order placed, fitment
 * confirmed, invoice emailed — so every row is a to-do rather than a receipt.
 */

/** How long the "Copied" confirmation stays on the button. */
const COPIED_TICK_MS = 1600

const statusStyles: Readonly<Record<OrderStatus, string>> = {
  new: 'bg-coral-deep text-paper',
  contacted: 'bg-sky text-ink',
  invoiced: 'bg-volt-soft text-volt-deep',
  paid: 'bg-lime text-ink',
  shipped: 'bg-volt text-paper',
  cancelled: 'bg-line text-slate',
}

function paymentLabel(preference: PaymentPreference): string {
  return (
    PAYMENT_PREFERENCES.find((option) => option.id === preference)?.label ??
    preference
  )
}

function fullAddress(order: OrderRecord): string {
  return [
    `${order.firstName} ${order.lastName}`,
    order.addressLine1,
    order.addressLine2,
    order.city,
    `${order.state} ${order.zip}`,
    'United States',
  ]
    .filter(Boolean)
    .join('\n')
}

function searchHaystack(order: OrderRecord): string {
  return [
    order.orderNumber,
    order.firstName,
    order.lastName,
    order.email,
    order.phone,
    order.city,
    order.state,
    order.zip,
    order.vehicle,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

interface OrderListProps {
  readonly orders: readonly OrderRecord[]
}

export function OrderList({ orders }: OrderListProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // One handle for the "Copied" tick. Held so a second copy restarts it rather
  // than inheriting the first timer's deadline, and so nothing fires after the
  // dashboard unmounts.
  const copiedTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current)
    }
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return orders.filter((order) => {
      if (filter !== 'all' && order.status !== filter) return false
      if (!needle) return true

      return searchHaystack(order).includes(needle)
    })
  }, [orders, query, filter])

  async function changeStatus(id: string, status: OrderStatus) {
    setPending(id)
    setError(null)

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      const result = (await response.json()) as {
        success: boolean
        error?: string
      }

      if (!result.success) {
        setError(result.error ?? 'Could not update that order.')
        return
      }

      router.refresh()
    } catch {
      setError('Could not reach the server. Your change was not saved.')
    } finally {
      setPending(null)
    }
  }

  async function copyAddress(order: OrderRecord) {
    try {
      await navigator.clipboard.writeText(fullAddress(order))
      setCopied(order.id)

      if (copiedTimer.current !== null) window.clearTimeout(copiedTimer.current)
      copiedTimer.current = window.setTimeout(() => {
        copiedTimer.current = null
        setCopied(null)
      }, COPIED_TICK_MS)
    } catch {
      setError('Your browser blocked the clipboard. Select the address manually.')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-mist"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, order number, ZIP, truck…"
            aria-label="Search orders"
            className="w-full rounded-full border-2 border-ink bg-paper py-2.5 pr-4 pl-11 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['all', ...ORDER_STATUSES] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                'rounded-full border-2 border-ink px-3 py-1.5 text-xs font-semibold transition-colors',
                filter === value
                  ? 'bg-ink text-paper'
                  : 'bg-paper hover:bg-lime-soft'
              )}
            >
              {value === 'all' ? 'All' : STATUS_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-md border-2 border-coral bg-coral-soft p-3 text-sm font-medium"
        >
          {error}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <p className="rounded-lg border-2 border-dashed border-line bg-paper p-10 text-center text-slate">
          {orders.length === 0
            ? 'No orders yet. They appear here the moment someone checks out.'
            : 'No orders match that search.'}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((order) => {
            const isOpen = expanded === order.id

            return (
              <li
                key={order.id}
                className="overflow-hidden rounded-lg border-2 border-ink bg-paper"
              >
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 font-mono text-[0.65rem] font-bold tracking-[0.14em] uppercase',
                      statusStyles[order.status]
                    )}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="truncate font-mono text-xs text-slate">
                      {order.orderNumber} · {formatDateTime(order.createdAt)}
                    </p>
                  </div>

                  <span className="font-display text-lg font-bold">
                    {formatPrice(order.totalCents)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    aria-expanded={isOpen}
                    aria-controls={`order-${order.id}`}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream"
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">
                      {isOpen ? 'Hide' : 'Show'} order {order.orderNumber}
                    </span>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`order-${order.id}`}
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t-2 border-line bg-cream"
                    >
                      <div className="grid gap-6 p-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-mono text-xs font-bold tracking-[0.16em] uppercase">
                            Contact
                          </h3>
                          <p className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <a
                              href={`mailto:${order.email}`}
                              className="underline underline-offset-4"
                            >
                              {order.email}
                            </a>
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <Phone
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                            <a
                              href={`tel:${order.phone}`}
                              className="underline underline-offset-4"
                            >
                              {order.phone}
                            </a>
                          </p>

                          <h3 className="mt-2 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.16em] uppercase">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            Ship to
                          </h3>
                          <address className="text-sm leading-relaxed whitespace-pre-line not-italic">
                            {fullAddress(order)}
                          </address>

                          <button
                            type="button"
                            onClick={() => copyAddress(order)}
                            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-lime-soft"
                          >
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            {copied === order.id ? 'Copied' : 'Copy address'}
                          </button>

                          <h3 className="mt-2 flex items-center gap-2 font-mono text-xs font-bold tracking-[0.16em] uppercase">
                            <Truck className="h-4 w-4" aria-hidden="true" />
                            Truck
                          </h3>
                          <p className="text-sm">
                            {order.vehicle ?? 'Not given — confirm before shipping.'}
                          </p>

                          {order.notes ? (
                            <>
                              <h3 className="mt-2 font-mono text-xs font-bold tracking-[0.16em] uppercase">
                                Notes
                              </h3>
                              <p className="text-sm whitespace-pre-wrap">
                                {order.notes}
                              </p>
                            </>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-3">
                          <h3 className="font-mono text-xs font-bold tracking-[0.16em] uppercase">
                            Order
                          </h3>
                          <ul className="flex flex-col gap-2 text-sm">
                            {order.items.map((item) => (
                              <li
                                key={`${item.slug}-${item.fitment}`}
                                className="flex justify-between gap-3"
                              >
                                <span>
                                  {item.qty} × {item.name}
                                  <span className="block text-xs text-slate">
                                    {item.fitmentLabel} · {item.sku}
                                  </span>
                                </span>
                                <span className="font-semibold">
                                  {formatPrice(item.lineCents)}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <dl className="flex flex-col gap-1 border-t-2 border-dashed border-line pt-2 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-slate">Subtotal</dt>
                              <dd>{formatPrice(order.subtotalCents)}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-slate">Freight</dt>
                              <dd>
                                {order.shippingCents === 0
                                  ? 'Free'
                                  : formatPrice(order.shippingCents)}
                              </dd>
                            </div>
                            <div className="flex justify-between font-display font-bold">
                              <dt>Total</dt>
                              <dd>{formatPrice(order.totalCents)}</dd>
                            </div>
                          </dl>

                          <div className="rounded-md border-2 border-ink bg-lime-soft p-3">
                            <p className="text-xs leading-relaxed">
                              Wants to pay by{' '}
                              <strong>{paymentLabel(order.paymentPreference)}</strong>
                              . Nothing has been charged — confirm the fitment,
                              then email a {formatPrice(order.totalCents)}{' '}
                              invoice to {order.email}.
                            </p>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label
                              htmlFor={`status-${order.id}`}
                              className="font-mono text-xs font-bold tracking-[0.16em] uppercase"
                            >
                              Status
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                id={`status-${order.id}`}
                                value={order.status}
                                disabled={pending === order.id}
                                onChange={(event) =>
                                  changeStatus(
                                    order.id,
                                    event.target.value as OrderStatus
                                  )
                                }
                                className="flex-1 rounded-md border-2 border-ink bg-paper px-3 py-2 text-sm"
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                  </option>
                                ))}
                              </select>
                              {pending === order.id ? (
                                <Loader2
                                  className="h-4 w-4 motion-safe:animate-spin"
                                  aria-hidden="true"
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
