'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { Logo } from '@/components/layout/logo'
import { Marquee } from '@/components/motion/marquee'
import { ButtonLink } from '@/components/ui/button'
import { primaryNav } from '@/lib/site'
import { cn } from '@/lib/utils'

const TICKER_ITEMS = [
  'Free freight to the lower 48',
  '4,500 lb load rating per wheel',
  'Six-wheel sets, caps + hardware included',
  'Fitment confirmed before we ship',
  'Shipped from Tomball, Texas',
]

export function SiteHeader() {
  const pathname = usePathname()
  const { totals, hydrated, openDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on navigation, or it stays open over the new page.
  // Adjusting during render rather than in an effect means the sheet is already
  // gone on the first frame of the new page instead of one render later.
  if (pathname !== menuPathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  // A fixed-position sheet over a scrollable body scrolls the page behind it.
  useEffect(() => {
    if (!menuOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  const itemCount = hydrated ? totals.itemCount : 0

  return (
    <>
      <div className="relative z-[60] border-b border-ink/10 bg-ink py-2 text-paper">
        <Marquee speed="slow" itemClassName="gap-10 pr-10">
          {TICKER_ITEMS.map((item) => (
            <span
              key={item}
              className="flex items-center gap-3 font-mono text-[0.7rem] font-bold tracking-[0.2em] whitespace-nowrap uppercase"
            >
              <span aria-hidden="true" className="text-lime">
                ●
              </span>
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled
            ? 'bg-paper/85 shadow-[0_1px_0_0_var(--color-line),0_10px_30px_-24px_rgb(11_11_18/0.5)] backdrop-blur-xl'
            : 'bg-paper'
        )}
      >
        <div className="mx-auto flex h-[4.5rem] w-full max-w-[88rem] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label={`Purasynth home`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`)

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative rounded-full px-4 py-2.5 text-[0.95rem] font-semibold transition-colors',
                        active ? 'text-volt-deep' : 'text-graphite hover:text-ink'
                      )}
                    >
                      {link.label}
                      {active ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-volt-soft"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper transition-transform duration-200 hover:-translate-y-0.5 hover:bg-lime-soft"
              aria-label={
                itemCount > 0
                  ? `Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`
                  : 'Open cart'
              }
            >
              <ShoppingBag
                className="h-[1.15rem] w-[1.15rem]"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <AnimatePresence>
                {itemCount > 0 ? (
                  <motion.span
                    key={itemCount}
                    initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                    className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-deep px-1 font-mono text-[0.65rem] font-bold text-paper"
                  >
                    {itemCount}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>

            <ButtonLink href="/shop" size="sm" className="hidden sm:inline-flex">
              Shop wheels
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              // The sheet is unmounted while closed, so pointing at its id then
              // would be a dangling reference. aria-expanded carries the state
              // on its own; aria-controls only appears once the target exists.
              aria-controls={menuOpen ? 'mobile-menu' : undefined}
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full border-t border-line bg-paper shadow-lift lg:hidden"
            >
              <nav aria-label="Mobile" className="px-5 py-5 sm:px-8">
                <ul className="flex flex-col gap-1">
                  {primaryNav.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl font-bold text-ink transition-colors hover:bg-haze"
                      >
                        {link.label}
                        <span aria-hidden="true" className="font-mono text-xs text-slate">
                          0{index + 1}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ButtonLink href="/shop" size="md" className="w-full">
                    Shop wheels
                  </ButtonLink>
                  <ButtonLink
                    href="/contact"
                    variant="outline"
                    size="md"
                    className="w-full"
                  >
                    Contact
                  </ButtonLink>
                </div>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  )
}
