import type { FaqEntry } from '@/lib/seo'
import { site } from '@/lib/site'

/**
 * FAQ copy lives here so the same text feeds the accordion and the FAQPage
 * structured data. Google requires the markup to match what a visitor can
 * actually read on the page — keeping one source makes that automatic.
 */

export interface FaqGroup {
  readonly title: string
  readonly entries: readonly FaqEntry[]
}

export const orderingFaqs: readonly FaqEntry[] = [
  {
    question: 'How does checkout work if there is no payment gateway?',
    answer:
      'You place the order on the site with your shipping details and fitment — no card details are collected anywhere. The order lands with us straight away, we confirm the bolt pattern against your year, make and model, then email an invoice with a secure payment link. Nothing is charged until you choose to pay that invoice.',
  },
  {
    question: 'When will I hear back after placing an order?',
    answer: `Within ${site.responseWindow}. You get an on-screen order number immediately, and a reply by email once the fitment is checked. If anything about your truck changes the fitment, we raise it before an invoice goes out.`,
  },
  {
    question: 'Can I cancel after placing an order?',
    answer:
      'Yes. Because no payment is taken at checkout, cancelling before you pay the invoice costs you nothing — reply to the confirmation email and it is done. After payment, the standard returns policy applies.',
  },
  {
    question: 'Do you take financing or bank transfer?',
    answer:
      'Bank transfer, yes — account details arrive with your invoice. Financing is not something offered here as a product, but choosing "Ask about payment terms" at checkout puts the question on your order and the answer comes back with the invoice. Nothing is committed at that point either way — you are still free to walk away.',
  },
]

export const fitmentFaqs: readonly FaqEntry[] = [
  {
    question: 'Which trucks do these dually wheels fit?',
    answer:
      'Ford F-350/F-450/F-550 duallys on the 8x200mm pattern from 2005 up, GM Silverado and Sierra 3500 duallys on 8x210mm from 2011 up, and RAM 3500/4500/5500 duallys on the 8x165.1mm (8x6.5") pattern from 1994 up. A 10x225mm option covers F-450/F-550 cab and chassis trucks.',
  },
  {
    question: 'What if I do not know my bolt pattern?',
    answer:
      'Pick "Not sure — check my fitment" at checkout and add your year, make, model and trim in the vehicle box. We work it out and confirm in writing before anything ships. It is the same answer either way, we just do the looking up.',
  },
  {
    question: 'Are the wheels hub-centric?',
    answer:
      'Yes. Center bores are machined to the application rather than run oversized with plastic rings, so the hub carries the load instead of the studs. That is what keeps a loaded dually from developing a vibration at highway speed.',
  },
  {
    question: 'Do I need new tires or TPMS sensors?',
    answer:
      'You will need tires mounted to the new wheels — we ship wheels only. Existing TPMS sensors usually transfer, but a shop should check the sensor style before the swap. We can talk through what your truck needs before you order.',
  },
  {
    question: 'Is a 22x8.25 wheel legal and safe on a one-ton dually?',
    answer:
      'Yes, when the load rating matches the axle. Every Purasynth wheel is rated to 4,500 lb, which covers the rear axle ratings on current F-350, 3500 and RAM 3500 duallys. Always match tire load rating to the wheel and to the truck door-jamb sticker.',
  },
]

export const productFaqs: readonly FaqEntry[] = [
  {
    question: 'What is in a set?',
    answer:
      'Six wheels — two front, four rear — plus front and rear center caps and the lug hardware for your bolt pattern. Tires are not included.',
  },
  {
    question: 'Flow-formed or fully forged?',
    answer:
      'Flow-formed. The barrel is spun under heat and pressure after casting, which aligns the grain and lets the wall run thinner at the same strength. It lands between a plain cast wheel and a fully forged one on both weight and price, which is the honest description of it.',
  },
  {
    question: 'Will the polished finish stay bright?',
    answer:
      'The Mesh 8 is hand-polished aluminum under a UV clear coat, not chrome plating. Plating lifts and peels at the edges over time; polish is the metal itself, so scuffs buff out. Wash it like paint, avoid acid wheel cleaners, and it stays bright.',
  },
  {
    question: 'How is the gloss black finish protected?',
    answer:
      'An e-coat base under a gloss black powder coat. The e-coat is what fights corrosion where road salt gets into chips, which is the failure most black wheels actually die of.',
  },
]

export const shippingFaqs: readonly FaqEntry[] = [
  {
    question: 'How much is shipping?',
    answer:
      'Free freight to any address in the lower 48. Alaska, Hawaii and outside the US are quoted individually — email us before ordering and we come back with a real number.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Wheels leave within 1–2 business days of a paid invoice, and freight typically takes 3–7 business days on top. A tracking number comes by email as soon as the pallet is booked.',
  },
  {
    question: 'What if a wheel arrives damaged?',
    answer:
      'Photograph the pallet before the driver leaves and note the damage on the delivery paperwork. Send the photos the same day and a replacement goes out at no cost. That note on the paperwork is what makes a freight claim work.',
  },
  {
    question: 'Can I return a set?',
    answer: `Unmounted wheels in original packaging can be returned within ${site.returnsWindowDays} days. Once tires are mounted the wheels count as used and cannot be returned, which is standard across the wheel trade — check fitment before mounting.`,
  },
]

export const faqGroups: readonly FaqGroup[] = [
  { title: 'Ordering & payment', entries: orderingFaqs },
  { title: 'Fitment', entries: fitmentFaqs },
  { title: 'The wheels', entries: productFaqs },
  { title: 'Shipping & returns', entries: shippingFaqs },
]

/** Every FAQ, flattened — used for the FAQPage structured data. */
export const allFaqs: readonly FaqEntry[] = faqGroups.flatMap(
  (group) => group.entries
)

/** A short set for the home page. */
export const homeFaqs: readonly FaqEntry[] = [
  orderingFaqs[0],
  fitmentFaqs[1],
  productFaqs[0],
  shippingFaqs[0],
  productFaqs[2],
]
