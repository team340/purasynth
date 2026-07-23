import type { Metadata } from 'next'

import { OrderConfirmedContent } from '@/components/checkout/order-confirmed-content'
import { Container } from '@/components/ui/container'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Order Received',
  description:
    'Your Purasynth order is logged. Fitment gets confirmed first, then an invoice with a secure payment link is emailed — nothing has been charged.',
  path: '/order-confirmed',
  noIndex: true,
})

interface OrderConfirmedPageProps {
  /** Next 16 hands search params over as a promise. */
  readonly searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

/** Take the first value only — `?order=a&order=b` arrives as an array. */
function readOrderNumber(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value
  const trimmed = raw?.trim()

  return trimmed && trimmed.length > 0 && trimmed.length <= 40 ? trimmed : null
}

export default async function OrderConfirmedPage({
  searchParams,
}: OrderConfirmedPageProps) {
  const params = await searchParams
  const orderNumber = readOrderNumber(params.order)

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[30rem] w-[52rem] -translate-x-1/2 rounded-blob bg-haze motion-safe:animate-blob"
      />
      <div
        aria-hidden="true"
        className="noise-overlay pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <Container size="wide">
        <OrderConfirmedContent orderNumber={orderNumber} />
      </Container>
    </section>
  )
}
