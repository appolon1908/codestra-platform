import { type ReactNode, createContext, useContext, useMemo, useState } from 'react'
import type { Role } from '@/permissions/roles'

export interface Session {
  userId: string
  name: string
  email: string
  role: Role
  tenantId: string | null
  tenantName: string | null
}

interface AuthContextValue {
  session: Session | null
  signIn: (session: Session) => void
  signOut: () => void
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession())

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn: (next) => {
        setSession(next)
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next))
        } catch {
          // sessionStorage may be unavailable (private browsing); auth still
          // works for the lifetime of this tab via in-memory state.
        }
      },
      signOut: () => {
        setSession(null)
        try {
          sessionStorage.removeItem(SESSION_STORAGE_KEY)
        } catch {
          // ignore
        }
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
