import { getApiBaseUrl, getDevApiToken, isRealApiModeEnabled } from './config'

export type ApiFailureReason = 'mode-disabled' | 'no-token' | 'network' | 'http'

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: ApiFailureReason; status?: number; message: string }

/**
 * Thin fetch wrapper for Middleware's real platform APIs. Every caller must
 * handle the non-ok branches explicitly (no silent fallback to fabricated
 * data) — screens decide what to render for each `reason`, typically via
 * the shared `StatePanel` component.
 */
export async function apiGet<T>(path: string, query?: Record<string, string | undefined>): Promise<ApiResult<T>> {
  if (!isRealApiModeEnabled()) {
    return { ok: false, reason: 'mode-disabled', message: 'Real API mode is not enabled.' }
  }
  const token = getDevApiToken()
  if (!token) {
    return { ok: false, reason: 'no-token', message: 'No development API token is configured.' }
  }

  const url = new URL(path, getApiBaseUrl() || window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value)
  }

  let response: Response
  try {
    response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
  } catch (error) {
    return { ok: false, reason: 'network', message: error instanceof Error ? error.message : 'Network error.' }
  }

  if (!response.ok) {
    return { ok: false, reason: 'http', status: response.status, message: `Request failed with status ${response.status}.` }
  }

  try {
    const data = (await response.json()) as T
    return { ok: true, data }
  } catch {
    return { ok: false, reason: 'http', status: response.status, message: 'Response was not valid JSON.' }
  }
}
