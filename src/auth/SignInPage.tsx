import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/core/Button'
import { Select } from '@/components/form/Select'
import { Input } from '@/components/form/Input'
import { Card, CardTitle } from '@/components/container/Card'
import { deriveHomePath } from '@/app/nav'
import { DEMO_PERSONAS } from './demoPersonas'
import { useAuth } from './AuthContext'
import { getDevApiToken, isRealApiModeEnabled, setDevApiToken } from '@/lib/api/config'

interface LocationState {
  from?: { pathname: string }
}

export function SignInPage() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [personaId, setPersonaId] = useState(DEMO_PERSONAS[0].id)
  const [devToken, setDevToken] = useState(() => getDevApiToken() ?? '')

  if (session) {
    const state = location.state as LocationState | null
    return <Navigate to={state?.from?.pathname ?? deriveHomePath(session)} replace />
  }

  const persona = DEMO_PERSONAS.find((p) => p.id === personaId) ?? DEMO_PERSONAS[0]

  function handleSignIn() {
    signIn(persona.session)
    navigate(deriveHomePath(persona.session), { replace: true })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-nav-background)] p-6">
      <Card className="w-full max-w-md" padding="md">
        <div className="flex flex-col gap-4">
          <CardTitle>Sign in to Codestra</CardTitle>
          <p className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">
            Demo sign-in — pick a persona to exercise platform/tenant/campaign scopes independently. A real
            deployment authenticates through Keycloak and derives this from Odoo membership records.
          </p>
          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Persona
            <Select
              value={personaId}
              onValueChange={setPersonaId}
              options={DEMO_PERSONAS.map((p) => ({ value: p.id, label: p.label }))}
            />
          </label>
          <p className="text-[length:var(--text-small)] text-[var(--color-text-muted)]">{persona.description}</p>
          <Button size="lg" onClick={handleSignIn}>
            Sign in
          </Button>

          {isRealApiModeEnabled() && (
            <div className="flex flex-col gap-1 border-t border-[var(--color-surface-border)] pt-4">
              <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
                Development API token
                <Input
                  type="password"
                  value={devToken}
                  onChange={(event) => {
                    const next = event.target.value
                    setDevToken(next)
                    setDevApiToken(next || null)
                  }}
                  placeholder="Bearer token for real Middleware API calls"
                />
              </label>
              <p className="text-[length:var(--text-small)] text-[var(--color-text-muted)]">
                Development stand-in only — there is no real Keycloak sign-in flow yet. Screens fetch live data
                from Middleware when this is set, and fall back to demo data otherwise.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
