import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface Crumb {
  readonly label: string
  /** Omit on the final crumb — the current page is not a link. */
  readonly href?: string
}

interface BreadcrumbsProps {
  readonly items: readonly Crumb[]
  readonly className?: string
}

/**
 * Visible breadcrumb trail. The matching BreadcrumbList structured data is
 * emitted separately by each page, so the markup and the schema stay in step.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('font-mono text-[0.7rem] tracking-[0.14em] uppercase', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const last = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded-full px-2 py-1 font-bold text-slate transition-colors hover:bg-volt-soft hover:text-volt-deep"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="rounded-full bg-haze px-2 py-1 font-bold text-ink"
                >
                  {item.label}
                </span>
              )}

              {last ? null : (
                <ChevronRight
                  className="h-3 w-3 text-mist"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
