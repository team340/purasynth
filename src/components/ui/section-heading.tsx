import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  readonly eyebrow?: string
  readonly title: ReactNode
  readonly description?: ReactNode
  readonly align?: 'left' | 'center'
  readonly tone?: 'volt' | 'lime' | 'coral' | 'sky'
  readonly className?: string
  readonly as?: 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'volt',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Tag className="text-4xl sm:text-5xl lg:text-6xl">{title}</Tag>
      {description ? (
        <p
          className={cn(
            'text-lg leading-relaxed text-slate',
            align === 'center' ? 'max-w-2xl' : 'max-w-xl'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
