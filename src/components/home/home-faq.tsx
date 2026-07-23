'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { homeFaqs } from '@/lib/faqs'
import { cn } from '@/lib/utils'

/**
 * The copy comes from lib/faqs so the same words feed the FAQPage structured
 * data emitted by the page — Google requires the markup to match what a
 * visitor can actually read.
 */
export function HomeFaq() {
  const reduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Straight answers"
              title="The questions everyone asks."
              description="Fitment, payment and freight, answered before you have to ask twice."
              tone="coral"
            />

            <div className="mt-8">
              <ButtonLink href="/faq" variant="outline" size="md">
                Read every answer
                <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1}>
            <ul className="flex flex-col gap-4">
              {homeFaqs.map((faq, index) => {
                const open = openIndex === index
                const panelId = `home-faq-panel-${index}`
                const triggerId = `home-faq-trigger-${index}`

                return (
                  <li
                    key={faq.question}
                    className={cn(
                      'rounded-lg border-2 bg-paper transition-[border-color,box-shadow] duration-300',
                      open
                        ? 'border-ink shadow-[0_5px_0_0_var(--color-ink)]'
                        : 'border-ink/10 hover:border-ink/40'
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={open}
                        // The panel is unmounted while collapsed, so pointing
                        // at its id then is a dangling reference.
                        aria-controls={open ? panelId : undefined}
                        onClick={() => setOpenIndex(open ? null : index)}
                        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-8 sm:py-6"
                      >
                        <span className="font-display text-lg leading-snug font-bold text-ink sm:text-xl">
                          {faq.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink',
                            'transition-[transform,background-color] duration-300',
                            open ? 'rotate-45 bg-lime' : 'bg-paper'
                          )}
                        >
                          <Plus className="h-4 w-4" strokeWidth={3} />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          key={panelId}
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={
                            reduceMotion ? false : { height: 0, opacity: 0 }
                          }
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="border-t-2 border-line px-6 py-5 text-[0.95rem] leading-relaxed text-slate sm:px-8 sm:py-6">
                            {faq.answer}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
