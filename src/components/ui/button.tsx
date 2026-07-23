import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'lime' | 'outline' | 'ghost' | 'coral'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-[transform,box-shadow,background-color,color] duration-200 ease-[cubic-bezier(0.22,1.2,0.36,1)] ' +
  'active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-55 whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-paper shadow-[0_5px_0_0_var(--color-volt)] hover:-translate-y-[3px] ' +
    'hover:shadow-[0_9px_0_0_var(--color-volt)] active:shadow-[0_2px_0_0_var(--color-volt)]',
  lime:
    'bg-lime text-ink shadow-[0_5px_0_0_var(--color-ink)] hover:-translate-y-[3px] ' +
    'hover:shadow-[0_9px_0_0_var(--color-ink)] active:shadow-[0_2px_0_0_var(--color-ink)]',
  coral:
    'bg-coral text-paper shadow-[0_5px_0_0_var(--color-ink)] hover:-translate-y-[3px] ' +
    'hover:shadow-[0_9px_0_0_var(--color-ink)] active:shadow-[0_2px_0_0_var(--color-ink)]',
  outline:
    'border-2 border-ink bg-paper text-ink hover:-translate-y-[3px] hover:bg-lime-soft ' +
    'shadow-[0_5px_0_0_var(--color-ink)] hover:shadow-[0_9px_0_0_var(--color-ink)] ' +
    'active:shadow-[0_2px_0_0_var(--color-ink)]',
  ghost: 'text-ink hover:bg-haze',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-[0.95rem]',
  lg: 'h-14 px-9 text-base sm:h-16 sm:px-11 sm:text-lg',
}

interface CommonProps {
  readonly children: ReactNode
  readonly variant?: Variant
  readonly size?: Size
  readonly className?: string
}

interface ButtonAsLink extends CommonProps {
  readonly href: string
  readonly external?: boolean
  /** Fires alongside navigation — used to close the cart drawer on click. */
  readonly onClick?: () => void
  readonly ariaLabel?: string
}

export function ButtonLink({
  children,
  href,
  external = false,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  ariaLabel,
}: ButtonAsLink) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
}
