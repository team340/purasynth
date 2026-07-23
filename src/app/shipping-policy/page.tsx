import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Shipping Policy'
const PAGE_DESCRIPTION =
  'Free freight to the lower 48, 1–2 business day handling after a paid invoice and 3–7 business days in transit. What curbside freight delivery involves, why someone must be present, and how to inspect a pallet before signing for it.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/shipping-policy',
  keywords: [
    'wheel shipping policy',
    'freight delivery wheels',
    'curbside freight delivery',
    'free shipping dually wheels',
  ],
})

const sections: readonly LegalSection[] = [
  {
    id: 'free-freight',
    heading: 'Free freight to the lower 48',
    blocks: [
      {
        kind: 'text',
        value:
          'Every wheel set ships free to any address in the 48 contiguous United States. The price on the product page is the price of the whole pallet delivered — there is no freight line added at the invoice stage and no fuel surcharge to discover later.',
      },
      {
        kind: 'text',
        value: `Sets leave from ${site.address.locality}, ${site.address.region}, which puts most of Texas and the Gulf states within a couple of days and the coasts at the far end of the transit window.`,
      },
      {
        kind: 'callout',
        value:
          'Six 22-inch wheels weigh enough that they cannot go by parcel courier. Every order moves on a pallet by LTL freight, and that changes what delivery day looks like — the sections below are worth reading before the truck turns up.',
        tone: 'volt',
      },
    ],
  },
  {
    id: 'handling-time',
    heading: 'Handling time',
    blocks: [
      {
        kind: 'text',
        value:
          'Nothing is picked or packed until an invoice has been paid. Because no payment is taken on this site, the clock starts when your invoice clears — not when the order was submitted.',
      },
      {
        kind: 'steps',
        items: [
          'Order placed on the site. Nothing charged, nothing packed.',
          `Fitment confirmed against your vehicle and an invoice emailed, normally within ${site.responseWindow}.`,
          'Invoice paid.',
          'Wheels picked, wrapped and palletised within 1–2 business days of that payment.',
          'Freight booked and a tracking number emailed the same day the pallet is collected.',
        ],
      },
      {
        kind: 'text',
        value:
          'Business days are Monday to Friday, excluding US federal holidays. An invoice paid over a weekend is picked on the next business day.',
      },
    ],
  },
  {
    id: 'transit-time',
    heading: 'Transit time',
    blocks: [
      {
        kind: 'text',
        value:
          'Freight transit is typically 3 to 7 business days across the lower 48 once the pallet has been collected. Closer destinations land at the short end, and cross-country runs at the long end.',
      },
      {
        kind: 'bullets',
        items: [
          'Transit is measured in business days and does not include the day of collection.',
          'LTL freight moves through terminals, so a pallet can sit for a day mid-route without anything being wrong.',
          'Weather, terminal congestion and holiday volume all add days. Estimates are estimates, not guarantees, and no delivery date is promised.',
          'Rural and mountain ZIPs sometimes route through a second terminal, which adds a day or two.',
        ],
      },
    ],
  },
  {
    id: 'curbside-delivery',
    heading: 'What curbside freight delivery means',
    blocks: [
      {
        kind: 'text',
        value:
          'This is the part most first-time freight buyers are surprised by, so here it is plainly: the driver brings the pallet to the curb and no further.',
      },
      {
        kind: 'bullets',
        items: [
          'The truck is a full-size freight vehicle. It needs a road it can turn around on and enough clearance to stop safely.',
          'Delivery is to the curb or the end of the driveway — not into a garage, not up a driveway, not around the back of a property.',
          'The driver is not required to help move the pallet onto your property, and most carriers do not permit it.',
          'A liftgate lowers the pallet to ground level where one is fitted. Not every truck has one, so say at the order stage if you have no forklift or loading dock and one will be requested on the booking.',
          'Plan for two people and a hand truck, or a dolly, to move six wheels once the pallet is on the ground.',
        ],
      },
      {
        kind: 'callout',
        value:
          'If your street is narrow, gated, unpaved or has a low bridge or a weight limit, say so in the order notes. It costs nothing to flag and it is far cheaper than a failed delivery and a redelivery fee.',
        tone: 'coral',
      },
    ],
  },
  {
    id: 'someone-must-be-present',
    heading: 'Someone has to be there',
    blocks: [
      {
        kind: 'text',
        value:
          'Freight is not left unattended. An adult aged 18 or over must be present to inspect the pallet and sign for it.',
      },
      {
        kind: 'bullets',
        items: [
          'Most carriers call ahead to arrange a delivery window, which is why a working phone number is required at checkout.',
          'Answer that call. An unreachable consignee is the most common cause of a pallet sitting at a terminal.',
          'A missed delivery usually means the pallet returns to the terminal, and the carrier may charge a redelivery or storage fee. That fee is passed on at cost.',
          'You may arrange to collect from the terminal instead if that suits you better — ask and the terminal details will be sent.',
        ],
      },
    ],
  },
  {
    id: 'inspect-before-signing',
    heading: 'Inspect the pallet before you sign',
    blocks: [
      {
        kind: 'callout',
        value:
          'Signing a clean delivery receipt tells the carrier the freight arrived undamaged. Once that signature is on the paperwork, a damage claim becomes very hard to win — for you and for us. Take the two minutes.',
        tone: 'coral',
      },
      {
        kind: 'steps',
        items: [
          'Before the driver leaves, walk the pallet. Look at the shrink wrap, the corners, the strapping and the box edges.',
          'Photograph the pallet while it is still on the truck or on the ground next to it, from a few angles, with the wrap intact.',
          'Open it if anything looks wrong. You are entitled to inspect before signing.',
          'If there is any damage — even a scuff you are unsure about — write it on the delivery receipt before signing. Words like “box crushed on one corner, wheels not yet inspected” are enough and they preserve the claim.',
          `Email the photos and the noted receipt to ${site.email} the same day.`,
        ],
      },
      {
        kind: 'text',
        value:
          'With damage noted on the paperwork and same-day photos, a replacement goes out at no cost to you and the freight claim is handled on this end. Without them, the carrier will usually refuse the claim outright.',
      },
    ],
  },
  {
    id: 'missing-or-short',
    heading: 'Missing, short or refused shipments',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'Count the wheels. A set is six — two front, four rear — plus caps and hardware. If the count is short, note it on the receipt exactly as you would note damage.',
          'If a pallet is so badly damaged that it is not worth accepting, you may refuse the delivery. Write the reason on the receipt and email the same day so a replacement can be arranged immediately.',
          'Tracking that has not moved for more than three business days is worth an email. Freight can be mis-scanned, and a trace opened early is resolved far faster.',
        ],
      },
    ],
  },
  {
    id: 'addresses-and-po-boxes',
    heading: 'Addresses freight cannot reach',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'PO boxes are not possible. Freight carriers cannot deliver a pallet to a post office box, and an order with a PO box as the shipping address will be held until a street address is supplied.',
          'APO, FPO and DPO military addresses cannot be served by LTL freight either.',
          'Commercial addresses with a dock or forklift are the easiest and fastest option. If you have access to one — a workplace, a friend’s shop, your installer — using it is worth doing.',
          'Construction sites, storage yards and addresses without a permanent street presence should be flagged in the order notes before the booking is made.',
        ],
      },
    ],
  },
  {
    id: 'alaska-hawaii-international',
    heading: 'Alaska, Hawaii and outside the US',
    blocks: [
      {
        kind: 'text',
        value:
          'Free freight covers the lower 48 only. Alaska, Hawaii, Puerto Rico, the US territories and anywhere outside the United States are quoted individually, because the cost depends entirely on the route and the port.',
      },
      {
        kind: 'text',
        value: (
          <>
            Email{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>{' '}
            with your full delivery address before ordering and a real number
            comes back — not an estimate that changes later. Nothing is booked
            until you have seen and accepted that figure.
          </>
        ),
      },
      {
        kind: 'text',
        value:
          'For international orders, any duties, import taxes and customs brokerage are the buyer’s responsibility and are not included in any quote. Customs clearance timing is outside anyone’s control here.',
      },
    ],
  },
  {
    id: 'tracking-and-changes',
    heading: 'Tracking and address changes',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'A tracking number is emailed the day the pallet is collected, with the carrier name and a link.',
          'Address changes are possible while the order is still being packed. Email as early as you can.',
          'Once a pallet is in the freight network an address change becomes a carrier-side reconsignment, which usually carries a fee. That fee is passed on at cost with the carrier’s figure attached.',
        ],
      },
      {
        kind: 'text',
        value: `Anything about a shipment in progress goes to ${site.email} and is answered within ${site.responseWindow}.`,
      },
    ],
  },
]

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="Freight, explained"
      intro="Six 22-inch wheels travel on a pallet, not in a parcel van. Here is exactly how that works — the timings, what the driver will and will not do, and the two minutes at the curb that protect you if something arrives damaged."
      path="/shipping-policy"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="sky"
    />
  )
}
