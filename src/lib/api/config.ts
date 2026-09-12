/**
 * Real-API mode configuration.
 *
 * There is no real end-user auth flow yet (Middleware's real endpoints are
 * machine-to-machine/Keycloak-service-account authenticated; nothing
 * establishes a human agent's own browser session against it). Until that
 * exists, "real mode" attaches a manually-configured bearer token — a
 * development stand-in, never a production auth mechanism. Demo mode
 * (mock data, no network calls) remains the default and always works.
 */

const DEV_TOKEN_STORAGE_KEY = 'codestra.devApiToken'

export function isRealApiModeEnabled(): boolean {
  return import.meta.env.VITE_USE_REAL_API === 'true'
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_MIDDLEWARE_API_BASE_URL ?? ''
}

export function getDevApiToken(): string | null {
  try {
    return localStorage.getItem(DEV_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setDevApiToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(DEV_TOKEN_STORAGE_KEY, token)
    else localStorage.removeItem(DEV_TOKEN_STORAGE_KEY)
  } catch {
    // localStorage may be unavailable (private browsing) — real mode simply
    // won't have a token to attach; callers already handle "no token".
  }
}

/** Real mode requires both the build-time flag and a configured dev token. */
export function isRealApiModeActive(): boolean {
  return isRealApiModeEnabled() && Boolean(getDevApiToken())
}
