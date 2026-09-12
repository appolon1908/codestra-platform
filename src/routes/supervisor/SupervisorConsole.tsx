import { Headphones, MessageSquare, Mic, Radio } from 'lucide-react'
import { MetricCard } from '@/components/data/MetricCard'
import { Card, CardTitle } from '@/components/container/Card'
import { Table } from '@/components/data/Table'
import { StatusPill, type CallState } from '@/components/status/StatusPill'
import { IconButton } from '@/components/core/IconButton'
import { StatePanel } from '@/components/feedback/StatePanel'
import { usePermission } from '@/permissions/usePermission'
import { fetchCalls } from '@/lib/api/calls'
import { fetchAgentsPresence } from '@/lib/api/presence'
import { fetchQueueMetrics } from '@/lib/api/queues'
import { useApiResource } from '@/lib/api/useApiResource'
import { isRealApiModeEnabled } from '@/lib/api/config'

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

/** Middleware's `lifecycle_state` vocabulary mapped to this UI's coarser CallState. */
function toCallState(lifecycleState: string): CallState {
  switch (lifecycleState) {
    case 'connected':
    case 'answering':
      return 'active'
    case 'held':
      return 'hold'
    case 'offered':
    case 'ringing':
    case 'initiating':
      return 'ready'
    default:
      return 'ready'
  }
}

function elapsedSince(startedAt: string | null): string {
  if (!startedAt) return '00:00'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export function SupervisorConsole() {
  const { activeCampaign, activeTenant, can } = usePermission()
  const realMode = isRealApiModeEnabled()

  const calls = useApiResource(() => fetchCalls({ tenantId: activeTenant?.tenantId }), [activeTenant?.tenantId])
  const presence = useApiResource(() => fetchAgentsPresence({ tenantId: activeTenant?.tenantId }), [activeTenant?.tenantId])
  // No queue-id concept exists yet in the permission model — the active
  // campaign id is used as a stand-in until one does; this is a documented
  // assumption, not a verified mapping.
  const metrics = useApiResource(
    () => fetchQueueMetrics(activeCampaign?.campaignId ?? ''),
    [activeCampaign?.campaignId],
  )

  if (!activeCampaign) {
    return <StatePanel state="empty" title="No campaign selected" description="Select a campaign to see live activity." />
  }

  const canMonitor = can('calls.monitor')
  const canWhisper = can('calls.whisper')
  const canBarge = can('calls.barge')

  const usingRealCalls = realMode && calls.status === 'ready'
  const presenceByAgent = new Map(
    presence.status === 'ready' ? presence.data.items.map((row) => [row.agent_id, row.state]) : [],
  )
  const rows: LiveCallRow[] = usingRealCalls
    ? calls.data.items.map((call) => ({
        id: call.call_id,
        agent: call.source_extension ?? '—',
        customer: call.destination ?? '—',
        duration: elapsedSince(call.connected_at ?? call.started_at),
        state: presenceByAgent.get(call.source_extension ?? '') === 'busy' ? 'active' : toCallState(call.lifecycle_state),
      }))
    : (LIVE_CALLS_BY_CAMPAIGN[activeCampaign.campaignId] ?? [])

  const m = metrics.status === 'ready' ? metrics.data : undefined
  const activeCount = rows.filter((r) => r.state === 'active').length

  return (
    <div className="flex flex-col gap-6">
      {realMode && (calls.status === 'unavailable' || presence.status === 'unavailable') && (
        <StatePanel
          state="stale-data"
          description="Live call/presence data could not be fetched. Showing the last known activity."
        />
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-7">
        <MetricCard label="Agents online" value={m?.agents_online ?? 14} />
        <MetricCard label="Active calls" value={m?.active_calls ?? activeCount} />
        <MetricCard label="Waiting" value={m?.waiting ?? 3} />
        <MetricCard
          label="Service level"
          value={m?.service_level_pct !== undefined ? `${m.service_level_pct}%` : '82%'}
          trend={{ direction: 'up', label: '+2pts' }}
        />
        <MetricCard label="ASA" value={m?.asa_seconds !== undefined ? `${m.asa_seconds}s` : '14s'} />
        <MetricCard
          label="Abandonment"
          value={m?.abandonment_pct !== undefined ? `${m.abandonment_pct}%` : '2.1%'}
          trend={{ direction: 'down', label: '-0.3pts' }}
        />
        <MetricCard label="AHT" value={m?.aht_seconds !== undefined ? `${Math.floor(m.aht_seconds / 60)}:${String(m.aht_seconds % 60).padStart(2, '0')}` : '4:18'} />
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
