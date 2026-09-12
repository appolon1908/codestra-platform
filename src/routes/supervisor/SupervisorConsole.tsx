import { Headphones, MessageSquare, Mic, Radio } from 'lucide-react'
import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { Table } from '@/components/data/Table'
import { StatusPill, type CallState } from '@/components/status/StatusPill'
import { IconButton } from '@/components/core/IconButton'
import { StatePanel } from '@/components/feedback/StatePanel'
import { usePermission } from '@/permissions/usePermission'

interface LiveCallRow {
  id: string
  agent: string
  customer: string
  duration: string
  state: CallState
}

const LIVE_CALLS_BY_CAMPAIGN: Record<string, LiveCallRow[]> = {
  transportation: [
    { id: '1', agent: 'Maria Alvarez', customer: 'Acme Freight', duration: '03:21', state: 'active' },
    { id: '2', agent: 'Carlos Reyes', customer: 'Smith Transport', duration: '01:12', state: 'active' },
    { id: '3', agent: 'Jordan Lee', customer: '—', duration: '00:00', state: 'ready' },
  ],
  'student-repayment': [
    { id: '4', agent: 'Priya Shah', customer: 'M. Thompson', duration: '05:02', state: 'active' },
    { id: '5', agent: 'Devon Clarke', customer: '—', duration: '00:00', state: 'hold' },
  ],
}

export function SupervisorConsole() {
  const { activeCampaign, can } = usePermission()

  if (!activeCampaign) {
    return <StatePanel state="empty" title="No campaign selected" description="Select a campaign to see live activity." />
  }

  const rows = LIVE_CALLS_BY_CAMPAIGN[activeCampaign.campaignId] ?? []
  const canMonitor = can('calls.monitor')
  const canWhisper = can('calls.whisper')
  const canBarge = can('calls.barge')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-7">
        <MetricCard label="Agents online" value={14} />
        <MetricCard label="Active calls" value={rows.filter((r) => r.state === 'active').length} />
        <MetricCard label="Waiting" value={3} />
        <MetricCard label="Service level" value="82%" trend={{ direction: 'up', label: '+2pts' }} />
        <MetricCard label="ASA" value="14s" />
        <MetricCard label="Abandonment" value="2.1%" trend={{ direction: 'down', label: '-0.3pts' }} />
        <MetricCard label="AHT" value="4:18" />
      </div>

      <Card>
        <CardTitle>Live calls — {activeCampaign.campaignName}</CardTitle>
        <div className="mt-3">
          {!canMonitor ? (
            <StatePanel
              state="permission-denied"
              title="Monitoring not available"
              description="Your role in this campaign does not include call monitoring."
            />
          ) : (
            <Table<LiveCallRow>
              columns={[
                { key: 'agent', header: 'Agent', render: (row) => row.agent },
                { key: 'customer', header: 'Customer', render: (row) => row.customer },
                { key: 'duration', header: 'Duration', render: (row) => row.duration },
                { key: 'state', header: 'State', render: (row) => <StatusPill state={row.state} /> },
                {
                  key: 'actions',
                  header: 'Actions',
                  align: 'right',
                  render: (row) => (
                    <div className="flex justify-end gap-1">
                      <IconButton label="Listen" size="sm" disabled={row.state !== 'active'}>
                        <Headphones className="size-4" aria-hidden="true" />
                      </IconButton>
                      <IconButton label="Whisper" size="sm" disabled={!canWhisper || row.state !== 'active'}>
                        <Mic className="size-4" aria-hidden="true" />
                      </IconButton>
                      <IconButton label="Barge" size="sm" disabled={!canBarge || row.state !== 'active'}>
                        <Radio className="size-4" aria-hidden="true" />
                      </IconButton>
                      <IconButton label="Message agent" size="sm">
                        <MessageSquare className="size-4" aria-hidden="true" />
                      </IconButton>
                    </div>
                  ),
                },
              ]}
              rows={rows}
              getRowKey={(row) => row.id}
              emptyState={<StatePanel state="empty" title="No live calls in this campaign right now" />}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
