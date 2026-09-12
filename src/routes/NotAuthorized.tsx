import { EmptyState } from '@/components/feedback/EmptyState'

export function NotAuthorized() {
  return (
    <EmptyState
      title="You don't have access to this page"
      description="Your role does not include this capability. Contact your administrator if you believe this is a mistake."
    />
  )
}
