import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Privacy Policy'
const PAGE_DESCRIPTION = `What Purasynth collects when you place a dually wheel order, why it is collected, where it is stored, who it is shared with, and how to have it deleted. Independently run from ${site.address.locality}, ${site.address.region}.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/privacy-policy',
  keywords: ['privacy policy', 'CCPA', 'CPRA', 'data deletion request'],
})

const sections: readonly LegalSection[] = [
  {
    id: 'who-you-are-dealing-with',
    heading: 'Who you are dealing with',
    blocks: [
      {
        kind: 'text',
        value: `Purasynth is a ${site.businessType} — one individual, ${site.ownerRole}, selling dually wheel sets online from ${site.address.locality}, ${site.address.region}. There is no team with access to your details and no third-party call centre handling your messages. The owner reads every order and every email.`,
      },
      {
        kind: 'text',
        value: `This policy explains exactly what is collected on this site, why, where it lives and how to get rid of it. Anything you want to act on in this document is handled by emailing ${site.email}.`,
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
          'Only what an order needs. There is no account system, no newsletter sign-up, no advertising pixel and no behavioural profile built on you.',
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
              'Passed to the freight carrier. Curbside freight is scheduled by phone — a delivery without a contact number gets stuck at the terminal.',
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
              'Anything you type into the notes box — access instructions, delivery constraints, questions.',
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
          'The hosting platform keeps standard server logs — IP address, timestamp, requested URL, user agent — for delivery and abuse prevention. They are not linked to an order record and are not used to profile visitors.',
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
        ],
      },
      {
        kind: 'text',
        value:
          'That is the complete list. Your details are not used for advertising, are not enriched with data bought from anyone, and are not fed into a marketing platform.',
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
            term: 'Order records — Supabase',
            detail:
              'Orders are written to a Supabase Postgres database hosted in a United States region. Access is restricted to the owner through a service-role key held as a server environment variable and never exposed to the browser.',
          },
          {
            term: 'Order alerts — Web3Forms',
            detail:
              'A copy of each order is emailed to the owner through Web3Forms, an email delivery service, so nothing sits unread waiting for someone to log in.',
          },
          {
            term: 'The site itself — Netlify',
            detail:
              'Pages and the order route run on Netlify, which keeps standard access logs on its own infrastructure.',
          },
          {
            term: 'Email threads — the owner mailbox',
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
    ],
  },
  {
    id: 'who-it-is-shared-with',
    heading: 'Who it is shared with',
    blocks: [
      {
        kind: 'text',
        value:
          'Personal information leaves the owner in exactly three situations, and each one exists to get your order to you.',
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
              'Supabase, Web3Forms and Netlify process data on the owner’s instructions in order to run the shop. They are not permitted to use it for their own purposes.',
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
        value:
          'Purasynth does not sell personal information, and does not share it for cross-context behavioural advertising. There is no advertising on this site to share it with.',
        tone: 'lime',
      },
    ],
  },
  {
    id: 'cookies-and-local-storage',
    heading: 'Cookies and local storage',
    blocks: [
      {
        kind: 'text',
        value:
          'This site sets no advertising cookies, no retargeting pixels and no third-party analytics. There is no consent banner because there is nothing to consent to beyond what is strictly necessary to run the shop.',
      },
      {
        kind: 'bullets',
        items: [
          'Your cart is held in your own browser under the localStorage key purasynth.cart.v1. It stores product slugs, chosen fitments and quantities — no personal details — and never leaves your device until you submit an order.',
          'A single cookie exists for the owner’s order dashboard. It is set only after the owner signs in, holds nothing but a signed expiry timestamp, and is never set on a customer visit.',
        ],
      },
      {
        kind: 'text',
        value:
          'Clearing your browser storage empties the cart and nothing else. The full detail is in the cookie policy.',
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
          'Purasynth applies the rights below to every US customer, regardless of which state you order from. It is simpler than checking a residency map, and you should not need to live in the right place to control your own details.',
      },
      { kind: 'subheading', value: 'California — CCPA and CPRA' },
      {
        kind: 'text',
        value:
          'If you are a California resident, the California Consumer Privacy Act as amended by the California Privacy Rights Act gives you the following rights over the personal information described in this policy.',
      },
      {
        kind: 'bullets',
        items: [
          'Right to know — what categories of personal information have been collected about you, the sources, the purpose, and the categories of third parties it was disclosed to.',
          'Right to access — a copy of the specific pieces of personal information held about you.',
          'Right to delete — deletion of personal information held about you, subject to the record-keeping exceptions in the retention section above.',
          'Right to correct — correction of anything inaccurate, such as a misspelled name or an outdated shipping address.',
          'Right to opt out of sale or sharing — nothing is sold or shared for advertising, so there is nothing to opt out of, but the request will always be honoured and confirmed in writing.',
          'Right to limit use of sensitive personal information — no sensitive personal information as the CPRA defines it is collected here.',
          'Right to non-discrimination — exercising any of these rights will never change your price, your freight cost or the service you receive.',
        ],
      },
      { kind: 'subheading', value: 'No sale, no sharing' },
      {
        kind: 'callout',
        value:
          'Purasynth has not sold or shared personal information in the preceding 12 months, and has no plans to. It has not disclosed personal information for a business purpose beyond the freight carrier and service providers named above.',
        tone: 'volt',
      },
      { kind: 'subheading', value: 'Other states' },
      {
        kind: 'text',
        value:
          'Residents of Virginia, Colorado, Connecticut, Utah, Texas and other states with comprehensive privacy laws have broadly equivalent rights of access, correction, deletion and portability. Use the same email address and the same process below — no state-specific form is needed.',
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
          'Say which right you are exercising — know, access, delete, correct or opt out — and include the email address you used to order, plus the order number if you have it.',
          'Your identity is verified by matching those details against the order record. No extra document is asked for; if the details do not match, you will be told rather than left waiting.',
          'A response comes within 45 days, and usually far sooner. If more time is genuinely needed the extension will be explained in writing before the 45 days are up.',
          'Deletion is confirmed in writing once it is done, including anything that had to be retained and the legal reason it was retained.',
        ],
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
            {site.address.postcode}, {site.address.country} — a business address,
            not a walk-in store, so email will always be faster.
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
      intro="No trackers, no advertising, no data sales. Here is every piece of information this site collects, where it goes and how to have it removed."
      path="/privacy-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="volt"
    />
  )
}
