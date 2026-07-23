'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface MagneticProps {
  readonly children: ReactNode
  readonly className?: string
  /** How far the element chases the cursor, in pixels. */
  readonly strength?: number
}

/**
 * Pulls its child toward the pointer on hover, then springs back.
 *
 * Pointer-only by design: the effect is disabled for reduced-motion visitors
 * and does nothing on touch, where there is no hover state to respond to.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return

        const element = ref.current
        if (!element) return

        const rect = element.getBoundingClientRect()
        const relativeX = event.clientX - (rect.left + rect.width / 2)
        const relativeY = event.clientY - (rect.top + rect.height / 2)

        x.set((relativeX / (rect.width / 2)) * strength)
        y.set((relativeY / (rect.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
