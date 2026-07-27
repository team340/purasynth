import type { Metadata } from 'next'

import type { Product } from '@/lib/products'
import { SITE_URL, site } from '@/lib/site'
import { priceInDollars } from '@/lib/utils'

interface PageMetaInput {
  readonly title: string
  readonly description: string
  readonly path: string
  readonly image?: string
  readonly keywords?: readonly string[]
  readonly noIndex?: boolean
  readonly type?: 'website' | 'article'
}

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Build page metadata with a canonical URL, Open Graph and Twitter cards.
 * Every page should use this so nothing ships without a canonical tag.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = '/opengraph-image',
  keywords,
  noIndex = false,
  type = 'website',
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      url,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteUrl(image)],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.regionCode,
  postalCode: site.address.postcode,
  addressCountry: site.address.countryCode,
} as const

/**
 * Store-level structured data.
 *
 * Deliberately modelled as an OnlineStore with contact and address details
 * only. No legal entity, registration number, EIN, VAT number or employee
 * count is claimed, because Purasynth is run by an individual as a sole
 * proprietor. `openingHours` is also omitted — this is a shipping address,
 * not a walk-in showroom, and claiming hours would invite a wasted trip.
 */
export function storeSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${SITE_URL}/#store`,
    name: site.name,
    url: SITE_URL,
    description: site.description,
    email: site.email,
    address: postalAddress,
    areaServed: { '@type': 'Country', name: 'United States' },
    currenciesAccepted: site.currency,
    paymentAccepted: 'Invoice, bank transfer, card link',
    slogan: site.tagline,
    foundingDate: String(site.foundedYear),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: site.email,
      areaServed: 'US',
      availableLanguage: 'English',
    },
  }
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    description: site.description,
    inLanguage: site.language,
    publisher: { '@id': `${SITE_URL}/#store` },
  }
}

/**
 * Product structured data.
 *
 * Note: no aggregateRating or review markup is emitted. Review rich results
 * must be backed by genuine customer reviews — inventing them here would be a
 * Google policy violation and could get the site penalised. Wire this up once
 * real reviews exist.
 */
export function productSchema(product: Product): Record<string, unknown> {
  const url = absoluteUrl(`/product/${product.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: product.description,
    // The white-plate version, matching the Merchant feed. Google reads this
    // for rich results and free listings, so it should not disagree with the
    // feed, and a transparent cutout can be composited onto black here too.
    image: [absoluteUrl(product.feedImage)],
    url,
    brand: { '@type': 'Brand', name: site.name },
    category: 'Automotive Wheels',
    additionalProperty: product.specs.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    })),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: site.currency,
      price: priceInDollars(product.price),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#store` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: site.currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'US',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: site.returnsWindowDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  }
}

export interface BreadcrumbEntry {
  readonly name: string
  readonly path: string
}

export function breadcrumbSchema(
  entries: readonly BreadcrumbEntry[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  }
}

export interface FaqEntry {
  readonly question: string
  readonly answer: string
}

export function faqSchema(entries: readonly FaqEntry[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  }
}

export function itemListSchema(
  products: readonly Product[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Purasynth dually wheel sets',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  }
}

/** Marks a page as part of the site, for pages with no richer type. */
export function webPageSchema(input: {
  readonly name: string
  readonly description: string
  readonly path: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: site.language,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#store` },
  }
}
