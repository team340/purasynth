'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { AlertTriangle, Loader2, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface LoginResponse {
  readonly success: boolean
  readonly error?: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const result = (await response.json()) as LoginResponse

      if (!result.success) {
        setError(result.error ?? 'Could not sign you in.')
        setIsSubmitting(false)
        return
      }

      // Drop the password from state before navigating away.
      setPassword('')
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-lg border-2 border-ink bg-paper p-7 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8"
    >
      <div>
        <span className="inline-flex items-center rounded-full bg-volt-soft px-4 py-1.5 font-mono text-[0.7rem] font-bold tracking-[0.18em] text-volt-deep uppercase">
          Purasynth
        </span>
        <h1 className="mt-4 text-3xl">Orders</h1>
        <p className="mt-2 text-sm text-slate">
          Sign in to see who has ordered and where it is going.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-password" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'admin-login-error' : undefined}
          className="w-full rounded-md border-2 border-ink bg-cream px-4 py-3 text-base"
        />
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            id="admin-login-error"
            role="alert"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-2.5 overflow-hidden rounded-md border-2 border-coral bg-coral-soft p-3"
          >
            <AlertTriangle
              className="h-4 w-4 shrink-0 text-coral"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2
              className="h-5 w-5 motion-safe:animate-spin"
              aria-hidden="true"
            />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" aria-hidden="true" />
            Sign in
          </>
        )}
      </Button>
    </form>
  )
}
