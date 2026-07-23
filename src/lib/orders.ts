import 'server-only'

import type { OrderInput } from '@/lib/order-schema'
import {
  ORDER_STATUSES,
  type OrderItemSnapshot,
  type OrderRecord,
  type OrderStatus,
  type PaymentPreference,
  type PricedOrder,
} from '@/lib/order-types'
import { getSupabase } from '@/lib/supabase'

/**
 * Database access for orders. Server-only — see `order-types.ts` for the
 * shapes and pure helpers that client components are allowed to import.
 */

interface OrderRow {
  id: string
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  zip: string
  vehicle: string | null
  notes: string | null
  items: unknown
  subtotal_cents: number
  shipping_cents: number
  total_cents: number
  payment_preference: string
  status: string
  created_at: string
}

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

function isItemSnapshot(value: unknown): value is OrderItemSnapshot {
  if (typeof value !== 'object' || value === null) return false

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.slug === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.sku === 'string' &&
    typeof candidate.fitment === 'string' &&
    typeof candidate.fitmentLabel === 'string' &&
    typeof candidate.qty === 'number' &&
    typeof candidate.unitCents === 'number' &&
    typeof candidate.lineCents === 'number'
  )
}

/**
 * `items` is jsonb, so a row written by an older schema or edited by hand in
 * the Supabase table view can hold anything. Drop what does not match instead
 * of asserting the type: a malformed row should cost one line of one order,
 * not crash the whole dashboard while the owner is trying to read it.
 */
function toItems(value: unknown): readonly OrderItemSnapshot[] {
  if (!Array.isArray(value)) return []

  return (value as readonly unknown[]).filter(isItemSnapshot)
}

function toRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    orderNumber: row.order_number,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    state: row.state,
    zip: row.zip,
    vehicle: row.vehicle,
    notes: row.notes,
    items: toItems(row.items),
    subtotalCents: row.subtotal_cents,
    shippingCents: row.shipping_cents,
    totalCents: row.total_cents,
    paymentPreference: row.payment_preference as PaymentPreference,
    status: isOrderStatus(row.status) ? row.status : 'new',
    createdAt: row.created_at,
  }
}

export function toItemSnapshots(
  priced: PricedOrder
): readonly OrderItemSnapshot[] {
  return priced.lines.map((line) => ({
    slug: line.product.slug,
    name: line.product.name,
    sku: line.product.sku,
    fitment: line.fitmentId,
    fitmentLabel: line.fitmentLabel,
    qty: line.qty,
    unitCents: line.product.price,
    lineCents: line.lineTotal,
  }))
}

/**
 * Persist an order. Throws if the insert fails — the caller must surface that
 * to the customer rather than showing a confirmation for an order that was
 * never recorded.
 */
export async function saveOrder(
  order: OrderInput,
  priced: PricedOrder
): Promise<void> {
  const { error } = await getSupabase()
    .from('orders')
    .insert({
      order_number: priced.orderNumber,
      first_name: order.firstName,
      last_name: order.lastName,
      email: order.email,
      phone: order.phone,
      address_line1: order.addressLine1,
      address_line2: order.addressLine2 || null,
      city: order.city,
      state: order.state,
      zip: order.zip.toUpperCase(),
      vehicle: order.vehicle || null,
      notes: order.notes || null,
      items: toItemSnapshots(priced),
      subtotal_cents: priced.subtotal,
      shipping_cents: priced.shippingFee,
      total_cents: priced.total,
      payment_preference: order.paymentPreference,
    })

  if (error) {
    throw new Error(`Could not save order: ${error.message}`)
  }
}

export async function listOrders(limit = 200): Promise<readonly OrderRecord[]> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Could not load orders: ${error.message}`)
  }

  return (data as OrderRow[]).map(toRecord)
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const { error } = await getSupabase()
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(`Could not update order: ${error.message}`)
  }
}
