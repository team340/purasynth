import type { Metadata } from 'next'

import {
  LEGAL_UPDATED,
  LegalPage,
  type LegalSection,
} from '@/components/legal/legal-page'
import { buildMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const PAGE_TITLE = 'Accessibility'
const PAGE_DESCRIPTION =
  'Purasynth targets WCAG 2.2 Level AA: reduced-motion support, visible focus states, semantic landmarks, contrast-checked colour and keyboard-operable accordions and cart drawer. Known gaps are listed honestly, and problems can be reported by email.'

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/accessibility',
  keywords: [
    'accessibility statement',
    'WCAG 2.2 AA',
    'reduced motion',
    'keyboard accessible store',
  ],
})

const sections: readonly LegalSection[] = [
  {
    id: 'commitment',
    heading: 'The commitment',
    blocks: [
      {
        kind: 'text',
        value:
          'Buying a set of wheels should not depend on being able to see a hover state, use a mouse, or tolerate a page full of moving parts. This site is built to be usable with a keyboard, with a screen reader, at high zoom, and with motion switched off entirely.',
      },
      {
        kind: 'text',
        value: `Purasynth is ${site.ownerRole} by one person, so there is no accessibility department to escalate to — but there is also nobody to go through. A problem reported by email reaches the person who can change the code, and it gets fixed rather than logged.`,
      },
    ],
  },
  {
    id: 'the-standard',
    heading: 'The standard being worked to',
    blocks: [
      {
        kind: 'text',
        value:
          'The target is the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. That is the level most commonly referenced by US accessibility law and the level this site is measured against.',
      },
      {
        kind: 'text',
        value:
          'Conformance is a claim of intent and ongoing work, not a certificate. This page is written to be checkable — if something below is not true on the page you are reading, it is a bug and it should be reported.',
      },
    ],
  },
  {
    id: 'what-has-been-done',
    heading: 'What has been done',
    blocks: [
      { kind: 'subheading', value: 'Motion and animation' },
      {
        kind: 'bullets',
        items: [
          'The site is deliberately animated, and every animation respects the prefers-reduced-motion setting in your operating system. Turn it on and scroll reveals, marquees, floating shapes, spinning graphics, counters and tilt effects all stop.',
          'Reduced motion shows the finished content immediately — never a frozen frame of an animation that never played, and never a blank space where something was meant to move.',
          'Nothing flashes more than three times per second, so there is no seizure risk from any page.',
          'No animation plays for longer than five seconds without being a decorative loop that reduced motion removes entirely.',
        ],
      },
      { kind: 'subheading', value: 'Keyboard' },
      {
        kind: 'bullets',
        items: [
          'Every interactive element is a real button, link or form control and is reachable by Tab in a logical order.',
          'A “Skip to content” link is the first thing in the tab order on every page, and it becomes visible when focused.',
          'FAQ and fitment accordions are proper disclosure buttons: Enter or Space toggles them, and Arrow Up, Arrow Down, Home and End move between the questions in a group.',
          'The cart drawer is a labelled dialog that closes on Escape and on a click outside it, and the page behind it is locked from scrolling while it is open.',
          'The mobile menu is a real navigation region with expanded state announced, and it closes on navigation.',
          'There are no keyboard traps anywhere, and no interaction depends on hover or on a pointer.',
        ],
      },
      { kind: 'subheading', value: 'Focus and visibility' },
      {
        kind: 'bullets',
        items: [
          'A 3px focus outline with an offset is applied globally, so the focused element is obvious against every background used on the site.',
          'Focus indicators are never removed for aesthetic reasons on any control.',
          'Focus order follows reading order, and content is not reordered visually in a way that breaks it.',
        ],
      },
      { kind: 'subheading', value: 'Structure and semantics' },
      {
        kind: 'bullets',
        items: [
          'Every page has one h1 and a heading order that steps down without skipping levels.',
          'Landmarks are real elements — header, nav, main, footer — and each navigation region has its own accessible name.',
          'The fitment chart uses real table markup with scoped header cells and a caption, so a screen reader can announce which column a value belongs to. Product specifications use a description list, which pairs each label with its value.',
          'Decorative graphics, blobs, spinning rings and duplicated marquee content are hidden from assistive technology, so nothing is announced twice.',
          'Product photographs carry descriptive alternative text rather than a filename.',
          'Form fields have visible labels, errors are announced and tied to the field they belong to, and no field relies on placeholder text alone.',
        ],
      },
      { kind: 'subheading', value: 'Colour and text' },
      {
        kind: 'bullets',
        items: [
          'Body and heading colours are checked against their backgrounds for at least 4.5:1 contrast, and large display type for at least 3:1.',
          'Colour is never the only way information is conveyed — status, errors and emphasis always carry text or an icon as well.',
          'Text reflows without horizontal scrolling at 320px width and at 200% browser zoom.',
          'Nothing is set in an image of text.',
        ],
      },
    ],
  },
  {
    id: 'known-gaps',
    heading: 'Known gaps',
    blocks: [
      {
        kind: 'text',
        value:
          'An accessibility statement with no gaps in it usually means nobody has looked properly. These are the ones known about right now.',
      },
      {
        kind: 'bullets',
        items: [
          'The cart drawer announces itself as a dialog and closes on Escape, but it does not yet move focus into the panel when it opens or return focus to the cart button when it closes. That is the next accessibility fix queued.',
          'Testing has been done with keyboard navigation, browser zoom, forced reduced motion and automated audits. It has not yet been through a formal audit by a third-party accessibility specialist, and it has not been tested with every screen reader and browser combination in use.',
          'Screen reader testing so far has focused on the ordering path — shop, product, cart, checkout. The long policy pages have had less attention, and feedback on how they read aloud is genuinely useful.',
          'The fitment chart is a wide table. It scrolls horizontally inside its own container on small screens, which works but is not as comfortable as a purpose-built mobile layout would be.',
          'Some decorative shapes sit behind content at unusual zoom and viewport combinations. They are hidden from assistive technology, but a visual overlap at an extreme window size is possible.',
          'Structured data and metadata are maintained by hand, so an occasional mismatch between a page and its markup is possible until it is spotted.',
        ],
      },
      {
        kind: 'text',
        value:
          'This list is updated as items are fixed and as new ones are found. If something is missing from it, that is because it has not been noticed — not because it has been dismissed.',
      },
    ],
  },
  {
    id: 'if-something-blocks-you',
    heading: 'If something on this site blocks you',
    blocks: [
      {
        kind: 'callout',
        value:
          'You never have to use the online checkout to buy a set of wheels. If any part of this site is a barrier, email the owner and the whole order can be completed by email — fitment check, invoice and freight booking included. Nothing costs more that way.',
        tone: 'volt',
      },
      {
        kind: 'text',
        value:
          'That offer stands for any reason and needs no explanation. It is the same process the site runs anyway, since a person confirms every order before an invoice goes out.',
      },
    ],
  },
  {
    id: 'reporting-a-problem',
    heading: 'Reporting a problem',
    blocks: [
      {
        kind: 'steps',
        items: [
          <>
            Email{' '}
            <strong className="font-semibold text-ink">{site.email}</strong> with
            &ldquo;Accessibility&rdquo; in the subject line.
          </>,
          'Include the page address, what you were trying to do, and what happened instead.',
          'If you can, say what you are using — browser, operating system, screen reader or other assistive technology, and whether reduced motion or high contrast is switched on. It makes a fix far quicker, and none of it is required.',
          `A reply comes within ${site.responseWindow} acknowledging the report and saying what will be done about it.`,
          'Anything that blocks a purchase is treated as urgent and fixed ahead of other work. Smaller issues get a realistic timeframe rather than a vague promise.',
        ],
      },
      {
        kind: 'text',
        value:
          'Feedback about something that is merely awkward rather than broken is welcome too. Most accessibility improvements start as somebody saying a thing was annoying.',
      },
    ],
  },
  {
    id: 'about-this-statement',
    heading: 'About this statement',
    blocks: [
      {
        kind: 'text',
        value:
          'This statement applies to every page on this website. It is reviewed whenever a significant change ships, and the date at the top of the page reflects the last review.',
      },
      {
        kind: 'text',
        value:
          'It was prepared by self-assessment using automated tooling and manual keyboard, zoom and reduced-motion testing, and it will be updated as external testing happens.',
      },
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <LegalPage
      title={PAGE_TITLE}
      eyebrow="Built to be usable"
      intro="This site is loud and heavily animated on purpose — and all of it switches off if you have asked your device for less motion. Here is what has been done, what is still missing, and how to tell the owner when something gets in your way."
      path="/accessibility"
      description={PAGE_DESCRIPTION}
      updated={LEGAL_UPDATED}
      sections={sections}
      tone="volt"
    />
  )
}
