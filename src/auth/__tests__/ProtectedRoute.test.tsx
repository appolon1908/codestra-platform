import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider, useAuth } from '../AuthContext'
import { ProtectedRoute } from '../ProtectedRoute'
import type { Session } from '../AuthContext'

const tenantAdminOnlySession: Session = {
  userId: 'u1',
  name: 'Priya Nair',
  email: 'priya@example.com',
  platformRole: 'none',
  tenantMemberships: [{ tenantId: 'smith-transport', tenantName: 'Smith Transport', role: 'tenant_admin' }],
  campaignMemberships: [],
  activeTenantId: 'smith-transport',
  activeCampaignId: null,
}

function renderProtected(session: Session, initialPath: string, protectedProps: Partial<React.ComponentProps<typeof ProtectedRoute>>) {
  function Bootstrap() {
    const { signIn, session: current } = useAuth()
    if (!current) {
      signIn(session)
      return null
    }
    return (
      <Routes>
        <Route path="/sign-in" element={<div>sign-in page</div>} />
        <Route path="/not-authorized" element={<div>not authorized</div>} />
        <Route
          path={initialPath}
          element={
            <ProtectedRoute {...protectedProps}>
              <div>protected content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    )
  }

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Bootstrap />
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('ProtectedRoute', () => {
  it('redirects to sign-in when there is no session', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/tenant-admin']}>
          <Routes>
            <Route path="/sign-in" element={<div>sign-in page</div>} />
            <Route
              path="/tenant-admin"
              element={
                <ProtectedRoute surface="tenant-admin">
                  <div>protected content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByText('sign-in page')).toBeInTheDocument()
  })

  it('redirects to not-authorized when the session lacks the required surface', () => {
    renderProtected(tenantAdminOnlySession, '/supervisor', { surface: 'supervisor' })
    expect(screen.getByText('not authorized')).toBeInTheDocument()
  })

  it('redirects to not-authorized when the session lacks the required capability', () => {
    renderProtected(tenantAdminOnlySession, '/tenant-admin', {
      surface: 'tenant-admin',
      capability: 'platform.security.manage',
    })
    expect(screen.getByText('not authorized')).toBeInTheDocument()
  })

  it('renders children when surface and capability checks pass', () => {
    renderProtected(tenantAdminOnlySession, '/tenant-admin', {
      surface: 'tenant-admin',
      capability: 'tenant.users.manage',
    })
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })
})
