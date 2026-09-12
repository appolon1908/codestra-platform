import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Capability } from '@/permissions/capabilities'
import { usePermission } from '@/permissions/usePermission'
import type { Surface } from '@/permissions/roles'
import { useAuth } from './AuthContext'

export interface ProtectedRouteProps {
  children: ReactNode
  /** Top-level product surface this route belongs to — gates on scope membership, not just a capability. */
  surface?: Surface
  capability?: Capability
}

export function ProtectedRoute({ children, surface, capability }: ProtectedRouteProps) {
  const { session } = useAuth()
  const { can, availableSurfaces } = usePermission()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  if (surface && !availableSurfaces.includes(surface)) {
    return <Navigate to="/not-authorized" replace />
  }

  if (capability && !can(capability)) {
    return <Navigate to="/not-authorized" replace />
  }

  return <>{children}</>
}
