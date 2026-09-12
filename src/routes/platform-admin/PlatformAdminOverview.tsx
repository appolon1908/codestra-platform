import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { InlineAlert } from '@/components/feedback/InlineAlert'

export function PlatformAdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[length:var(--text-page-title)] font-semibold text-[var(--color-text-primary)]">
        Platform overview
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total tenants" value={47} />
        <MetricCard label="Total agents" value={612} />
        <MetricCard label="Calls today" value="12,904" />
        <MetricCard label="SMS sent" value="8,120" />
        <MetricCard label="Email sent" value="21,340" />
        <MetricCard label="MRR" value="$184,200" trend={{ direction: 'up', label: '+3.1% MoM' }} />
        <MetricCard label="Failed jobs" value={2} />
        <MetricCard label="Unhealthy integrations" value={1} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardTitle>System health</CardTitle>
          <div className="mt-3 flex flex-col gap-2">
            <InlineAlert status="success">Jasmin SMS gateway: healthy</InlineAlert>
            <InlineAlert status="warning">Odoo sync worker: 1 retry backlog</InlineAlert>
            <InlineAlert status="error">SMTP relay tenant-19: authentication failing</InlineAlert>
          </div>
        </Card>
        <Card className="col-span-12 lg:col-span-4">
          <CardTitle>Recent jobs</CardTitle>
          <p className="mt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
            2 failed in the last 24 hours. See Monitoring → Jobs for detail.
          </p>
        </Card>
      </div>
    </div>
  )
}
