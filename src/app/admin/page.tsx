import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AlertTriangle, DollarSign, Inbox, LogOut, Sparkles } from 'lucide-react'

import { OrderList } from '@/components/admin/order-list'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import { summarise, type OrderRecord } from '@/lib/order-types'
import { listOrders } from '@/lib/orders'
import { buildMetadata } from '@/lib/seo'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Orders',
  description: 'Order dashboard for the Purasynth shop.',
  path: '/admin',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

interface StatProps {
  readonly icon: typeof Inbox
  readonly label: string
  readonly value: string
  readonly tone: string
}

function Stat({ icon: Icon, label, value, tone }: StatProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border-2 border-ink bg-paper p-4">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-sm ${tone}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl leading-none font-bold">{value}</p>
        <p className="mt-1 text-xs text-slate">{label}</p>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  // The layout already refuses to render children without the secrets, but
  // repeating the check here means no future refactor of the layout can
  // accidentally expose the order list.
  if (!isAdminConfigured() || !(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  let orders: readonly OrderRecord[] = []
  let loadError: string | null = null

  try {
    orders = await listOrders()
  } catch (error: unknown) {
    loadError =
      error instanceof Error
        ? error.message
        : 'Could not load orders from the database.'
  }

  const totals = summarise(orders)

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-slate">
            Everyone who has placed an order. Nothing here has been charged.
            Confirm the fitment, then email the invoice.
          </p>
        </div>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold transition-colors hover:bg-lime-soft"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border-2 border-coral bg-coral-soft p-5"
        >
          <AlertTriangle
            className="h-5 w-5 shrink-0 text-coral"
            aria-hidden="true"
          />
          <div>
            <p className="font-display text-lg font-bold">
              Could not load orders
            </p>
            <p className="mt-1 text-sm text-slate">{loadError}</p>
            <p className="mt-2 text-sm text-slate">
              Check that SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set for
              this environment, then redeploy.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Stat
              icon={Sparkles}
              label="Waiting to be contacted"
              value={String(totals.newCount)}
              tone="bg-coral text-paper"
            />
            <Stat
              icon={Inbox}
              label="Orders in total"
              value={String(totals.count)}
              tone="bg-volt text-paper"
            />
            <Stat
              icon={DollarSign}
              label="Value, excluding cancelled"
              value={formatPrice(totals.revenueCents)}
              tone="bg-lime text-ink"
            />
          </div>

          <OrderList orders={orders} />
        </>
      )}
    </>
  )
}
