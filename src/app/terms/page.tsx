import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Terms of Service'
const PAGE_DESCRIPTION = `The terms an order with Purasynth is placed under: an order is an offer until fitment is confirmed, no payment is taken on this site, wheels ship without tires or TPMS, professional installation and a 50–100 mile re-torque are required. Governed by ${site.address.region} law.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/terms',
  keywords: ['terms of service', 'wheel purchase terms', 'order terms'],
})

const sections: readonly LegalSection[] = [
  {
    id: 'who-you-are-contracting-with',
    heading: 'Who you are dealing with',
    blocks: [
      {
        kind: 'text',
        value: `Purasynth is a ${site.businessType} — one individual, ${site.ownerRole}, trading from ${site.address.locality}, ${site.address.region}. These terms govern your use of this site and any order placed through it. Placing an order means you have read them.`,
      },
      {
        kind: 'text',
        value:
          'The shipping policy, returns policy, warranty and privacy policy form part of these terms. Where a specific policy covers a topic in more detail, that policy governs.',
      },
    ],
  },
  {
    id: 'an-order-is-an-offer',
    heading: 'An order is an offer, not a contract',
    blocks: [
      {
        kind: 'text',
        value:
          'Submitting the order form on this site is you offering to buy. It does not create a binding contract by itself, and the on-screen confirmation with your order number is an acknowledgement that the request arrived — not an acceptance of it.',
      },
      {
        kind: 'text',
        value:
          'A contract is formed only when the owner has checked the fitment against your vehicle, confirmed availability, and emailed you an invoice for that order. Until that invoice exists, either side may walk away with no cost and no obligation.',
      },
      {
        kind: 'bullets',
        items: [
          'An order may be declined if the wheels do not fit the vehicle described, if the set is unavailable, if the delivery address cannot take a freight pallet, or if the order looks fraudulent.',
          'If an order is declined you are told why, in writing, and nothing has been charged because nothing could be.',
          'Cancelling before you pay the invoice costs nothing — reply to the confirmation email and it is done.',
        ],
      },
    ],
  },
  {
    id: 'no-payment-on-this-site',
    heading: 'No payment is taken on this site',
    blocks: [
      {
        kind: 'callout',
        value:
          'This site has no payment gateway. No card number, CVV, expiry date or bank detail is collected anywhere on it, and there is no field capable of accepting one. Anything asking you for card details in the name of Purasynth on this domain is not genuine — report it to the email address below.',
        tone: 'coral',
      },
      {
        kind: 'text',
        value:
          'The payment preference chosen at checkout is exactly that — a preference. It records how you would like to settle up so the invoice arrives in a usable form. It authorises nothing.',
      },
      { kind: 'subheading', value: 'How money actually moves' },
      {
        kind: 'steps',
        items: [
          'You place the order. Nothing is charged and no payment instrument is held.',
          'The owner confirms the fitment against your year, make, model and trim, and confirms the set is available.',
          `An invoice is emailed with a payment link, normally within ${site.responseWindow}.`,
          'You choose whether to pay it. Paying is what accepts the order and forms the contract.',
          'Freight is booked once the invoice is settled, and tracking follows by email.',
        ],
      },
      {
        kind: 'text',
        value:
          'An unpaid invoice expires after 14 days. Prices are re-confirmed if you come back after that, because freight and stock costs move.',
      },
    ],
  },
  {
    id: 'pricing-and-errors',
    heading: 'Pricing, taxes and errors',
    blocks: [
      {
        kind: 'text',
        value: `All prices are shown in ${site.currency} and cover a complete six-wheel set with center caps and lug hardware. Freight to the lower 48 is included in the price shown.`,
      },
      {
        kind: 'text',
        value:
          'Every basket is priced on the server from the catalogue at the moment the order is received. A price sent from a browser is ignored entirely, so a manipulated page cannot change what an order is worth.',
      },
      {
        kind: 'bullets',
        items: [
          'Prices may change at any time before an invoice is issued. The price on your invoice is the price that binds.',
          'If an obvious pricing or description error is spotted before the invoice goes out, you will be told, offered the correct price, and free to decline. An obvious error does not have to be honoured.',
          'If an error is only found after you have paid, you may either pay the difference or take a full refund. You will not be charged extra without agreeing to it first.',
          'Sales tax is applied where it is due and shown on the invoice, not estimated on the product page.',
        ],
      },
    ],
  },
  {
    id: 'fitment-responsibility',
    heading: 'Fitment is a shared responsibility',
    blocks: [
      {
        kind: 'text',
        value:
          'Fitment only works if both sides do their part, so it is worth being exact about which part is whose.',
      },
      { kind: 'subheading', value: 'What you are responsible for' },
      {
        kind: 'bullets',
        items: [
          'Giving accurate vehicle details — year, make, model, trim and any modification that changes hubs, brakes, axles or track width.',
          'Telling us about lifted, converted, re-axled or otherwise altered trucks. A changed axle changes everything downstream of it.',
          'Choosing tires with a load rating that matches the wheel and the axle ratings on your door-jamb sticker.',
          'Having a qualified shop confirm clearance to brake calipers, fenders and any aftermarket bumper or step before mounting tires.',
        ],
      },
      { kind: 'subheading', value: 'What the owner is responsible for' },
      {
        kind: 'bullets',
        items: [
          'Checking the bolt pattern, hub bore and load rating against the vehicle details you supplied, before an invoice is sent.',
          'Raising anything that looks wrong instead of shipping and hoping.',
          'Shipping the pattern that was confirmed in writing, with hardware matched to it.',
        ],
      },
      {
        kind: 'callout',
        value:
          'If a set is shipped in the wrong pattern for the vehicle you accurately described, that is our error — return shipping and a corrected set are covered in full. If the vehicle details given were wrong or incomplete, the standard returns policy applies instead.',
        tone: 'volt',
      },
    ],
  },
  {
    id: 'what-you-are-buying',
    heading: 'What you are buying — and what you are not',
    blocks: [
      {
        kind: 'text',
        value:
          'A set is six wheels: two front, four rear, plus front and rear center caps and the lug hardware for your bolt pattern.',
      },
      {
        kind: 'callout',
        value:
          'Wheels only. No tires, no TPMS sensors, no valve stems beyond what is fitted, no spacers and no adapters are supplied or sold. Existing TPMS sensors usually transfer, but the sensor style must be checked by whoever mounts the tires.',
        tone: 'lime',
      },
      {
        kind: 'text',
        value:
          'Purasynth does not manufacture wheels. Sets are built to the published specification — flow-formed A356-T6 aluminum, 4,500 lb rated per wheel — and supplied complete. Finishes are described honestly on each product page; polished aluminum is not chrome plating and is not sold as such.',
      },
      {
        kind: 'text',
        value:
          'Product photography is representative. Small variation in polish depth and powder coat texture between production runs is normal in wheel manufacturing and is not a defect.',
      },
    ],
  },
  {
    id: 'installation',
    heading: 'Installation, torque and safety',
    blocks: [
      {
        kind: 'callout',
        value:
          'Wheels must be fitted by a qualified professional workshop with equipment rated for dually wheels and tires. Fitting them yourself, or having them fitted by someone without that equipment, voids the warranty and is not something Purasynth can stand behind.',
        tone: 'coral',
      },
      {
        kind: 'bullets',
        items: [
          'Torque every lug nut to the vehicle manufacturer’s specification, in a star pattern, with a calibrated torque wrench. Never with an impact gun alone.',
          'Re-torque every nut to the same figure after 50 to 100 miles of driving. Aluminum beds into the hub face over the first heat cycles and clamp load drops as it does.',
          'Check torque again after any tire rotation, wheel removal or brake service.',
          'Match tire load rating to the wheel rating and to the axle ratings on the door-jamb sticker.',
          'Do not use acid-based wheel cleaners on any finish sold here.',
        ],
      },
      {
        kind: 'text',
        value:
          'Damage, vibration or loss caused by improper installation, missed re-torque, over-torque or under-torque is not covered by the warranty and is not the owner’s responsibility.',
      },
    ],
  },
  {
    id: 'delivery-title-and-risk',
    heading: 'Delivery, title and risk',
    blocks: [
      {
        kind: 'text',
        value:
          'Wheels ship by curbside freight. Someone aged 18 or over must be present to receive the pallet, inspect it and sign for it. Full detail is in the shipping policy.',
      },
      {
        kind: 'bullets',
        items: [
          'Title and risk of loss pass to you when the pallet is delivered and signed for.',
          'Inspect the pallet before the driver leaves. Damage must be noted on the delivery paperwork at that moment — an unqualified signature makes a freight claim almost impossible to win.',
          'Delivery dates are estimates. Freight networks are affected by weather and terminal congestion, and a delayed pallet is not itself a breach of these terms.',
        ],
      },
    ],
  },
  {
    id: 'returns-and-warranty',
    heading: 'Returns and warranty',
    blocks: [
      {
        kind: 'text',
        value: `Unmounted wheels in original packaging may be returned within ${site.returnsWindowDays} days. Once tires are mounted the wheels count as used and cannot be returned — this is standard across the wheel trade, so check fitment before anything is mounted.`,
      },
      {
        kind: 'text',
        value: `Wheels carry a ${site.warrantyYears}-year structural and finish warranty to the original purchaser. The returns policy and warranty pages set out the detail, the exclusions and how to claim, and both form part of these terms.`,
      },
    ],
  },
  {
    id: 'using-this-site',
    heading: 'Using this site',
    blocks: [
      {
        kind: 'text',
        value:
          'The site, its copy, its layout and its code belong to Purasynth. You may browse, print and share pages for your own use. You may not scrape the catalogue, republish the copy, or use the site to place fraudulent or automated orders.',
      },
      {
        kind: 'text',
        value:
          'Product photographs may show wheels bearing other manufacturers’ center-cap marks. Those marks belong to their owners and no affiliation or endorsement is implied by their appearance.',
      },
    ],
  },
  {
    id: 'limitation-of-liability',
    heading: 'Limitation of liability',
    blocks: [
      {
        kind: 'text',
        value:
          'Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be limited.',
      },
      {
        kind: 'text',
        value:
          'Subject to that, and to the fullest extent permitted by law: total liability for any claim arising out of an order is limited to the amount you actually paid for that order. Liability is excluded for indirect, incidental, special or consequential loss — including loss of use of a vehicle, towing costs, rental costs, lost income, lost contracts or missed jobs.',
      },
      {
        kind: 'text',
        value:
          'Except as stated in the warranty, the goods are supplied without further warranties of any kind, express or implied, including implied warranties of merchantability and fitness for a particular purpose, to the extent the law allows that exclusion.',
      },
      {
        kind: 'text',
        value:
          'No liability is accepted for a failure caused by something outside reasonable control — carrier failure, severe weather, strikes, supply interruption or utility outage.',
      },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    blocks: [
      {
        kind: 'text',
        value: `These terms and any dispute arising from them are governed by the laws of the State of ${site.address.region}, United States, without regard to conflict-of-law rules. The state and federal courts serving ${site.address.locality}, ${site.address.region} have exclusive jurisdiction.`,
      },
      {
        kind: 'text',
        value:
          'If any part of these terms is found unenforceable, the rest continues to apply. Not enforcing a term on one occasion is not a waiver of it.',
      },
    ],
  },
  {
    id: 'changes-and-contact',
    heading: 'Changes and contact',
    blocks: [
      {
        kind: 'text',
        value:
          'These terms may be updated. The version in force for your order is the version published on the date the order was placed, and the date at the top of this page is when the current version took effect.',
      },
      {
        kind: 'text',
        value: (
          <>
            Questions about anything on this page go to{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>.
            Purasynth is independently run, so that email reaches the person who
            makes the decisions rather than a queue.
          </>
        ),
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="The deal, in writing"
      intro="Short version: your order is a request, nobody can charge you on this site, and the wheels only ship once a person has confirmed they fit your truck. The long version is below."
      path="/terms"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="coral"
    />
  )
}
