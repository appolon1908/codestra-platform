import type { Capability } from '@/permissions/capabilities'
import type { Role } from '@/permissions/roles'

export interface NavItem {
  label: string
  path: string
  capability?: Capability
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

const AGENT_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Workspace', path: '/agent' },
      { label: 'History', path: '/agent/history' },
      { label: 'Contacts', path: '/agent/contacts' },
      { label: 'Knowledge Base', path: '/agent/knowledge-base' },
      { label: 'Performance', path: '/agent/performance' },
      { label: 'Help', path: '/agent/help' },
    ],
  },
]

const SUPERVISOR_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: '/supervisor' },
      { label: 'Team', path: '/supervisor/team' },
      { label: 'Queues', path: '/supervisor/queues' },
      { label: 'Campaigns', path: '/supervisor/campaigns' },
      { label: 'Quality', path: '/supervisor/quality' },
      { label: 'Reports', path: '/supervisor/reports' },
      { label: 'Recordings', path: '/supervisor/recordings' },
      { label: 'Dispositions', path: '/supervisor/dispositions' },
      { label: 'Settings', path: '/supervisor/settings' },
    ],
  },
]

const TENANT_ADMIN_NAV: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: '/tenant-admin' },
      { label: 'Phone System', path: '/tenant-admin/phone-system' },
      { label: 'Users', path: '/tenant-admin/users', capability: 'tenant.users' },
      { label: 'Numbers', path: '/tenant-admin/numbers', capability: 'tenant.numbers' },
      { label: 'Queues', path: '/tenant-admin/queues' },
      { label: 'Call History', path: '/tenant-admin/call-history' },
      { label: 'Recordings', path: '/tenant-admin/recordings' },
      { label: 'Reports', path: '/tenant-admin/reports' },
      { label: 'Integrations', path: '/tenant-admin/integrations', capability: 'tenant.integrations' },
      { label: 'Billing', path: '/tenant-admin/billing', capability: 'tenant.billing' },
      { label: 'Settings', path: '/tenant-admin/settings', capability: 'tenant.settings' },
    ],
  },
]

const PLATFORM_ADMIN_NAV: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Overview', path: '/platform-admin' }] },
  {
    label: 'Customers',
    items: [
      { label: 'Tenants', path: '/platform-admin/tenants', capability: 'platform.tenants' },
      { label: 'Users & Roles', path: '/platform-admin/users' },
      { label: 'Plans', path: '/platform-admin/plans' },
      { label: 'Subscriptions', path: '/platform-admin/subscriptions' },
    ],
  },
  {
    label: 'Call Center',
    items: [
      { label: 'Numbers', path: '/platform-admin/numbers', capability: 'platform.telephony' },
      { label: 'SIP', path: '/platform-admin/sip', capability: 'platform.telephony' },
      { label: 'Queues', path: '/platform-admin/queues', capability: 'platform.telephony' },
      { label: 'Campaigns', path: '/platform-admin/campaigns', capability: 'platform.telephony' },
      { label: 'Routing', path: '/platform-admin/routing', capability: 'platform.telephony' },
      { label: 'Recordings', path: '/platform-admin/recordings' },
      { label: 'Dispositions', path: '/platform-admin/dispositions' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { label: 'Email / SMTP', path: '/platform-admin/smtp', capability: 'platform.communications' },
      { label: 'SMS / Jasmin', path: '/platform-admin/sms', capability: 'platform.communications' },
      { label: 'Templates', path: '/platform-admin/templates', capability: 'platform.communications' },
    ],
  },
  {
    label: 'Odoo',
    items: [
      { label: 'CRM Mapping', path: '/platform-admin/odoo/mapping', capability: 'platform.odoo_mapping' },
      { label: 'Models', path: '/platform-admin/odoo/models', capability: 'platform.odoo_mapping' },
      { label: 'Sync Rules', path: '/platform-admin/odoo/sync-rules', capability: 'platform.odoo_mapping' },
    ],
  },
  {
    label: 'Billing',
    items: [
      { label: 'Plans', path: '/platform-admin/billing/plans', capability: 'platform.billing' },
      { label: 'Usage', path: '/platform-admin/billing/usage', capability: 'platform.billing' },
      { label: 'Invoices', path: '/platform-admin/billing/invoices', capability: 'platform.billing' },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { label: 'System Health', path: '/platform-admin/monitoring/health', capability: 'platform.monitoring' },
      { label: 'Jobs', path: '/platform-admin/monitoring/jobs', capability: 'platform.monitoring' },
      { label: 'Logs', path: '/platform-admin/monitoring/logs', capability: 'platform.monitoring' },
    ],
  },
  {
    label: 'Security',
    items: [
      { label: 'Roles', path: '/platform-admin/security/roles', capability: 'platform.security' },
      { label: 'Audit', path: '/platform-admin/security/audit', capability: 'platform.security' },
      { label: 'Environments', path: '/platform-admin/security/environments', capability: 'platform.security' },
    ],
  },
]

export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  agent: AGENT_NAV,
  supervisor: SUPERVISOR_NAV,
  tenant_admin: TENANT_ADMIN_NAV,
  platform_operator: PLATFORM_ADMIN_NAV,
  platform_admin: PLATFORM_ADMIN_NAV,
}

export const ROLE_HOME_PATH: Record<Role, string> = {
  agent: '/agent',
  supervisor: '/supervisor',
  tenant_admin: '/tenant-admin',
  platform_operator: '/platform-admin',
  platform_admin: '/platform-admin',
}
