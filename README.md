# Purasynth

Storefront for **Purasynth** — heavy-duty dually wheel sets for Ford, RAM and GM
one-ton trucks. Independently run by a sole proprietor in Tomball, Texas.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion ·
Supabase · deployed on Netlify.

---

## How an order actually works

There is **no payment gateway on this site**. Nothing on any page collects card
details, and nothing is ever charged at checkout.

```
customer fills the checkout form
        ↓
POST /api/order   →  basket is re-priced server-side from src/lib/products.ts
        ↓
order row inserted into Supabase          (must succeed, or the customer sees an error)
        ↓
email alert fired via Web3Forms           (best effort — never fails a saved order)
        ↓
owner confirms fitment, then emails an invoice with a secure payment link
```

The customer sees an order number immediately at `/order-confirmed`. The owner
sees the order two ways: an email in the inbox, and the dashboard at `/admin`.

---

## Getting it running locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The site runs without any environment variables — the catalogue, every page and
the cart all work. What breaks without them:

| Missing                                        | Effect                                                        |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`   | Checkout returns a 502 and tells the customer to email instead |
| `WEB3FORMS_ACCESS_KEY`                         | No email alert. Orders still save and still show in `/admin`   |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`      | `/admin` shows a setup notice and refuses to log anyone in     |
| `NEXT_PUBLIC_SITE_URL`                         | Canonicals and the sitemap fall back to the Netlify subdomain  |

---

## One-time setup

### 1. Supabase (order storage)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy **Project URL** → `SUPABASE_URL`.
4. Copy **service_role** key (Settings → API) → `SUPABASE_SERVICE_ROLE_KEY`.

The `orders` table has Row Level Security enabled with **no policies**, so the
anon and publishable keys can read and write nothing at all. Only the service
role key gets in, and it is used exclusively from `server-only` modules.

> Never give the service role key a `NEXT_PUBLIC_` prefix. That would ship your
> customers' names, phone numbers and addresses to every visitor's browser.

### 2. Web3Forms (order email alerts)

1. Go to [web3forms.com](https://web3forms.com), enter the inbox that should
   receive order alerts, and copy the access key it gives you.
2. Set `WEB3FORMS_ACCESS_KEY` and, if it differs, `ORDER_NOTIFICATION_EMAIL`.

No account, no SMTP credentials, no verified sending domain needed.

### 3. Admin dashboard

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use that for `ADMIN_SESSION_SECRET`, and pick a long random `ADMIN_PASSWORD`
(12 characters minimum — shorter values are rejected and the dashboard stays
locked). Sessions last 12 hours and the cookie is HttpOnly and signed; changing
the password signs every session out.

---

## Deploying to Netlify

1. Push to GitHub.
2. Netlify → **Add new site** → **Import an existing project** → pick the repo.
3. Netlify reads [`netlify.toml`](netlify.toml) and detects Next.js — leave the
   build command and publish directory as they are.
4. Add every variable from `.env.example` under **Site configuration →
   Environment variables**.
5. Set `NEXT_PUBLIC_SITE_URL` to the real origin once the domain is attached,
   then trigger a redeploy so canonicals and the sitemap pick it up.

---

## Project layout

```
src/
  app/
    api/order/            order intake — validates, re-prices, saves, alerts
    api/admin/            login, logout, order list + status updates
    product/[slug]/       product detail, statically generated
    admin/                order dashboard behind a password
    product-feed.xml/     Google Merchant Center feed
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx
  components/
    home/ product/ cart/ checkout/ admin/ legal/ faq/ contact/
    ui/                   Container, Button, Eyebrow, SectionHeading
    motion/               Reveal, Marquee, Magnetic, TiltCard, CountUp
    seo/                  JsonLd
  lib/
    site.ts               brand, address, nav — single source of truth
    products.ts           the catalogue AND the only source of pricing
    order-schema.ts       zod schema shared by the form and the API
    orders.ts             Supabase writes (server-only)
    notify.ts             Web3Forms alerts (server-only, never throws)
    admin-auth.ts         signed-cookie session for one operator
    seo.ts                metadata builders + every JSON-LD block
supabase/schema.sql       run this once in the Supabase SQL editor
```

### Changing prices

Prices live in `src/lib/products.ts` in **cents**, and nowhere else. The order
API re-prices every basket from that file and ignores whatever the browser sent,
so editing it is the whole job — a tampered payload cannot change a total.

---

## Things this project deliberately does not do

- **No fake social proof.** No testimonials, star ratings, review counts or award
  badges, and no `aggregateRating` in the structured data. Google treats invented
  review markup as a policy violation, and it would be untrue anyway.
- **No company language.** Purasynth is a sole proprietor. Nothing in the copy,
  the footer or the schema claims an incorporated entity, employees, a factory or
  a registration number.
- **No tracking cookies.** No analytics, no advertising pixels, no consent banner
  theatre. The only browser storage is the cart in `localStorage` and the admin
  session cookie.
- **No dark theme.** The palette is deliberately light throughout.

---

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Dev server on http://localhost:3000   |
| `npm run build` | Production build                      |
| `npm start`     | Serve the production build            |
| `npm run lint`  | ESLint                                |
