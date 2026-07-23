-- =============================================================================
-- Purasynth — orders table
-- =============================================================================
--
-- HOW TO RUN THIS
--   1. Open your Supabase project → SQL Editor → New query.
--   2. Paste this whole file and run it. It is safe to re-run: every statement
--      is guarded with IF NOT EXISTS.
--   3. Copy the project URL and the *service role* key into the deployment
--      environment as SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
--
-- Column names here must match `src/lib/orders.ts` exactly — that file writes
-- snake_case keys straight through to this table, so a rename in one place
-- without the other silently drops data.
--
-- Money is stored in integer cents, never a float. `products.ts` is the only
-- source of prices; the order route re-prices every basket from it and writes
-- the result here, so these columns are a record of what was quoted, not a
-- number the browser was trusted with.
-- =============================================================================

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),

  -- Human-facing reference, e.g. PSY-20260723-4F1B. Unique so a retried
  -- insert can never produce two orders quoting the same number.
  order_number        text        not null unique,

  first_name          text        not null,
  last_name           text        not null,
  email               text        not null,
  phone               text        not null,

  address_line1       text        not null,
  address_line2       text,
  city                text        not null,
  state               text        not null,
  zip                 text        not null,

  -- Year, make, model and trim, so fitment can be confirmed before shipping.
  vehicle             text,
  notes               text,

  -- Snapshot of the priced basket: slug, name, sku, fitment, fitmentLabel,
  -- qty, unitCents, lineCents. Frozen at order time so a later catalogue
  -- edit cannot rewrite what someone was quoted.
  items               jsonb       not null default '[]'::jsonb,

  subtotal_cents      integer     not null check (subtotal_cents >= 0),
  shipping_cents      integer     not null default 0 check (shipping_cents >= 0),
  total_cents         integer     not null check (total_cents >= 0),

  -- How the customer would like to settle up. A preference, not a charge:
  -- there is no payment gateway on this site. An invoice with a payment link
  -- is emailed once fitment is confirmed.
  payment_preference  text        not null
    check (payment_preference in ('card', 'apple-pay', 'google-pay', 'bank-transfer')),

  status              text        not null default 'new'
    check (status in ('new', 'contacted', 'invoiced', 'paid', 'shipped', 'cancelled')),

  created_at          timestamptz not null default now()
);

-- The dashboard only ever reads newest-first, so this is the one index it needs.
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

-- =============================================================================
-- Row Level Security
-- =============================================================================
--
-- RLS is ENABLED and there are deliberately NO POLICIES.
--
-- With RLS on and no policy, every role that RLS applies to — `anon`,
-- `authenticated`, and anything holding a publishable key — can read nothing
-- and write nothing. There is no policy to find a hole in, because there is no
-- policy at all.
--
-- The service role key bypasses RLS, so it is the only way into this table.
-- That key lives in `src/lib/supabase.ts`, which is marked `server-only` and
-- reads SUPABASE_SERVICE_ROLE_KEY — a name with no NEXT_PUBLIC_ prefix, so it
-- is never inlined into the browser bundle.
--
-- The practical effect: customer names, addresses, phone numbers and order
-- values exist only on the server. Nothing here is one leaked publishable key
-- away from being public. If you ever add a policy to this table, you are
-- opening that door — be certain that is what you want.
-- =============================================================================

alter table public.orders enable row level security;

comment on table public.orders is
  'Customer orders. RLS enabled with no policies: reachable only via the service role key from server-side code. Nothing here has been charged — payment is arranged by emailed invoice.';
