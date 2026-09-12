import { apiGet } from './client'

/**
 * Matches Middleware's `_call_out()` in `app/api/v1/calls.py` exactly
 * (verified against that file's source this session). `lead_model`/
 * `lead_id` are only present once the pending PR that adds CRM linkage
 * (Middleware PR #265) is merged — treat them as optional.
 */
export interface RealCallRecord {
  call_id: string
  correlation_id: string
  lifecycle_state: string
  source_extension: string | null
  destination: string | null
  dialplan_context: string | null
  disposition: string | null
  hangup_cause: string | null
  started_at: string | null
  connected_at: string | null
  ended_at: string | null
  lead_model?: string | null
  lead_id?: string | number | null
}

export interface CallsPage {
  items: RealCallRecord[]
  next_cursor?: string | null
}

export function fetchCalls(params?: { tenantId?: string; cursor?: string }) {
  return apiGet<CallsPage>('/platform/v1/calls', {
    tenant_id: params?.tenantId,
    cursor: params?.cursor,
  })
}

export function fetchCall(callId: string) {
  return apiGet<RealCallRecord>(`/platform/v1/calls/${encodeURIComponent(callId)}`)
}
