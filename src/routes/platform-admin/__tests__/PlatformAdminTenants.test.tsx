import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import type { Session } from '@/auth/AuthContext'
import { PlatformAdminTenants } from '../PlatformAdminTenants'

const platformAdminSession: Session = {
  userId: 'u1',
  name: 'Dana Whitfield',
  email: 'dana@example.com',
  platformRole: 'platform_admin',
  tenantMemberships: [],
  campaignMemberships: [],
  activeTenantId: null,
  activeCampaignId: null,
}

function Bootstrap() {
  const { signIn, session } = useAuth()
  if (!session) {
    signIn(platformAdminSession)
    return null
  }
  return <PlatformAdminTenants />
}

function renderScreen() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Bootstrap />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('PlatformAdminTenants', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('shows the mock tenant directory when real API mode is disabled', async () => {
    vi.stubEnv('VITE_USE_REAL_API', 'false')
    renderScreen()

    expect(await screen.findByText('Smith Transport')).toBeInTheDocument()
    expect(screen.getByText('Demo data — enable real API mode for live tenants.')).toBeInTheDocument()
  })

  it('falls back to mock tenants with a stale-data notice when the real fetch fails', async () => {
    vi.stubEnv('VITE_USE_REAL_API', 'true')
    localStorage.setItem('codestra.devApiToken', 'secret-token')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    renderScreen()

    await waitFor(() => expect(screen.getByText(/last known tenant directory/i)).toBeInTheDocument())
    expect(screen.getByText('Smith Transport')).toBeInTheDocument()
  })

  it('renders real tenant data when the fetch succeeds', async () => {
    vi.stubEnv('VITE_USE_REAL_API', 'true')
    localStorage.setItem('codestra.devApiToken', 'secret-token')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [{ tenant_id: 'acme', name: 'Acme Corp', plan: 'Enterprise', status: 'active' }],
        }),
      }),
    )

    renderScreen()

    expect(await screen.findByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Smith Transport')).not.toBeInTheDocument()
  })
})
