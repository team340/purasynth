import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Returns & Refunds'
const PAGE_DESCRIPTION = `Unmounted Purasynth wheels in original packaging can be returned within ${site.returnsWindowDays} days. Once tires are mounted the wheels count as used and cannot be returned. How to start a return, who pays freight, restocking, transit damage and refund timing.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/returns-policy',
  keywords: [
    'wheel returns policy',
    'return unmounted wheels',
    'wheel refund',
    'restocking fee wheels',
  ],
})

const sections: readonly LegalSection[] = [
  {
    id: 'the-window',
    heading: `The ${site.returnsWindowDays}-day window`,
    blocks: [
      {
        kind: 'text',
        value: `You have ${site.returnsWindowDays} days from the day the pallet is delivered to start a return. The request has to be raised inside that window by email. A set that turns up unannounced after the window has closed cannot be accepted.`,
      },
      {
        kind: 'text',
        value:
          'A return does not need a reason. Changed your mind about the finish, bought the wrong set, decided against the whole project: all fine, as long as the wheels come back in the condition described below.',
      },
    ],
  },
  {
    id: 'condition',
    heading: 'What can come back',
    blocks: [
      {
        kind: 'text',
        value:
          'Wheels have to return in the state they arrived in. Because they are sold as new, anything that stops them being sold as new stops them being returnable.',
      },
      { kind: 'subheading', value: 'Accepted' },
      {
        kind: 'bullets',
        items: [
          'Completely unmounted, with no tires ever fitted, not even briefly.',
          'In the original boxes with the original inserts, foam and protective film.',
          'All six wheels, both sets of center caps and all lug hardware present.',
          'No mounting marks, no test-fit scuffs on the hub face or lug seats, no curb contact.',
        ],
      },
      { kind: 'subheading', value: 'Not accepted' },
      {
        kind: 'callout',
        value:
          'Once tires have been mounted, the wheels are used. Mounting marks the bead seat and the barrel permanently, and no wheel shop anywhere can resell that as new. This is standard across the entire wheel trade, not a Purasynth rule. Confirm your fitment before anything goes near a tire machine.',
        tone: 'coral',
      },
      {
        kind: 'bullets',
        items: [
          'Wheels with tires mounted, even if the tires were removed again.',
          'Wheels that have been bolted to a vehicle and driven on.',
          'Curbed, scratched, drilled, re-drilled, refinished, powder coated or polished after delivery.',
          'Sets returned without the original packaging, which cannot survive freight a second time.',
          'Partial sets. Six wheels went out; six wheels come back.',
        ],
      },
      {
        kind: 'text',
        value:
          'A careful test fit of one front wheel, hand-tight, on a clean hub, without a tire, is not a mount and does not void the return. Say so when you raise it.',
      },
    ],
  },
  {
    id: 'how-to-start',
    heading: 'How to start a return',
    blocks: [
      {
        kind: 'steps',
        items: [
          <>
            Email{' '}
            <strong className="font-semibold text-ink">{site.email}</strong> with
            &ldquo;Return&rdquo; and your order number in the subject line.
          </>,
          'Say why it is coming back and confirm no tires were ever mounted.',
          'Attach photos of the wheels and of the boxes they are going back in. This protects you if the carrier damages them on the way.',
          'A return authorisation and the return address come back by email, normally within one business day. Do not ship anything before you have that authorisation. Unauthorised pallets cannot be identified or credited.',
          'Repack the wheels exactly as they arrived, palletise and ship. Keep the tracking number.',
          'Once the set arrives it is inspected within two business days and you are told the outcome in writing before any refund is issued.',
        ],
      },
    ],
  },
  {
    id: 'who-pays-freight',
    heading: 'Who pays the return freight',
    blocks: [
      {
        kind: 'terms',
        items: [
          {
            term: 'You changed your mind',
            detail:
              'Return freight is paid by you, at cost. The outbound freight that was included in the purchase price is not refunded, because it was already spent getting the pallet to you.',
          },
          {
            term: 'We got it wrong',
            detail:
              'Wrong pattern shipped against vehicle details you gave accurately, wrong finish, wrong set, missing hardware: a prepaid return label is sent and you pay nothing at all.',
          },
          {
            term: 'Manufacturing defect',
            detail:
              'Covered in full, including freight both ways. See the warranty page for what counts as a defect.',
          },
          {
            term: 'Damaged in transit',
            detail:
              'Covered in full, provided the damage was noted on the delivery paperwork. See the section below.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'Returns must travel by palletised freight, insured for the value of the wheels. A set shipped loose or under-insured is at your risk the whole way back, and a pallet that arrives damaged cannot be refunded in full.',
      },
    ],
  },
  {
    id: 'restocking',
    heading: 'Restocking',
    blocks: [
      {
        kind: 'text',
        value:
          'A set returned complete, unmounted and in the original packaging is refunded in full. There is no restocking fee for a clean return, because there is nothing to restock beyond putting the boxes back on the shelf.',
      },
      {
        kind: 'bullets',
        items: [
          'A restocking deduction of up to 15% applies only where the wheels come back needing work to be saleable again: missing caps or hardware, damaged packaging that has to be replaced, or handling marks that need attention.',
          'Any deduction is itemised in writing, with photos, before the refund is processed. You will never see a number appear on a refund without an explanation attached to it.',
          'If a set comes back in a condition that cannot be sold as new at all, it will be offered back to you at your cost rather than quietly scrapped.',
        ],
      },
    ],
  },
  {
    id: 'damaged-in-transit',
    heading: 'Damaged in transit',
    blocks: [
      {
        kind: 'callout',
        value:
          'Photograph the pallet before the driver leaves and write the damage on the delivery receipt. That note is what makes a freight claim work. Without it the carrier will usually refuse, and the claim becomes a fight nobody wins.',
        tone: 'coral',
      },
      {
        kind: 'steps',
        items: [
          'Note the damage on the delivery paperwork before signing, even if you have not opened the boxes yet.',
          'Photograph the pallet wrapped, the outer boxes, and each damaged wheel once unpacked.',
          `Email the photos and a copy of the noted receipt to ${site.email} the same day.`,
          'A replacement wheel or set is dispatched at no cost as soon as the photos are reviewed. You are not left waiting for the carrier to settle the claim first.',
          'Keep the damaged wheels and the packaging until the claim closes. Carriers can ask to inspect, and discarded freight ends a claim instantly.',
        ],
      },
    ],
  },
  {
    id: 'wrong-or-defective',
    heading: 'Wrong item or manufacturing defect',
    blocks: [
      {
        kind: 'text',
        value:
          'If the wrong set arrives, or a wheel has a genuine manufacturing defect, it is put right in full: replacement or refund, your choice, with freight covered both ways.',
      },
      {
        kind: 'text',
        value: `Structural and finish defects are covered for ${site.warrantyYears} years from delivery under the warranty. The warranty page sets out what counts as a defect and what counts as wear, damage or misuse, and how to claim with photos.`,
      },
    ],
  },
  {
    id: 'cancellations',
    heading: 'Cancelling before you pay',
    blocks: [
      {
        kind: 'text',
        value:
          'Because no payment is taken on this site, cancelling before the invoice is paid costs nothing and needs nothing formal. Reply to the confirmation email saying you would like to cancel and the order is closed.',
      },
      {
        kind: 'text',
        value:
          'After an invoice is paid but before the pallet is collected, a cancellation is still a full refund with no deduction. Once freight is collected it becomes a return and this policy applies.',
      },
    ],
  },
  {
    id: 'refunds',
    heading: 'Refund timing and method',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'Refunds are issued within 3 business days of the returned set being inspected and accepted.',
          'Money goes back to the original payment method used for the invoice. There is no store credit, and no alternative method is offered. Sending a refund somewhere other than where the payment came from is how refund fraud works.',
          'Once issued, the funds take a further 3 to 10 business days to appear depending on your bank or card issuer. That part is out of anyone’s hands here.',
          'A written confirmation with the refunded amount and any itemised deduction is emailed the moment the refund is sent.',
        ],
      },
      {
        kind: 'text',
        value: `Anything unclear about a refund goes to ${site.email} and is answered within ${site.responseWindow}. Independently run means there is no dispute department. The person who processed the refund is the person who replies.`,
      },
    ],
  },
]

export default function ReturnsPolicyPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="Changed your mind?"
      intro={`Unmounted wheels, original boxes, ${site.returnsWindowDays} days. The one hard limit is tires: once they are mounted the wheels are used, and no wheel shop can take them back. Everything else is below.`}
      path="/returns-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="lime"
    />
  )
}
