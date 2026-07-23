import type { MetadataRoute } from 'next'

import { products } from '@/lib/products'
import { absoluteUrl } from '@/lib/seo'
import { legalNav } from '@/lib/site'

type SitemapEntry = MetadataRoute.Sitemap[number]

/**
 * Every indexable URL on the site.
 *
 * `lastModified` is one timestamp shared by every entry — the catalogue is
 * static and there is no per-page edit history to read from, so inventing
 * different dates per page would be a guess dressed up as a fact.
 */
interface PageEntry {
  readonly path: string
  readonly changeFrequency: NonNullable<SitemapEntry['changeFrequency']>
  readonly priority: number
}

const PAGES: readonly PageEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/shop', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/fitment', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const pages: readonly SitemapEntry[] = PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const productPages: readonly SitemapEntry[] = products.map((product) => ({
    url: absoluteUrl(`/product/${product.slug}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
    images: [absoluteUrl(product.image)],
  }))

  const legalPages: readonly SitemapEntry[] = legalNav.map((link) => ({
    url: absoluteUrl(link.href),
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...pages, ...productPages, ...legalPages]
}
