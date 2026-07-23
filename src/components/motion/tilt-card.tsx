'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface TiltCardProps {
  readonly children: ReactNode
  readonly className?: string
  /** Maximum rotation in degrees on each axis. */
  readonly max?: number
}

/**
 * 3D tilt that tracks the pointer across the card.
 *
 * The rotation is driven by springs rather than raw pointer values so the
 * card settles instead of snapping, and the whole effect is skipped for
 * reduced-motion visitors and non-mouse pointers.
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)

  const springX = useSpring(pointerX, { stiffness: 180, damping: 20 })
  const springY = useSpring(pointerY, { stiffness: 180, damping: 20 })

  const rotateX = useTransform(springY, [0, 1], [max, -max])
  const rotateY = useTransform(springX, [0, 1], [-max, max])

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn('[transform-style:preserve-3d]', className)}
      style={{ rotateX, rotateY, perspective: 1100 }}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return

        const element = ref.current
        if (!element) return

        const rect = element.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width)
        pointerY.set((event.clientY - rect.top) / rect.height)
      }}
      onPointerLeave={() => {
        pointerX.set(0.5)
        pointerY.set(0.5)
      }}
    >
      {children}
    </motion.div>
  )
}
