import { Phone, PhoneCall, Sparkles } from 'lucide-react'
import { Card, CardTitle } from '@/components/container/Card'
import { StatusPill } from '@/components/status/StatusPill'
import { Button } from '@/components/core/Button'
import { Select } from '@/components/form/Select'
import { Badge } from '@/components/status/Badge'
import { Textarea } from '@/components/form/Textarea'
import { TimelineItem } from '@/components/data/TimelineItem'

export function AgentWorkspace() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 flex items-center justify-between">
        <StatusPill state="ready" />
        <div className="flex items-center gap-4 text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
          <span>Queue: Sales EN</span>
          <span>Ext. 6101</span>
        </div>
      </div>

      <Card className="col-span-12 flex flex-col gap-4 lg:col-span-3">
        <CardTitle>Phone</CardTitle>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-brand-surface)] text-[var(--color-brand-primary)]">
            <Phone className="size-7" aria-hidden="true" />
          </div>
          <span className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">No active call</span>
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

      <Card className="col-span-12 flex flex-col gap-3 lg:col-span-5">
        <CardTitle>Odoo Customer</CardTitle>
        <div className="flex flex-col gap-1">
          <span className="text-[length:var(--text-card-title)] font-semibold text-[var(--color-text-primary)]">John Smith</span>
          <span className="text-[length:var(--text-body)] text-[var(--color-text-muted)]">+1 (555) 019-2244 · Acme Co</span>
          <Badge status="info" className="w-fit">Qualified lead</Badge>
        </div>
        <div className="flex flex-col">
          <TimelineItem
            icon={<Phone className="size-4" aria-hidden="true" />}
            timestamp="10:42 AM"
            title="Call completed"
            source="call"
            actor="Alex Rivera"
            metadata="4m 12s · Outcome: Interested"
          />
        </div>
      </Card>

      <Card className="col-span-12 flex flex-col gap-3 lg:col-span-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--color-status-ai)]" aria-hidden="true" />
          <CardTitle>Script &amp; AI Assistant</CardTitle>
        </div>
        <p className="text-[length:var(--text-body)] text-[var(--color-text-secondary)]">
          Opening: confirm identity, reference their last support ticket, offer the Q3 renewal plan.
        </p>
        <label className="flex flex-col gap-1 text-[length:var(--text-label)] font-medium text-[var(--color-text-secondary)]">
          Disposition notes
          <Textarea placeholder="Add call notes…" />
        </label>
        <Select
          defaultValue=""
          placeholder="Select disposition"
          options={[
            { value: 'interested', label: 'Interested' },
            { value: 'callback', label: 'Callback requested' },
            { value: 'not-interested', label: 'Not interested' },
          ]}
        />
      </Card>
    </div>
  )
}
