'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'

import type { Product } from '@/lib/products'
import { cn } from '@/lib/utils'

const TAB_IDS = ['overview', 'specs', 'box', 'fitment'] as const

type TabId = (typeof TAB_IDS)[number]

const TAB_LABELS: Readonly<Record<TabId, string>> = {
  overview: 'Overview',
  specs: 'Specs',
  box: 'In the box',
  fitment: 'Fitment',
}

interface ProductTabsProps {
  readonly product: Product
}

/**
 * Tabbed detail panel following the ARIA tabs pattern: one tab in the focus
 * order at a time, arrow keys move between them, and each panel is labelled by
 * its tab. Panel content is swapped rather than hidden so the DOM stays small.
 */
export function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>('overview')
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const reduceMotion = useReducedMotion()

  function focusTab(id: TabId) {
    setActive(id)
    tabRefs.current[id]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = TAB_IDS.indexOf(active)

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab(TAB_IDS[(index + 1) % TAB_IDS.length])
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab(TAB_IDS[(index - 1 + TAB_IDS.length) % TAB_IDS.length])
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      focusTab(TAB_IDS[0])
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      focusTab(TAB_IDS[TAB_IDS.length - 1])
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[0_8px_0_0_var(--color-ink)]">
      <div
        role="tablist"
        aria-label="Product detail"
        className="flex flex-wrap gap-1 border-b-2 border-ink bg-cream p-2 sm:gap-2 sm:p-3"
      >
        {TAB_IDS.map((id) => {
          const selected = id === active

          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              // Only one panel is in the DOM at a time — it is the selected
              // tab's. The other three would point at ids that do not exist.
              aria-controls={selected ? `panel-${id}` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={handleKeyDown}
              className={cn(
                'relative rounded-full px-5 py-3 font-mono text-[0.7rem] font-bold tracking-[0.14em] uppercase transition-colors sm:px-6',
                selected ? 'text-paper' : 'text-graphite hover:text-ink'
              )}
            >
              {selected ? (
                <motion.span
                  layoutId="product-tab-pill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              ) : null}
              {TAB_LABELS[id]}
            </button>
          )
        })}
      </div>

      <div className="p-6 sm:p-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            // No outline suppression here: the panel is in the tab order, so it
            // has to show the global 3px volt ring. The 6px it needs sits well
            // inside this container's padding, so nothing clips it.
          >
            {active === 'overview' ? (
              <div className="flex max-w-3xl flex-col gap-5">
                <h3 className="text-2xl sm:text-3xl">{product.tagline}</h3>
                {product.longDescription.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[1rem] leading-relaxed text-slate"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {active === 'specs' ? (
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl sm:text-3xl">Numbers, not adjectives</h3>
                <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-6 border-b border-dashed border-line py-3.5"
                    >
                      <dt className="font-mono text-[0.68rem] font-bold tracking-[0.14em] text-slate uppercase">
                        {spec.label}
                      </dt>
                      <dd className="text-right text-[0.95rem] font-semibold text-ink">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {active === 'box' ? (
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl sm:text-3xl">
                  Everything that lands on the pallet
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.inTheBox.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-lg bg-haze px-5 py-4 text-[0.95rem] font-medium text-graphite"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[0.9rem] text-slate">
                  Tires are not included — we ship wheels only.
                </p>
              </div>
            ) : null}

            {active === 'fitment' ? (
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl sm:text-3xl">Bolt patterns we cover</h3>
                <ul className="flex flex-col gap-3">
                  {product.fitments.map((option) => (
                    <li
                      key={option.id}
                      className="flex flex-col gap-1.5 rounded-lg border-2 border-line px-5 py-4 transition-colors hover:border-ink sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-lg font-bold">
                          {option.label}
                        </span>
                        <span className="text-[0.88rem] text-slate">
                          {option.trucks}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-volt-soft px-4 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.14em] text-volt-deep uppercase">
                        {option.bolt}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[0.9rem] text-slate">
                  Not sure which one you have? Pick &ldquo;Not sure&rdquo; and add
                  your year, make and model at checkout — we confirm it in writing
                  before anything ships.
                </p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
