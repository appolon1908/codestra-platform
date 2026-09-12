import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export type CallState = 'ready' | 'ringing' | 'active' | 'hold' | 'end' | 'offline'

const dotVariants = cva('size-2 rounded-full', {
  variants: {
    state: {
      ready: 'bg-[var(--color-call-ready)]',
      ringing: 'bg-[var(--color-call-ringing)] animate-pulse',
      active: 'bg-[var(--color-call-active)]',
      hold: 'bg-[var(--color-call-hold)]',
      end: 'bg-[var(--color-call-end)]',
      offline: 'bg-[var(--color-call-offline)]',
    },
  },
  defaultVariants: { state: 'offline' },
})

const labels: Record<CallState, string> = {
  ready: 'Ready',
  ringing: 'Ringing',
  active: 'Active call',
  hold: 'On hold',
  end: 'Call ended',
  offline: 'Offline',
}

export interface StatusPillProps {
  state: CallState
  label?: string
  className?: string
}

export function StatusPill({ state, label, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] px-2.5 py-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-primary)]',
        className,
      )}
    >
      <span className={dotVariants({ state })} aria-hidden="true" />
      {label ?? labels[state]}
    </span>
  )
}
