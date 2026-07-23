'use client'

import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  readonly to: number
  readonly duration?: number
  readonly prefix?: string
  readonly suffix?: string
  readonly decimals?: number
  readonly className?: string
}

function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5)
}

/**
 * Counts from zero to `to` the first time it scrolls into view.
 *
 * Reduced-motion visitors get the final number immediately — the point of the
 * component is the number, and the animation is decoration on top of it.
 */
export function CountUp({
  to,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  // Reduced motion shows the final number directly, so no animation state is
  // needed and the effect never has to run.
  useEffect(() => {
    if (!inView || reduceMotion) return

    let frame = 0
    const start = performance.now()

    const step = (now: number) => {
      const elapsed = (now - start) / (duration * 1000)

      if (elapsed >= 1) {
        setValue(to)
        return
      }

      setValue(to * easeOutQuint(elapsed))
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration, reduceMotion])

  const display = (reduceMotion ? to : value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
