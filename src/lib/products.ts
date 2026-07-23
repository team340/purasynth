/**
 * The catalogue. This is the only source of truth for pricing — the order
 * route re-prices every basket from here and ignores anything the browser
 * sends, so a tampered payload cannot change what an order is worth.
 *
 * Prices are in cents. A "set" is six wheels: two front, four rear, plus
 * center caps and lug hardware.
 */

export interface Fitment {
  readonly id: string
  readonly label: string
  readonly bolt: string
  readonly trucks: string
}

export interface SpecRow {
  readonly label: string
  readonly value: string
}

export interface Product {
  readonly slug: string
  readonly sku: string
  readonly name: string
  readonly shortName: string
  readonly finish: string
  readonly tagline: string
  readonly description: string
  readonly longDescription: readonly string[]
  /** Cents. */
  readonly price: number
  /**
   * Cents. Shown struck through when higher than `price`. Only ever set this
   * to a price the set was genuinely offered at before — a comparison that
   * cannot be substantiated is a pricing claim, not a discount.
   */
  readonly compareAtPrice: number | null
  readonly image: string
  readonly imageAlt: string
  readonly accent: 'violet' | 'lime' | 'coral'
  /**
   * A verifiable property of the product, never a claim about demand, sales
   * or recency — there is no order history here to substantiate one.
   */
  readonly badge: string | null
  readonly diameter: string
  readonly width: string
  readonly loadRating: string
  readonly highlights: readonly string[]
  readonly specs: readonly SpecRow[]
  readonly inTheBox: readonly string[]
  readonly fitments: readonly Fitment[]
  readonly keywords: readonly string[]
  readonly inStock: boolean
}

/**
 * Bolt patterns shared by both wheel sets. Kept as one list because the
 * catalogue is small; split per product the moment that stops being true.
 */
const DUALLY_FITMENTS: readonly Fitment[] = [
  {
    id: 'ford-8x200',
    label: 'Ford 8x200mm',
    bolt: '8x200mm',
    trucks: 'F-350 / F-450 / F-550 dually, 2005 and newer',
  },
  {
    id: 'gm-8x210',
    label: 'GM 8x210mm',
    bolt: '8x210mm',
    trucks: 'Silverado / Sierra 3500 dually, 2011 and newer',
  },
  {
    id: 'ram-8x6.5',
    label: 'RAM 8x6.5"',
    bolt: '8x165.1mm (8x6.5")',
    trucks: 'RAM 3500 / 4500 / 5500 dually, 1994 and newer',
  },
  {
    id: 'ford-10x225',
    label: 'Ford / Freightliner 10x225mm',
    bolt: '10x225mm',
    trucks: 'F-450 / F-550 cab & chassis, M2 106',
  },
  {
    id: 'not-sure',
    label: 'Not sure, check my fitment',
    bolt: 'To be confirmed',
    trucks: 'Tell us the year, make and model and we confirm before shipping',
  },
]

export const products: readonly Product[] = [
  {
    slug: 'a127-innovator-dually-gloss-black',
    sku: 'PSY-A127-GB-2285',
    name: 'A127 Innovator Dually Wheel Set, Gloss Black',
    shortName: 'A127 Innovator',
    finish: 'Gloss Black',
    tagline: 'Blacked out, rated heavy.',
    description:
      'A six-piece 22x8.25 dually wheel set in deep gloss black. Flow-formed A356-T6 aluminum, 4,500 lb load rating per wheel, hidden-hardware front caps and a stepped-lip window face that shows brake hardware without collecting road grime.',
    longDescription: [
      'The A127 Innovator is the set for people who want the truck to read as one solid shape. Deep gloss black across the face, the barrel and the lip, with a machined window pattern that lets light through the spokes instead of flattening into a black disc under a streetlight.',
      'Every wheel is flow-formed from A356-T6 aluminum. Spinning the barrel under heat aligns the grain, which carries the same strength in a thinner wall, so each wheel lands lighter than a comparable cast piece while still rated to 4,500 lb. Less unsprung weight is less work for the suspension every mile you tow.',
      'The set ships complete: six wheels, front and rear center caps, and the lug hardware for your bolt pattern. Pick your truck at checkout and we confirm the fitment against your year, make and model before anything leaves Tomball.',
    ],
    price: 289900,
    compareAtPrice: null,
    image: '/products/a127-innovator-dually-gloss-black.webp',
    imageAlt:
      'Purasynth A127 Innovator 22x8.25 dually wheels in gloss black, front and rear faces shown',
    accent: 'violet',
    badge: 'Blacked out',
    diameter: '22"',
    width: '8.25"',
    loadRating: '4,500 lb',
    highlights: [
      'Flow-formed A356-T6 aluminum',
      '4,500 lb load rating per wheel',
      'Six-piece set with caps and hardware',
      'Free freight to the lower 48',
    ],
    specs: [
      { label: 'Diameter', value: '22 inches' },
      { label: 'Width', value: '8.25 inches' },
      { label: 'Construction', value: 'Flow-formed A356-T6 aluminum' },
      { label: 'Finish', value: 'Gloss black powder coat over e-coat base' },
      { label: 'Load rating', value: '4,500 lb per wheel' },
      { label: 'Offset', value: 'Application specific, set by bolt pattern' },
      { label: 'Center bore', value: 'Hub-centric, machined to application' },
      { label: 'Set contents', value: '6 wheels: 2 front, 4 rear' },
      { label: 'Warranty', value: '2 years, structural and finish' },
      { label: 'Ships from', value: 'Tomball, Texas' },
    ],
    inTheBox: [
      '2 front dually wheels',
      '4 rear dually wheels',
      'Front and rear center caps',
      'Lug hardware matched to your bolt pattern',
      'Torque sequence and break-in card',
    ],
    fitments: DUALLY_FITMENTS,
    keywords: [
      'dually wheels',
      'gloss black dually wheels',
      '22x8.25 dually wheels',
      '8x200 dually wheels',
      'Ford F-350 dually wheels',
      'forged look dually wheels',
    ],
    inStock: true,
  },
  {
    slug: 'mesh-8-dually-polished',
    sku: 'PSY-MSH8-PL-2285',
    name: 'Mesh 8 Dually Wheel Set, Mirror Polished',
    shortName: 'Mesh 8',
    finish: 'Mirror Polished',
    tagline: 'Chrome energy, no chrome plating.',
    description:
      'A six-piece 22x8.25 dually wheel set in hand-finished mirror polish. Twenty-spoke mesh face, 4,500 lb load rating per wheel, and a clear-coated aluminum surface that keeps its shine without the flaking that kills plated wheels.',
    longDescription: [
      'The Mesh 8 is the loud one. Twenty spokes woven into a mesh face, polished by hand through progressive grits until the aluminum throws light like a mirror, then sealed under a clear coat so it stays that way through a Texas summer and a northern winter.',
      'This is polished aluminum, not chrome plating. Plating sits on top of the metal and eventually lifts, pits and peels at the edges. Polish is the metal itself, so a scuff buffs out instead of turning into a flake. Wash it like paint and it stays bright.',
      'Same heavy-duty bones as the rest of the line: flow-formed A356-T6 barrels, 4,500 lb per wheel, hub-centric fitment machined to your application. Six wheels, caps and hardware in the box, free freight to the lower 48.',
    ],
    price: 319900,
    compareAtPrice: null,
    image: '/products/mesh-8-dually-polished.webp',
    imageAlt:
      'Purasynth Mesh 8 22x8.25 dually wheels in mirror polished aluminum, front and rear faces shown',
    accent: 'lime',
    badge: 'Mirror finish',
    diameter: '22"',
    width: '8.25"',
    loadRating: '4,500 lb',
    highlights: [
      'Hand-polished, clear-coated aluminum',
      '4,500 lb load rating per wheel',
      'Twenty-spoke mesh face',
      'Free freight to the lower 48',
    ],
    specs: [
      { label: 'Diameter', value: '22 inches' },
      { label: 'Width', value: '8.25 inches' },
      { label: 'Construction', value: 'Flow-formed A356-T6 aluminum' },
      { label: 'Finish', value: 'Hand mirror polish under UV clear coat' },
      { label: 'Load rating', value: '4,500 lb per wheel' },
      { label: 'Offset', value: 'Application specific, set by bolt pattern' },
      { label: 'Center bore', value: 'Hub-centric, machined to application' },
      { label: 'Set contents', value: '6 wheels: 2 front, 4 rear' },
      { label: 'Warranty', value: '2 years, structural and finish' },
      { label: 'Ships from', value: 'Tomball, Texas' },
    ],
    inTheBox: [
      '2 front dually wheels',
      '4 rear dually wheels',
      'Front and rear center caps',
      'Lug hardware matched to your bolt pattern',
      'Polish care and torque card',
    ],
    fitments: DUALLY_FITMENTS,
    keywords: [
      'polished dually wheels',
      'mesh dually wheels',
      '22x8.25 polished dually',
      'RAM 3500 dually wheels',
      'aluminum dually wheels',
      'mirror polished truck wheels',
    ],
    inStock: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getFitment(
  product: Product,
  fitmentId: string
): Fitment | undefined {
  return product.fitments.find((fitment) => fitment.id === fitmentId)
}

/** Every fitment offered across the catalogue, for the fitment guide page. */
export const allFitments: readonly Fitment[] = DUALLY_FITMENTS

export const productSlugs: readonly string[] = products.map((p) => p.slug)
