import { NavLink } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { usePermission } from '@/permissions/usePermission'
import { cn } from '@/lib/cn'
import { NAV_BY_ROLE } from './nav'

export function Sidebar() {
  const { session } = useAuth()
  const { can } = usePermission()
  if (!session) return null

  const groups = NAV_BY_ROLE[session.role]

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-[220px] shrink-0 flex-col gap-4 overflow-y-auto bg-[var(--color-nav-sidebar)] p-3"
    >
      {groups.map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-1">
          {group.label && (
            <span className="px-2 pb-1 text-[length:var(--text-label)] font-medium uppercase tracking-wide text-[var(--color-text-disabled)]">
              {group.label}
            </span>
          )}
          {group.items
            .filter((item) => !item.capability || can(item.capability))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === NAV_BY_ROLE[session.role][0]?.items[0]?.path}
                className={({ isActive }) =>
                  cn(
                    'rounded-[var(--radius-sm)] px-3 py-2 text-[length:var(--text-body)] text-[var(--color-text-on-dark)] opacity-80 transition-colors hover:bg-[var(--color-nav-hover)] hover:opacity-100',
                    isActive && 'bg-[var(--color-nav-selected)] opacity-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
        </div>
      ))}
    </nav>
  )
}
