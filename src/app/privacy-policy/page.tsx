import type { Metadata } from 'next'
import Link from 'next/link'

import {
  LEGAL_UPDATED_ADS,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Privacy Policy'
const PAGE_DESCRIPTION = `What Purasynth collects when you place a dually wheel order, why it is collected, where it is stored, who it is shared with including Google Ads, and how to opt out of advertising or have your details deleted. Independently run from ${site.address.locality}, ${site.address.region}.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/privacy-policy',
  keywords: [
    'privacy policy',
    'CCPA',
    'CPRA',
    'data deletion request',
    'opt out of sharing',
    'Google Ads',
  ],
})

/** Inline link styling, matching the consent copy at checkout. */
const LINK_CLASS = 'font-bold text-volt-deep underline underline-offset-2'

const sections: readonly LegalSection[] = [
  {
    id: 'who-you-are-dealing-with',
    heading: 'Who you are dealing with',
    blocks: [
      {
        kind: 'text',
        value: `Purasynth is a ${site.businessType}, ${site.ownerRole} by one individual, selling dually wheel sets online from ${site.address.locality}, ${site.address.region}. There is no team with access to your details and no third-party call centre handling your messages. The owner reads every order and every email.`,
      },
      {
        kind: 'text',
        value: `This policy explains exactly what is collected on this site, why, where it lives, how to opt out of the advertising side of it and how to get rid of the rest. Anything you want to act on in this document is handled by emailing ${site.email}.`,
      },
    ],
  },
  {
    id: 'what-is-collected',
    heading: 'What is collected',
    blocks: [
      {
        kind: 'text',
        value:
          'Two separate things, and it is worth keeping them apart. An order collects only what an order needs. On top of that, a Google Ads tag runs on every page of this site, so your visit is measured for advertising whether you order anything or not. There is still no account system and no newsletter sign-up.',
      },
      { kind: 'subheading', value: 'When you place an order' },
      {
        kind: 'terms',
        items: [
          {
            term: 'Name',
            detail:
              'First and last name, so the freight paperwork and the invoice match the person receiving the pallet.',
          },
          {
            term: 'Email address',
            detail:
              'The only channel used to confirm fitment, send the invoice and share tracking.',
          },
          {
            term: 'Phone number',
            detail:
              'Passed to the freight carrier. Curbside freight is scheduled by phone, so a delivery without a contact number gets stuck at the terminal.',
          },
          {
            term: 'Shipping address',
            detail:
              'Street, city, state and ZIP, used for the freight booking and the transit estimate.',
          },
          {
            term: 'Vehicle details',
            detail:
              'Year, make, model and trim if you provide them, used only to confirm the bolt pattern before anything ships.',
          },
          {
            term: 'Order notes',
            detail:
              'Anything you type into the notes box: access instructions, delivery constraints, questions.',
          },
          {
            term: 'What you ordered',
            detail:
              'The wheel sets, quantities, chosen fitment and the prices as calculated on the server.',
          },
          {
            term: 'Payment preference',
            detail:
              'Which way you would like to settle the invoice. This is a preference, not a payment instrument.',
          },
        ],
      },
      {
        kind: 'callout',
        value:
          'No card number, CVV, expiry date or bank account number is ever collected on this site. There is no payment gateway here and no card field exists to type one into.',
        tone: 'coral',
      },
      { kind: 'subheading', value: 'When you email' },
      {
        kind: 'text',
        value:
          'Whatever you choose to put in the message, plus your email address and any photos you attach to a warranty or freight-damage claim. Those threads sit in an ordinary email mailbox.',
      },
      { kind: 'subheading', value: 'Automatically' },
      {
        kind: 'text',
        value:
          'The hosting platform keeps standard server logs (IP address, timestamp, requested URL, user agent) for delivery and abuse prevention. Those logs stay with the host, are not linked to an order record and are not used by the owner to profile anyone. The advertising tag below is a different thing entirely and works differently.',
      },
      { kind: 'subheading', value: 'Advertising: the Google Ads tag' },
      {
        kind: 'text',
        value:
          'Every page here loads the Google Ads tag (gtag.js) from googletagmanager.com and reports the pageview to a Google Ads account. It is there so the ads that bring people to this shop can be measured, and it is also what makes remarketing possible, which is why you may see a Purasynth ad on some other site after visiting this one.',
      },
      {
        kind: 'text',
        value: (
          <>
            Through that tag Google receives your IP address, your browser user
            agent, the pages you view on this site and the identifiers in its own
            advertising cookies. It does not receive your name, email address,
            phone number, shipping address or what is in your cart. The cookies
            themselves are listed one by one in the{' '}
            <Link href="/cookie-policy" className={LINK_CLASS}>
              cookie policy
            </Link>
            .
          </>
        ),
      },
      {
        kind: 'text',
        value:
          'The order confirmation page is also built to report a completed order to Google as a conversion, sending the order number and the order total so an ad can be credited with the sale. No name, no email address and no shipping address would go with it. That part is switched off at the time of writing, because it needs a conversion label from Google that has not been issued yet, so today no order detail reaches Google at all. When it is switched on, this section will be updated on the same day rather than left standing as it is.',
      },
    ],
  },
  {
    id: 'why-it-is-collected',
    heading: 'Why it is collected',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'To confirm the wheels you ordered actually fit the truck you drive, before an invoice goes out.',
          'To produce and send that invoice, and to answer questions about it.',
          'To book a freight pallet and give the carrier what it needs to reach you.',
          'To honour the returns window and the warranty, both of which need a record that the order existed.',
          'To meet US tax and business record-keeping obligations that apply to a sole proprietor.',
          'To measure which advertising brought a visitor here and to build remarketing audiences, which is the job the Google Ads tag does.',
        ],
      },
      {
        kind: 'text',
        value:
          'That is the complete list. What you type into an order is not used to target advertising: your name, email address, phone number and shipping address are never uploaded to Google or any other ad platform, are not enriched with data bought from anyone, and are not fed into a marketing platform. No order detail reaches Google today, because conversion reporting is switched off. If it is switched on, the only order details that would ever be sent are the order number and the order total. Everything else the advertising side sees is pageviews and cookie identifiers.',
      },
    ],
  },
  {
    id: 'where-it-is-stored',
    heading: 'Where it is stored',
    blocks: [
      {
        kind: 'terms',
        items: [
          {
            term: 'Order records: Supabase',
            detail:
              'Orders are written to a Supabase Postgres database hosted in a United States region. Access is restricted to the owner through a service-role key held as a server environment variable and never exposed to the browser.',
          },
          {
            term: 'The site itself: Netlify',
            detail:
              'Pages and the order route run on Netlify, which keeps standard access logs on its own infrastructure.',
          },
          {
            term: 'Email threads: the owner mailbox',
            detail:
              'Correspondence lives in a normal email mailbox, protected by a strong password and two-factor authentication.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'All of the above operate in the United States. If you are writing from outside the US, ordering means your details are handled there.',
      },
      {
        kind: 'text',
        value:
          'Advertising data is the exception to that list. What the Google Ads tag collects goes to Google and sits on Google’s own infrastructure, which the owner does not control, cannot export and cannot delete from. Google may process it outside the United States. The next section sets out what it receives and why that relationship is not the same as the three above.',
      },
    ],
  },
  {
    id: 'who-it-is-shared-with',
    heading: 'Who it is shared with',
    blocks: [
      {
        kind: 'text',
        value:
          'Personal information leaves the owner in four situations. Three of them exist to get your order to you. The fourth is advertising, it applies to every visitor rather than only to customers, and it works differently enough to be worth spelling out.',
      },
      {
        kind: 'terms',
        items: [
          {
            term: 'The freight carrier',
            detail:
              'Name, shipping address and phone number, so a truck can be dispatched and a delivery appointment arranged. Carriers receive nothing about payment.',
          },
          {
            term: 'Service providers listed above',
            detail:
              'Supabase and Netlify process data on the owner’s instructions in order to run the shop. They are not permitted to use it for their own purposes. Google is not in this category, which is why it has an entry of its own.',
          },
          {
            term: 'Google, for advertising',
            detail:
              'The Google Ads tag passes your IP address, your user agent, the pages you view here and its own cookie identifiers to Google, which uses them for ad measurement and for remarketing. Google decides how that feeds its own advertising products, so for those products it acts as an independent controller rather than a processor following the owner’s instructions. That is a real difference from the two services above, and it is why there is an opt out further down this page.',
          },
          {
            term: 'Where the law requires it',
            detail:
              'A valid legal demand, or the defence of a legal claim. This has not happened, and if it does you will be told unless the demand forbids it.',
          },
        ],
      },
      {
        kind: 'callout',
        value: (
          <>
            Purasynth does not sell personal information. Nobody pays for your
            details and they are not traded for anything else of value. Running
            Google Ads does, however, count as sharing personal information for
            cross-context behavioural advertising under the CPRA, because
            pageview data and cookie identifiers go to Google so ads can be
            targeted across other sites. Selling and sharing are two different
            things in that law, and only the second one happens here. The opt out
            is in{' '}
            <a href="#your-rights" className={LINK_CLASS}>
              your US privacy rights
            </a>
            .
          </>
        ),
        tone: 'lime',
      },
    ],
  },
  {
    id: 'cookies-and-local-storage',
    heading: 'Cookies, advertising and local storage',
    blocks: [
      {
        kind: 'text',
        value: (
          <>
            This site sets Google advertising cookies, because it runs Google
            Ads. Alongside those there is browser storage for your cart and one
            cookie for the owner’s order dashboard. Each entry is named and
            explained individually in the{' '}
            <Link href="/cookie-policy" className={LINK_CLASS}>
              cookie policy
            </Link>{' '}
            rather than duplicated here.
          </>
        ),
      },
      {
        kind: 'bullets',
        items: [
          'Google advertising cookies appear when the Ads tag loads. The _gcl_ family is written under this site’s own domain; Google may also set or read cookies on its own domains, which is outside this site’s control and not something it can list accurately. They connect a click on an ad to a visit here and they are what makes remarketing work.',
          'Your cart is held in your own browser under the localStorage key purasynth.cart.v1. It stores product slugs, chosen fitments and quantities (no personal details), never leaves your device until you submit an order, and is not shared with Google.',
          'A single cookie exists for the owner’s order dashboard. It is set only after the owner signs in, holds nothing but a signed expiry timestamp, and is never set on a customer visit.',
        ],
      },
      {
        kind: 'text',
        value:
          'There is no consent banner. US state privacy law is built on opt out rather than opt in, so what it asks for is a working way to say no, not a box to click before the page will load. Those routes are set out below, they cost nothing, and they are honoured for anyone who asks rather than California residents only.',
      },
      {
        kind: 'text',
        value:
          'Clearing your browser storage empties the cart. Clearing cookies removes the Google advertising cookies too, though they are set again on your next visit unless you block them or opt out using one of the routes below.',
      },
    ],
  },
  {
    id: 'how-long-it-is-kept',
    heading: 'How long it is kept',
    blocks: [
      {
        kind: 'terms',
        items: [
          {
            term: 'Order records',
            detail:
              'Kept for seven years from the order date, which is the record-keeping period a US sole proprietor works to for tax and warranty purposes.',
          },
          {
            term: 'Orders never invoiced or paid',
            detail:
              'Deleted within 12 months if no invoice was ever settled, unless you ask for them to go sooner.',
          },
          {
            term: 'Email threads',
            detail:
              'Kept while they are useful for warranty or dispute history, and cleared out periodically after that.',
          },
          {
            term: 'Server logs',
            detail:
              'Retained by the hosting platform on its own short rolling schedule and not archived by the owner.',
          },
          {
            term: 'Advertising cookies and ad data',
            detail:
              'Expiry is set by Google rather than by the owner, and is typically counted in months rather than days. Clearing your browser cookies removes them from your device straight away. What Google has already collected is retained on Google’s own schedule, which is why the opt-out routes below matter more than deleting a cookie once.',
          },
        ],
      },
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your US privacy rights',
    blocks: [
      {
        kind: 'text',
        value:
          'Purasynth applies the rights below to every US customer and every US visitor, regardless of which state you are in. It is simpler than checking a residency map, and you should not need to live in the right place to control your own details. The advertising opt out in particular matters to people who have never ordered anything, because the tag runs on every page.',
      },
      { kind: 'subheading', value: 'California: CCPA and CPRA' },
      {
        kind: 'text',
        value:
          'If you are a California resident, the California Consumer Privacy Act as amended by the California Privacy Rights Act gives you the following rights over the personal information described in this policy.',
      },
      {
        kind: 'bullets',
        items: [
          'Right to know: what categories of personal information have been collected about you, the sources, the purpose, and the categories of third parties it was disclosed to.',
          'Right to access: a copy of the specific pieces of personal information held about you.',
          'Right to delete: deletion of personal information held about you, subject to the record-keeping exceptions in the retention section above.',
          'Right to correct: correction of anything inaccurate, such as a misspelled name or an outdated shipping address.',
          'Right to opt out of sale or sharing: nothing is sold, but pageview data is shared with Google for cross-context behavioural advertising, and you can stop that. The routes are immediately below and the request is confirmed in writing.',
          'Right to limit use of sensitive personal information: no sensitive personal information as the CPRA defines it is collected here.',
          'Right to non-discrimination: exercising any of these rights will never change your price, your freight cost or the service you receive.',
        ],
      },
      { kind: 'subheading', value: 'No sale, but there is sharing' },
      {
        kind: 'callout',
        value:
          'Purasynth has not sold personal information in the preceding 12 months, for money or for anything else of value, and has no plans to. It does share personal information for cross-context behavioural advertising, in the specific sense the CPRA means: the Google Ads tag passes pageview data and cookie identifiers to Google. The categories involved are internet activity and device identifiers. No name, email address, phone number or shipping address goes to Google. Beyond that, personal information has been disclosed for a business purpose only to the freight carrier and the service providers named above.',
        tone: 'volt',
      },
      { kind: 'subheading', value: 'How to opt out of sharing' },
      {
        kind: 'text',
        value:
          'Four routes. Use as many as you like. None costs anything, and none of them changes your price, your freight cost or the service you get.',
      },
      {
        kind: 'bullets',
        items: [
          <>
            Email{' '}
            <strong className="font-semibold text-ink">{site.email}</strong> with
            &ldquo;Opt out of sharing&rdquo; in the subject line. No reason is
            needed, you do not have to be a California resident, and you do not
            have to have ordered anything. It is recorded against you and
            confirmed in writing. Worth being straight about what it cannot do
            on its own: the tag runs inside your browser, so an email to the
            owner cannot reach back and stop it there. Use it alongside one of
            the three routes below, which are the ones that actually stop data
            leaving your browser.
          </>,
          'Block or clear cookies for this site in your browser settings. Every major browser can do it per site, and blocking third-party cookies stops the Google advertising cookies being useful.',
          <>
            Turn off ad personalisation in your Google account at{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              https://adssettings.google.com
            </a>
            . That one applies everywhere you are signed in to Google, not just
            here.
          </>,
          <>
            Use the industry opt out at{' '}
            <a
              href="https://optout.aboutads.info"
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              https://optout.aboutads.info
            </a>
            , which covers Google along with other participating advertising
            companies, in whichever browser you set it in.
          </>,
        ],
      },
      {
        kind: 'text',
        value:
          'Browser and Google account opt outs live where you set them, so they need repeating on each browser and each device. The email route is recorded against you rather than against a browser. This site does not yet detect the Global Privacy Control signal automatically, so if your browser sends one, follow it up with the email above and it will be treated as an opt-out request.',
      },
      { kind: 'subheading', value: 'Other states' },
      {
        kind: 'text',
        value:
          'Residents of Virginia, Colorado, Connecticut, Utah, Texas and other states with comprehensive privacy laws have broadly equivalent rights of access, correction, deletion and portability. Those laws also give a right to opt out of targeted advertising, which is the same opt out described above and works the same way. Use the same email address and the same process below. No state-specific form is needed.',
      },
      { kind: 'subheading', value: 'Authorised agents' },
      {
        kind: 'text',
        value:
          'You may use an authorised agent to make a request on your behalf. The agent needs written permission from you, and you may be asked to confirm the request directly so that nobody can hand over your details by pretending to be your representative.',
      },
    ],
  },
  {
    id: 'how-to-make-a-request',
    heading: 'How to request access, correction or deletion',
    blocks: [
      {
        kind: 'steps',
        items: [
          <>
            Email <strong className="font-semibold text-ink">{site.email}</strong>{' '}
            with &ldquo;Privacy request&rdquo; in the subject line.
          </>,
          'Say which right you are exercising (know, access, delete, correct or opt out) and include the email address you used to order, plus the order number if you have it.',
          'Your identity is verified by matching those details against the order record. No extra document is asked for; if the details do not match, you will be told rather than left waiting.',
          'A response comes within 45 days, and usually far sooner. If more time is genuinely needed the extension will be explained in writing before the 45 days are up.',
          'Deletion is confirmed in writing once it is done, including anything that had to be retained and the legal reason it was retained.',
        ],
      },
      {
        kind: 'text',
        value:
          'An opt out is the one request with nothing to verify against, since honouring it reveals nothing about you and you may never have ordered. It is actioned on the strength of the email alone.',
      },
      {
        kind: 'text',
        value:
          'There is no charge for any of this, and no limit on how often you may ask.',
      },
    ],
  },
  {
    id: 'children',
    heading: "Children's privacy",
    blocks: [
      {
        kind: 'text',
        value:
          'This is a shop selling heavy-duty truck wheels to licensed drivers and trade buyers. It is not directed at children, and personal information is not knowingly collected from anyone under 16.',
      },
      {
        kind: 'text',
        value: `If you believe a child has submitted details here, email ${site.email} and the record will be deleted without needing a formal request.`,
      },
    ],
  },
  {
    id: 'security',
    heading: 'How it is protected',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'The whole site is served over HTTPS, so anything you submit is encrypted in transit.',
          'Database credentials live in server-side environment variables and are never included in the browser bundle.',
          'The order dashboard sits behind a password with a signed, HttpOnly session cookie and no public sign-up.',
          'Order submissions are validated and re-priced on the server, so a tampered request cannot alter an order or reach the database unchecked.',
          'No card data exists to protect, because none is ever collected.',
        ],
      },
      {
        kind: 'text',
        value:
          'No system is perfect. If something goes wrong that affects your details, you will be told by email promptly and told plainly what happened.',
      },
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    blocks: [
      {
        kind: 'text',
        value:
          'If this policy changes, the date at the top of the page changes with it and the previous wording stops applying from that date. A change that materially affects existing customers will also be emailed to anyone with an open order.',
      },
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    blocks: [
      {
        kind: 'text',
        value: (
          <>
            Privacy questions, requests and complaints all go to{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>.
            Postal correspondence can be sent to {site.address.street},{' '}
            {site.address.locality}, {site.address.regionCode}{' '}
            {site.address.postcode}, {site.address.country}. That is a business
            address, not a walk-in store, so email will always be faster.
          </>
        ),
      },
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="Your details, plainly"
      intro="This site runs Google Ads, so advertising cookies are set and pageview data goes to Google. Nothing is sold. Here is every piece of information this site collects, where it goes, how to opt out of the advertising and how to have the rest removed."
      path="/privacy-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED_ADS}
      sections={sections}
      tone="volt"
    />
  )
}
