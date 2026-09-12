export interface MockTenant {
  tenantId: string
  tenantName: string
  plan: string
  status: 'active' | 'suspended'
}

/** Demo-only tenant directory for the Platform Admin "Tenants" screen and tenant-impersonation flow. */
export const MOCK_TENANTS: MockTenant[] = [
  { tenantId: 'smith-transport', tenantName: 'Smith Transport', plan: 'Growth', status: 'active' },
  { tenantId: 'ridgeline-logistics', tenantName: 'Ridgeline Logistics', plan: 'Scale', status: 'active' },
  { tenantId: 'northwind-capital', tenantName: 'Northwind Capital', plan: 'Starter', status: 'suspended' },
]
