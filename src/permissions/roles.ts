/**
 * Three independent authorization scopes, not one role inheritance chain.
 * A person's effective access is the union of whatever they hold in each
 * scope for the currently active tenant/campaign — see `resolveCapabilities`
 * in ./capabilities.ts.
 */

export const PLATFORM_ROLES = ['none', 'platform_operator', 'platform_admin'] as const
export type PlatformRole = (typeof PLATFORM_ROLES)[number]

export const TENANT_ROLES = ['member', 'tenant_admin'] as const
export type TenantRole = (typeof TENANT_ROLES)[number]

export const CAMPAIGN_ROLES = ['agent', 'closer', 'supervisor', 'qa'] as const
export type CampaignRole = (typeof CAMPAIGN_ROLES)[number]

export const PLATFORM_ROLE_LABELS: Record<PlatformRole, string> = {
  none: 'None',
  platform_operator: 'Platform Operator',
  platform_admin: 'Platform Admin',
}

export const TENANT_ROLE_LABELS: Record<TenantRole, string> = {
  member: 'Member',
  tenant_admin: 'Tenant Admin',
}

export const CAMPAIGN_ROLE_LABELS: Record<CampaignRole, string> = {
  agent: 'Agent',
  closer: 'Closer',
  supervisor: 'Supervisor',
  qa: 'QA',
}

export interface TenantMembership {
  tenantId: string
  tenantName: string
  role: TenantRole
}

export interface CampaignMembership {
  campaignId: string
  campaignName: string
  tenantId: string
  role: CampaignRole
}

/** A top-level product surface a user may be routed into. */
export const SURFACES = ['agent', 'supervisor', 'tenant-admin', 'platform-operator', 'platform-admin'] as const
export type Surface = (typeof SURFACES)[number]

export const SURFACE_LABELS: Record<Surface, string> = {
  agent: 'Agent Workspace',
  supervisor: 'Supervisor Console',
  'tenant-admin': 'Tenant Admin',
  'platform-operator': 'Platform Operations',
  'platform-admin': 'Platform Admin',
}

export const SURFACE_HOME_PATH: Record<Surface, string> = {
  agent: '/agent',
  supervisor: '/supervisor',
  'tenant-admin': '/tenant-admin',
  'platform-operator': '/platform-operator',
  'platform-admin': '/platform-admin',
}
