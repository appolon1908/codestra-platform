import { useMemo } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { MOCK_TENANTS } from '@/app/mockTenants'
import { type Capability, canAny as canAnyOf, resolveCapabilities } from './capabilities'
import type { CampaignMembership, Surface, TenantMembership } from './roles'

export function usePermission() {
  const { session } = useAuth()

  const capabilities = useMemo(
    () => resolveCapabilities(session, session?.activeTenantId ?? null, session?.activeCampaignId ?? null),
    [session],
  )

  const activeTenant: TenantMembership | null = useMemo(
    () => session?.tenantMemberships.find((m) => m.tenantId === session.activeTenantId) ?? null,
    [session],
  )

  /** Falls back to the mock tenant directory for a Platform Admin viewing a tenant they hold no membership row in. */
  const activeTenantName: string | null = useMemo(() => {
    if (activeTenant) return activeTenant.tenantName
    if (!session?.activeTenantId) return null
    return MOCK_TENANTS.find((t) => t.tenantId === session.activeTenantId)?.tenantName ?? null
  }, [activeTenant, session])

  const activeCampaign: CampaignMembership | null = useMemo(
    () => session?.campaignMemberships.find((m) => m.campaignId === session.activeCampaignId) ?? null,
    [session],
  )

  const availableCampaigns: CampaignMembership[] = useMemo(
    () => session?.campaignMemberships.filter((m) => m.tenantId === session.activeTenantId) ?? [],
    [session],
  )

  /** Which top-level product surfaces this person can enter at all, given any tenant/campaign context. */
  const availableSurfaces: Surface[] = useMemo(() => {
    if (!session) return []
    const surfaces: Surface[] = []
    if (session.campaignMemberships.length > 0) surfaces.push('agent')
    if (session.campaignMemberships.some((m) => m.role === 'supervisor' || m.role === 'qa')) surfaces.push('supervisor')
    if (session.tenantMemberships.some((m) => m.role === 'tenant_admin')) surfaces.push('tenant-admin')
    else if (session.platformRole === 'platform_admin') surfaces.push('tenant-admin')
    if (session.platformRole === 'platform_operator') surfaces.push('platform-operator')
    if (session.platformRole === 'platform_admin') surfaces.push('platform-admin')
    return surfaces
  }, [session])

  return {
    platformRole: session?.platformRole ?? 'none',
    activeTenant,
    activeTenantName,
    activeCampaign,
    availableTenants: session?.tenantMemberships ?? [],
    availableCampaigns,
    availableSurfaces,
    can: (capability: Capability) => capabilities.has(capability),
    canAny: (list: Capability[]) => canAnyOf(capabilities, list),
  }
}
