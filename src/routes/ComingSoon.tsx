import { EmptyState } from '@/components/feedback/EmptyState'

export interface ComingSoonProps {
  title: string
}

/** Placeholder for nav leaves that have a route and a capability gate wired up, but no bespoke screen yet. */
export function ComingSoon({ title }: ComingSoonProps) {
  return <EmptyState title={title} description="This screen has not been built yet." />
}
