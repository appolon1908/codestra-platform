import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/form/Input'
import { Select } from '@/components/form/Select'
import { Card, CardTitle } from '@/components/container/Card'
import { ROLES, ROLE_LABELS } from '@/permissions/roles'
import type { Role } from '@/permissions/roles'
import { ROLE_HOME_PATH } from '@/app/nav'
import { useAuth } from './AuthContext'

interface LocationState {
  from?: { pathname: string }
}

export function SignInPage() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('agent')

  if (session) {
    const state = location.state as LocationState | null
    return <Navigate to={state?.from?.pathname ?? ROLE_HOME_PATH[session.role]} replace />
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email) return
    signIn({
      userId: 'demo-user',
      name: email.split('@')[0] ?? 'User',
      email,
      role,
      tenantId: role === 'platform_operator' || role === 'platform_admin' ? null : 'demo-tenant',
      tenantName: role === 'platform_operator' || role === 'platform_admin' ? null : 'Acme Co',
    })
    navigate(ROLE_HOME_PATH[role], { replace: true })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-nav-background)] p-6">
      <Card className="w-full max-w-sm" padding="md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CardTitle>Sign in to Codestra</CardTitle>
          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Email
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Role
            <Select
              value={role}
              onValueChange={(next) => setRole(next as Role)}
              options={ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            />
          </label>
          <Button type="submit" size="lg">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}
