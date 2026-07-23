import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ContainerProps {
  readonly children: ReactNode
  readonly className?: string
  readonly size?: 'default' | 'wide' | 'narrow'
}

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-[88rem]',
} as const

export function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', sizes[size], className)}>
      {children}
    </div>
  )
}
