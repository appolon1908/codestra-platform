import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { SignInPage } from '@/auth/SignInPage'
import { AppShell } from '@/app/AppShell'
import { deriveHomePath, AGENT_NAV, SUPERVISOR_NAV, TENANT_ADMIN_NAV, PLATFORM_OPERATOR_NAV, PLATFORM_ADMIN_NAV } from '@/app/nav'
import { buildSurfaceRoutes } from '@/app/buildSurfaceRoutes'
import { AgentWorkspace } from '@/routes/agent/AgentWorkspace'
import { SupervisorConsole } from '@/routes/supervisor/SupervisorConsole'
import { TenantAdminOverview } from '@/routes/tenant-admin/TenantAdminOverview'
import { PlatformOperatorOverview } from '@/routes/platform-operator/PlatformOperatorOverview'
import { PlatformAdminOverview } from '@/routes/platform-admin/PlatformAdminOverview'
import { PlatformAdminTenants } from '@/routes/platform-admin/PlatformAdminTenants'
import { NotAuthorized } from '@/routes/NotAuthorized'

function RootRedirect() {
  const { session } = useAuth()
  return <Navigate to={session ? deriveHomePath(session) : '/sign-in'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      <Route
        path="/agent"
        element={
          <ProtectedRoute surface="agent">
            <AppShell />
          </ProtectedRoute>
        }
      >
        {buildSurfaceRoutes(AGENT_NAV, '/agent', { '/agent': <AgentWorkspace /> })}
      </Route>

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute surface="supervisor">
            <AppShell />
          </ProtectedRoute>
        }
      >
        {buildSurfaceRoutes(SUPERVISOR_NAV, '/supervisor', { '/supervisor': <SupervisorConsole /> })}
      </Route>

      <Route
        path="/tenant-admin"
        element={
          <ProtectedRoute surface="tenant-admin">
            <AppShell />
          </ProtectedRoute>
        }
      >
        {buildSurfaceRoutes(TENANT_ADMIN_NAV, '/tenant-admin', { '/tenant-admin': <TenantAdminOverview /> })}
      </Route>

      <Route
        path="/platform-operator"
        element={
          <ProtectedRoute surface="platform-operator">
            <AppShell />
          </ProtectedRoute>
        }
      >
        {buildSurfaceRoutes(PLATFORM_OPERATOR_NAV, '/platform-operator', {
          '/platform-operator': <PlatformOperatorOverview />,
        })}
      </Route>

      <Route
        path="/platform-admin"
        element={
          <ProtectedRoute surface="platform-admin">
            <AppShell />
          </ProtectedRoute>
        }
      >
        {buildSurfaceRoutes(PLATFORM_ADMIN_NAV, '/platform-admin', {
          '/platform-admin': <PlatformAdminOverview />,
          '/platform-admin/tenants': <PlatformAdminTenants />,
        })}
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
