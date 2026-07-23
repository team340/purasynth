'use client'

interface CheckoutStepHeadingProps {
  readonly id: string
  readonly index: number
  readonly total: number
  readonly heading: string
  readonly blurb: string
}

/**
 * The heading of whichever step is on screen.
 *
 * It carries `tabIndex={-1}` because moving between steps moves focus here:
 * without it the browser would leave focus on the Continue button, which has
 * just been replaced, and a screen reader would announce nothing at all.
 */
export function CheckoutStepHeading({
  id,
  index,
  total,
  heading,
  blurb,
}: CheckoutStepHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="w-fit rounded-full bg-ink px-4 py-1.5 font-mono text-[0.62rem] font-bold tracking-[0.16em] text-paper uppercase">
        Step {index + 1} of {total}
      </span>

      <h2
        id={id}
        tabIndex={-1}
        className="text-3xl focus-visible:outline-none sm:text-4xl"
      >
        {heading}
      </h2>

      <p className="text-[0.95rem] leading-relaxed text-slate">{blurb}</p>
    </div>
  )
}
