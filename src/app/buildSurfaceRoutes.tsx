import type { ReactNode } from 'react'
import { Route } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { ComingSoon } from '@/routes/ComingSoon'
import type { NavGroup } from './nav'

/**
 * Turns a surface's nav tree into route elements, so every sidebar link has
 * somewhere real to go (a dedicated screen via `overrides`, or a ComingSoon
 * placeholder) instead of the whole surface rendering one screen regardless
 * of path.
 */
export function buildSurfaceRoutes(groups: NavGroup[], rootPath: string, overrides: Record<string, ReactNode> = {}) {
  const items = groups.flatMap((g) => g.items)
  return items.map((item) => {
    const relative = item.path === rootPath ? '' : item.path.slice(rootPath.length + 1)
    const content = overrides[item.path] ?? <ComingSoon title={item.label} />
    const element = item.capability ? <ProtectedRoute capability={item.capability}>{content}</ProtectedRoute> : content

    return relative === '' ? (
      <Route key={item.path} index element={element} />
    ) : (
      <Route key={item.path} path={relative} element={element} />
    )
  })
}
