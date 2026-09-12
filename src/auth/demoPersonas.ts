import type { Session } from './AuthContext'

/**
 * Demo-only seed data for the sign-in screen. Exercises the 3-scope model:
 * platform role, tenant membership(s), and campaign membership(s) are all
 * independent — a real backend would derive these from Keycloak + Odoo.
 */
export interface DemoPersona {
  id: string
  label: string
  description: string
  session: Session
}

const SMITH_TRANSPORT = { tenantId: 'smith-transport', tenantName: 'Smith Transport' }
const TRANSPORTATION = { campaignId: 'transportation', campaignName: 'Transportation', tenantId: SMITH_TRANSPORT.tenantId }
const STUDENT_REPAYMENT = { campaignId: 'student-repayment', campaignName: 'Student Repayment', tenantId: SMITH_TRANSPORT.tenantId }

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'agent',
    label: 'Agent — Alex Rivera',
    description: 'Campaign agent in Transportation only.',
    session: {
      userId: 'demo-agent',
      name: 'Alex Rivera',
      email: 'alex.rivera@smithtransport.test',
      platformRole: 'none',
      tenantMemberships: [{ ...SMITH_TRANSPORT, role: 'member' }],
      campaignMemberships: [{ ...TRANSPORTATION, role: 'agent' }],
      activeTenantId: SMITH_TRANSPORT.tenantId,
      activeCampaignId: TRANSPORTATION.campaignId,
    },
  },
  {
    id: 'supervisor',
    label: 'Supervisor — Jordan Lee',
    description: 'Supervises the Transportation campaign only.',
    session: {
      userId: 'demo-supervisor',
      name: 'Jordan Lee',
      email: 'jordan.lee@smithtransport.test',
      platformRole: 'none',
      tenantMemberships: [{ ...SMITH_TRANSPORT, role: 'member' }],
      campaignMemberships: [{ ...TRANSPORTATION, role: 'supervisor' }],
      activeTenantId: SMITH_TRANSPORT.tenantId,
      activeCampaignId: TRANSPORTATION.campaignId,
    },
  },
  {
    id: 'tenant-admin',
    label: 'Tenant Admin — Priya Nair',
    description: 'Runs Smith Transport; no campaign membership.',
    session: {
      userId: 'demo-tenant-admin',
      name: 'Priya Nair',
      email: 'priya.nair@smithtransport.test',
      platformRole: 'none',
      tenantMemberships: [{ ...SMITH_TRANSPORT, role: 'tenant_admin' }],
      campaignMemberships: [],
      activeTenantId: SMITH_TRANSPORT.tenantId,
      activeCampaignId: null,
    },
  },
  {
    id: 'tenant-admin-and-supervisor',
    label: 'Tenant Admin + Supervisor (Transportation only) — Sam Okafor',
    description:
      'Proves scope isolation: tenant_admin of Smith Transport, ALSO supervisor of Transportation, but has no membership at all in Student Repayment.',
    session: {
      userId: 'demo-multi-scope',
      name: 'Sam Okafor',
      email: 'sam.okafor@smithtransport.test',
      platformRole: 'none',
      tenantMemberships: [{ ...SMITH_TRANSPORT, role: 'tenant_admin' }],
      campaignMemberships: [{ ...TRANSPORTATION, role: 'supervisor' }],
      activeTenantId: SMITH_TRANSPORT.tenantId,
      activeCampaignId: TRANSPORTATION.campaignId,
    },
  },
  {
    id: 'platform-operator',
    label: 'Platform Operator — Morgan Ives',
    description: 'Codestra ops; cross-tenant read/ops only, no billing or security authority.',
    session: {
      userId: 'demo-platform-operator',
      name: 'Morgan Ives',
      email: 'morgan.ives@codestra.co',
      platformRole: 'platform_operator',
      tenantMemberships: [],
      campaignMemberships: [],
      activeTenantId: null,
      activeCampaignId: null,
    },
  },
  {
    id: 'platform-admin',
    label: 'Platform Admin — Dana Whitfield',
    description: 'Runs the Codestra SaaS business globally.',
    session: {
      userId: 'demo-platform-admin',
      name: 'Dana Whitfield',
      email: 'dana.whitfield@codestra.co',
      platformRole: 'platform_admin',
      tenantMemberships: [],
      campaignMemberships: [],
      activeTenantId: null,
      activeCampaignId: null,
    },
  },
]

export const STUDENT_REPAYMENT_CAMPAIGN = STUDENT_REPAYMENT
