import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Capability } from '@/permissions/capabilities'
import { usePermission } from '@/permissions/usePermission'
import { useAuth } from './AuthContext'

export interface ProtectedRouteProps {
  children: ReactNode
  capability?: Capability
}

export function ProtectedRoute({ children, capability }: ProtectedRouteProps) {
  const { session } = useAuth()
  const { can } = usePermission()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  if (capability && !can(capability)) {
    return <Navigate to="/not-authorized" replace />
  }

  return <>{children}</>
}
