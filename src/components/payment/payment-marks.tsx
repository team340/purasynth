import { cn } from '@/lib/utils'

/**
 * Acceptance marks, drawn inline.
 *
 * These are clean in house renderings rather than downloaded logos, so the
 * site makes no external image requests and nothing here can 404 later.
 *
 * Before any large campaign, swap these for the official assets from each
 * brand's merchant toolkit (Visa Product Brand Standards, Mastercard Brand
 * Centre, American Express Merchant Marks, Apple Pay Marketing Guidelines,
 * Google Pay Brand Guidelines). Each sets its own rules on minimum size,
 * clear space and colour, and those rules are a condition of using the mark.
 */

interface MarkProps {
  readonly className?: string
}

/** Every mark draws on the same 48x30 plate so a row of them lines up. */
const plate = 'h-8 w-auto shrink-0'

function Plate({
  children,
  label,
  className,
  fill = '#ffffff',
}: {
  readonly children: React.ReactNode
  readonly label: string
  readonly className?: string
  readonly fill?: string
}) {
  return (
    <svg
      viewBox="0 0 48 30"
      role="img"
      aria-label={label}
      className={cn(plate, className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="28.5"
        rx="5"
        fill={fill}
        stroke="#dcd9e6"
        strokeWidth="1.5"
      />
      {children}
    </svg>
  )
}

export function VisaMark({ className }: MarkProps) {
  return (
    <Plate label="Visa" className={className}>
      <text
        x="24"
        y="20.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="13"
        fontStyle="italic"
        fontWeight="700"
        letterSpacing="0.4"
        fill="#1434cb"
      >
        VISA
      </text>
    </Plate>
  )
}

export function MastercardMark({ className }: MarkProps) {
  return (
    <Plate label="Mastercard" className={className}>
      <circle cx="20" cy="15" r="7.4" fill="#eb001b" />
      <circle cx="28" cy="15" r="7.4" fill="#f79e1b" />
      <path
        d="M24 9.4a7.38 7.38 0 0 0 0 11.2 7.38 7.38 0 0 0 0-11.2Z"
        fill="#ff5f00"
      />
    </Plate>
  )
}

export function AmexMark({ className }: MarkProps) {
  return (
    <Plate label="American Express" className={className} fill="#2e77bc">
      <text
        x="24"
        y="18.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="7.4"
        fontWeight="700"
        letterSpacing="0.2"
        fill="#ffffff"
      >
        AMEX
      </text>
    </Plate>
  )
}

export function ApplePayMark({ className }: MarkProps) {
  return (
    <Plate label="Apple Pay" className={className}>
      {/* Simplified fruit glyph plus wordmark. Not the official lockup. */}
      <path
        d="M15.9 11.3c.63-.76.55-1.82.5-2.18-.5.03-1.14.34-1.53.79-.35.4-.6 1-.53 1.6.56.05 1.13-.28 1.56-.53Zm.86 1.02c-.86-.05-1.6.48-2 .48-.42 0-1.05-.46-1.73-.45-.9.02-1.72.52-2.18 1.32-.93 1.6-.24 3.98.67 5.28.44.64.97 1.36 1.67 1.33.67-.03.92-.43 1.73-.43.8 0 1.03.43 1.74.42.72-.01 1.17-.65 1.61-1.3.5-.74.71-1.46.72-1.5-.02-.01-1.38-.53-1.4-2.1-.01-1.31 1.07-1.94 1.12-1.97-.61-.9-1.56-1-1.9-1.02Z"
        fill="#0b0b12"
      />
      <text
        x="30.5"
        y="19.5"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9.5"
        fontWeight="500"
        letterSpacing="-0.2"
        fill="#0b0b12"
      >
        Pay
      </text>
    </Plate>
  )
}

export function GooglePayMark({ className }: MarkProps) {
  return (
    <Plate label="Google Pay" className={className}>
      {/* Four colour G plus wordmark. Not the official lockup. */}
      <path d="M13.6 12.1a3.9 3.9 0 0 1 2.72 1.06l-1.15 1.15a2.3 2.3 0 0 0-1.57-.61 2.4 2.4 0 0 0-2.26 1.66l-1.34-1.04a3.96 3.96 0 0 1 3.6-2.22Z" fill="#ea4335" />
      <path d="M17.45 15.1c0-.34-.03-.66-.09-.97H13.6v1.84h2.17a1.86 1.86 0 0 1-.8 1.22l1.3 1.01a3.93 3.93 0 0 0 1.18-3.1Z" fill="#4285f4" />
      <path d="M11.34 15.36c0-.36.06-.7.16-1.04l-1.34-1.04a3.96 3.96 0 0 0 0 4.16l1.34-1.04a3.3 3.3 0 0 1-.16-1.04Z" fill="#fbbc04" />
      <path d="M13.6 18.6c1.07 0 1.97-.35 2.63-.96l-1.3-1.01c-.36.24-.81.38-1.33.38a2.4 2.4 0 0 1-2.26-1.65l-1.34 1.04a3.96 3.96 0 0 0 3.6 2.2Z" fill="#34a853" />
      <text
        x="31"
        y="19.3"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9.5"
        fontWeight="500"
        letterSpacing="-0.2"
        fill="#5f6368"
      >
        Pay
      </text>
    </Plate>
  )
}

export function BankTransferMark({ className }: MarkProps) {
  return (
    <Plate label="Bank transfer or ACH" className={className}>
      <path
        d="M24 8.2 32.4 13H15.6L24 8.2Zm-7.2 6.3h2.2v5.4h-2.2v-5.4Zm5.1 0h2.2v5.4h-2.2v-5.4Zm5.1 0h2.2v5.4h-2.2v-5.4Zm-13 6.9h20v1.9h-20v-1.9Z"
        fill="#4713d1"
      />
    </Plate>
  )
}

const MARKS = [
  VisaMark,
  MastercardMark,
  AmexMark,
  ApplePayMark,
  GooglePayMark,
  BankTransferMark,
] as const

interface PaymentStripProps {
  readonly className?: string
  readonly markClassName?: string
}

/**
 * The full row of marks.
 *
 * The list itself is decorative, so it is hidden from assistive tech and the
 * surrounding copy carries the meaning instead. Each individual mark still
 * has its own aria-label for anyone who inspects it directly.
 */
export function PaymentStrip({ className, markClassName }: PaymentStripProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {MARKS.map((Mark, index) => (
        <li key={index} className="flex">
          <Mark className={markClassName} />
        </li>
      ))}
    </ul>
  )
}
