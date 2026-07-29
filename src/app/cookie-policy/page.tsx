import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import {
  LEGAL_UPDATED_ADS,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Cookie Policy'
const PAGE_DESCRIPTION =
  'Purasynth runs the Google Ads tag, so Google advertising cookies in the _gcl_ family are set and pageviews are reported. The rest is a cart key in your own localStorage and a sign-in cookie for the owner’s order dashboard. Here is what each one does, and how to turn the advertising cookies off.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/cookie-policy',
  keywords: [
    'cookie policy',
    'google ads cookies',
    'gcl cookie',
    'advertising cookie opt out',
    'localStorage cart',
  ],
})

/**
 * Inline link out to a domain Purasynth does not control.
 *
 * Every link on this page goes somewhere a reader has to be able to check for
 * themselves (Google's own description of what it collects, and the two opt-out
 * pages), so they are deliberately shown as full addresses rather than hidden
 * behind words like "here".
 */
function ExternalLink({
  href,
  children,
}: {
  readonly href: string
  readonly children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-volt-deep underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
    >
      {children}
    </a>
  )
}

const sections: readonly LegalSection[] = [
  {
    id: 'short-version',
    heading: 'The short version',
    blocks: [
      {
        kind: 'callout',
        value:
          'This site runs the Google Ads tag. It loads a script from googletagmanager.com, sets Google advertising cookies in the _gcl_ family, and tells Google that a page here was viewed. That is how the owner can tell which ads led to orders, and it is what makes it possible to show you a Purasynth ad after you have left.',
        tone: 'volt',
      },
      {
        kind: 'text',
        value:
          'Past that, the list is short. Your cart sits in your own browser storage. A sign-in cookie exists for the order dashboard and only ever appears on the owner’s computer. There is no Google Analytics, no Meta pixel, no TikTok pixel and no session recorder. Every item is described in full below, including how to switch the advertising cookies off without breaking anything.',
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
              'A small piece of data your browser attaches to every request it sends to the site. Because it travels with each request, a server can read it. This is what advertising measurement is normally built on, and it is what the Google tag uses.',
          },
          {
            term: 'localStorage',
            detail:
              'A key-and-value store that lives in your browser and is never sent anywhere automatically. A server cannot request it. It only leaves your device if a page deliberately puts it into a request.',
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
    id: 'google-ads-tag',
    heading: 'The Google Ads tag',
    blocks: [
      {
        kind: 'text',
        value:
          'This is the one thing on the site that is not strictly necessary, so it gets the most detail.',
      },
      {
        kind: 'terms',
        items: [
          {
            term: 'Type',
            detail:
              'A third-party script, plus the cookies it writes. Not strictly necessary, and not needed to browse or to order.',
          },
          {
            term: 'Who runs it',
            detail:
              'Google. The tag reports to a Google Ads account owned by Purasynth, and Google handles that data under its own terms as well as for its own purposes.',
          },
          {
            term: 'What loads',
            detail:
              'gtag.js, fetched from www.googletagmanager.com once the page has finished loading.',
          },
          {
            term: 'What it records',
            detail:
              'That a page on this site was viewed, together with what a browser sends with any request: the page address, the page you arrived from, an approximate location derived from your IP address, and your device and browser.',
          },
          {
            term: 'Cookies it sets',
            detail:
              'The _gcl_ family, written into your browser under this site’s own domain. _gcl_au is the usual one. Google writes and reads these, not Purasynth.',
          },
          {
            term: 'Why it exists',
            detail:
              'So the owner can tell which ads actually produced orders instead of guessing at where the ad budget went, and so Purasynth ads can be shown to people who have visited the site before. That second part is remarketing.',
          },
        ],
      },
      {
        kind: 'subheading',
        value: 'How long these cookies last',
      },
      {
        kind: 'text',
        value:
          'The conversion linker cookie, _gcl_au, typically lasts about 90 days from your most recent visit. Purasynth does not pick that number. Google sets these cookies, reads them, and decides which ones exist and how long each one lives, and it can change that without anything on this site changing.',
      },
      {
        kind: 'text',
        value:
          'So rather than print a confident table of cookie names and durations here that would quietly go out of date, the honest position is this: the _gcl_ family and the roughly 90 day linker cookie are what is known, and the current authoritative list is Google’s to publish, not Purasynth’s to guess at.',
      },
      {
        kind: 'text',
        value: (
          <>
            Google sets out what it collects through tags on sites like this one,
            and what it then does with it, at{' '}
            <ExternalLink href="https://policies.google.com/technologies/partner-sites">
              policies.google.com/technologies/partner-sites
            </ExternalLink>
            . Read that if this matters to you. It covers Google’s side of the
            arrangement, which is the side Purasynth does not control.
          </>
        ),
      },
      {
        kind: 'subheading',
        value: 'Orders reported as conversions',
      },
      {
        kind: 'text',
        value:
          'The tag is also wired to report a completed order to Google as a conversion, sending the order number, the order total and the currency. The order number goes with it so that refreshing the confirmation page cannot count one order twice. No name, no email and no address is sent with it.',
      },
      {
        kind: 'text',
        value:
          'That part is switched off at the time of writing, because it needs a conversion label from Google that has not been set up yet. When it is switched on, order numbers and order values will start being sent to Google, and this section will be edited to say so on the same day rather than left standing as it is.',
      },
    ],
  },
  {
    id: 'the-cart-key',
    heading: 'Your cart: purasynth.cart.v1',
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
              'A list of product slugs, the fitment you picked and quantities. Nothing else: no name, no email, no address, no price.',
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
              'Pages on this site, in your browser. Unlike a cookie it does not travel with requests, so no server can ask for it. Any script a page loads can read localStorage in principle, and the Google tag is such a script, so worth stating plainly: Purasynth never passes your cart contents to it.',
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
    heading: 'The order dashboard: purasynth_admin',
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
        kind: 'text',
        value:
          'The Google tag is the whole of the third-party story. It is worth being specific about what did not come with it.',
      },
      {
        kind: 'bullets',
        items: [
          'No Google Analytics, no Plausible, no Fathom and no in-house visitor tracker. Measuring ad spend is the entire job of the one tag that is here.',
          'No session recording and no heatmaps. Nobody is watching a replay of your mouse.',
          'No Meta pixel, no TikTok pixel, and no social share widgets that phone home.',
          'No fingerprinting script written into this site, and no customer data bought from a data broker or sold to one.',
          'No advertising cookie is required to use the shop. Block it and browsing, fitment and checkout all work exactly the same, cart included.',
          'No fonts or stylesheets pulled from a third-party CDN. Typefaces are bundled with the site at build time, so rendering a page does not call out to another domain. The Google tag is the exception to that rule, and it is a script, described above.',
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
    id: 'consent-and-the-banner',
    heading: 'Consent, and why there is no banner',
    blocks: [
      {
        kind: 'text',
        value:
          'An earlier version of this page argued that there was nothing here to consent to. That argument no longer holds, and it is not worth pretending otherwise. An advertising cookie is exactly the sort of non-essential thing consent banners were invented for, so the question deserves a straight answer rather than a dodge.',
      },
      {
        kind: 'text',
        value:
          'Purasynth sells and ships only within the United States. US state privacy law, California’s CPRA included, is built around telling you what is happening and giving you a way to opt out, rather than asking permission before anything loads. On that basis there is no banner on this site today.',
      },
      {
        kind: 'text',
        value:
          'That is a judgement call about which rules apply to a shop that only ships to the lower 48. It is not a claim that the question is closed, and it is not legal advice. If you are reading this somewhere with a stricter rule, the objection is fair, and the practical answer is the same either way: the controls in the next section work wherever you are, and turning the tag off costs you nothing here. If a banner turns out to be the right thing to have, it will appear and this page will change with it.',
      },
    ],
  },
  {
    id: 'your-choices',
    heading: 'Turning the advertising cookies off',
    blocks: [
      {
        kind: 'text',
        value:
          'Three routes, none of which need permission from Purasynth or an email to anyone.',
      },
      {
        kind: 'bullets',
        items: [
          'Your browser. Every current browser can block or clear cookies for a single site, and most can block third-party scripts outright. Blocking cookies for this domain stops the _gcl_ family. Your cart is localStorage rather than a cookie, so it keeps working.',
          <>
            Google’s own ad settings, at{' '}
            <ExternalLink href="https://adssettings.google.com">
              adssettings.google.com
            </ExternalLink>
            . Personalised advertising can be turned off there across everything
            Google shows you, not just what comes from this site.
          </>,
          <>
            The industry opt-out at{' '}
            <ExternalLink href="https://optout.aboutads.info">
              optout.aboutads.info
            </ExternalLink>
            , which covers a list of advertising companies in one place rather
            than one at a time.
          </>,
          'A content blocker or tracker-blocking extension stops gtag.js loading at all. The site is built to work without it, so nothing on it degrades if you run one.',
        ],
      },
      {
        kind: 'text',
        value:
          'Opting out changes advertising and nothing else. It has no effect on an order already placed, on the fitment check, on the invoice, or on the warranty. Those run on email and the order record, not on a cookie.',
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
          'Clearing site data for this domain in your browser settings removes everything stored under it, the _gcl_ cookies included, with no other effect.',
          'Browsing in a private or incognito window means all of it, cart and advertising cookies alike, is thrown away when you close the window.',
          'Cookies Google holds on its own domains, from your use of Google generally, are not stored under this domain, so clearing this site will not touch them. Google’s ad settings are the place for those.',
          'Blocking storage for this site entirely still lets you browse and read every page. The cart simply will not persist between page loads.',
        ],
      },
      {
        kind: 'text',
        value: (
          <>
            Questions about anything on this page go to{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>.
            If you find something on this site setting storage that is not
            described here, that is worth telling the owner about. Please do.
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
      eyebrow="What is actually set."
      intro="This site runs the Google Ads tag, so Google sets advertising cookies and is told that you looked at a page. Alongside that there is a cart saved on your own device and a sign-in cookie only the owner ever gets. Here is each one, and how to switch the advertising off."
      path="/cookie-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED_ADS}
      sections={sections}
      tone="sky"
    />
  )
}
