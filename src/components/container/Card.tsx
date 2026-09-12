import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
}

export function Card({ className, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-card)]',
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-[length:var(--text-card-title)] leading-[var(--text-card-title--line-height)] font-semibold text-[var(--color-text-primary)]',
        className,
      )}
      {...props}
    />
  )
}
