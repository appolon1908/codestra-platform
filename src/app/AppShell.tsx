import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { usePermission } from '@/permissions/usePermission'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { surfaceForPath } from './nav'

export function AppShell() {
  const { session } = useAuth()
  const { activeTenantName, activeTenant } = usePermission()
  const location = useLocation()
  const surface = surfaceForPath(location.pathname)

  // A Platform Admin only gains tenant-scoped authority once they've explicitly
  // entered a tenant context (impersonation) — make that unmistakable while it's active.
  const showViewingTenantBanner =
    session?.platformRole === 'platform_admin' && !activeTenant && surface === 'tenant-admin' && activeTenantName

  return (
    <div className="flex h-screen w-full bg-[var(--color-nav-background)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {showViewingTenantBanner && (
          <div className="bg-[var(--color-status-warning-bg)] px-6 py-2 text-center text-[length:var(--text-label)] font-medium text-[var(--color-status-warning)]">
            Viewing tenant: {activeTenantName}
          </div>
        )}
        <main className="flex-1 overflow-y-auto bg-[var(--color-surface-page)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
