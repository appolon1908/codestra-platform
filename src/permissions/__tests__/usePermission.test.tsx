import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import type { Session } from '@/auth/AuthContext'
import { usePermission } from '../usePermission'

const SMITH = { tenantId: 'smith-transport', tenantName: 'Smith Transport' }
const TRANSPORTATION = { campaignId: 'transportation', campaignName: 'Transportation', tenantId: SMITH.tenantId }
const STUDENT_REPAYMENT = { campaignId: 'student-repayment', campaignName: 'Student Repayment', tenantId: SMITH.tenantId }

const multiScopeSession: Session = {
  userId: 'u1',
  name: 'Sam Okafor',
  email: 'sam@example.com',
  platformRole: 'none',
  tenantMemberships: [{ ...SMITH, role: 'tenant_admin' }],
  campaignMemberships: [{ ...TRANSPORTATION, role: 'supervisor' }],
  activeTenantId: SMITH.tenantId,
  activeCampaignId: TRANSPORTATION.campaignId,
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

function useAuthAndPermission() {
  const auth = useAuth()
  const permission = usePermission()
  return { auth, permission }
}

describe('usePermission', () => {
  it('denies everything and reports no surfaces when signed out', () => {
    const { result } = renderHook(() => usePermission(), { wrapper })
    expect(result.current.platformRole).toBe('none')
    expect(result.current.availableSurfaces).toEqual([])
    expect(result.current.can('calls.answer')).toBe(false)
  })

  it('is tenant_admin in tenant scope and supervisor in campaign scope for the same person, isolated from a second campaign', () => {
    const { result } = renderHook(() => useAuthAndPermission(), { wrapper })

    act(() => {
      result.current.auth.signIn(multiScopeSession)
    })

    expect(result.current.permission.can('tenant.users.manage')).toBe(true)
    expect(result.current.permission.can('calls.monitor')).toBe(true)
    expect(result.current.permission.availableSurfaces).toEqual(
      expect.arrayContaining(['agent', 'supervisor', 'tenant-admin']),
    )
    expect(result.current.permission.availableSurfaces).not.toContain('platform-admin')

    act(() => {
      result.current.auth.setActiveCampaign(STUDENT_REPAYMENT.campaignId)
    })
    expect(result.current.permission.can('calls.monitor')).toBe(false)
    // Tenant-scoped capability is unaffected by the campaign switch.
    expect(result.current.permission.can('tenant.users.manage')).toBe(true)
  })

  it('clears permissions and active context after signOut', () => {
    const { result } = renderHook(() => useAuthAndPermission(), { wrapper })

    act(() => {
      result.current.auth.signIn(multiScopeSession)
    })
    expect(result.current.permission.can('tenant.users.manage')).toBe(true)

    act(() => {
      result.current.auth.signOut()
    })
    expect(result.current.permission.can('tenant.users.manage')).toBe(false)
    expect(result.current.permission.availableSurfaces).toEqual([])
  })
})
