import { type ReactNode, createContext, useContext, useMemo, useState } from 'react'
import type { CampaignMembership, PlatformRole, TenantMembership } from '@/permissions/roles'

export interface Session {
  userId: string
  name: string
  email: string
  platformRole: PlatformRole
  tenantMemberships: TenantMembership[]
  campaignMemberships: CampaignMembership[]
  activeTenantId: string | null
  activeCampaignId: string | null
}

interface AuthContextValue {
  session: Session | null
  signIn: (session: Session) => void
  signOut: () => void
  setActiveTenant: (tenantId: string | null) => void
  setActiveCampaign: (campaignId: string | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_STORAGE_KEY = 'codestra.session'

function readStoredSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function persist(session: Session | null) {
  try {
    if (session) sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // sessionStorage may be unavailable (private browsing); auth still
    // works for the lifetime of this tab via in-memory state.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn: (next) => {
        setSession(next)
        persist(next)
      },
      signOut: () => {
        setSession(null)
        persist(null)
      },
      setActiveTenant: (tenantId) => {
        setSession((prev) => {
          if (!prev) return prev
          // Switching tenant invalidates any previously active campaign —
          // it belonged to the old tenant's membership set.
          const stillValidCampaign = prev.campaignMemberships.find(
            (m) => m.campaignId === prev.activeCampaignId && m.tenantId === tenantId,
          )
          const next: Session = {
            ...prev,
            activeTenantId: tenantId,
            activeCampaignId: stillValidCampaign ? prev.activeCampaignId : null,
          }
          persist(next)
          return next
        })
      },
      setActiveCampaign: (campaignId) => {
        setSession((prev) => {
          if (!prev) return prev
          const next: Session = { ...prev, activeCampaignId: campaignId }
          persist(next)
          return next
        })
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
