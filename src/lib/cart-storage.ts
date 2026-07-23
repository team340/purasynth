import { parseStoredCart, type Cart } from '@/lib/cart-store'

/**
 * localStorage as an external store, in the shape `useSyncExternalStore` wants.
 *
 * The cart lives in the browser, not in React, so React subscribes to it rather
 * than mirroring it into state inside an effect. That keeps a cart edited in a
 * second tab in sync, and avoids the cascading render an effect-then-setState
 * restore causes on every mount.
 *
 * No React in here on purpose — the parsing and clamping rules stay testable.
 */

const STORAGE_KEY = 'purasynth.cart.v1'
const EMPTY: Cart = []

/**
 * Cached so `getSnapshot` is referentially stable between renders. Returning a
 * freshly parsed array every call would loop React forever.
 */
let snapshot: Cart = EMPTY
let stale = true

const listeners = new Set<() => void>()

function readRaw(): string | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private mode or a blocked storage API. An empty cart is the right
    // fallback — the customer can still shop, they just lose persistence.
    return null
  }
}

function emit(): void {
  for (const listener of listeners) listener()
}

function onStorage(event: StorageEvent): void {
  // A null key means the whole store was cleared, which affects us too.
  if (event.key !== null && event.key !== STORAGE_KEY) return

  stale = true
  emit()
}

/** The cart as the browser currently has it. Stable until something changes. */
export function getCartSnapshot(): Cart {
  if (stale) {
    snapshot = parseStoredCart(readRaw())
    stale = false
  }

  return snapshot
}

/** The server has no idea what is in the cart, so it renders an empty one. */
export function getServerCartSnapshot(): Cart {
  return EMPTY
}

export function subscribeToCart(listener: () => void): () => void {
  listeners.add(listener)

  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage)
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage)
    }
  }
}

/** Apply a pure cart transform, persist the result, and notify subscribers. */
export function updateCart(recipe: (current: Cart) => Cart): void {
  const next = recipe(getCartSnapshot())

  snapshot = next
  stale = false

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked. The in-memory cart still works for this visit.
  }

  emit()
}

const noopSubscribe = (): (() => void) => () => {}

/**
 * `useSyncExternalStore` arguments for "has this component hydrated yet".
 *
 * The first client render has to match the server's markup, so anything that
 * depends on localStorage renders a placeholder until React swaps in the client
 * snapshot. Exported as data rather than a hook so it lives next to the store.
 */
export const hydrationStore = {
  subscribe: noopSubscribe,
  getSnapshot: (): boolean => true,
  getServerSnapshot: (): boolean => false,
} as const
