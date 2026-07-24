'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur'

interface RevealProps {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
  readonly duration?: number
  readonly direction?: Direction
  readonly amount?: number
  readonly as?: 'div' | 'section' | 'li' | 'span' | 'article'
}

const offsets: Record<Direction, Record<string, number | string>> = {
  up: { y: 34 },
  down: { y: -34 },
  left: { x: 42 },
  right: { x: -42 },
  scale: { scale: 0.92 },
  blur: { filter: 'blur(14px)', y: 20 },
}

const settled: Record<Direction, Record<string, number | string>> = {
  up: { y: 0 },
  down: { y: 0 },
  left: { x: 0 },
  right: { x: 0 },
  scale: { scale: 1 },
  blur: { filter: 'blur(0px)', y: 0 },
}

/**
 * Fade-and-move a block into view the first time it is scrolled to.
 *
 * Respects prefers-reduced-motion by rendering the content plainly — a
 * visitor who has asked for less motion gets the content, not a still frame
 * of an animation that never played.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = 'up',
  /**
   * How much of the element must be in view before it reveals, as a fraction
   * of its own height.
   *
   * Defaults to 0, meaning "as soon as any part of it enters". Raise it only
   * on elements you know stay shorter than a viewport. The value is a
   * fraction of the element's OWN height, so on anything tall it quietly
   * becomes unreachable: at 0.25 an element 4000px tall needs 1000px of
   * itself on screen simultaneously, and on a short window it may never get
   * there. It then stays at opacity 0 indefinitely, present in the DOM and
   * correctly positioned but invisible, which is a hard failure to diagnose.
   */
  amount = 0,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, ...settled[direction] }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}

interface StaggerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly stagger?: number
  readonly delay?: number
}

/** Parent that runs its `RevealItem` children in sequence. */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: StaggerProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      /*
       * `amount: 0` means "reveal as soon as any part of the container enters
       * the viewport", which is the only threshold that is safe here.
       *
       * It was 0.15. Because `amount` is a fraction of the element's OWN
       * height, that is fine on a card and dangerous on a wrapper: Stagger
       * wraps a whole page of sections, and on /returns-policy that container
       * is about 3800px tall, so 0.15 demanded 570px of it be on screen at
       * once. Nothing guarantees that on a short window, and if the parent
       * never counts as in view, none of the children ever leave their hidden
       * variant and the whole block stays at opacity 0. Since the parent has
       * no visual state of its own, there is nothing to gain from waiting.
       */
      viewport={{ once: true, amount: 0 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
