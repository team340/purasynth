import { products, type Product } from '@/lib/products'
import { absoluteUrl } from '@/lib/seo'
import { site } from '@/lib/site'
import { priceInDollars } from '@/lib/utils'

/**
 * Google Merchant Center product feed (RSS 2.0 with the `g:` namespace).
 *
 * Point a scheduled fetch in Merchant Center at `/product-feed.xml`. The feed
 * is generated from `products.ts`, so it and the site can never disagree about
 * a price — a mismatch there is what gets a Merchant account suspended.
 *
 * No `g:gtin` is sent because these sets do not carry one, which is exactly
 * what `g:identifier_exists=false` declares. `g:mpn` still goes out as the
 * part number a buyer would quote back to us.
 */

export const runtime = 'nodejs'

/** Vehicles & Parts > … > Motor Vehicle Wheel Systems. */
const GOOGLE_PRODUCT_CATEGORY = '913'
const CACHE_CONTROL =
  'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'

/** Escape the five XML entities. `&` must go first or it double-escapes. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function tag(name: string, value: string, indent = 4): string {
  return `${' '.repeat(indent)}<${name}>${escapeXml(value)}</${name}>`
}

function itemXml(product: Product): string {
  const url = absoluteUrl(`/product/${product.slug}`)

  return [
    '    <item>',
    tag('g:id', product.sku, 6),
    tag('title', product.name, 6),
    tag('description', product.description, 6),
    tag('g:link', url, 6),
    tag('g:image_link', absoluteUrl(product.image), 6),
    tag('g:availability', product.inStock ? 'in_stock' : 'out_of_stock', 6),
    tag('g:price', `${priceInDollars(product.price)} ${site.currency}`, 6),
    tag('g:condition', 'new', 6),
    tag('g:brand', site.name, 6),
    tag('g:google_product_category', GOOGLE_PRODUCT_CATEGORY, 6),
    tag('g:identifier_exists', 'false', 6),
    tag('g:mpn', product.sku, 6),
    tag(
      'g:product_type',
      `Wheels > Dually Wheel Sets > ${product.finish}`,
      6
    ),
    '      <g:shipping>',
    tag('g:country', site.address.countryCode, 8),
    tag('g:price', `0.00 ${site.currency}`, 8),
    '      </g:shipping>',
    '    </item>',
  ].join('\n')
}

function feedXml(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    tag('title', `${site.name} dually wheel sets`),
    tag('link', site.url),
    tag('description', site.shortDescription),
    ...products.map(itemXml),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

export function GET(): Response {
  return new Response(feedXml(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
    },
  })
}
