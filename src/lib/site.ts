/**
 * Single source of truth for brand, contact and legal details.
 *
 * IMPORTANT — Purasynth is run by an individual (a sole proprietor), not an
 * incorporated business. Nothing in this file or anywhere on the site may
 * describe Purasynth as a company, corporation, Inc., LLC, "our team",
 * "our factory" or similar, and no company registration, EIN, VAT or
 * employee count is claimed. Copy should say "independently run",
 * "sole proprietor", "the owner" or "I".
 */

export interface PostalAddress {
  readonly street: string
  readonly locality: string
  readonly region: string
  readonly regionCode: string
  readonly postcode: string
  readonly country: string
  readonly countryCode: string
}

export interface SiteConfig {
  readonly name: string
  /** How the business is described in legal copy. Never a company name. */
  readonly legalName: string
  readonly businessType: string
  readonly ownerRole: string
  readonly tagline: string
  readonly description: string
  readonly shortDescription: string
  readonly url: string
  readonly email: string
  readonly address: PostalAddress
  readonly currency: 'USD'
  readonly currencySymbol: '$'
  readonly locale: string
  readonly language: string
  /** Cents. Orders at or above this ship free; both wheel sets qualify. */
  readonly freeShippingThreshold: number
  readonly standardShippingFee: number
  readonly responseWindow: string
  readonly returnsWindowDays: number
  readonly warrantyYears: number
  readonly foundedYear: number
}

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

/** Absolute origin with no trailing slash. Set NEXT_PUBLIC_SITE_URL in Netlify. */
export const SITE_URL: string = (rawUrl && rawUrl.length > 0
  ? rawUrl
  : 'https://purasynth.netlify.app'
).replace(/\/+$/, '')

export const site: SiteConfig = {
  name: 'Purasynth',
  legalName: 'Purasynth',
  businessType: 'sole proprietor',
  ownerRole: 'independently owned and operated',
  tagline: 'Dually wheels that hit different.',
  /**
   * Feeds every page's meta description, so it stays keyword-rich and under
   * ~300 characters. "specs and ships" is deliberate: Purasynth sources and
   * supplies the wheels, it does not manufacture them.
   */
  description:
    'Purasynth specs and ships heavy-duty dually wheel sets for Ford, RAM and GM one-ton trucks. Flow-formed aluminum, 4,500 lb load rating per wheel, gloss black and mirror-polished finishes, free freight across the lower 48 from Tomball, Texas. Independently run, so you talk to the owner.',
  shortDescription:
    'Heavy-duty dually wheel sets for Ford, RAM and GM one-ton trucks. Free freight, lower 48.',
  url: SITE_URL,
  email: 'support@purasynth.com',
  address: {
    street: '15422 Oxenford Dr',
    locality: 'Tomball',
    region: 'Texas',
    regionCode: 'TX',
    postcode: '77377',
    country: 'United States',
    countryCode: 'US',
  },
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en_US',
  language: 'en-US',
  freeShippingThreshold: 0,
  standardShippingFee: 0,
  responseWindow: '1 business day',
  returnsWindowDays: 30,
  warrantyYears: 2,
  foundedYear: 2024,
}

/** One-line address, e.g. for footers and meta tags. */
export const addressLine: string = [
  site.address.street,
  site.address.locality,
  `${site.address.regionCode} ${site.address.postcode}`,
  site.address.country,
].join(', ')

/** Two-line address for stacked footer / contact blocks. */
export const addressLines: readonly string[] = [
  site.address.street,
  `${site.address.locality}, ${site.address.regionCode} ${site.address.postcode}`,
  site.address.country,
]

export interface NavLink {
  readonly href: string
  readonly label: string
}

export const primaryNav: readonly NavLink[] = [
  { href: '/shop', label: 'Wheels' },
  { href: '/fitment', label: 'Fitment' },
  { href: '/about', label: 'Our Story' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export const legalNav: readonly NavLink[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
  { href: '/returns-policy', label: 'Returns & Refunds' },
  { href: '/warranty', label: 'Warranty' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/accessibility', label: 'Accessibility' },
]

export const helpNav: readonly NavLink[] = [
  { href: '/shop', label: 'All wheels' },
  { href: '/fitment', label: 'Fitment guide' },
  { href: '/faq', label: 'Help center' },
  { href: '/contact', label: 'Talk to the owner' },
  { href: '/cart', label: 'Your cart' },
]
