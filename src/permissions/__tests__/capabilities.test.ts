import { describe, expect, it } from 'vitest'
import { resolveCapabilities } from '../capabilities'
import type { Session } from '@/auth/AuthContext'

const SMITH = { tenantId: 'smith-transport', tenantName: 'Smith Transport' }
const TRANSPORTATION = { campaignId: 'transportation', campaignName: 'Transportation', tenantId: SMITH.tenantId }
const STUDENT_REPAYMENT = { campaignId: 'student-repayment', campaignName: 'Student Repayment', tenantId: SMITH.tenantId }

function session(overrides: Partial<Session>): Session {
  return {
    userId: 'u1',
    name: 'Test User',
    email: 'test@example.com',
    platformRole: 'none',
    tenantMemberships: [],
    campaignMemberships: [],
    activeTenantId: null,
    activeCampaignId: null,
    ...overrides,
  }
}

describe('resolveCapabilities — three independent scopes, not one inheritance chain', () => {
  it('grants an agent only their campaign-scoped capabilities', () => {
    const s = session({
      tenantMemberships: [{ ...SMITH, role: 'member' }],
      campaignMemberships: [{ ...TRANSPORTATION, role: 'agent' }],
      activeTenantId: SMITH.tenantId,
      activeCampaignId: TRANSPORTATION.campaignId,
    })
    const caps = resolveCapabilities(s, s.activeTenantId, s.activeCampaignId)
    expect(caps.has('calls.answer')).toBe(true)
    expect(caps.has('calls.monitor')).toBe(false)
    expect(caps.has('tenant.billing.manage')).toBe(false)
  })

  it('does NOT grant a tenant_admin any campaign-scoped capability without an actual campaign membership', () => {
    const s = session({
      tenantMemberships: [{ ...SMITH, role: 'tenant_admin' }],
      campaignMemberships: [],
      activeTenantId: SMITH.tenantId,
      activeCampaignId: null,
    })
    const caps = resolveCapabilities(s, s.activeTenantId, s.activeCampaignId)
    expect(caps.has('tenant.users.manage')).toBe(true)
    expect(caps.has('calls.monitor')).toBe(false)
    expect(caps.has('calls.whisper')).toBe(false)
    expect(caps.has('calls.barge')).toBe(false)
    expect(caps.has('qa.score')).toBe(false)
  })

  it('grants supervisor capabilities only for the active campaign, isolating a second campaign in the same tenant', () => {
    const s = session({
      tenantMemberships: [{ ...SMITH, role: 'tenant_admin' }],
      campaignMemberships: [{ ...TRANSPORTATION, role: 'supervisor' }],
      activeTenantId: SMITH.tenantId,
      activeCampaignId: TRANSPORTATION.campaignId,
    })
    const capsInTransportation = resolveCapabilities(s, s.activeTenantId, s.activeCampaignId)
    expect(capsInTransportation.has('calls.monitor')).toBe(true)
    expect(capsInTransportation.has('calls.barge')).toBe(true)

    // Same person, no membership at all in Student Repayment — switching the
    // active campaign must strip the campaign-scoped grants immediately.
    const capsInStudentRepayment = resolveCapabilities(s, s.activeTenantId, STUDENT_REPAYMENT.campaignId)
    expect(capsInStudentRepayment.has('calls.monitor')).toBe(false)
    expect(capsInStudentRepayment.has('calls.barge')).toBe(false)
    expect(capsInStudentRepayment.has('calls.answer')).toBe(false)
    // Tenant-scoped grants are unaffected by the campaign switch.
    expect(capsInStudentRepayment.has('tenant.users.manage')).toBe(true)
  })

  it('gives platform operators cross-tenant read/ops access without billing or security authority', () => {
    const s = session({ platformRole: 'platform_operator' })
    const caps = resolveCapabilities(s, null, null)
    expect(caps.has('platform.operations.read')).toBe(true)
    expect(caps.has('platform.tenants.read')).toBe(true)
    expect(caps.has('platform.tenants.manage')).toBe(false)
    expect(caps.has('platform.billing.manage')).toBe(false)
    expect(caps.has('platform.security.manage')).toBe(false)
    expect(caps.has('platform.provisioning.manage')).toBe(false)
  })

  it('gives platform admins the full platform-scope capability set', () => {
    const s = session({ platformRole: 'platform_admin' })
    const caps = resolveCapabilities(s, null, null)
    expect(caps.has('platform.tenants.manage')).toBe(true)
    expect(caps.has('platform.billing.manage')).toBe(true)
    expect(caps.has('platform.security.manage')).toBe(true)
    expect(caps.has('platform.provisioning.manage')).toBe(true)
  })

  it('lets a platform admin administer a tenant only after explicitly entering that tenant context', () => {
    const s = session({ platformRole: 'platform_admin' })
    const before = resolveCapabilities(s, null, null)
    expect(before.has('tenant.users.manage')).toBe(false)

    const after = resolveCapabilities(s, 'ridgeline-logistics', null)
    expect(after.has('tenant.users.manage')).toBe(true)
  })

  it('never grants tenant-admin capabilities to a platform_operator entering a tenant id', () => {
    const s = session({ platformRole: 'platform_operator' })
    const caps = resolveCapabilities(s, 'ridgeline-logistics', null)
    expect(caps.has('tenant.users.manage')).toBe(false)
  })

  it('returns no capabilities for a signed-out session', () => {
    expect(resolveCapabilities(null, null, null).size).toBe(0)
  })
})
