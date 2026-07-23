'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  readonly children: ReactNode
  readonly className?: string
  readonly itemClassName?: string
  readonly reverse?: boolean
  readonly speed?: 'normal' | 'slow'
  readonly pauseOnHover?: boolean
}

/**
 * Infinite horizontal ticker.
 *
 * The track holds the content twice and translates by exactly -50%, so the
 * loop point lands on an identical frame and never visibly jumps. The
 * duplicate is aria-hidden so a screen reader announces the strip once.
 *
 * The `motion-safe:` prefix is load-bearing, not belt-and-braces. The global
 * reduced-motion block collapses animation-duration to 0.01ms, which does not
 * cancel the animation — it snaps the track to its end frame at translate(-50%)
 * and leaves the duplicate copy on screen. Never applying the class at all is
 * what gives a reduced-motion visitor a static strip in the right place.
 */
export function Marquee({
  children,
  className,
  itemClassName,
  reverse = false,
  speed = 'normal',
  pauseOnHover = true,
}: MarqueeProps) {
  const animation = reverse
    ? 'motion-safe:animate-marquee-reverse'
    : speed === 'slow'
      ? 'motion-safe:animate-marquee-slow'
      : 'motion-safe:animate-marquee'

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 items-center',
          animation,
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        <div className={cn('flex shrink-0 items-center', itemClassName)}>
          {children}
        </div>
        <div
          aria-hidden="true"
          className={cn('flex shrink-0 items-center', itemClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
