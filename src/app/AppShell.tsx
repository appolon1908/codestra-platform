import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  return (
    <div className="flex h-screen w-full bg-[var(--color-nav-background)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[var(--color-surface-page)] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
