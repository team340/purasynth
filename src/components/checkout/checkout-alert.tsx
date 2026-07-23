'use client'

import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'

interface CheckoutAlertProps {
  readonly message: string | null
  readonly reduceMotion: boolean
}

/**
 * The top-level failure message.
 *
 * The live region and the focus handling live on the wrapper in the form
 * itself, because that is the element focus has to land on. This only draws
 * the message and animates it in and out.
 */
export function CheckoutAlert({ message, reduceMotion }: CheckoutAlertProps) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="checkout-alert"
          initial={reduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-start gap-3 rounded-lg border-2 border-coral bg-coral-soft px-5 py-4 text-[0.92rem] font-semibold text-coral-deep"
        >
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0"
            strokeWidth={2.6}
            aria-hidden="true"
          />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}
