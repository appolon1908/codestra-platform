import { type ReactNode } from 'react'
import { Badge } from '@/components/status/Badge'

export type ActivitySource = 'call' | 'sms' | 'email' | 'crm' | 'system'

const sourceLabel: Record<ActivitySource, string> = {
  call: 'Call',
  sms: 'SMS',
  email: 'Email',
  crm: 'Odoo',
  system: 'System',
}

export interface TimelineItemProps {
  icon: ReactNode
  timestamp: string
  title: string
  source: ActivitySource
  actor?: string
  metadata?: string
  status?: ReactNode
  detail?: ReactNode
}

export function TimelineItem({ icon, timestamp, title, source, actor, metadata, status, detail }: TimelineItemProps) {
  return (
    <div className="flex gap-3 border-b border-[var(--color-surface-border)] py-3 last:border-0">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2 text-[length:var(--text-small)] text-[var(--color-text-muted)]">
          <span>{timestamp}</span>
          <Badge status="neutral">{sourceLabel[source]}</Badge>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[length:var(--text-body)] font-medium text-[var(--color-text-primary)]">{title}</span>
          {status}
        </div>
        {(actor || metadata) && (
          <span className="text-[length:var(--text-small)] text-[var(--color-text-secondary)]">
            {[actor, metadata].filter(Boolean).join(' · ')}
          </span>
        )}
        {detail}
      </div>
    </div>
  )
}
