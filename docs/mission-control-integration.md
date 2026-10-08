# Mission Control: real API integration and UI acceptance gate

The dashboard is NOT an independently certified source of truth while its API
is unreachable. The frontend queries existing `/platform/v1/dashboard/*`
endpoints through the browser origin (Caddy -> Kong -> Mission Control service).
It does not connect to the visitor's own localhost.

## Deployment prerequisites

- Deploy a legitimate authenticated **read-only** Mission Control API. It must
  implement `/platform/v1/dashboard/contract`, `repositories`, `agents`,
  `tasks?repository=...`, `local-work?repository=...`, and `task?task_id=...`.
  The service on 8790 was **not reachable** from the development desktop or
  the Middleware host during the 2026-10-08 review. Middleware's 8095 OpenAPI
  did not list these dashboard endpoints (GET returned 404).
- Proxy the API via Caddy -> Kong; strip untrusted identity headers, validate
  Keycloak issuer/audience/scopes, deny unknown/unauthorized tenants, and
  restrict internal metrics and admin surfaces. The client uses a bearer
  obtained through OIDC/PKCE; `VITE_MC_AUTH_REQUIRED` defaults to true.
- Configure `VITE_MC_OIDC_ISSUER`, `VITE_MC_OIDC_CLIENT_ID`, and optionally
  `VITE_MC_API_BASE_URL` for a distinct TLS endpoint. For WebSocket event
  updates, supply `VITE_MC_WS_URL` (same-origin path or secure WSS URL).
  Missing WebSocket settings show OFFLINE, not an invented connected status.
- Require a fresh authenticated end-to-end check with
  `MC_API_URL=https://<staging-gateway> MC_ACCESS_TOKEN=<short-lived-token>
  node scripts/check-mission-control-integration.mjs`. Never write tokens to
  logs, source files, or CI artifacts.
- Read-only scope only: production_go=false, live_capabilities_enabled=false,
  external_effects_enabled=false. Full release certification also needs
  cross-repo Caddy/Kong/Middleware contract parity, independent review,
  observation of exact SHA, and negative authorization/tenant tests.

## UI behavior

Live agent rows inspect actual state and open associated repository work.
Repository cards open authenticated work/task APIs. PR Control lists real API
counts and links to GitHub's live PR queues (not fabricated PR rows).
Task deep links navigate to their actual repository. Errors are visible
with retry, success timestamps, responsive layouts, and accessible labels.
If the backend fails, the interface clearly marks data as stale or unavailable.

Not yet proven: live clicks in deployed browsers, accessibility audit of all
application screens, production domain/DNS routing, external provider callbacks,
and full staging runtime certification. Do not claim that this source repair
alone completes those checks.
