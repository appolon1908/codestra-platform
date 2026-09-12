import { useNavigate } from 'react-router-dom'
import { Card, CardTitle } from '@/components/container/Card'
import { Table } from '@/components/data/Table'
import { Badge } from '@/components/status/Badge'
import { Button } from '@/components/core/Button'
import { MOCK_TENANTS, type MockTenant } from '@/app/mockTenants'
import { useAuth } from '@/auth/AuthContext'

export function PlatformAdminTenants() {
  const { setActiveTenant, setActiveCampaign } = useAuth()
  const navigate = useNavigate()

  function viewAsTenantAdmin(tenantId: string) {
    // Explicit, visible context switch — never implicit. AppShell renders a
    // persistent "Viewing tenant" banner for as long as this is active.
    setActiveCampaign(null)
    setActiveTenant(tenantId)
    navigate('/tenant-admin')
  }

  return (
    <Card>
      <CardTitle>Tenants</CardTitle>
      <div className="mt-3">
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
          rows={MOCK_TENANTS}
          getRowKey={(row) => row.tenantId}
        />
      </div>
    </Card>
  )
}
