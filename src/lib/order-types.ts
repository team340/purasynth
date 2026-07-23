import type { OrderInput } from '@/lib/order-schema'
import type { Product } from '@/lib/products'

/**
 * Order shapes and pure helpers, safe to import from client components.
 *
 * Kept apart from `orders.ts` on purpose: that module is `server-only`
 * because it builds a Supabase client with the service role key. If a client
 * component imported a type from there, the whole database module would be
 * pulled into the browser bundle.
 */

export const ORDER_STATUSES = [
  'new',
  'contacted',
  'invoiced',
  'paid',
  'shipped',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type PaymentPreference = OrderInput['paymentPreference']

export interface OrderItemSnapshot {
  readonly slug: string
  readonly name: string
  readonly sku: string
  readonly fitment: string
  readonly fitmentLabel: string
  readonly qty: number
  readonly unitCents: number
  readonly lineCents: number
}

export interface PricedLine {
  readonly product: Product
  readonly qty: number
  readonly fitmentId: string
  readonly fitmentLabel: string
  readonly lineTotal: number
}

export interface PricedOrder {
  readonly orderNumber: string
  readonly lines: readonly PricedLine[]
  readonly subtotal: number
  readonly shippingFee: number
  readonly total: number
}

/** A stored order as the dashboard consumes it. */
export interface OrderRecord {
  readonly id: string
  readonly orderNumber: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly addressLine1: string
  readonly addressLine2: string | null
  readonly city: string
  readonly state: string
  readonly zip: string
  readonly vehicle: string | null
  readonly notes: string | null
  readonly items: readonly OrderItemSnapshot[]
  readonly subtotalCents: number
  readonly shippingCents: number
  readonly totalCents: number
  readonly paymentPreference: PaymentPreference
  readonly status: OrderStatus
  readonly createdAt: string
}

export interface OrderTotals {
  readonly count: number
  readonly newCount: number
  readonly revenueCents: number
}

/** Headline numbers for the dashboard. Cancelled orders are excluded. */
export function summarise(orders: readonly OrderRecord[]): OrderTotals {
  const live = orders.filter((order) => order.status !== 'cancelled')

  return {
    count: orders.length,
    newCount: orders.filter((order) => order.status === 'new').length,
    revenueCents: live.reduce((sum, order) => sum + order.totalCents, 0),
  }
}

export const STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  new: 'New',
  contacted: 'Contacted',
  invoiced: 'Invoiced',
  paid: 'Paid',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
}
