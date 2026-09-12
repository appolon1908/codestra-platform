import type { Role } from './roles'

/**
 * Capability keys gate entire nav sections and screens. Keep these coarse
 * (section-level) — component-level detail differences belong in props, not
 * new capability keys.
 */
export const CAPABILITIES = [
  'workspace.telephony', // agent phone/call controls
  'workspace.crm', // Odoo customer/lead panel
  'team.manage', // supervisor: agents, coaching, QA
  'queue.manage', // supervisor/tenant admin: queues, routing
  'reports.view',
  'recordings.view',
  'tenant.users', // manage users within one's own tenant
  'tenant.numbers',
  'tenant.billing', // a tenant's own billing/subscription status
  'tenant.integrations',
  'tenant.settings',
  'platform.tenants', // cross-tenant administration
  'platform.billing', // platform-wide billing/plans/invoices
  'platform.telephony', // SIP/numbers/routing infra
  'platform.communications', // SMTP + Jasmin SMS configuration
  'platform.odoo_mapping',
  'platform.monitoring',
  'platform.security', // roles, audit, environments
  'platform.provisioning',
] as const

export type Capability = (typeof CAPABILITIES)[number]

const AGENT: Capability[] = ['workspace.telephony', 'workspace.crm']

const SUPERVISOR: Capability[] = [
  ...AGENT,
  'team.manage',
  'queue.manage',
  'reports.view',
  'recordings.view',
]

const TENANT_ADMIN: Capability[] = [
  ...SUPERVISOR,
  'tenant.users',
  'tenant.numbers',
  'tenant.billing',
  'tenant.integrations',
  'tenant.settings',
]

const PLATFORM_OPERATOR: Capability[] = [
  'platform.tenants',
  'platform.telephony',
  'platform.communications',
  'platform.monitoring',
  'reports.view',
  'recordings.view',
]

const PLATFORM_ADMIN: Capability[] = [
  ...PLATFORM_OPERATOR,
  'platform.billing',
  'platform.odoo_mapping',
  'platform.security',
  'platform.provisioning',
]

export const ROLE_CAPABILITIES: Record<Role, Capability[]> = {
  agent: AGENT,
  supervisor: SUPERVISOR,
  tenant_admin: TENANT_ADMIN,
  platform_operator: PLATFORM_OPERATOR,
  platform_admin: PLATFORM_ADMIN,
}

export function can(role: Role, capability: Capability): boolean {
  return ROLE_CAPABILITIES[role].includes(capability)
}

export function canAny(role: Role, capabilities: Capability[]): boolean {
  return capabilities.some((capability) => can(role, capability))
}
