'use client'

import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Shared input chrome and label wiring for every step of the checkout. */

const inputBase =
  'w-full rounded-md border-2 bg-paper px-5 py-3.5 text-[0.95rem] font-medium text-ink ' +
  // `mist` is a hairline/icon tone (~2.5:1 on paper) and must not carry text.
  // Placeholder text is text: it needs the same 4.5:1 the accessibility page
  // promises, so it uses `slate` like every other secondary string.
  'transition-colors placeholder:font-normal placeholder:text-slate'

export function inputClass(hasError: boolean): string {
  return cn(
    inputBase,
    hasError ? 'border-coral bg-coral-soft/50' : 'border-ink hover:bg-haze/60'
  )
}

interface FieldErrorProps {
  readonly id: string
  readonly message: string
}

/** The error line, used both inside `Field` and beside the two custom groups. */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      className="flex items-start gap-2 text-[0.82rem] font-semibold text-coral-deep"
    >
      <AlertCircle
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        strokeWidth={2.8}
        aria-hidden="true"
      />
      {message}
    </p>
  )
}

interface FieldProps {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly hint?: string
  readonly optional?: boolean
  readonly className?: string
  readonly children: (describedBy: string | undefined) => ReactNode
}

/** Label, optional hint, control and error message, wired up for a11y. */
export function Field({
  id,
  label,
  error,
  hint,
  optional = false,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className="font-mono text-[0.66rem] font-bold tracking-[0.16em] text-ink uppercase"
      >
        {label}
        {optional ? (
          <span className="ml-2 font-normal text-slate normal-case">optional</span>
        ) : (
          <span className="ml-1 text-coral-deep">*</span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-[0.8rem] leading-relaxed text-slate">
          {hint}
        </p>
      ) : null}

      {children(describedBy)}

      {error && errorId ? <FieldError id={errorId} message={error} /> : null}
    </div>
  )
}
