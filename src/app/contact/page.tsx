import type { Metadata } from 'next'

import { ContactPanel } from '@/components/contact/contact-panel'
import { Marquee } from '@/components/motion/marquee'
import { Reveal } from '@/components/motion/reveal'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { breadcrumbSchema, buildMetadata, webPageSchema } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Contact — Email the Owner Direct'
const PAGE_DESCRIPTION = `Questions about dually wheel fitment, freight or an existing order go straight to the owner at ${site.email}. Written replies within ${site.responseWindow}. Email only — there is no phone line and no contact form.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/contact',
  keywords: [
    'contact Purasynth',
    'dually wheel fitment help',
    'dually wheels Tomball Texas',
    'wheel freight quote',
  ],
})

const TICKER = [
  'Email only',
  `Replies in ${site.responseWindow}`,
  'Fitment checked by a person',
  'No card details, ever',
  'Appointment-only address',
]

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          webPageSchema({
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            path: '/contact',
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-haze py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-blob bg-sky-soft motion-safe:animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -bottom-24 h-80 w-80 rounded-blob bg-volt-soft motion-safe:animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="noise-overlay pointer-events-none absolute inset-0 opacity-70"
        />

        <Container size="wide" className="relative">
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            className="mb-8"
          />

          <Reveal>
            <Eyebrow tone="sky">Straight to the owner</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
              Ask before you buy.{' '}
              <span className="text-gradient">Please.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl">
              Every message lands in one inbox and is answered by the person who
              runs the shop. Bolt patterns, freight to an awkward address, a
              question about an order already placed — all of it goes to the
              same address.
            </p>
          </Reveal>
        </Container>
      </section>

      <div className="border-y-2 border-ink bg-coral py-3">
        <Marquee reverse itemClassName="gap-10 pr-10">
          {TICKER.map((item) => (
            <span
              key={item}
              className="flex items-center gap-3 font-mono text-[0.72rem] font-bold tracking-[0.2em] whitespace-nowrap text-ink uppercase"
            >
              <span aria-hidden="true">◆</span>
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <ContactPanel />
    </>
  )
}
