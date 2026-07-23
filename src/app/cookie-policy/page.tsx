import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Cookie Policy'
const PAGE_DESCRIPTION =
  'Purasynth sets no advertising, retargeting or third-party analytics cookies. The only browser storage used is a cart key in your own localStorage and a sign-in cookie for the owner’s order dashboard. Here is exactly what each one does.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/cookie-policy',
  keywords: [
    'cookie policy',
    'no tracking cookies',
    'strictly necessary cookies',
    'localStorage cart',
  ],
})

const sections: readonly LegalSection[] = [
  {
    id: 'short-version',
    heading: 'The short version',
    blocks: [
      {
        kind: 'callout',
        value:
          'This site uses strictly necessary browser storage only. There is no advertising cookie, no retargeting pixel, no Google Analytics, no Meta pixel, no TikTok pixel, no heatmap recorder and no third-party tracker of any kind on any page.',
        tone: 'lime',
      },
      {
        kind: 'text',
        value:
          'Two pieces of browser storage exist across the whole site. One holds your cart on your own device. The other only ever appears on the owner’s computer, after signing in to the order dashboard. That is the complete list, and both are described in full below.',
      },
    ],
  },
  {
    id: 'the-two-kinds',
    heading: 'Cookies and localStorage are not the same thing',
    blocks: [
      {
        kind: 'text',
        value:
          'Worth separating, because most cookie policies blur the two and it matters here.',
      },
      {
        kind: 'terms',
        items: [
          {
            term: 'Cookie',
            detail:
              'A small piece of data your browser attaches to every request it sends to the site. Because it travels with each request, a server can read it. This is what tracking is normally built on.',
          },
          {
            term: 'localStorage',
            detail:
              'A key-and-value store that lives in your browser and is never sent anywhere automatically. A server cannot read it. It only leaves your device if a page deliberately puts it into a request.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'Your cart uses localStorage rather than a cookie precisely because a cart is your business until you choose to submit an order.',
      },
    ],
  },
  {
    id: 'the-cart-key',
    heading: 'Your cart — purasynth.cart.v1',
    blocks: [
      {
        kind: 'terms',
        items: [
          { term: 'Type', detail: 'localStorage entry, first-party.' },
          {
            term: 'Name',
            detail: 'purasynth.cart.v1',
          },
          {
            term: 'What it holds',
            detail:
              'A list of product slugs, the fitment you picked and quantities. Nothing else — no name, no email, no address, no price.',
          },
          {
            term: 'Why it exists',
            detail:
              'So a cart survives a page refresh, a closed tab and a return visit. Without it, opening a product page in a new tab would empty your basket.',
          },
          {
            term: 'How long it lasts',
            detail:
              'Until you empty the cart, place an order, or clear your browser storage. It has no expiry date of its own.',
          },
          {
            term: 'Who can read it',
            detail:
              'Only pages on this site, in your browser. It is never transmitted anywhere on its own, and no server can request it.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'The contents are re-checked against the catalogue every time they are read, so a stale or edited entry is discarded rather than trusted. Prices are never stored there and are always calculated on the server.',
      },
    ],
  },
  {
    id: 'the-admin-cookie',
    heading: 'The order dashboard — purasynth_admin',
    blocks: [
      {
        kind: 'terms',
        items: [
          {
            term: 'Type',
            detail: 'Cookie, first-party, HttpOnly, strictly necessary.',
          },
          { term: 'Name', detail: 'purasynth_admin' },
          {
            term: 'What it holds',
            detail:
              'A signed expiry timestamp. No name, no email, no password, no order data and nothing that identifies a customer.',
          },
          {
            term: 'Why it exists',
            detail:
              'To keep the owner signed in to the private order dashboard, so the list of orders is not open to the internet.',
          },
          {
            term: 'How long it lasts',
            detail: 'Twelve hours, then it expires and a fresh sign-in is required.',
          },
          {
            term: 'When you would ever see it',
            detail:
              'Never, as a customer. It is only set after a successful sign-in on the private dashboard, which is not linked from anywhere on the public site.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'It is marked HttpOnly, so no script can read it, and it is signed, so it cannot be forged or extended by editing it.',
      },
    ],
  },
  {
    id: 'what-is-not-here',
    heading: 'What this site does not do',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'No advertising or retargeting cookies. You will not be followed around the internet by a wheel.',
          'No third-party analytics. There is no Google Analytics, no Plausible, no Fathom and no in-house visitor tracker.',
          'No session recording or heatmaps. Nobody is watching a replay of your mouse.',
          'No social media pixels or share widgets that phone home.',
          'No cross-site identifiers, no fingerprinting, no data brokers, no audience lists.',
          'No fonts, scripts or stylesheets loaded from a third-party CDN at page load — typefaces are bundled with the site at build time, so your browser does not call out to another domain to render a page.',
        ],
      },
      {
        kind: 'text',
        value:
          'The hosting platform keeps standard server access logs for delivery and abuse prevention, as every web host does. Those are logs, not cookies, and they are not linked to a customer record. The privacy policy covers them.',
      },
    ],
  },
  {
    id: 'why-no-banner',
    heading: 'Why there is no cookie banner',
    blocks: [
      {
        kind: 'text',
        value:
          'Consent banners exist because sites want to place non-essential cookies. Strictly necessary storage — the kind without which the thing you asked for cannot work — does not require consent, and there is nothing else here to consent to.',
      },
      {
        kind: 'text',
        value:
          'Rather than show a banner asking permission for trackers that do not exist, this page tells you what the two entries are. If a non-essential cookie is ever introduced, a proper consent mechanism will appear with it and this page will change on the same day.',
      },
    ],
  },
  {
    id: 'clearing-storage',
    heading: 'Clearing it yourself',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'Emptying your cart on the cart page clears the stored entry immediately.',
          'Clearing site data for this domain in your browser settings removes everything this site has stored, with no other effect.',
          'Browsing in a private or incognito window means the cart is discarded when you close it.',
          'Blocking storage for this site entirely still lets you browse and read every page — the cart simply will not persist between page loads.',
        ],
      },
      {
        kind: 'text',
        value: (
          <>
            Questions about anything on this page go to{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>.
            If you find something on this site setting storage that is not
            described here, that is worth telling the owner about — please do.
          </>
        ),
      },
    ],
  },
]

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="Two entries. That is all."
      intro="No advertising cookies, no analytics, no pixels, no banner asking you to accept trackers that were never installed. Just a cart saved on your own device and a sign-in cookie the owner uses."
      path="/cookie-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="sky"
    />
  )
}
