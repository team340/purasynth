import type { Product } from '@/lib/products'
import { getProductBySlug, getFitment } from '@/lib/products'
import { site } from '@/lib/site'

/**
 * Pure cart logic. No React, no storage, no side effects — every function
 * takes the current cart and returns a new one, so the provider can hold it
 * in state and the same rules can be unit tested or reused on the server.
 *
 * A line is keyed by slug + fitment: the same wheel in two bolt patterns is
 * two lines, because they ship as different parts.
 */

export const MAX_QTY_PER_LINE = 10
export const MAX_LINES = 10

export interface CartLine {
  readonly slug: string
  readonly fitment: string
  readonly qty: number
}

export type Cart = readonly CartLine[]

export interface ResolvedLine {
  readonly key: string
  readonly product: Product
  readonly fitmentId: string
  readonly fitmentLabel: string
  readonly qty: number
  readonly lineTotal: number
}

export interface CartTotals {
  readonly lines: readonly ResolvedLine[]
  readonly itemCount: number
  readonly subtotal: number
  readonly shipping: number
  readonly total: number
  readonly freeShipping: boolean
}

export function lineKey(slug: string, fitment: string): string {
  return `${slug}::${fitment}`
}

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1
  return Math.min(MAX_QTY_PER_LINE, Math.max(1, Math.round(qty)))
}

export function addLine(cart: Cart, line: CartLine): Cart {
  const key = lineKey(line.slug, line.fitment)
  const existing = cart.find((entry) => lineKey(entry.slug, entry.fitment) === key)

  if (existing) {
    return cart.map((entry) =>
      lineKey(entry.slug, entry.fitment) === key
        ? { ...entry, qty: clampQty(entry.qty + line.qty) }
        : entry
    )
  }

  if (cart.length >= MAX_LINES) return cart

  return [...cart, { ...line, qty: clampQty(line.qty) }]
}

export function setQty(cart: Cart, key: string, qty: number): Cart {
  if (qty <= 0) return removeLine(cart, key)

  return cart.map((entry) =>
    lineKey(entry.slug, entry.fitment) === key
      ? { ...entry, qty: clampQty(qty) }
      : entry
  )
}

export function removeLine(cart: Cart, key: string): Cart {
  return cart.filter((entry) => lineKey(entry.slug, entry.fitment) !== key)
}

/**
 * Drop anything that no longer resolves against the catalogue. Needed because
 * the cart is restored from localStorage, which can hold a slug or fitment
 * that was removed since the customer last visited.
 */
export function pruneCart(cart: Cart): Cart {
  return cart.filter((entry) => {
    const product = getProductBySlug(entry.slug)
    return Boolean(product && getFitment(product, entry.fitment))
  })
}

export function resolveCart(cart: Cart): CartTotals {
  const lines: ResolvedLine[] = []

  for (const entry of cart) {
    const product = getProductBySlug(entry.slug)
    if (!product) continue

    const fitment = getFitment(product, entry.fitment)
    if (!fitment) continue

    const qty = clampQty(entry.qty)

    lines.push({
      key: lineKey(entry.slug, entry.fitment),
      product,
      fitmentId: fitment.id,
      fitmentLabel: fitment.label,
      qty,
      lineTotal: product.price * qty,
    })
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const freeShipping =
    subtotal > 0 && subtotal >= site.freeShippingThreshold
  const shipping = freeShipping ? 0 : site.standardShippingFee

  return {
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.qty, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShipping,
  }
}

/** Parse a cart out of localStorage without trusting a single field of it. */
export function parseStoredCart(raw: string | null): Cart {
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const lines: CartLine[] = []

    for (const entry of parsed) {
      if (typeof entry !== 'object' || entry === null) continue

      const candidate = entry as Record<string, unknown>
      const slug = candidate.slug
      const fitment = candidate.fitment
      const qty = candidate.qty

      if (typeof slug !== 'string' || typeof fitment !== 'string') continue
      if (typeof qty !== 'number') continue

      lines.push({ slug, fitment, qty: clampQty(qty) })
    }

    return pruneCart(lines).slice(0, MAX_LINES)
  } catch {
    return []
  }
}
