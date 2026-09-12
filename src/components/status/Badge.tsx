import { type HTMLAttributes } from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-0.5 text-[length:var(--text-label)] font-medium',
  {
    variants: {
      status: {
        neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]',
        success: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]',
        warning: 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]',
        error: 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]',
        ai: 'bg-[var(--color-status-ai-bg)] text-[var(--color-status-ai)]',
        info: 'bg-[var(--color-brand-surface)] text-[var(--color-brand-primary)]',
      },
    },
    defaultVariants: { status: 'neutral' },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, status, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ status }), className)} {...props} />
}
