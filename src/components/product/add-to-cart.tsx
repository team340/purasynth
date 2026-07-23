'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, Check, ChevronDown, Minus, Plus, ShoppingBag } from 'lucide-react'

import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { MAX_QTY_PER_LINE } from '@/lib/cart-store'
import type { Product } from '@/lib/products'

interface AddToCartProps {
  readonly product: Product
}

const SUCCESS_MS = 2400

/**
 * Fitment picker, quantity stepper and the add button.
 *
 * Fitment is required rather than defaulted: a bolt pattern guessed on the
 * customer's behalf is a set of wheels that will not bolt on, so the button
 * refuses to add anything until a truck is chosen.
 */
export function AddToCart({ product }: AddToCartProps) {
  const { add } = useCart()
  const reduceMotion = useReducedMotion()

  const selectId = useId()
  const errorId = useId()
  const qtyLabelId = useId()
  const selectRef = useRef<HTMLSelectElement>(null)

  const [fitment, setFitment] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return

    const timer = setTimeout(() => setAdded(false), SUCCESS_MS)
    return () => clearTimeout(timer)
  }, [added])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!fitment) {
      setError('Choose your truck first so we ship the right bolt pattern.')
      selectRef.current?.focus()
      return
    }

    setError(null)
    setAdded(true)
    add({ slug: product.slug, fitment, qty })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-ink uppercase"
        >
          Your truck <span className="text-coral-deep">*</span>
        </label>

        <div className="relative">
          <select
            id={selectId}
            ref={selectRef}
            name="fitment"
            required
            value={fitment}
            onChange={(event) => {
              setFitment(event.target.value)
              setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="w-full appearance-none rounded-md border-2 border-ink bg-paper px-5 py-4 pr-12 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-haze"
          >
            <option value="">Select your bolt pattern…</option>
            {product.fitments.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2"
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>

        <AnimatePresence initial={false}>
          {error ? (
            <motion.p
              id={errorId}
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2 rounded-md bg-coral-soft px-4 py-2.5 text-[0.85rem] font-semibold text-coral-deep"
            >
              <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.6} aria-hidden="true" />
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {fitment ? (
          <p className="text-[0.82rem] leading-relaxed text-slate">
            {product.fitments.find((option) => option.id === fitment)?.trucks}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span
          id={qtyLabelId}
          className="font-mono text-[0.68rem] font-bold tracking-[0.18em] text-ink uppercase"
        >
          Sets
        </span>

        <div
          role="group"
          aria-labelledby={qtyLabelId}
          className="flex items-center rounded-full border-2 border-ink"
        >
          <button
            type="button"
            onClick={() => setQty((current) => Math.max(1, current - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="flex h-12 w-12 items-center justify-center rounded-l-full transition-colors hover:bg-haze disabled:opacity-40"
          >
            <Minus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          </button>

          <output
            aria-live="polite"
            className="w-12 text-center font-mono text-lg font-bold"
          >
            {qty}
          </output>

          <button
            type="button"
            onClick={() =>
              setQty((current) => Math.min(MAX_QTY_PER_LINE, current + 1))
            }
            disabled={qty >= MAX_QTY_PER_LINE}
            aria-label="Increase quantity"
            className="flex h-12 w-12 items-center justify-center rounded-r-full transition-colors hover:bg-haze disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          </button>
        </div>

        <span className="font-mono text-[0.7rem] tracking-[0.12em] text-slate uppercase">
          {qty * 6} wheels total
        </span>
      </div>

      <Button
        type="submit"
        variant={added ? 'lime' : 'primary'}
        size="lg"
        className="w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span
              key="added"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="flex items-center gap-2.5"
            >
              <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
              Added to your cart
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              className="flex items-center gap-2.5"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
              Add set to cart
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <p aria-live="polite" className="visually-hidden">
        {added ? `${product.shortName} added to your cart.` : ''}
      </p>
    </form>
  )
}
