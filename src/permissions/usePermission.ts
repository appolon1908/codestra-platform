import { useAuth } from '@/auth/AuthContext'
import { type Capability, can, canAny } from './capabilities'

export function usePermission() {
  const { session } = useAuth()
  const role = session?.role ?? null

  return {
    role,
    can: (capability: Capability) => (role ? can(role, capability) : false),
    canAny: (capabilities: Capability[]) => (role ? canAny(role, capabilities) : false),
  }
}
