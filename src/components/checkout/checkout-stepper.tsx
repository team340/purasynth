'use client'

import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import type { CheckoutStepMeta } from '@/components/checkout/checkout-values'
import { cn } from '@/lib/utils'

interface CheckoutStepperProps {
  readonly steps: readonly CheckoutStepMeta[]
  readonly current: number
  readonly onSelect: (index: number) => void
}

const shell =
  'flex h-full w-full items-center gap-3 rounded-lg border-2 px-4 py-4 text-left transition-colors'

function Badge({
  done,
  active,
  number,
}: {
  readonly done: boolean
  readonly active: boolean
  readonly number: number
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-[0.95rem] font-extrabold',
        done ? 'bg-lime text-ink' : active ? 'bg-volt text-paper' : 'bg-paper text-slate'
      )}
    >
      {done ? <Check className="h-4 w-4" strokeWidth={4} /> : number}
    </span>
  )
}

function Body({
  meta,
  index,
  state,
}: {
  readonly meta: CheckoutStepMeta
  readonly index: number
  readonly state: 'done' | 'active' | 'ahead'
}): ReactNode {
  return (
    <>
      <Badge done={state === 'done'} active={state === 'active'} number={index + 1} />
      <span className="flex min-w-0 flex-col">
        <span className="font-mono text-[0.6rem] font-bold tracking-[0.16em] text-slate uppercase">
          <span className="visually-hidden">
            {state === 'done'
              ? 'Completed. '
              : state === 'active'
                ? 'Current. '
                : 'Not started. '}
          </span>
          Step {index + 1} of 3
        </span>
        <span
          className={cn(
            'text-[0.92rem] leading-tight font-bold',
            state === 'ahead' ? 'text-slate' : 'text-ink'
          )}
        >
          {meta.title}
        </span>
      </span>
    </>
  )
}

/**
 * The progress indicator.
 *
 * A step already cleared is a real button, because going back to fix an
 * address is a thing people do. A step still ahead is inert markup rather
 * than a disabled button: it cannot be reached until the one in front of it
 * validates, so offering it as a control would only be a dead end.
 */
export function CheckoutStepper({
  steps,
  current,
  onSelect,
}: CheckoutStepperProps) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((meta, index) => {
          const state =
            index < current ? 'done' : index === current ? 'active' : 'ahead'

          return (
            <li key={meta.id} className="flex">
              {state === 'done' ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={cn(
                    shell,
                    'cursor-pointer border-ink bg-lime-soft hover:-translate-y-[2px] hover:shadow-[0_4px_0_0_var(--color-ink)]',
                    'transition-[transform,box-shadow,background-color]'
                  )}
                >
                  <Body meta={meta} index={index} state={state} />
                  <span className="visually-hidden">Go back to this step.</span>
                </button>
              ) : (
                <div
                  aria-current={state === 'active' ? 'step' : undefined}
                  className={cn(
                    shell,
                    state === 'active'
                      ? 'border-ink bg-volt-soft shadow-[0_4px_0_0_var(--color-ink)]'
                      : 'border-line bg-paper'
                  )}
                >
                  <Body meta={meta} index={index} state={state} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
