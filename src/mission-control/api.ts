import { accessToken, ensureAccessToken } from './auth'

/**
 * Use the browser's origin by default. A 127.0.0.1 URL in a production
 * bundle points at the visitor's computer, not Codestra's API server.
 * Caddy/Kong must explicitly proxy /platform/v1/dashboard/* or supply
 * VITE_MC_API_BASE_URL for a separately secured gateway.
 */
export const MC_API = String(import.meta.env.VITE_MC_API_BASE_URL || '').replace(/\/$/, '')

export function missionUrl(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error('Mission Control API requires a relative endpoint path')
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://codestra.invalid'
  const base = MC_API ? new URL(MC_API, origin) : new URL(origin)
  if (!['http:', 'https:'].includes(base.protocol)) {
    throw new Error('Mission Control API must use HTTP or HTTPS')
  }
  return new URL(path, base).toString()
}

export class MissionApiError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'MissionApiError'
    this.status = status
  }
}

export async function mcFetch(path: string, init: RequestInit = {}): Promise<Response> {
  await ensureAccessToken()
  const token = accessToken()
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (token) headers.set('Authorization', 'Bearer ' + token)
  let response: Response
  try {
    response = await fetch(missionUrl(path), {
      ...init,
      headers,
      credentials: 'omit',
      signal: init.signal,
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new MissionApiError('Cannot connect to the Mission Control API. Check the gateway and API configuration.')
  }
  if (response.status === 401) {
    sessionStorage.removeItem('mission-control.access-token')
    throw new MissionApiError('Session expired or login required. Sign in and retry.', 401)
  }
  if (response.status === 403) throw new MissionApiError('You do not have permission to view this information.', 403)
  return response
}

export async function mcJson<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await mcFetch(path, init)
  if (!response.ok) throw new MissionApiError('Mission Control API returned HTTP ' + response.status + '.', response.status)
  try {
    return (await response.json()) as T
  } catch {
    throw new MissionApiError('Mission Control API returned an invalid JSON response.')
  }
}

/** Do not build an insecure localhost websocket connection in client browsers. */
export function missionWebSocketUrl(): string | null {
  const url = String(import.meta.env.VITE_MC_WS_URL || '')
  if (!url) return null
  try {
    const parsed = new URL(url, window.location.origin)
    const securePage = window.location.protocol === 'https:'
    if (url.startsWith('/') && !url.startsWith('//')) parsed.protocol = securePage ? 'wss:' : 'ws:'
    if (!['ws:', 'wss:'].includes(parsed.protocol) || (securePage && parsed.protocol !== 'wss:')) return null
    return parsed.toString()
  } catch {
    return null
  }
}
