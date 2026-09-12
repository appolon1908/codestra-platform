import { useNavigate } from 'react-router-dom'
import { Card, CardTitle } from '@/components/container/Card'
import { Table } from '@/components/data/Table'
import { Badge } from '@/components/status/Badge'
import { Button } from '@/components/core/Button'
import { StatePanel } from '@/components/feedback/StatePanel'
import { MOCK_TENANTS, type MockTenant } from '@/app/mockTenants'
import { useAuth } from '@/auth/AuthContext'
import { fetchTenants } from '@/lib/api/tenants'
import { useApiResource } from '@/lib/api/useApiResource'
import { isRealApiModeEnabled } from '@/lib/api/config'

function toMockShape(status: string): MockTenant['status'] {
  return status === 'active' ? 'active' : 'suspended'
}

export function PlatformAdminTenants() {
  const { setActiveTenant, setActiveCampaign } = useAuth()
  const navigate = useNavigate()
  const tenants = useApiResource(fetchTenants, [])

  function viewAsTenantAdmin(tenantId: string) {
    // Explicit, visible context switch — never implicit. AppShell renders a
    // persistent "Viewing tenant" banner for as long as this is active.
    setActiveCampaign(null)
    setActiveTenant(tenantId)
    navigate('/tenant-admin')
  }

  // Real mode is off, or no dev token configured — this is the expected
  // demo-mode path, not an error, so no stale-data notice.
  const usingMockFallback = !isRealApiModeEnabled() || tenants.status === 'unavailable'
  const rows: MockTenant[] =
    tenants.status === 'ready'
      ? tenants.data.items.map((t) => ({ tenantId: t.tenant_id, tenantName: t.name, plan: t.plan, status: toMockShape(t.status) }))
      : MOCK_TENANTS

  return (
    <Card>
      <CardTitle>Tenants</CardTitle>
      <div className="mt-3 flex flex-col gap-3">
        {tenants.status === 'loading' && isRealApiModeEnabled() && <StatePanel state="loading" />}
        {isRealApiModeEnabled() && tenants.status === 'unavailable' && tenants.reason !== 'mode-disabled' && tenants.reason !== 'no-token' && (
          <StatePanel
            state="stale-data"
            description="Live tenant data could not be fetched. Showing the last known tenant directory."
          />
        )}
        {(tenants.status !== 'loading' || !isRealApiModeEnabled()) && (
          <Table<MockTenant>
            columns={[
              { key: 'name', header: 'Tenant', render: (row) => row.tenantName },
              { key: 'plan', header: 'Plan', render: (row) => row.plan },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <Badge status={row.status === 'active' ? 'success' : 'warning'}>{row.status}</Badge>,
              },
              {
                key: 'actions',
                header: 'Actions',
                align: 'right',
                render: (row) => (
                  <Button variant="secondary" size="sm" onClick={() => viewAsTenantAdmin(row.tenantId)}>
                    View as Tenant Admin
                  </Button>
                ),
              },
            ]}
            rows={rows}
            getRowKey={(row) => row.tenantId}
          />
        )}
        {usingMockFallback && tenants.status !== 'loading' && (
          <span className="text-[length:var(--text-small)] text-[var(--color-text-muted)]">
            {isRealApiModeEnabled() ? 'Falling back to cached tenant data.' : 'Demo data — enable real API mode for live tenants.'}
          </span>
        )}
      </div>
    </Card>
  )
}
