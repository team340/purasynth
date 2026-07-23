import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Warranty'
const PAGE_DESCRIPTION = `Purasynth dually wheels carry a ${site.warrantyYears}-year structural and finish warranty to the original purchaser. What is covered, what is not — curb damage, acid wheel cleaners, improper torque, off-road and commercial abuse — and how to claim by email with photos.`

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/warranty',
  keywords: [
    'wheel warranty',
    'dually wheel warranty',
    'wheel finish warranty',
    'structural wheel warranty',
  ],
})

const sections: readonly LegalSection[] = [
  {
    id: 'the-cover',
    heading: `${site.warrantyYears} years, structural and finish`,
    blocks: [
      {
        kind: 'text',
        value: `Every Purasynth wheel is warranted against manufacturing defects in structure and in finish for ${site.warrantyYears} years from the delivery date, to the original purchaser, on the vehicle it was confirmed to fit.`,
      },
      {
        kind: 'text',
        value:
          'This is a defect warranty. It covers wheels that were made wrong. It does not cover wheels that were damaged, neglected, modified or asked to do a job they were never rated for — and the sections below say exactly which is which, so nobody has to guess when something goes wrong.',
      },
      {
        kind: 'callout',
        value:
          'Keep your order number and the invoice email. Proof of purchase is what starts a claim, and an order number is enough — no registration card, no online form, no warranty account to create.',
        tone: 'volt',
      },
    ],
  },
  {
    id: 'structural-cover',
    heading: 'What structural cover means',
    blocks: [
      {
        kind: 'text',
        value:
          'The structural side covers the aluminum itself and how it was formed. If a wheel fails in a way that traces back to how it was cast, flow-formed or machined, it is covered.',
      },
      {
        kind: 'bullets',
        items: [
          'Cracks originating in the casting, the spokes, the hub face or the barrel that are not the result of impact.',
          'Porosity in the aluminum causing a slow leak at the bead seat.',
          'Machining faults in the center bore, the bolt circle or the lug seats.',
          'A wheel that will not balance within normal limits with a known-good tire, where runout measures outside specification.',
          'Any failure of a wheel used within its 4,500 lb per-wheel rating on a correctly loaded axle.',
        ],
      },
    ],
  },
  {
    id: 'finish-cover',
    heading: 'What finish cover means',
    blocks: [
      {
        kind: 'text',
        value:
          'The finish side covers the coating doing what a coating should not do on its own, in normal road use, with normal washing.',
      },
      {
        kind: 'bullets',
        items: [
          'Powder coat peeling, blistering or lifting away from the e-coat base without impact damage.',
          'Clear coat on polished wheels delaminating or clouding across a panel rather than at a chip.',
          'Corrosion starting under an intact coating rather than at a stone chip or curb mark.',
          'Colour or gloss failing well outside what normal UV exposure produces.',
        ],
      },
      {
        kind: 'text',
        value:
          'Some things are normal and are not defects: light gloss reduction on a black wheel over years of sun, faint swirl marks in a polished face from washing, and small variation in polish depth or powder texture between production runs.',
      },
    ],
  },
  {
    id: 'not-covered',
    heading: 'What is not covered',
    blocks: [
      {
        kind: 'text',
        value:
          'None of the below is a manufacturing defect, and none of it is covered. Being upfront about this list is the only fair way to run a warranty.',
      },
      {
        kind: 'terms',
        items: [
          {
            term: 'Curb rash and impact',
            detail:
              'Kerbs, potholes, road debris, accidents and anything else that hit the wheel. Aluminum records every one of them and none of them start in the factory.',
          },
          {
            term: 'Acid wheel cleaners',
            detail:
              'Acid-based and strongly alkaline cleaners strip clear coat and etch polished aluminum, often on the first application. Any damage consistent with chemical attack ends the finish warranty on that wheel. Wash with car shampoo and water.',
          },
          {
            term: 'Improper torque',
            detail:
              'Over-torque, under-torque, impact-gun-only fitting, wrong-seat lug nuts, and a missed re-torque at 50–100 miles. These cause cracked hub faces, elongated bolt holes and vibration, and all of them are installation faults.',
          },
          {
            term: 'Off-road and commercial abuse',
            detail:
              'Competition use, sustained off-road running, gravel-haul and other severe-service commercial duty, overloading beyond the axle rating, and towing above the vehicle manufacturer’s limits.',
          },
          {
            term: 'Aftermarket refinishing',
            detail:
              'Repainting, re-powder coating, chrome plating, polishing a coated wheel, ceramic coating over a compromised finish, or any refinish carried out after delivery. Once the original coating is disturbed the finish warranty ends.',
          },
          {
            term: 'Modification',
            detail:
              'Re-drilling the bolt pattern, machining the center bore, welding, drilling for valve stems or balance hardware, and fitting spacers or adapters of any kind.',
          },
          {
            term: 'Incorrect fitment',
            detail:
              'A wheel fitted to a vehicle it was not confirmed for, or fitted with tires whose load rating is below the axle rating.',
          },
          {
            term: 'Wear and environment',
            detail:
              'Ordinary wear, brake dust bake-on left unwashed, road salt left unwashed through a winter, and damage from flood, fire or corrosive cargo.',
          },
        ],
      },
      {
        kind: 'text',
        value:
          'Transit damage is not a warranty matter either — it is handled as a freight claim, same day, under the returns policy. That route is faster and it is fully covered when the damage was noted on the delivery paperwork.',
      },
    ],
  },
  {
    id: 'conditions',
    heading: 'Conditions of cover',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'The warranty runs to the original purchaser only, on the original order, and is not transferable if the wheels or the truck are sold.',
          'Wheels must have been fitted by a qualified professional workshop with dually-capable equipment.',
          'Lug nuts must have been torqued to the vehicle manufacturer’s specification with a calibrated torque wrench, in a star pattern, and re-torqued at 50–100 miles.',
          'Tires fitted must meet or exceed the load rating required for the axle.',
          'The wheels must have been used on the vehicle whose fitment was confirmed before shipping.',
          'Reasonable maintenance — regular washing with a pH-neutral car shampoo, and no acid wheel cleaner ever.',
        ],
      },
      {
        kind: 'text',
        value:
          'These are not fine-print traps. Every one of them is a condition a wheel needs in order to survive, and each of them is the direct cause of a failure this warranty could otherwise be blamed for.',
      },
    ],
  },
  {
    id: 'how-to-claim',
    heading: 'How to make a claim',
    blocks: [
      {
        kind: 'text',
        value:
          'Claims are made by email. There is no form, no portal and no ticket number — just send the following and it gets looked at properly.',
      },
      {
        kind: 'steps',
        items: [
          <>
            Email{' '}
            <strong className="font-semibold text-ink">{site.email}</strong> with
            &ldquo;Warranty claim&rdquo; and your order number in the subject
            line.
          </>,
          'Describe what happened and when you first noticed it, including roughly how many miles the wheels have covered.',
          'Attach photos: one wide shot of the whole wheel on the vehicle, one of the wheel off the vehicle if it has been removed, and close-ups of the affected area with something for scale.',
          'Include a photo of the whole set if the issue appears on more than one wheel — a pattern across several wheels tells a different story from a single one.',
          'Confirm who fitted the wheels and that they were torqued and re-torqued to specification. An installer’s invoice helps and is not essential.',
        ],
      },
      {
        kind: 'text',
        value: `A first response comes within ${site.responseWindow}. Photos are usually enough to reach a decision; occasionally a wheel needs to come back for inspection, and if it does, freight is arranged and paid for from this end.`,
      },
    ],
  },
  {
    id: 'the-remedy',
    heading: 'What happens if a claim is accepted',
    blocks: [
      {
        kind: 'bullets',
        items: [
          'A defective wheel is replaced with the same wheel in the same finish, at no cost, including freight both ways.',
          'If that exact wheel is no longer available, the closest equivalent is offered, or a refund of the price paid for the affected wheels — your choice.',
          'Where a defect affects the look of a matched set and a single replacement would be visibly different, the set is replaced rather than one wheel.',
          'A replacement wheel carries the remainder of the original warranty period, not a fresh one.',
        ],
      },
      {
        kind: 'text',
        value:
          'Cover is limited to the wheels themselves. Tire mounting and balancing, labour, alignment, towing, vehicle rental, lost income and any other consequential cost are not covered — see the limitation of liability section of the terms of service.',
      },
    ],
  },
  {
    id: 'your-legal-rights',
    heading: 'Your other rights',
    blocks: [
      {
        kind: 'text',
        value:
          'This warranty is given in addition to your rights under applicable US state and federal consumer law, and nothing here removes or limits a right you have by law. Some states do not allow limits on how long an implied warranty lasts, or the exclusion of incidental or consequential damages, so those limits may not apply to you.',
      },
      {
        kind: 'text',
        value: (
          <>
            Anything unclear about cover goes to{' '}
            <strong className="font-semibold text-ink">{site.email}</strong>.
            It is quicker to ask before doing something to a wheel than to find
            out afterwards that it ended the cover.
          </>
        ),
      },
    ],
  },
]

export default function WarrantyPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow={`${site.warrantyYears} years, no small print games`}
      intro={`Structure and finish, covered for ${site.warrantyYears} years from the day the pallet lands. Below is precisely what that includes, precisely what it does not, and how a claim gets handled with photos and an email.`}
      path="/warranty"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="lime"
    />
  )
}
