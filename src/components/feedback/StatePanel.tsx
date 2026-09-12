import { type ReactNode } from 'react'
import { Clock, Lock, RefreshCw } from 'lucide-react'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'

export type PanelState = 'loading' | 'empty' | 'permission-denied' | 'stale-data' | 'session-expired'

export interface StatePanelProps {
  state: PanelState
  title?: string
  description?: string
  action?: ReactNode
}

const DEFAULTS: Record<Exclude<PanelState, 'loading'>, { icon: ReactNode; title: string; description: string }> = {
  empty: {
    icon: null,
    title: 'Nothing here yet',
    description: 'Once there is activity, it will show up here.',
  },
  'permission-denied': {
    icon: <Lock className="size-6 text-[var(--color-text-muted)]" aria-hidden="true" />,
    title: "You don't have access to this",
    description: 'This requires a capability your current role or campaign membership does not grant.',
  },
  'stale-data': {
    icon: <Clock className="size-6 text-[var(--color-status-warning)]" aria-hidden="true" />,
    title: 'Showing stale data',
    description: 'The latest data could not be fetched. What you see below may be out of date.',
  },
  'session-expired': {
    icon: <RefreshCw className="size-6 text-[var(--color-status-error)]" aria-hidden="true" />,
    title: 'Your session has expired',
    description: 'Sign in again to continue.',
  },
}

/** One reusable panel for the common non-happy-path states a screen needs to render. */
export function StatePanel({ state, title, description, action }: StatePanelProps) {
  if (state === 'loading') {
    return (
      <div className="flex flex-col gap-2" role="status" aria-label="Loading">
        <Skeleton height={16} width="60%" />
        <Skeleton height={16} width="90%" />
        <Skeleton height={16} width="75%" />
      </div>
    )
  }

  const fallback = DEFAULTS[state]
  return (
    <EmptyState
      icon={fallback.icon}
      title={title ?? fallback.title}
      description={description ?? fallback.description}
      action={action}
    />
  )
}
