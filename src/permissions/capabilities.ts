import type { CampaignRole, PlatformRole, TenantRole } from './roles'
import type { Session } from '@/auth/AuthContext'

/**
 * Flat, versioned capability vocabulary — do not invent new strings
 * screen-by-screen. Add here first, then grant it from the appropriate
 * scope's grant table below.
 */
export const CAPABILITIES = [
  'calls.read',
  'calls.answer',
  'calls.originate',
  'calls.hold',
  'calls.transfer',
  'calls.conference',
  'calls.record',
  'calls.disposition.write',
  'calls.monitor',
  'calls.whisper',
  'calls.barge',
  'contacts.read',
  'contacts.write',
  'campaigns.read',
  'campaigns.manage',
  'queues.read',
  'queues.manage',
  'recordings.read',
  'recordings.review',
  'qa.read',
  'qa.score',
  'sms.send',
  'sms.history.read',
  'email.send',
  'email.history.read',
  'tenant.users.read',
  'tenant.users.manage',
  'tenant.integrations.read',
  'tenant.integrations.manage',
  'tenant.billing.read',
  'tenant.billing.manage',
  'platform.tenants.read',
  'platform.tenants.manage',
  'platform.provisioning.manage',
  'platform.operations.read',
  'platform.security.manage',
  'platform.billing.manage',
  'platform.audit.read',
] as const

export type Capability = (typeof CAPABILITIES)[number]

// --- Platform scope --------------------------------------------------------

const PLATFORM_OPERATOR_CAPS: Capability[] = [
  'platform.operations.read',
  'platform.tenants.read',
  'recordings.read',
]

const PLATFORM_ADMIN_CAPS: Capability[] = [
  ...PLATFORM_OPERATOR_CAPS,
  'platform.tenants.manage',
  'platform.billing.manage',
  'platform.security.manage',
  'platform.audit.read',
  'platform.provisioning.manage',
]

const PLATFORM_ROLE_CAPS: Record<PlatformRole, Capability[]> = {
  none: [],
  platform_operator: PLATFORM_OPERATOR_CAPS,
  platform_admin: PLATFORM_ADMIN_CAPS,
}

// --- Tenant scope (scoped to whichever tenant is active) --------------------

const TENANT_ADMIN_CAPS: Capability[] = [
  'tenant.users.read',
  'tenant.users.manage',
  'tenant.integrations.read',
  'tenant.integrations.manage',
  'tenant.billing.read',
  'tenant.billing.manage',
  'campaigns.read',
  'campaigns.manage',
  'queues.read',
  'queues.manage',
]

const TENANT_ROLE_CAPS: Record<TenantRole, Capability[]> = {
  // A bare tenant member has no capabilities of their own — their access
  // comes entirely from their campaign memberships within this tenant.
  member: [],
  tenant_admin: TENANT_ADMIN_CAPS,
}

// --- Campaign scope (scoped to whichever campaign is active) ----------------

const AGENT_CAPS: Capability[] = [
  'calls.read',
  'calls.answer',
  'calls.originate',
  'calls.hold',
  'calls.transfer',
  'calls.disposition.write',
  'contacts.read',
  'contacts.write',
  'sms.send',
  'email.send',
]

const CLOSER_CAPS: Capability[] = [...AGENT_CAPS, 'calls.conference']

const SUPERVISOR_CAPS: Capability[] = [
  ...AGENT_CAPS,
  'calls.monitor',
  'calls.whisper',
  'calls.barge',
  'campaigns.read',
  'queues.read',
  'recordings.read',
  'recordings.review',
]

const QA_CAPS: Capability[] = ['recordings.read', 'recordings.review', 'qa.read', 'qa.score', 'calls.read']

const CAMPAIGN_ROLE_CAPS: Record<CampaignRole, Capability[]> = {
  agent: AGENT_CAPS,
  closer: CLOSER_CAPS,
  supervisor: SUPERVISOR_CAPS,
  qa: QA_CAPS,
}

/**
 * Composes the effective capability set for a session against whichever
 * tenant/campaign is currently active. This is a UX-gating boundary only —
 * the real security enforcement lives server-side, out of scope for this repo.
 */
export function resolveCapabilities(
  session: Session | null,
  activeTenantId: string | null,
  activeCampaignId: string | null,
): Set<Capability> {
  if (!session) return new Set()

  const caps = new Set<Capability>(PLATFORM_ROLE_CAPS[session.platformRole])

  const tenantMembership = session.tenantMemberships.find((m) => m.tenantId === activeTenantId)
  if (tenantMembership) {
    for (const cap of TENANT_ROLE_CAPS[tenantMembership.role]) caps.add(cap)
  } else if (session.platformRole === 'platform_admin' && activeTenantId) {
    // Platform Admin can administer any tenant, but only once they've entered
    // an explicit tenant context (never implicitly, and never for an operator).
    for (const cap of TENANT_ROLE_CAPS.tenant_admin) caps.add(cap)
  }

  const campaignMembership = session.campaignMemberships.find(
    (m) => m.campaignId === activeCampaignId && m.tenantId === activeTenantId,
  )
  if (campaignMembership) {
    for (const cap of CAMPAIGN_ROLE_CAPS[campaignMembership.role]) caps.add(cap)
  }

  return caps
}

export function can(capabilities: Set<Capability>, capability: Capability): boolean {
  return capabilities.has(capability)
}

export function canAny(capabilities: Set<Capability>, list: Capability[]): boolean {
  return list.some((capability) => capabilities.has(capability))
}
