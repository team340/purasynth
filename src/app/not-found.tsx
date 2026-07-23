import type { Metadata } from 'next'
import Link from 'next/link'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { helpNav } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

/** Decorative wheel. Spins only for visitors who have not asked for less motion. */
function WheelGlyph() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="h-40 w-40 motion-safe:animate-spin-slow sm:h-56 sm:w-56"
    >
      <circle cx="60" cy="60" r="57" className="fill-ink" />
      <circle
        cx="60"
        cy="60"
        r="44"
        className="stroke-lime"
        strokeWidth="5"
        strokeDasharray="10 8"
      />
      <circle cx="60" cy="60" r="22" className="fill-volt" />
      <circle cx="60" cy="60" r="8" className="fill-paper" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const radians = (angle * Math.PI) / 180

        return (
          <circle
            key={angle}
            cx={60 + Math.cos(radians) * 15}
            cy={60 + Math.sin(radians) * 15}
            r="3"
            className="fill-paper"
          />
        )
      })}
    </svg>
  )
}

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[34rem] w-[54rem] -translate-x-1/2 rounded-blob bg-haze motion-safe:animate-blob"
      />
      <div
        aria-hidden="true"
        className="noise-overlay pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal direction="up" className="flex flex-col items-start gap-6">
            <Eyebrow tone="coral">Error 404</Eyebrow>

            <p className="text-gradient font-display text-[6rem] leading-none font-extrabold tracking-[-0.06em] sm:text-[9rem] lg:text-[11rem]">
              404
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl">
              This one rolled off the trailer.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate">
              The page you were after has moved or never existed. Nothing is
              wrong with your cart — head back to the wheels and pick up where
              you left off.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop the wheels
              </ButtonLink>
              <ButtonLink href="/" variant="outline" size="lg">
                Back home
              </ButtonLink>
            </div>

            <nav aria-label="Helpful links" className="mt-2">
              <ul className="flex flex-wrap gap-2">
                {helpNav.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border-2 border-line bg-paper px-4 py-2 font-mono text-[0.7rem] font-bold tracking-[0.16em] text-graphite uppercase transition-colors hover:border-ink hover:bg-lime-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal direction="scale" delay={0.12} className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute h-52 w-52 rounded-full bg-volt-soft motion-safe:animate-pulse-ring sm:h-72 sm:w-72"
              />
              <WheelGlyph />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
