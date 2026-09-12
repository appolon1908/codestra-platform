import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface MetricCardProps {
  label: string
  value: string | number
  trend?: { direction: 'up' | 'down' | 'flat'; label: string }
  icon?: ReactNode
  className?: string
}

const trendColor: Record<'up' | 'down' | 'flat', string> = {
  up: 'text-[var(--color-status-success)]',
  down: 'text-[var(--color-status-error)]',
  flat: 'text-[var(--color-text-muted)]',
}

export function MetricCard({ label, value, trend, icon, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[length:var(--text-label)] font-medium text-[var(--color-text-muted)]">{label}</span>
        {icon}
      </div>
      <span className="text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-semibold text-[var(--color-text-primary)]">
        {value}
      </span>
      {trend && <span className={cn('text-[length:var(--text-small)]', trendColor[trend.direction])}>{trend.label}</span>}
    </div>
  )
}
