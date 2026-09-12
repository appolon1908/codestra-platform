import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/core/IconButton'
import { Avatar } from '@/components/identity/Avatar'
import { Select } from '@/components/form/Select'
import { useAuth } from '@/auth/AuthContext'
import { usePermission } from '@/permissions/usePermission'
import { SURFACE_HOME_PATH, SURFACE_LABELS } from '@/permissions/roles'

export function Topbar() {
  const { session, signOut, setActiveCampaign, setActiveTenant } = useAuth()
  const navigate = useNavigate()
  const { activeTenantName, activeCampaign, availableTenants, availableCampaigns, availableSurfaces } = usePermission()
  if (!session) return null

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-surface-border)] bg-[var(--color-surface-card)] px-6">
      <div className="flex items-center gap-3">
        <span className="text-[length:var(--text-section-title)] font-semibold text-[var(--color-text-primary)]">
          {activeTenantName ?? 'Codestra'}
        </span>

        {availableTenants.length > 1 && (
          <Select
            value={session.activeTenantId ?? undefined}
            onValueChange={setActiveTenant}
            options={availableTenants.map((t) => ({ value: t.tenantId, label: t.tenantName }))}
          />
        )}

        {availableCampaigns.length > 1 && (
          <Select
            value={session.activeCampaignId ?? undefined}
            onValueChange={setActiveCampaign}
            placeholder="Select campaign"
            options={availableCampaigns.map((c) => ({ value: c.campaignId, label: c.campaignName }))}
          />
        )}
        {availableCampaigns.length === 1 && (
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            {activeCampaign?.campaignName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {availableSurfaces.length > 1 && (
          <Select
            value=""
            placeholder="Switch workspace"
            onValueChange={(surface) => navigate(SURFACE_HOME_PATH[surface as keyof typeof SURFACE_HOME_PATH])}
            options={availableSurfaces.map((s) => ({ value: s, label: SURFACE_LABELS[s] }))}
          />
        )}
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
