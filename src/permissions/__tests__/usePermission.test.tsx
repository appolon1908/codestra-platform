import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import type { Session } from '@/auth/AuthContext'
import { usePermission } from '../usePermission'

const tenantAdminSession: Session = {
  userId: 'u1',
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  role: 'tenant_admin',
  tenantId: 't1',
  tenantName: 'Acme Co',
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
  it('returns no role and denies everything when signed out', () => {
    const { result } = renderHook(() => usePermission(), { wrapper })
    expect(result.current.role).toBeNull()
    expect(result.current.can('workspace.telephony')).toBe(false)
  })

  it('reflects the signed-in session role after signIn', () => {
    const { result } = renderHook(() => useAuthAndPermission(), { wrapper })

    expect(result.current.permission.role).toBeNull()

    act(() => {
      result.current.auth.signIn(tenantAdminSession)
    })

    expect(result.current.permission.role).toBe('tenant_admin')
    expect(result.current.permission.can('tenant.billing')).toBe(true)
    expect(result.current.permission.can('platform.security')).toBe(false)
  })

  it('clears permissions after signOut', () => {
    const { result } = renderHook(() => useAuthAndPermission(), { wrapper })

    act(() => {
      result.current.auth.signIn(tenantAdminSession)
    })
    expect(result.current.permission.role).toBe('tenant_admin')

    act(() => {
      result.current.auth.signOut()
    })
    expect(result.current.permission.role).toBeNull()
    expect(result.current.permission.can('tenant.billing')).toBe(false)
  })
})
