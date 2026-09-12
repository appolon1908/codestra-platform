import { type ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--color-surface-border-strong)] p-10 text-center">
      {icon}
      <p className="text-[length:var(--text-card-title)] font-medium text-[var(--color-text-primary)]">{title}</p>
      {description && <p className="max-w-sm text-[length:var(--text-body)] text-[var(--color-text-muted)]">{description}</p>}
      {action}
    </div>
  )
}
