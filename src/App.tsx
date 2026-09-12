import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { SignInPage } from '@/auth/SignInPage'
import { AppShell } from '@/app/AppShell'
import { ROLE_HOME_PATH } from '@/app/nav'
import { AgentWorkspace } from '@/routes/agent/AgentWorkspace'
import { SupervisorDashboard } from '@/routes/supervisor/SupervisorDashboard'
import { TenantAdminDashboard } from '@/routes/tenant-admin/TenantAdminDashboard'
import { PlatformAdminDashboard } from '@/routes/platform-admin/PlatformAdminDashboard'
import { NotAuthorized } from '@/routes/NotAuthorized'

function RootRedirect() {
  const { session } = useAuth()
  return <Navigate to={session ? ROLE_HOME_PATH[session.role] : '/sign-in'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/agent/*" element={<AgentWorkspace />} />
        <Route path="/supervisor/*" element={<SupervisorDashboard />} />
        <Route
          path="/tenant-admin/*"
          element={
            <ProtectedRoute capability="tenant.users">
              <TenantAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/platform-admin/*"
          element={
            <ProtectedRoute capability="platform.tenants">
              <PlatformAdminDashboard />
            </ProtectedRoute>
          }
        />
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
