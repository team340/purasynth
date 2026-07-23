import { cn } from '@/lib/utils'

interface LogoProps {
  readonly className?: string
  readonly spin?: boolean
}

/**
 * Wordmark plus an eight-lug wheel glyph. The glyph is drawn rather than
 * imported so it stays crisp at any size and inherits the current colour.
 */
export function LogoMark({ className, spin = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-9 w-9', spin && 'motion-safe:animate-spin-slower', className)}
    >
      <circle cx="24" cy="24" r="22" className="fill-ink" />
      <circle
        cx="24"
        cy="24"
        r="16.5"
        className="stroke-lime"
        strokeWidth="2.4"
        strokeDasharray="4 3.2"
      />
      <circle cx="24" cy="24" r="8.5" className="fill-volt" />
      <circle cx="24" cy="24" r="3.2" className="fill-paper" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const radians = (angle * Math.PI) / 180
        return (
          <circle
            key={angle}
            cx={24 + Math.cos(radians) * 5.9}
            cy={24 + Math.sin(radians) * 5.9}
            r="1.15"
            className="fill-paper"
          />
        )
      })}
    </svg>
  )
}

export function Logo({ className }: { readonly className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-2xl font-extrabold tracking-[-0.045em] text-ink">
        Pura<span className="text-volt">synth</span>
      </span>
    </span>
  )
}
