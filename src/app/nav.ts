import type { Capability } from '@/permissions/capabilities'
import type { Session } from '@/auth/AuthContext'
import type { Surface } from '@/permissions/roles'

export interface NavItem {
  label: string
  path: string
  capability?: Capability
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export const AGENT_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Workspace', path: '/agent' },
      { label: 'Contacts', path: '/agent/contacts' },
      { label: 'History', path: '/agent/history' },
      { label: 'Messages', path: '/agent/messages' },
      { label: 'Knowledge Base', path: '/agent/knowledge-base' },
      { label: 'My Performance', path: '/agent/performance' },
    ],
  },
  {
    items: [
      { label: 'Audio Settings', path: '/agent/audio-settings' },
      { label: 'Help', path: '/agent/help' },
    ],
  },
]

export const SUPERVISOR_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: '/supervisor' },
      { label: 'Live Calls', path: '/supervisor/live-calls' },
      { label: 'Team', path: '/supervisor/team' },
      { label: 'Queues', path: '/supervisor/queues' },
      { label: 'Campaigns', path: '/supervisor/campaigns' },
      { label: 'Quality', path: '/supervisor/quality' },
      { label: 'Recordings', path: '/supervisor/recordings' },
      { label: 'Reports', path: '/supervisor/reports' },
      { label: 'Dispositions', path: '/supervisor/dispositions' },
      { label: 'Knowledge', path: '/supervisor/knowledge' },
    ],
  },
]

export const TENANT_ADMIN_NAV: NavGroup[] = [
  { items: [{ label: 'Overview', path: '/tenant-admin' }] },
  {
    label: 'People',
    items: [
      { label: 'Users', path: '/tenant-admin/users', capability: 'tenant.users.read' },
      { label: 'Teams', path: '/tenant-admin/teams', capability: 'tenant.users.read' },
      { label: 'Roles', path: '/tenant-admin/roles', capability: 'tenant.users.read' },
    ],
  },
  {
    label: 'Call Center',
    items: [
      { label: 'Campaigns', path: '/tenant-admin/campaigns', capability: 'campaigns.read' },
      { label: 'Queues', path: '/tenant-admin/queues', capability: 'queues.read' },
      { label: 'Numbers', path: '/tenant-admin/numbers', capability: 'campaigns.read' },
      { label: 'Extensions', path: '/tenant-admin/extensions', capability: 'campaigns.read' },
      { label: 'Routing', path: '/tenant-admin/routing', capability: 'campaigns.manage' },
      { label: 'Recordings', path: '/tenant-admin/recordings', capability: 'recordings.read' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { label: 'Voice', path: '/tenant-admin/communications/voice' },
      { label: 'SMS', path: '/tenant-admin/communications/sms' },
      { label: 'Email', path: '/tenant-admin/communications/email' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Contacts', path: '/tenant-admin/crm/contacts' },
      { label: 'Opportunities', path: '/tenant-admin/crm/opportunities' },
      { label: 'Odoo Mapping', path: '/tenant-admin/crm/odoo-mapping', capability: 'tenant.integrations.read' },
      { label: 'Activity', path: '/tenant-admin/crm/activity' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'Scripts', path: '/tenant-admin/ai/scripts' },
      { label: 'Knowledge', path: '/tenant-admin/ai/knowledge' },
      { label: 'AI Assistant', path: '/tenant-admin/ai/assistant' },
    ],
  },
  {
    label: 'Reporting',
    items: [
      { label: 'Calls', path: '/tenant-admin/reporting/calls' },
      { label: 'SMS', path: '/tenant-admin/reporting/sms' },
      { label: 'Email', path: '/tenant-admin/reporting/email' },
      { label: 'Agent Performance', path: '/tenant-admin/reporting/agent-performance' },
      { label: 'Usage', path: '/tenant-admin/reporting/usage' },
    ],
  },
  {
    label: 'Integrations',
    items: [
      { label: 'Odoo', path: '/tenant-admin/integrations/odoo', capability: 'tenant.integrations.read' },
      { label: 'Email', path: '/tenant-admin/integrations/email', capability: 'tenant.integrations.read' },
      { label: 'SMS', path: '/tenant-admin/integrations/sms', capability: 'tenant.integrations.read' },
      { label: 'Webhooks', path: '/tenant-admin/integrations/webhooks', capability: 'tenant.integrations.manage' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { label: 'Plan', path: '/tenant-admin/billing/plan', capability: 'tenant.billing.read' },
      { label: 'Usage', path: '/tenant-admin/billing/usage', capability: 'tenant.billing.read' },
      { label: 'Invoices', path: '/tenant-admin/billing/invoices', capability: 'tenant.billing.read' },
    ],
  },
  { items: [{ label: 'Settings', path: '/tenant-admin/settings' }] },
]

export const PLATFORM_OPERATOR_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Tenant Health', path: '/platform-operator' },
      { label: 'Provisioning', path: '/platform-operator/provisioning' },
      { label: 'Failed Jobs', path: '/platform-operator/failed-jobs' },
      { label: 'Service Health', path: '/platform-operator/service-health' },
      { label: 'Integration Health', path: '/platform-operator/integration-health' },
      { label: 'Call Failures', path: '/platform-operator/call-failures' },
      { label: 'SMS Failures', path: '/platform-operator/sms-failures' },
      { label: 'Email Failures', path: '/platform-operator/email-failures' },
      { label: 'Reconciliation', path: '/platform-operator/reconciliation' },
      { label: 'Support Cases', path: '/platform-operator/support-cases' },
      { label: 'Logs', path: '/platform-operator/logs' },
    ],
  },
]

export const PLATFORM_ADMIN_NAV: NavGroup[] = [
  { items: [{ label: 'Overview', path: '/platform-admin' }] },
  {
    label: 'Customers',
    items: [
      { label: 'Tenants', path: '/platform-admin/tenants', capability: 'platform.tenants.read' },
      { label: 'Users', path: '/platform-admin/users', capability: 'platform.tenants.read' },
      { label: 'Plans', path: '/platform-admin/plans', capability: 'platform.billing.manage' },
    ],
  },
  {
    label: 'Call Center',
    items: [
      { label: 'Campaigns', path: '/platform-admin/call-center/campaigns' },
      { label: 'Queues', path: '/platform-admin/call-center/queues' },
      { label: 'Numbers', path: '/platform-admin/call-center/numbers' },
      { label: 'Extensions', path: '/platform-admin/call-center/extensions' },
      { label: 'SIP / WebRTC', path: '/platform-admin/call-center/sip-webrtc' },
      { label: 'Routing', path: '/platform-admin/call-center/routing' },
      { label: 'Recordings', path: '/platform-admin/call-center/recordings' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { label: 'Email', path: '/platform-admin/communications/email' },
      { label: 'SMS', path: '/platform-admin/communications/sms' },
      { label: 'Templates', path: '/platform-admin/communications/templates' },
      { label: 'Sender Identities', path: '/platform-admin/communications/sender-identities' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Odoo', path: '/platform-admin/crm/odoo' },
      { label: 'CRM Mapping', path: '/platform-admin/crm/mapping' },
      { label: 'Sync Health', path: '/platform-admin/crm/sync-health' },
    ],
  },
  {
    label: 'Provisioning',
    items: [
      { label: 'Requests', path: '/platform-admin/provisioning/requests', capability: 'platform.provisioning.manage' },
      { label: 'Failed Steps', path: '/platform-admin/provisioning/failed-steps', capability: 'platform.provisioning.manage' },
      { label: 'Reconciliation', path: '/platform-admin/provisioning/reconciliation', capability: 'platform.provisioning.manage' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { label: 'Subscriptions', path: '/platform-admin/billing/subscriptions', capability: 'platform.billing.manage' },
      { label: 'Usage', path: '/platform-admin/billing/usage', capability: 'platform.billing.manage' },
      { label: 'Invoices', path: '/platform-admin/billing/invoices', capability: 'platform.billing.manage' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Services', path: '/platform-admin/platform/services' },
      { label: 'API', path: '/platform-admin/platform/api' },
      { label: 'Webhooks', path: '/platform-admin/platform/webhooks' },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { label: 'System Health', path: '/platform-admin/monitoring/system-health' },
      { label: 'Providers', path: '/platform-admin/monitoring/providers' },
      { label: 'Jobs', path: '/platform-admin/monitoring/jobs' },
      { label: 'Logs', path: '/platform-admin/monitoring/logs' },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Users & Roles', path: '/platform-admin/security/users-roles', capability: 'platform.security.manage' },
      { label: 'Sessions', path: '/platform-admin/security/sessions', capability: 'platform.security.manage' },
      { label: 'Audit', path: '/platform-admin/security/audit', capability: 'platform.audit.read' },
      { label: 'Environments', path: '/platform-admin/security/environments', capability: 'platform.security.manage' },
    ],
  },
  { items: [{ label: 'Settings', path: '/platform-admin/settings' }] },
]

export const NAV_BY_SURFACE: Record<Surface, NavGroup[]> = {
  agent: AGENT_NAV,
  supervisor: SUPERVISOR_NAV,
  'tenant-admin': TENANT_ADMIN_NAV,
  'platform-operator': PLATFORM_OPERATOR_NAV,
  'platform-admin': PLATFORM_ADMIN_NAV,
}

/** Matches the current location to a top-level surface, e.g. "/tenant-admin/billing/plan" -> "tenant-admin". */
export function surfaceForPath(pathname: string): Surface | null {
  const [, first] = pathname.split('/')
  return (['agent', 'supervisor', 'tenant-admin', 'platform-operator', 'platform-admin'] as Surface[]).find(
    (s) => s === first,
  ) ?? null
}

/**
 * Where a freshly signed-in (or restored) session should land. A person can
 * hold multiple scopes at once (e.g. tenant_admin who is also a campaign
 * supervisor) — tenant/platform administration surfaces take priority over
 * the campaign-scoped ones as a landing default; every surface they hold
 * access to is still reachable via the workspace switcher.
 */
export function deriveHomePath(session: Session): string {
  if (session.platformRole === 'platform_admin') return '/platform-admin'
  if (session.platformRole === 'platform_operator') return '/platform-operator'

  const activeTenantMembership = session.tenantMemberships.find((m) => m.tenantId === session.activeTenantId)
  if (activeTenantMembership?.role === 'tenant_admin') return '/tenant-admin'

  const activeCampaignMembership = session.campaignMemberships.find(
    (m) => m.campaignId === session.activeCampaignId,
  )
  if (activeCampaignMembership?.role === 'supervisor' || activeCampaignMembership?.role === 'qa') {
    return '/supervisor'
  }

  return '/agent'
}
