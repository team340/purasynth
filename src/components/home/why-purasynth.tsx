import {
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { Reveal, RevealItem, Stagger } from '@/components/motion/reveal'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

interface Benefit {
  readonly title: string
  readonly body: string
  readonly icon: LucideIcon
  /** Classes for the hover flip and the bento span. */
  readonly hover: string
  readonly chip: string
  readonly span: string
}

/**
 * Every claim below is either a construction detail from products.ts or a
 * plain statement about how the shop is run. Nothing here counts customers,
 * years of experience or awards.
 */
const benefits: readonly Benefit[] = [
  {
    title: 'Flow-formed, not just cast',
    body: 'The barrel is spun under heat and pressure after casting. That aligns the grain and lets the wall run thinner at the same strength, so the wheel lands lighter than a comparable cast piece and still carries 4,500 lb.',
    icon: Zap,
    hover: 'hover:bg-volt-soft',
    chip: 'bg-volt text-paper',
    span: 'md:col-span-2',
  },
  {
    title: 'Hub-centric bores',
    body: 'Center bores are machined to the application instead of running oversized with plastic rings, so the hub carries the load rather than the studs.',
    icon: Target,
    hover: 'hover:bg-lime-soft',
    chip: 'bg-lime text-ink',
    span: '',
  },
  {
    title: 'E-coat under the powder',
    body: 'The gloss black set gets an electrocoat base before the powder goes on. That layer is what fights corrosion where road salt finds a chip.',
    icon: ShieldCheck,
    hover: 'hover:bg-sky-soft',
    chip: 'bg-sky text-ink',
    span: '',
  },
  {
    title: 'Polish, not chrome plating',
    body: 'Plating sits on top of the metal and eventually lifts, pits and peels at the edges. The Mesh 8 is the aluminum itself, hand-polished through progressive grits and sealed under UV clear coat, so a scuff buffs out instead of flaking off.',
    icon: Sparkles,
    hover: 'hover:bg-chrome-100',
    chip: 'bg-chrome-500 text-paper',
    span: 'md:col-span-2',
  },
  {
    title: 'Six wheels, not four',
    body: 'Two front, four rear, both center caps and the lug hardware for your bolt pattern. Nothing left to chase down on swap day.',
    icon: PackageCheck,
    hover: 'hover:bg-coral-soft',
    chip: 'bg-coral text-paper',
    span: '',
  },
  {
    // No phone line exists, so the heading must not evoke one — "call centre"
    // reads as a promise of phone support the site cannot keep.
    title: 'Email the owner, not a support desk',
    body: `Purasynth is ${site.ownerRole} from ${site.address.locality}, ${site.address.region}. The email you send reaches the same person who checks your fitment and books the pallet — no ticket queue, no script.`,
    icon: MessageCircle,
    hover: 'hover:bg-volt-soft',
    chip: 'bg-ink text-lime',
    span: 'md:col-span-2',
  },
]

export function WhyPurasynth() {
  return (
    <section className="bg-paper py-20 sm:py-28 lg:py-32">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Why these wheels"
            title="Details that matter long after delivery day."
            description="None of this shows up in a photo. All of it shows up the first winter, the first heavy tow, or the first time you need an answer from a human."
            tone="volt"
          />
        </Reveal>

        <Stagger
          className="mt-14 grid gap-5 sm:gap-6 md:grid-cols-3 lg:mt-20"
          stagger={0.08}
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <RevealItem key={benefit.title} className={benefit.span}>
                <article
                  className={cn(
                    'group flex h-full flex-col gap-4 rounded-lg border-2 border-ink/10 bg-cream p-7 sm:p-9',
                    'transition-[transform,background-color,border-color,box-shadow] duration-300',
                    'ease-[cubic-bezier(0.22,1.2,0.36,1)] hover:-translate-y-1.5 hover:border-ink',
                    'hover:shadow-[0_6px_0_0_var(--color-ink)]',
                    benefit.hover
                  )}
                >
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6',
                      benefit.chip
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                  </span>

                  <h3 className="text-2xl sm:text-[1.7rem]">{benefit.title}</h3>

                  <p className="text-[0.95rem] leading-relaxed text-slate">
                    {benefit.body}
                  </p>
                </article>
              </RevealItem>
            )
          })}
        </Stagger>
      </Container>
    </section>
  )
}
