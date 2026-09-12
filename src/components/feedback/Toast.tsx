import { type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/core/IconButton'

export type ToastStatus = 'success' | 'error' | 'info'

const iconByStatus: Record<ToastStatus, ReactNode> = {
  success: <CheckCircle2 className="size-5 text-[var(--color-status-success)]" aria-hidden="true" />,
  error: <AlertCircle className="size-5 text-[var(--color-status-error)]" aria-hidden="true" />,
  info: <Info className="size-5 text-[var(--color-brand-primary)]" aria-hidden="true" />,
}

const toastVariants = cva(
  'flex items-start gap-3 rounded-[var(--radius-md)] border bg-[var(--color-surface-card)] p-4 shadow-[var(--shadow-floating)]',
  {
    variants: {
      status: {
        success: 'border-[var(--color-status-success-bg)]',
        error: 'border-[var(--color-status-error-bg)]',
        info: 'border-[var(--color-brand-border)]',
      },
    },
    defaultVariants: { status: 'info' },
  },
)

export interface ToastProps {
  status?: ToastStatus
  title: string
  description?: string
  onDismiss?: () => void
}

export function Toast({ status = 'info', title, description, onDismiss }: ToastProps) {
  return (
    <div role="status" className={cn(toastVariants({ status }))}>
      {iconByStatus[status]}
      <div className="flex-1">
        <p className="text-[length:var(--text-body)] font-medium text-[var(--color-text-primary)]">{title}</p>
        {description && <p className="text-[length:var(--text-small)] text-[var(--color-text-secondary)]">{description}</p>}
      </div>
      {onDismiss && (
        <IconButton label="Dismiss" size="sm" onClick={onDismiss}>
          <X className="size-4" aria-hidden="true" />
        </IconButton>
      )}
    </div>
  )
}
