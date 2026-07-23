'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

/**
 * Thin progress bar pinned under the header, tracking how far down the page
 * the visitor is. Purely decorative, so it is hidden from assistive tech and
 * skipped entirely for reduced-motion visitors.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  if (reduceMotion) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-volt via-coral to-lime"
    />
  )
}
