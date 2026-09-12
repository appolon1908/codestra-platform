import { apiGet } from './client'

/**
 * Field names here are inferred from the supervisor console's own KPI
 * tiles (agents online / active calls / waiting / service level / ASA /
 * abandonment / AHT), not copied from a verified Middleware response body —
 * this repo's fork could not read `Middleware-`'s `queues.py` source
 * directly. Treat as best-effort; the UI already tolerates missing fields
 * (falls back to the mock tile value) so a contract mismatch degrades
 * gracefully rather than crashing.
 */
export interface QueueMetrics {
  agents_online?: number
  active_calls?: number
  waiting?: number
  service_level_pct?: number
  asa_seconds?: number
  abandonment_pct?: number
  aht_seconds?: number
}

export function fetchQueueMetrics(queueId: string) {
  return apiGet<QueueMetrics>(`/platform/v1/queues/${encodeURIComponent(queueId)}/metrics`)
}
