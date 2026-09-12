import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { Table } from '@/components/data/Table'
import { StatusPill, type CallState } from '@/components/status/StatusPill'
import { InlineAlert } from '@/components/feedback/InlineAlert'

interface AgentRow {
  id: string
  name: string
  extension: string
  state: CallState
  callsToday: number
}

const agents: AgentRow[] = [
  { id: '1', name: 'Alex Rivera', extension: '6101', state: 'active', callsToday: 24 },
  { id: '2', name: 'Jordan Lee', extension: '6102', state: 'ready', callsToday: 19 },
  { id: '3', name: 'Sam Patel', extension: '6103', state: 'hold', callsToday: 15 },
]

export function SupervisorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <MetricCard label="Agents online" value={18} />
        <MetricCard label="Active calls" value={11} />
        <MetricCard label="Calls today" value={342} trend={{ direction: 'up', label: '+8% vs yesterday' }} />
        <MetricCard label="Avg. handle time" value="4m 32s" />
        <MetricCard label="Answer rate" value="94%" trend={{ direction: 'up', label: '+2pts' }} />
        <MetricCard label="Abandonment rate" value="3.1%" trend={{ direction: 'down', label: '-0.4pts' }} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardTitle>Call volume</CardTitle>
          <div className="mt-4 flex h-40 items-end gap-2">
            {[40, 65, 50, 80, 70, 90, 60].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-[var(--radius-sm)] bg-[var(--color-brand-interactive)]"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>
        <Card className="col-span-12 flex flex-col gap-2 lg:col-span-4">
          <CardTitle>Live agent activity</CardTitle>
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between text-[length:var(--text-body)]">
              <span className="text-[var(--color-text-primary)]">{agent.name}</span>
              <StatusPill state={agent.state} />
            </div>
          ))}
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <CardTitle>Queue performance</CardTitle>
          <p className="mt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
            Sales EN: 6 waiting, SLA 92%. Support EN: 2 waiting, SLA 98%.
          </p>
        </Card>
        <Card className="col-span-12 flex flex-col gap-2 lg:col-span-6">
          <CardTitle>Alerts</CardTitle>
          <InlineAlert status="warning">Sales EN queue exceeded 5-minute SLA for 3 callers.</InlineAlert>
        </Card>
      </div>

      <Card>
        <CardTitle>Agent performance</CardTitle>
        <div className="mt-3">
          <Table<AgentRow>
            columns={[
              { key: 'name', header: 'Agent', render: (row) => row.name },
              { key: 'extension', header: 'Extension', render: (row) => row.extension },
              { key: 'state', header: 'State', render: (row) => <StatusPill state={row.state} /> },
              { key: 'calls', header: 'Calls today', render: (row) => row.callsToday, align: 'right' },
            ]}
            rows={agents}
            getRowKey={(row) => row.id}
          />
        </div>
      </Card>
    </div>
  )
}
