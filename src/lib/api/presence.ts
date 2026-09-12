import { apiGet } from './client'

export type PresenceState = 'available' | 'busy' | 'pause' | 'after_call_work' | 'offline'

export interface AgentPresence {
  agent_id: string
  state: PresenceState
  changed_at: string
}

export function fetchAgentsPresence(params?: { tenantId?: string }) {
  return apiGet<{ items: AgentPresence[] }>('/platform/v1/agents/presence', { tenant_id: params?.tenantId })
}

export function fetchMyPresence() {
  return apiGet<AgentPresence>('/platform/v1/me/presence')
}
