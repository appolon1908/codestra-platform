import { describe, expect, it } from 'vitest'
import { can, canAny } from '../capabilities'

describe('role capability matrix', () => {
  it('keeps agents scoped to their workspace only', () => {
    expect(can('agent', 'workspace.telephony')).toBe(true)
    expect(can('agent', 'workspace.crm')).toBe(true)
    expect(can('agent', 'tenant.billing')).toBe(false)
    expect(can('agent', 'tenant.integrations')).toBe(false)
    expect(can('agent', 'platform.tenants')).toBe(false)
    expect(can('agent', 'platform.provisioning')).toBe(false)
  })

  it('lets supervisors manage their team and queues but not tenant billing', () => {
    expect(can('supervisor', 'team.manage')).toBe(true)
    expect(can('supervisor', 'queue.manage')).toBe(true)
    expect(can('supervisor', 'tenant.billing')).toBe(false)
  })

  it('scopes tenant admins to their own tenant, never cross-tenant platform controls', () => {
    expect(can('tenant_admin', 'tenant.users')).toBe(true)
    expect(can('tenant_admin', 'tenant.billing')).toBe(true)
    expect(can('tenant_admin', 'tenant.integrations')).toBe(true)
    expect(can('tenant_admin', 'platform.tenants')).toBe(false)
    expect(can('tenant_admin', 'platform.odoo_mapping')).toBe(false)
    expect(can('tenant_admin', 'platform.security')).toBe(false)
  })

  it('gives platform operators cross-tenant operational access without billing or security', () => {
    expect(can('platform_operator', 'platform.tenants')).toBe(true)
    expect(can('platform_operator', 'platform.telephony')).toBe(true)
    expect(can('platform_operator', 'platform.communications')).toBe(true)
    expect(can('platform_operator', 'platform.billing')).toBe(false)
    expect(can('platform_operator', 'platform.security')).toBe(false)
    expect(can('platform_operator', 'platform.provisioning')).toBe(false)
  })

  it('gives platform admins the full capability set', () => {
    expect(can('platform_admin', 'platform.billing')).toBe(true)
    expect(can('platform_admin', 'platform.odoo_mapping')).toBe(true)
    expect(can('platform_admin', 'platform.security')).toBe(true)
    expect(can('platform_admin', 'platform.provisioning')).toBe(true)
  })

  it('canAny returns true when the role holds at least one of the listed capabilities', () => {
    expect(canAny('agent', ['tenant.billing', 'workspace.telephony'])).toBe(true)
    expect(canAny('agent', ['tenant.billing', 'platform.security'])).toBe(false)
  })
})
