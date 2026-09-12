import { apiGet } from './client'

export interface ActivityItem {
  id: string
  source: 'audit_event' | 'agent_provisioning_audit' | string
  occurred_at: string
  title: string
  actor?: string | null
  metadata?: string | null
}

export function fetchActivity(params?: { tenantId?: string; cursor?: string }) {
  return apiGet<{ items: ActivityItem[]; next_cursor?: string | null }>('/platform/v1/activity', {
    tenant_id: params?.tenantId,
    cursor: params?.cursor,
  })
}
