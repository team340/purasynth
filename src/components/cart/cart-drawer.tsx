'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { ButtonLink } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

/** Everything the browser will hand focus to inside the panel, in DOM order. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function CartDrawer() {
  const { totals, drawerOpen, closeDrawer, update, remove } = useCart()
  const reduceMotion = useReducedMotion()

  const drawerRef = useRef<HTMLElement | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!drawerOpen) return

    const drawer = drawerRef.current

    // Whatever was focused when the drawer opened is where focus goes back to.
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    // The panel rather than the close button, so the dialog label is announced
    // first. preventScroll matters because the panel is still mid-slide-in.
    drawer?.focus({ preventScroll: true })

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDrawer()
        return
      }

      if (event.key !== 'Tab' || !drawer) return

      // aria-modal tells assistive tech the rest of the page is inert, but it
      // does nothing to the tab order — without this, Tab walks out of the
      // panel and into the page the scrim is covering.
      const nodes = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE))

      if (nodes.length === 0) {
        event.preventDefault()
        drawer.focus({ preventScroll: true })
        return
      }

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      const inside = active instanceof Node && drawer.contains(active)

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [drawerOpen, closeDrawer])

  /**
   * Runs when the exit animation finishes, not when `drawerOpen` flips — a
   * restore mid-exit would fight the panel that is still on screen.
   *
   * Links inside the drawer close it on the way to another page, and that
   * navigation owns focus. So the opener is only reclaimed when closing left
   * focus on <body>, which is precisely the case this is here to fix.
   */
  const restoreFocus = useCallback(() => {
    const opener = openerRef.current
    openerRef.current = null

    if (!opener?.isConnected) return
    if (document.activeElement && document.activeElement !== document.body) {
      return
    }

    opener.focus({ preventScroll: true })
  }, [])

  return (
    <AnimatePresence onExitComplete={restoreFocus}>
      {drawerOpen ? (
        <>
          <motion.div
            key="scrim"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            tabIndex={-1}
            initial={reduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col border-l-2 border-ink bg-paper"
          >
            <header className="flex items-center justify-between border-b-2 border-ink px-6 py-5">
              <h2 className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
                <ShoppingBag
                  className="h-5 w-5 text-volt"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
                Your cart
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors hover:bg-coral-soft"
              >
                <X className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
              </button>
            </header>

            {totals.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-haze motion-safe:animate-float">
                  <ShoppingBag
                    className="h-9 w-9 text-volt"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </div>
                <p className="font-display text-2xl font-extrabold">
                  Nothing in here yet
                </p>
                <p className="text-[0.95rem] text-slate">
                  Two sets. Both heavy. Pick one and we will confirm fitment
                  before anything ships.
                </p>
                <ButtonLink href="/shop" onClick={closeDrawer}>
                  Browse wheels
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-5">
                  {totals.lines.map((line) => (
                    <li
                      key={line.key}
                      className="flex gap-4 border-b border-line py-5 first:pt-0 last:border-0"
                    >
                      <Link
                        href={`/product/${line.product.slug}`}
                        onClick={closeDrawer}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-haze"
                      >
                        <Image
                          src={line.product.image}
                          alt={line.product.imageAlt}
                          fill
                          sizes="96px"
                          className="object-contain p-1"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <Link
                          href={`/product/${line.product.slug}`}
                          onClick={closeDrawer}
                          className="font-display text-[1.05rem] leading-tight font-bold hover:text-volt-deep"
                        >
                          {line.product.shortName}
                        </Link>
                        <p className="font-mono text-[0.7rem] tracking-wide text-slate uppercase">
                          {line.fitmentLabel}
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-full border-2 border-ink">
                            <button
                              type="button"
                              onClick={() => update(line.key, line.qty - 1)}
                              aria-label={`Decrease quantity of ${line.product.shortName}`}
                              className="flex h-8 w-8 items-center justify-center rounded-l-full transition-colors hover:bg-haze"
                            >
                              <Minus
                                className="h-3.5 w-3.5"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            </button>
                            <span className="w-8 text-center font-mono text-sm font-bold">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => update(line.key, line.qty + 1)}
                              aria-label={`Increase quantity of ${line.product.shortName}`}
                              className="flex h-8 w-8 items-center justify-center rounded-r-full transition-colors hover:bg-haze"
                            >
                              <Plus
                                className="h-3.5 w-3.5"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          <span className="font-display text-lg font-extrabold">
                            {formatPrice(line.lineTotal)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        aria-label={`Remove ${line.product.shortName} from cart`}
                        className="self-start text-slate transition-colors hover:text-coral-deep"
                      >
                        <Trash2
                          className="h-4 w-4"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>

                <footer className="border-t-2 border-ink bg-cream px-6 py-6">
                  <dl className="flex flex-col gap-2 text-[0.95rem]">
                    <div className="flex justify-between">
                      <dt className="text-slate">Subtotal</dt>
                      <dd className="font-semibold">
                        {formatPrice(totals.subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate">Freight</dt>
                      <dd className="font-semibold text-volt-deep">
                        {totals.shipping === 0
                          ? 'Free to the lower 48'
                          : formatPrice(totals.shipping)}
                      </dd>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-ink/15 pt-3">
                      <dt className="font-display text-xl font-extrabold">
                        Total
                      </dt>
                      <dd className="font-display text-xl font-extrabold">
                        {formatPrice(totals.total)}
                      </dd>
                    </div>
                  </dl>

                  <ButtonLink
                    href="/checkout"
                    size="lg"
                    className="mt-5 w-full"
                    onClick={closeDrawer}
                  >
                    Place your order
                  </ButtonLink>

                  <p className="mt-3 text-center text-[0.75rem] leading-relaxed text-slate">
                    No card details are collected. We confirm fitment, then email
                    an invoice with a secure payment link.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
