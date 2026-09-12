export const ROLES = [
  'agent',
  'supervisor',
  'tenant_admin',
  'platform_operator',
  'platform_admin',
] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  agent: 'Agent',
  supervisor: 'Supervisor',
  tenant_admin: 'Tenant Admin',
  platform_operator: 'Platform Operator',
  platform_admin: 'Platform Admin',
}
