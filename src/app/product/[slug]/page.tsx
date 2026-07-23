import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check, MapPin, ShieldCheck, Truck } from 'lucide-react'

import { Reveal } from '@/components/motion/reveal'
import { AddToCart } from '@/components/product/add-to-cart'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { ProductCard } from '@/components/product/product-card'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductTabs } from '@/components/product/product-tabs'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProductBySlug, products } from '@/lib/products'
import { breadcrumbSchema, buildMetadata, productSchema } from '@/lib/seo'
import { site } from '@/lib/site'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  /** Next 16 hands route params over as a promise. */
  readonly params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return buildMetadata({
      title: 'Wheel set not found',
      description: 'That wheel set is not in the catalogue.',
      path: '/shop',
      noIndex: true,
    })
  }

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.slug}`,
    image: product.image,
    keywords: product.keywords,
  })
}

const ASSURANCES = [
  { icon: Truck, label: 'Free freight', detail: 'Lower 48, curbside pallet' },
  {
    icon: ShieldCheck,
    label: `${site.warrantyYears}-year warranty`,
    detail: 'Structural and finish',
  },
  { icon: MapPin, label: 'Ships from Texas', detail: 'Tomball, TX' },
] as const

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const saving =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : null

  const otherProducts = products.filter((entry) => entry.slug !== product.slug)

  return (
    <>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Wheels', path: '/shop' },
            { name: product.shortName, path: `/product/${product.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 -z-10 h-[38rem] w-[38rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-haze"
        />

        <Container size="wide">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wheels', href: '/shop' },
              { label: product.shortName },
            ]}
            className="mb-10"
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery product={product} />
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow tone={product.accent === 'lime' ? 'lime' : 'volt'}>
                    {product.finish}
                  </Eyebrow>
                  {product.badge ? (
                    <span className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.16em] uppercase">
                      {product.badge}
                    </span>
                  ) : null}
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.16em] text-slate uppercase">
                    SKU {product.sku}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl">
                  {product.name}
                </h1>

                <p className="font-display text-xl font-bold text-volt-deep">
                  {product.tagline}
                </p>

                <p className="text-lg leading-relaxed text-slate">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border-2 border-ink bg-paper p-6 shadow-[0_8px_0_0_var(--color-ink)] sm:p-8">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <span className="font-display text-4xl font-extrabold sm:text-5xl">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice ? (
                    <span className="font-mono text-lg text-slate line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  ) : null}
                  {saving ? (
                    <span className="rounded-full bg-coral-deep px-4 py-1.5 font-mono text-[0.68rem] font-bold tracking-[0.16em] text-paper uppercase motion-safe:animate-pop">
                      Save {formatPrice(saving)}
                    </span>
                  ) : null}
                  <span className="font-mono text-[0.68rem] font-bold tracking-[0.16em] text-slate uppercase">
                    / set of six
                  </span>
                </div>

                <p className="rounded-lg bg-lime-soft px-5 py-4 text-[0.9rem] leading-relaxed font-medium text-graphite">
                  <span className="font-bold">No payment is taken now.</span>{' '}
                  Placing this order reserves the set. We confirm your bolt
                  pattern, then email an invoice with a secure payment link —
                  there are no card fields anywhere on this site.
                </p>

                <ul className="flex flex-col gap-2.5 py-1">
                  {product.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-[0.95rem] font-medium text-graphite"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <AddToCart product={product} />
              </div>

              <ul className="grid gap-3 sm:grid-cols-3">
                {ASSURANCES.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg bg-haze px-4 py-3.5"
                  >
                    <item.icon
                      className="h-5 w-5 shrink-0 text-volt-deep"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                    <span className="flex flex-col">
                      <span className="text-[0.85rem] font-bold text-ink">
                        {item.label}
                      </span>
                      <span className="font-mono text-[0.62rem] tracking-[0.1em] text-slate uppercase">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container size="wide">
          <SectionHeading
            eyebrow="The long version"
            title="Everything you would ask in the driveway"
            description="Construction, the full spec sheet, what lands on the pallet, and every bolt pattern this set is machined for."
            className="mb-12"
          />

          <Reveal>
            <ProductTabs product={product} />
          </Reveal>
        </Container>
      </section>

      <section className="border-t-2 border-ink bg-cream py-20 sm:py-28">
        <Container size="wide">
          <SectionHeading
            eyebrow="The other one"
            title="Same bones, different attitude"
            description="Both sets carry the same 4,500 lb rating and the same six-piece contents. If this finish is not it, the other one might be."
            tone="coral"
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {otherProducts.map((entry) => (
              <Reveal key={entry.slug} amount={0.15}>
                <ProductCard product={entry} index={1} />
              </Reveal>
            ))}

            <Reveal direction="left" delay={0.1} amount={0.15}>
              <div className="flex h-full flex-col justify-center gap-6 rounded-xl border-2 border-dashed border-ink bg-paper p-8 sm:p-10">
                <h3 className="text-3xl sm:text-4xl">
                  Still torn between the two?
                </h3>
                <p className="text-[1rem] leading-relaxed text-slate">
                  Gloss black hides brake dust and road film and reads as one
                  solid shape. Mirror polish throws light and makes the truck look
                  wider than it is, but it wants a wash more often. Same price
                  bracket, same rating, different maintenance habit.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    'Both are 22 x 8.25, six wheels per set',
                    'Both rated 4,500 lb per wheel',
                    'Both ship free to the lower 48',
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-[0.92rem] font-medium text-graphite"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-volt"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="font-mono text-[0.7rem] tracking-[0.12em] text-slate uppercase">
                  Email {site.email} and the owner will talk it through
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
