import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { Badge } from '@/components/status/Badge'
import { StatePanel } from '@/components/feedback/StatePanel'
import { usePermission } from '@/permissions/usePermission'

export function TenantAdminOverview() {
  const { activeTenantName } = usePermission()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[length:var(--text-page-title)] font-semibold text-[var(--color-text-primary)]">
            {activeTenantName ?? 'Your organization'}
          </h1>
          <p className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">
            Plan: Growth · Environment: Production
          </p>
        </div>
        <Badge status="success">Billing current</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Calls this month" value={4821} />
        <MetricCard label="Active agents" value={22} />
        <MetricCard label="Answer rate" value="93%" />
        <MetricCard label="Avg. handle time" value="4m 51s" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <CardTitle>Queue performance</CardTitle>
          <p className="mt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
            3 queues configured. Sales EN is at 89% SLA this month.
          </p>
        </Card>
        <Card className="col-span-12 lg:col-span-6">
          <CardTitle>Monthly usage</CardTitle>
          <div className="mt-2">
            <StatePanel
              state="stale-data"
              description="Usage figures last refreshed 6 hours ago — the billing sync worker is behind."
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
