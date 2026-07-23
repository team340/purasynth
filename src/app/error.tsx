'use client'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { Button, ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { site } from '@/lib/site'

interface ErrorPageProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
  /** Next 16 also passes a retry that re-fetches before re-rendering. */
  readonly unstable_retry?: () => void
}

export default function ErrorPage({
  error,
  reset,
  unstable_retry,
}: ErrorPageProps) {
  useEffect(() => {
    // Only the digest. The message from a server component is already
    // scrubbed in production, and logging more here would put whatever the
    // client did receive into the visitor's console for no benefit.
    console.error(`[purasynth] Render failed. Digest: ${error.digest ?? 'none'}`)
  }, [error.digest])

  const retry = unstable_retry ?? reset

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[30rem] w-[48rem] -translate-x-1/2 rounded-blob bg-coral-soft motion-safe:animate-blob"
      />

      <Container size="narrow">
        <Reveal direction="up" className="flex flex-col items-start gap-6">
          <Eyebrow tone="coral">Something broke</Eyebrow>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl">
            That page threw a wobble.
          </h1>

          <p className="text-lg leading-relaxed text-slate">
            A part of this page failed to load. Nothing has been charged and
            nothing in your cart has changed. Try again, and if it keeps
            happening, email{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-volt-deep underline underline-offset-4"
            >
              {site.email}
            </a>{' '}
            and the order can be taken by hand.
          </p>

          {error.digest ? (
            <p className="font-mono text-xs tracking-[0.14em] text-slate uppercase">
              Reference {error.digest}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => retry()}>
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              Try again
            </Button>
            <ButtonLink href="/shop" variant="outline" size="lg">
              Back to the wheels
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
