'use client'

import type { ComponentType } from 'react'

import {
  AmexMark,
  ApplePayMark,
  BankTransferMark,
  GooglePayMark,
  MastercardMark,
  VisaMark,
} from '@/components/payment/payment-marks'
import type { PaymentMethodId } from '@/lib/payment-methods'
import { cn } from '@/lib/utils'

type Mark = ComponentType<{ readonly className?: string }>

const MARKS: Readonly<Record<PaymentMethodId, readonly Mark[]>> = {
  card: [VisaMark, MastercardMark, AmexMark],
  'apple-pay': [ApplePayMark],
  'google-pay': [GooglePayMark],
  'bank-transfer': [BankTransferMark],
}

interface PaymentMethodMarksProps {
  readonly id: PaymentMethodId
  readonly className?: string
  readonly markClassName?: string
}

/**
 * The brand marks that belong to one payment method.
 *
 * Hidden from assistive tech on purpose: the method's own label always sits
 * next to it, so announcing "Visa Mastercard American Express" as well only
 * repeats what the label already said.
 */
export function PaymentMethodMarks({
  id,
  className,
  markClassName,
}: PaymentMethodMarksProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {MARKS[id].map((Brand, index) => (
        <Brand key={index} className={markClassName} />
      ))}
    </span>
  )
}
