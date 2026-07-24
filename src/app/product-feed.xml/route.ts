import { products, type Product } from '@/lib/products'
import { absoluteUrl } from '@/lib/seo'
import { site } from '@/lib/site'
import { priceInDollars } from '@/lib/utils'

/**
 * Google Merchant Center product feed (RSS 2.0 with the `g:` namespace).
 *
 * Point a scheduled fetch in Merchant Center at `/product-feed.xml`. The feed
 * is generated from `products.ts`, so it and the site can never disagree about
 * a price. A mismatch there is what gets a Merchant account suspended.
 *
 * On identifiers: no `g:gtin` is sent because these sets carry no
 * manufacturer-assigned barcode. `g:brand` plus `g:mpn` is the accepted
 * substitute, and because that pair IS a valid identifier, `g:identifier_exists`
 * is deliberately NOT sent. Sending `identifier_exists=false` alongside an MPN
 * contradicts itself and Merchant Center flags it.
 */

export const runtime = 'nodejs'

/**
 * Vehicles & Parts > Vehicle Parts & Accessories > Motor Vehicle Parts >
 * Motor Vehicle Wheel Systems > Motor Vehicle Rims & Wheels >
 * Automotive Rims & Wheels
 *
 * Verified against Google's published taxonomy. This previously read 913,
 * which is "Vehicle Maintenance, Care & Decor" and is not wheels at all.
 * A wrong category costs impressions and can fail category-specific checks,
 * so change it only against the current taxonomy file.
 */
const GOOGLE_PRODUCT_CATEGORY = '6090'

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

/**
 * Spec rows worth sending as structured detail. The full spec table is on the
 * product page; these are the ones a shopper actually filters and compares on.
 */
const DETAIL_SPECS = new Set([
  'Diameter',
  'Width',
  'Construction',
  'Load rating',
  'Center bore',
  'Set contents',
])

function productDetails(product: Product): readonly string[] {
  return product.specs
    .filter((spec) => DETAIL_SPECS.has(spec.label))
    .flatMap((spec) => [
      '      <g:product_detail>',
      tag('g:section_name', 'Specifications', 8),
      tag('g:attribute_name', spec.label, 8),
      tag('g:attribute_value', spec.value, 8),
      '      </g:product_detail>',
    ])
}

function itemXml(product: Product): string {
  const url = absoluteUrl(`/product/${product.slug}`)

  return [
    '    <item>',
    tag('g:id', product.sku, 6),
    tag('title', product.name, 6),
    tag('description', product.description, 6),

    // Both spellings: `link` is the RSS 2.0 element, `g:link` the namespaced
    // one. Merchant Center accepts either, and different validators check
    // different ones, so sending both removes a whole class of false failure.
    tag('link', url, 6),
    tag('g:link', url, 6),
    tag('g:image_link', absoluteUrl(product.image), 6),

    tag('g:availability', product.inStock ? 'in_stock' : 'out_of_stock', 6),
    tag('g:price', `${priceInDollars(product.price)} ${site.currency}`, 6),
    tag('g:condition', 'new', 6),
    tag('g:brand', site.name, 6),
    tag('g:mpn', product.sku, 6),
    tag('g:google_product_category', GOOGLE_PRODUCT_CATEGORY, 6),
    tag('g:product_type', `Wheels > Dually Wheel Sets > ${product.finish}`, 6),

    // Category-relevant attributes. Wheels are compared on finish and metal
    // far more than on anything else in the spec table.
    tag('g:color', product.finish, 6),
    tag('g:material', 'Aluminum', 6),
    tag('g:size', `${product.diameter} x ${product.width}`, 6),
    tag('g:size_system', 'US', 6),
    tag('g:unit_pricing_measure', '6 ct', 6),
    tag('g:is_bundle', 'yes', 6),

    // Up to 10 allowed. These are the same claims made on the product page.
    ...product.highlights.map((highlight) =>
      tag('g:product_highlight', highlight, 6)
    ),

    ...productDetails(product),

    // Segments campaigns by finish without needing a second feed.
    tag('g:custom_label_0', product.finish, 6),

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
