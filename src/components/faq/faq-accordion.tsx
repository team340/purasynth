'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'

import type { FaqEntry } from '@/lib/seo'
import { cn } from '@/lib/utils'

interface FaqAccordionProps {
  readonly entries: readonly FaqEntry[]
  /** Prefix for the generated element ids — must be unique on the page. */
  readonly idPrefix: string
  readonly headingLevel?: 'h3' | 'h4'
  /** Index open on first paint, or null for all closed. */
  readonly defaultOpenIndex?: number | null
  readonly className?: string
}

/**
 * Disclosure list for a group of questions.
 *
 * One panel is open at a time. Each trigger is a real button inside a heading
 * so the list is navigable by heading as well as by tab, and Arrow/Home/End
 * move between triggers the way the WAI-ARIA accordion pattern describes.
 * The height transition is skipped for reduced-motion visitors, who get the
 * answer appearing instantly rather than a panel that never finishes opening.
 */
export function FaqAccordion({
  entries,
  idPrefix,
  headingLevel: Heading = 'h3',
  defaultOpenIndex = null,
  className,
}: FaqAccordionProps) {
  const reduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])

  function focusTrigger(index: number) {
    const wrapped = (index + entries.length) % entries.length
    triggers.current[wrapped]?.focus()
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusTrigger(index + 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusTrigger(index - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTrigger(0)
        break
      case 'End':
        event.preventDefault()
        focusTrigger(entries.length - 1)
        break
      default:
        break
    }
  }

  return (
    <ul className={cn('flex flex-col gap-4', className)}>
      {entries.map((entry, index) => {
        const open = openIndex === index
        const panelId = `${idPrefix}-panel-${index}`
        const triggerId = `${idPrefix}-trigger-${index}`

        return (
          <li
            key={entry.question}
            className={cn(
              'rounded-lg border-2 bg-paper transition-[border-color,box-shadow,transform] duration-300',
              open
                ? 'border-ink shadow-[0_5px_0_0_var(--color-ink)]'
                : 'border-ink/10 hover:-translate-y-0.5 hover:border-ink/40'
            )}
          >
            <Heading>
              <button
                type="button"
                id={triggerId}
                ref={(node) => {
                  triggers.current[index] = node
                }}
                aria-expanded={open}
                // The panel is unmounted while collapsed, so pointing at its id
                // then is a dangling reference.
                aria-controls={open ? panelId : undefined}
                onClick={() => setOpenIndex(open ? null : index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8 sm:py-6"
              >
                <span className="font-display text-lg leading-snug font-bold text-ink sm:text-xl">
                  {entry.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink',
                    'transition-[transform,background-color] duration-300',
                    open ? 'rotate-45 bg-lime' : 'bg-paper'
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </span>
              </button>
            </Heading>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="border-t-2 border-line px-6 py-5 text-[0.95rem] leading-relaxed text-slate sm:px-8 sm:py-6">
                    {entry.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
