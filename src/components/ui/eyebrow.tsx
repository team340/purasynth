import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface EyebrowProps {
  readonly children: ReactNode
  readonly className?: string
  readonly tone?: 'volt' | 'lime' | 'coral' | 'sky'
}

const tones = {
  volt: 'bg-volt-soft text-volt-deep',
  lime: 'bg-lime-soft text-ink',
  coral: 'bg-coral-soft text-coral-deep',
  sky: 'bg-sky-soft text-ink',
} as const

/** Small pill label used above section headings. */
export function Eyebrow({ children, className, tone = 'volt' }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[0.7rem]',
        'font-bold tracking-[0.18em] uppercase',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
