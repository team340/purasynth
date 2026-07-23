# Purasynth — working notes

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · Motion ·
Supabase · Netlify. See [README.md](README.md) for setup and deployment.

## Non-negotiable rules

These are business constraints, not preferences. Breaking one is a bug.

1. **Purasynth is a sole proprietor — one individual.** Never write "company",
   "corporation", "Inc.", "LLC", "Ltd", "our team", "our staff", "our factory",
   "headquarters" or anything implying an incorporated entity or employees. No
   registration number, EIN, VAT number or employee count. Use "independently
   run", "the owner", or first person.
2. **No invented social proof.** No testimonials, star ratings, review counts,
   "trusted by N drivers", awards or `aggregateRating` structured data. Wire real
   reviews in only when real reviews exist.
3. **No phone number.** One does not exist. Contact is `site.email` only.
4. **No payment gateway.** Nothing on the site may collect card details, show
   card-brand logos or imply a charge at checkout. The flow is: order placed →
   fitment confirmed → invoice with a payment link emailed.
5. **No dark theme.** The client asked for a light, high-energy, Gen-Z look.
   `ink` is for text, borders, small pills, the footer strip and button shadows —
   never a section background wash.
6. **Purasynth does not manufacture the wheels.** The product photos carry other
   brands' center-cap marks. Never claim in-house forging or manufacturing.

## Where things live

| Concern                        | File                                    |
| ------------------------------ | --------------------------------------- |
| Brand, address, nav, contact   | `src/lib/site.ts`                       |
| Catalogue **and all pricing**  | `src/lib/products.ts`                   |
| Design tokens and animations   | `src/app/globals.css` (`@theme` block)  |
| Metadata + every JSON-LD block | `src/lib/seo.ts`                        |
| Order validation               | `src/lib/order-schema.ts`               |
| FAQ copy (feeds page + schema) | `src/lib/faqs.ts`                       |

Tailwind v4 is CSS-first — there is **no `tailwind.config`**. Add a token to the
`@theme` block in `globals.css` and it becomes a utility class. A class that does
not resolve is silently dropped, so check `globals.css` before inventing one.
Note the radius scale is overridden and chunky: `rounded-lg` is `1.75rem`.

## Money

Prices are integers in **cents**, only in `products.ts`. `/api/order` re-prices
every basket from the catalogue and ignores client-supplied prices — never add a
code path that trusts a price from the browser.

## Server / client boundary

`src/lib/orders.ts`, `supabase.ts` and `admin-auth.ts` are
`server-only`. Types that client components need live in `src/lib/order-types.ts`
so importing a type never drags the Supabase service-role client into the browser
bundle. Keep it that way.

## Animation

Every looping animation needs a `motion-safe:` prefix, and every scripted one
should go through the components in `src/components/motion/` — they already
handle `prefers-reduced-motion`. A reduced-motion visitor must get the content,
never a frozen frame of an animation that never played.

## Next 16 gotchas

- `params` and `searchParams` are Promises. Await them.
- Motion imports come from `motion/react`, not `framer-motion`.
- A `page.tsx` that exports `metadata` cannot be `'use client'` — push the
  interactive part into a child component.
