import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

/**
 * Crawl rules.
 *
 * Only the two areas that must never be fetched at all are closed off: the
 * order dashboard and the API.
 *
 * /checkout and /order-confirmed are deliberately NOT listed. Both send
 * `noindex` through buildMetadata, and a crawler blocked here would never
 * fetch the page and so never read that header — which is exactly how a
 * disallowed URL still ends up indexed as a bare link with no title. Letting
 * the crawl through is what gets them dropped from the index.
 */
const DISALLOWED: readonly string[] = ['/admin', '/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...DISALLOWED],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
