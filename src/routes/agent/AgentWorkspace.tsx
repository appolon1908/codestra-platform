import { useState } from 'react'
import {
  Mail,
  Mic,
  Pause,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  Plus,
  Sparkles,
} from 'lucide-react'
import { Card, CardTitle } from '@/components/container/Card'
import { StatusPill } from '@/components/status/StatusPill'
import { Button } from '@/components/core/Button'
import { IconButton } from '@/components/core/IconButton'
import { Select } from '@/components/form/Select'
import { Badge } from '@/components/status/Badge'
import { Textarea } from '@/components/form/Textarea'
import { TimelineItem } from '@/components/data/TimelineItem'
import { Tabs, TabPanel } from '@/components/navigation/Tabs'
import { StatePanel } from '@/components/feedback/StatePanel'
import { usePermission } from '@/permissions/usePermission'
import { fetchActivity } from '@/lib/api/activity'
import { useApiResource } from '@/lib/api/useApiResource'
import { isRealApiModeEnabled } from '@/lib/api/config'

function activitySourceFor(source: string): 'call' | 'sms' | 'email' | 'crm' | 'system' {
  if (source.includes('call') || source === 'audit_event') return 'call'
  if (source.includes('email')) return 'email'
  if (source.includes('sms')) return 'sms'
  return 'system'
}

export function AgentWorkspace() {
  const { activeTenantName, activeCampaign, activeTenant } = usePermission()
  const [available, setAvailable] = useState(true)
  const realMode = isRealApiModeEnabled()
  const activity = useApiResource(() => fetchActivity({ tenantId: activeTenant?.tenantId }), [activeTenant?.tenantId])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[length:var(--text-page-title)] font-semibold text-[var(--color-text-primary)]">
            {activeTenantName ?? 'Codestra'}
          </span>
          <span className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">
            {activeCampaign?.campaignName ?? 'No campaign assigned'} · Queue: Sales EN · Extension 6101
          </span>
        </div>
        <Button variant={available ? 'primary' : 'secondary'} onClick={() => setAvailable((v) => !v)}>
          <StatusPill state={available ? 'ready' : 'offline'} label={available ? 'Ready for calls' : 'Not ready'} />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left column — Phone */}
        <Card className="col-span-12 flex flex-col gap-4 lg:col-span-3">
          <CardTitle>Phone</CardTitle>
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-brand-surface)] text-[var(--color-brand-primary)]">
              <Phone className="size-7" aria-hidden="true" />
            </div>
            <span className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">No active call</span>
            <span className="text-[length:var(--text-small)] text-[var(--color-text-disabled)]">00:00</span>
          </div>
          {realMode && (
            <p className="text-[length:var(--text-small)] text-[var(--color-text-muted)]">
              Live call state isn't wired yet — Middleware's calls API has no verified per-agent filter, so this
              panel can't safely show only this agent's call.
            </p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <IconButton label="Mute" variant="secondary">
              <Mic className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Hold" variant="secondary">
              <Pause className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Transfer" variant="secondary">
              <PhoneForwarded className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Add call" variant="secondary">
              <Plus className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="End call" variant="danger" className="col-span-2">
              <PhoneOff className="size-4" aria-hidden="true" />
            </IconButton>
          </div>

          <Button variant="primary" size="lg">
            <PhoneCall className="size-4" aria-hidden="true" />
            Start call
          </Button>

          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Audio device
            <Select
              defaultValue="headset"
              options={[
                { value: 'headset', label: 'USB Headset' },
                { value: 'speaker', label: 'Speaker' },
              ]}
            />
          </label>
        </Card>

        {/* Center column — Odoo CRM.
            Deliberately still mock data: Odoo's CRM API (codestra_middleware_bridge)
            is HMAC-signed with a server-held secret and must never be called
            directly from a browser. No safe browser-facing proxy for it exists
            in Middleware yet — wiring this panel for real needs that proxy
            built first, not a client-side signer. */}
        <Card className="col-span-12 flex flex-col gap-3 lg:col-span-5">
          <div className="flex items-center justify-between">
            <CardTitle>Customer</CardTitle>
            {realMode && <Badge status="neutral">Demo data</Badge>}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[length:var(--text-card-title)] font-semibold text-[var(--color-text-primary)]">
              John Smith
            </span>
            <span className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">
              +1 (555) 019-2244 · john.smith@example.com
            </span>
            <span className="text-[length:var(--text-body)] text-[var(--color-text-secondary)]">Smith Transport</span>
            <div className="flex flex-wrap gap-1 pt-1">
              <Badge status="info">Qualified lead</Badge>
              <Badge status="neutral">Repeat customer</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1 border-t border-[var(--color-surface-border)] pt-3">
            <span className="text-[length:var(--text-label)] font-medium text-[var(--color-text-muted)]">
              Opportunities
            </span>
            <div className="flex items-center justify-between text-[length:var(--text-body)]">
              <span className="text-[var(--color-text-primary)]">Fleet renewal — Q3</span>
              <Badge status="warning">Negotiation</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1 border-t border-[var(--color-surface-border)] pt-3">
            <span className="text-[length:var(--text-label)] font-medium text-[var(--color-text-muted)]">Notes</span>
            <p className="text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
              Prefers afternoon callbacks. Asked about multi-vehicle discount last call.
            </p>
          </div>
        </Card>

        {/* Right column — Script / AI / Disposition */}
        <Card className="col-span-12 flex flex-col gap-3 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--color-status-ai)]" aria-hidden="true" />
            <CardTitle>Script &amp; AI Assistant</CardTitle>
          </div>

          <Tabs
            items={[
              { value: 'opening', label: 'Opening' },
              { value: 'questions', label: 'Questions' },
              { value: 'objections', label: 'Objections' },
              { value: 'close', label: 'Close' },
            ]}
            defaultValue="opening"
          >
            <TabPanel value="opening" className="pt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
              Confirm identity, reference their last support ticket, offer the Q3 renewal plan.
            </TabPanel>
            <TabPanel value="questions" className="pt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
              Ask how many vehicles are currently active on their fleet plan.
            </TabPanel>
            <TabPanel value="objections" className="pt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
              If price is raised, mention the multi-vehicle discount tier.
            </TabPanel>
            <TabPanel value="close" className="pt-2 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
              Confirm renewal date and send written confirmation by email.
            </TabPanel>
          </Tabs>

          <Badge status="ai" className="w-fit">
            AI suggestion: offer multi-vehicle discount
          </Badge>

          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Disposition
            <Select
              placeholder="Select disposition"
              options={[
                { value: 'interested', label: 'Interested' },
                { value: 'callback', label: 'Callback requested' },
                { value: 'not-interested', label: 'Not interested' },
              ]}
            />
          </label>
          <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
            Notes
            <Textarea placeholder="Add call notes…" />
          </label>
          <Button variant="secondary">Save disposition &amp; follow-up</Button>
        </Card>

        {/* Bottom row — Lead Details / Recent Activity */}
        <Card className="col-span-12 flex flex-col gap-2 lg:col-span-4">
          <CardTitle>Lead Details</CardTitle>
          <div className="flex flex-col gap-1 text-[length:var(--text-body)]">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Score</span>
              <span className="text-[var(--color-text-primary)]">82</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Campaign</span>
              <span className="text-[var(--color-text-primary)]">{activeCampaign?.campaignName ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Owner</span>
              <span className="text-[var(--color-text-primary)]">Alex Rivera</span>
            </div>
          </div>
        </Card>

        <Card className="col-span-12 flex flex-col gap-1 lg:col-span-8">
          <CardTitle>Recent Activity</CardTitle>
          {realMode && activity.status === 'loading' && <StatePanel state="loading" />}
          {realMode && activity.status === 'unavailable' && (
            <StatePanel state="stale-data" description="Live activity could not be fetched. Showing recent demo activity." />
          )}
          {realMode && activity.status === 'ready' && activity.data.items.length > 0
            ? activity.data.items.map((item) => (
                <TimelineItem
                  key={item.id}
                  icon={<Phone className="size-4" aria-hidden="true" />}
                  timestamp={new Date(item.occurred_at).toLocaleString()}
                  title={item.title}
                  source={activitySourceFor(item.source)}
                  actor={item.actor ?? undefined}
                  metadata={item.metadata ?? undefined}
                />
              ))
            : (!realMode || activity.status !== 'loading') && (
                <>
                  <TimelineItem
                    icon={<Phone className="size-4" aria-hidden="true" />}
                    timestamp="10:42 AM"
                    title="Call completed"
                    source="call"
                    actor="Alex Rivera"
                    metadata="4m 12s · Outcome: Interested"
                  />
                  <TimelineItem
                    icon={<Mail className="size-4" aria-hidden="true" />}
                    timestamp="Yesterday"
                    title="Renewal quote sent"
                    source="email"
                    actor="Alex Rivera"
                  />
                </>
              )}
        </Card>
      </div>
    </div>
  )
}
