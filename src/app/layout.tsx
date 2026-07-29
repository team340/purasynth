import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Mono } from 'next/font/google'

import { CartDrawer } from '@/components/cart/cart-drawer'
import { CartProvider } from '@/components/cart/cart-provider'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { GoogleAdsTag } from '@/components/analytics/google-ads'
import { ScrollProgress } from '@/components/motion/scroll-progress'
import { JsonLd } from '@/components/seo/json-ld'
import { storeSchema, websiteSchema } from '@/lib/seo'
import { SITE_URL, site } from '@/lib/site'

import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  weight: ['400', '600', '700', '800'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | Dually Wheels for Ford, RAM & GM Trucks`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'dually wheels',
    '22x8.25 dually wheels',
    'gloss black dually wheels',
    'polished dually wheels',
    'Ford F-350 dually wheels',
    'RAM 3500 dually wheels',
    'GM 3500 dually wheels',
    '8x200 dually wheels',
    'aluminum dually wheel set',
    'dually wheels Texas',
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: SITE_URL },
  formatDetection: { telephone: false, address: false, email: false },
  category: 'automotive',
  /**
   * Google property ownership. Next renders each entry as its own
   * <meta name="google-site-verification" content="..." /> in <head>.
   *
   * Two tokens, because Search Console and Merchant Center issue separate
   * ones and each looks only for its own value. Having both present is
   * expected and they do not conflict.
   *
   * Leave them in place permanently. Google re-checks ownership periodically,
   * and deleting a token drops that property's verification.
   */
  verification: {
    google: [
      // Search Console
      '-twRS9BaF-w0LEJV79cqQPl9Rd0abcMWkSyKZMpwCzo',
      // Merchant Center
      'G3pDf625jOCrjsOAznOVuapKMSdysxW3SvKkG0jl_Bc',
    ],
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: SITE_URL,
    title: `${site.name} | Dually Wheels That Hit Different`,
    description: site.shortDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Dually Wheels That Hit Different`,
    description: site.shortDescription,
  },
  robots: {
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

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jakarta.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-dvh bg-paper antialiased">
        <JsonLd data={[storeSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>

        <CartProvider>
          <ScrollProgress />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>

        <GoogleAdsTag />
      </body>
    </html>
  )
}
