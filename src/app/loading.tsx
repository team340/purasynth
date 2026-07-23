import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

/**
 * Route-level loading skeleton.
 *
 * The shimmer is decorative, so the whole thing is hidden from assistive
 * technology and announced once as plain text instead — a screen reader
 * should hear "loading", not a description of grey rectangles.
 */

const shimmer =
  'bg-haze bg-[linear-gradient(100deg,var(--color-haze)_0%,var(--color-paper)_45%,var(--color-haze)_70%)] ' +
  'bg-[length:260%_100%] motion-safe:animate-shimmer'

function Block({ className }: { readonly className?: string }) {
  return <div className={cn('rounded-md', shimmer, className)} />
}

export default function Loading() {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <p className="visually-hidden" role="status">
        Loading
      </p>

      <Container size="wide">
        <div aria-hidden="true" className="flex flex-col gap-12">
          <div className="flex flex-col gap-5">
            <Block className="h-7 w-40 rounded-full" />
            <Block className="h-14 w-full max-w-3xl rounded-lg sm:h-20" />
            <Block className="h-5 w-full max-w-xl" />
            <Block className="h-5 w-2/3 max-w-md" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="surface-card flex flex-col gap-4 p-6"
              >
                <Block className="aspect-square w-full rounded-lg" />
                <Block className="h-6 w-3/4" />
                <Block className="h-4 w-1/2" />
                <Block className="h-11 w-36 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
