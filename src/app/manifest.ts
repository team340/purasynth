import type { MetadataRoute } from 'next'

import { site } from '@/lib/site'

/**
 * Web app manifest.
 *
 * Both colours are white on purpose: the site has no dark theme, so an
 * installed window or an Android splash screen should open on paper, not on a
 * dark wash the rest of the site never uses.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Dually Wheel Sets`,
    short_name: site.name,
    description: site.shortDescription,
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: site.language,
    dir: 'ltr',
    categories: ['shopping', 'automotive'],
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'Shop wheels', url: '/shop' },
      { name: 'Check fitment', url: '/fitment' },
    ],
  }
}
