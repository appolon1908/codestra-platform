import { type ReactNode } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export type AlertStatus = 'success' | 'warning' | 'error' | 'info'

const iconByStatus: Record<AlertStatus, ReactNode> = {
  success: <CheckCircle2 className="size-4" aria-hidden="true" />,
  warning: <AlertTriangle className="size-4" aria-hidden="true" />,
  error: <AlertCircle className="size-4" aria-hidden="true" />,
  info: <Info className="size-4" aria-hidden="true" />,
}

const alertVariants = cva('flex items-start gap-2 rounded-[var(--radius-sm)] p-3 text-[length:var(--text-body)]', {
  variants: {
    status: {
      success: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]',
      warning: 'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]',
      error: 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]',
      info: 'bg-[var(--color-brand-surface)] text-[var(--color-brand-primary)]',
    },
  },
  defaultVariants: { status: 'info' },
})

export interface InlineAlertProps {
  status?: AlertStatus
  children: ReactNode
  className?: string
}

export function InlineAlert({ status = 'info', children, className }: InlineAlertProps) {
  return (
    <div role="alert" className={cn(alertVariants({ status }), className)}>
      {iconByStatus[status]}
      <div>{children}</div>
    </div>
  )
}
