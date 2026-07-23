import type { Metadata } from 'next'

import { ClosingCta } from '@/components/home/closing-cta'
import { FeaturedWheels } from '@/components/home/featured-wheels'
import { FitmentFinder } from '@/components/home/fitment-finder'
import { Hero } from '@/components/home/hero'
import { HomeFaq } from '@/components/home/home-faq'
import { HowItWorks } from '@/components/home/how-it-works'
import { SpecShowdown } from '@/components/home/spec-showdown'
import { TrustStrip } from '@/components/home/trust-strip'
import { WhyPurasynth } from '@/components/home/why-purasynth'
import { JsonLd } from '@/components/seo/json-ld'
import { products } from '@/lib/products'
import { buildMetadata, itemListSchema, webPageSchema } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Dually Wheels for Ford, RAM & GM Trucks'
const description =
  'Heavy-duty 22x8.25 dually wheel sets in gloss black or mirror polish. Flow-formed A356-T6 aluminum, 4,500 lb per wheel, six wheels with caps and hardware, free freight to the lower 48.'

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: '/',
  keywords: [
    'dually wheels',
    '22x8.25 dually wheels',
    'gloss black dually wheels',
    'polished dually wheels',
    'Ford F-350 dually wheels',
    'RAM 3500 dually wheels',
    'GM 3500 dually wheels',
    'aluminum dually wheel set',
    'dually wheel fitment',
  ],
})

export default function HomePage() {
  return (
    <>
      {/* No faqSchema here. /faq is the one canonical FAQPage on the site —
          emitting the same questions from several URLs risks all of them being
          dropped. The visible accordion below is unaffected. */}
      <JsonLd
        data={[
          itemListSchema(products),
          webPageSchema({
            name: `${site.name} — ${title}`,
            description,
            path: '/',
          }),
        ]}
      />

      <Hero />
      <TrustStrip />
      <FeaturedWheels />
      <FitmentFinder />
      <SpecShowdown />
      <HowItWorks />
      <WhyPurasynth />
      <HomeFaq />
      <ClosingCta />
    </>
  )
}
