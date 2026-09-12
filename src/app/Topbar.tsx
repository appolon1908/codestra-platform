import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/core/IconButton'
import { Avatar } from '@/components/identity/Avatar'
import { useAuth } from '@/auth/AuthContext'
import { ROLE_LABELS } from '@/permissions/roles'

export function Topbar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  if (!session) return null

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-surface-border)] bg-[var(--color-surface-card)] px-6">
      <div className="flex items-center gap-3">
        <span className="text-[length:var(--text-section-title)] font-semibold text-[var(--color-text-primary)]">
          {session.tenantName ?? 'Codestra'}
        </span>
        <span className="rounded-[var(--radius-pill)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
          {ROLE_LABELS[session.role]}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name={session.name} size="sm" />
        <span className="text-[length:var(--text-body)] text-[var(--color-text-primary)]">{session.name}</span>
        <IconButton
          label="Sign out"
          size="sm"
          onClick={() => {
            signOut()
            navigate('/sign-in')
          }}
        >
          <LogOut className="size-4" aria-hidden="true" />
        </IconButton>
      </div>
    </header>
  )
}
