import { apiGet } from './client'

/**
 * `GET /platform/v1/tenants` exists only on Middleware PR #265
 * (`feat/agent-admin-workspace-api-gaps-20260912`) as of this writing, not
 * yet merged to main. Callers must treat a failure here (404, network
 * error, mode disabled) as expected-until-merged, not a hard error — fall
 * back to the existing mock tenant directory with a visible stale-data
 * notice rather than blanking the screen.
 */
export interface RealTenant {
  tenant_id: string
  name: string
  plan: string
  status: string
}

export function fetchTenants() {
  return apiGet<{ items: RealTenant[] }>('/platform/v1/tenants')
}
