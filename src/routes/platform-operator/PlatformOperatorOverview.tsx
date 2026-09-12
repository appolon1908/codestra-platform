import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { InlineAlert } from '@/components/feedback/InlineAlert'

export function PlatformOperatorOverview() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[length:var(--text-page-title)] font-semibold text-[var(--color-text-primary)]">
        Tenant &amp; service health
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Tenants monitored" value={47} />
        <MetricCard label="Open support cases" value={5} />
        <MetricCard label="Failed jobs (24h)" value={2} />
        <MetricCard label="Unhealthy integrations" value={1} />
      </div>

      <Card>
        <CardTitle>Service health</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          <InlineAlert status="success">Jasmin SMS gateway: healthy</InlineAlert>
          <InlineAlert status="warning">Odoo sync worker: 1 retry backlog</InlineAlert>
          <InlineAlert status="error">SMTP relay tenant-19: authentication failing</InlineAlert>
        </div>
      </Card>

      <Card>
        <CardTitle>Scope reminder</CardTitle>
        <p className="mt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
          Platform Operator is read/ops only — billing changes, security policy, role changes, and destructive tenant
          actions are not available from this workspace. Escalate to a Platform Admin.
        </p>
      </Card>
    </div>
  )
}
