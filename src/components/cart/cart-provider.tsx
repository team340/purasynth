'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import {
  addLine,
  removeLine,
  resolveCart,
  setQty,
  type Cart,
  type CartLine,
  type CartTotals,
} from '@/lib/cart-store'
import {
  getCartSnapshot,
  getServerCartSnapshot,
  hydrationStore,
  subscribeToCart,
  updateCart,
} from '@/lib/cart-storage'

interface CartContextValue {
  readonly cart: Cart
  readonly totals: CartTotals
  /** True once the cart has been restored, so the UI can avoid a flash of 0. */
  readonly hydrated: boolean
  readonly drawerOpen: boolean
  readonly lastAdded: string | null
  add: (line: CartLine) => void
  update: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { readonly children: ReactNode }) {
  // localStorage is the cart's home. Subscribing to it instead of copying it
  // into state after mount keeps other tabs in sync and means the server and
  // the first client render agree without a restore pass.
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot
  )
  const hydrated = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot
  )

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  const add = useCallback((line: CartLine) => {
    updateCart((current) => addLine(current, line))
    setLastAdded(line.slug)
    setDrawerOpen(true)
  }, [])

  const update = useCallback((key: string, qty: number) => {
    updateCart((current) => setQty(current, key, qty))
  }, [])

  const remove = useCallback((key: string) => {
    updateCart((current) => removeLine(current, key))
  }, [])

  const clear = useCallback(() => updateCart(() => []), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const totals = useMemo(() => resolveCart(cart), [cart])

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      totals,
      hydrated,
      drawerOpen,
      lastAdded,
      add,
      update,
      remove,
      clear,
      openDrawer,
      closeDrawer,
    }),
    [
      cart,
      totals,
      hydrated,
      drawerOpen,
      lastAdded,
      add,
      update,
      remove,
      clear,
      openDrawer,
      closeDrawer,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider.')
  }

  return context
}
