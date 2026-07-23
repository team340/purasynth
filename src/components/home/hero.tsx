'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import Image from 'next/image'
import { ArrowDown, ArrowRight } from 'lucide-react'

import { Magnetic } from '@/components/motion/magnetic'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { products } from '@/lib/products'
import { cn } from '@/lib/utils'

/**
 * The hero photograph is the gloss black set. It is the first catalogue entry
 * rather than a hard-coded path so the image, its alt text and the finish name
 * all keep coming from products.ts.
 */
const heroProduct = products[0]

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const cluster: Variants = {
  hidden: { opacity: 0, scale: 0.88, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.95, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
  },
}

interface Sticker {
  readonly text: string
  readonly className: string
}

/** Sticker badges. Every line is a verifiable fact from the catalogue. */
const stickers: readonly Sticker[] = [
  {
    text: '4,500 lb / wheel',
    className: 'top-2 left-0 rotate-[-7deg] bg-lime text-ink',
  },
  {
    text: '6-piece set',
    className: 'top-1/3 right-0 rotate-[8deg] bg-coral text-paper',
  },
  {
    text: 'Free freight',
    className: 'bottom-3 left-8 rotate-[4deg] bg-paper text-ink sm:left-12',
  },
]

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-paper via-volt-soft/45 to-haze pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Soft colour fields behind everything. Decorative only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-blob bg-lime/35 blur-3xl motion-safe:animate-blob" />
        <div className="absolute top-1/4 -right-28 h-[30rem] w-[30rem] rounded-blob bg-volt/20 blur-3xl motion-safe:animate-blob [animation-delay:-6s]" />
        <div className="absolute -bottom-40 left-1/3 h-[24rem] w-[24rem] rounded-blob bg-coral/15 blur-3xl motion-safe:animate-blob [animation-delay:-11s]" />
        <div className="absolute inset-0 noise-overlay opacity-70" />
      </div>

      <Container size="wide" className="relative">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={stagger}
          className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8"
        >
          <div className="flex flex-col items-start gap-7">
            <motion.div variants={item}>
              {/* "Shipped from", not "built in" — Purasynth specs and stocks
                  these sets, it does not manufacture them. */}
              <Eyebrow tone="volt">Shipped from Tomball, Texas</Eyebrow>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl leading-[0.94] sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Dually wheels that{' '}
              <span className="text-gradient">hit different.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl text-lg leading-relaxed text-slate sm:text-xl"
            >
              Two finishes, one spec sheet. Deep{' '}
              <strong className="font-semibold text-ink">gloss black</strong> or
              hand{' '}
              <strong className="font-semibold text-ink">mirror polish</strong>{' '}
              — both 22x8.25, both flow-formed A356-T6, both rated to 4,500 lb a
              corner. Six wheels, caps and hardware in every box.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Magnetic>
                <ButtonLink href="/shop" size="lg">
                  Shop wheels
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-200 group-hover/btn:translate-x-1"
                    strokeWidth={2.4}
                  />
                </ButtonLink>
              </Magnetic>

              <Magnetic>
                <ButtonLink href="/fitment" variant="outline" size="lg">
                  Check my fitment
                </ButtonLink>
              </Magnetic>
            </motion.div>

            {/* There is no card processing on this site — say so before the
                visitor goes looking for a checkout that takes payment. */}
            <motion.p
              variants={item}
              className="max-w-lg font-mono text-xs leading-relaxed tracking-wide text-graphite uppercase"
            >
              No card details at checkout. You place the order, the owner
              confirms your fitment, then emails an invoice with a payment link.
            </motion.p>

            <motion.a
              variants={item}
              href="#featured-wheels"
              className="mt-2 inline-flex items-center gap-3 rounded-full border-2 border-ink/15 bg-paper/70 px-5 py-2.5 font-mono text-[0.7rem] font-bold tracking-[0.22em] text-graphite uppercase transition-colors hover:border-ink hover:bg-lime-soft"
            >
              See the sets
              <ArrowDown
                className="h-4 w-4 motion-safe:animate-float-slow"
                strokeWidth={2.6}
              />
            </motion.a>
          </div>

          <motion.div
            variants={cluster}
            className="relative mx-auto w-full max-w-[30rem] lg:max-w-[34rem]"
          >
            <div className="relative aspect-square motion-safe:animate-float">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-volt-soft via-paper to-lime-soft shadow-lift"
              />
              {/* Rings spin, the photograph does not — a rotating picture of
                  two static wheels reads as a rendering glitch. */}
              <div
                aria-hidden="true"
                className="absolute inset-[3%] rounded-full border-2 border-dashed border-ink/25 motion-safe:animate-spin-slower"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[9%] rounded-full border border-volt/30 motion-safe:animate-spin-slow"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[9%] rounded-full bg-volt/10 motion-safe:animate-pulse-ring"
              />

              <div className="absolute inset-[12%]">
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30rem, (min-width: 640px) 26rem, 75vw"
                  priority
                  className="object-contain drop-shadow-[0_24px_40px_rgb(11_11_18/0.18)]"
                />
              </div>
            </div>

            {stickers.map((sticker) => (
              <span
                key={sticker.text}
                className={cn(
                  'absolute inline-flex items-center rounded-full border-2 border-ink px-4 py-2',
                  'font-mono text-[0.65rem] font-bold tracking-[0.16em] uppercase',
                  'shadow-[0_4px_0_0_var(--color-ink)] sm:text-xs',
                  sticker.className
                )}
              >
                {sticker.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
