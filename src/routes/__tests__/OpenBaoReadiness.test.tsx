import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { OpenBaoReadiness } from '../OpenBaoReadiness'
import { mcJson } from '@/mission-control/api'

vi.mock('@/mission-control/api', () => ({ mcJson: vi.fn() }))
const fetchJson = vi.mocked(mcJson)
const snapshot = {
  repository: 'Codestra-OpenBao',
  observed_at: '2026-10-08T20:00:00Z',
  data_state: 'OBSERVED',
  registry: {
    sync_state: 'REMOTE_AHEAD', ci_state: 'RED', open_prs: 2,
    remote_head_sha: 'a'.repeat(40), last_synced_at: '2026-10-08T19:00:00Z',
    active_agents: 0, certified_tasks: 1, total_tasks: 2,
  },
  pr_summary: { total: 7, ci_green: 3, merged: 2, post_merge_verified: 1 },
  sections: [{
    name: 'CI / Governance', total: 2, certified: 1,
    tasks: [
      { task_id: 'OB-15-01', subarea: 'Policy', completion_percent: 100, certified: true },
      { task_id: 'OB-15-04', subarea: 'Promotion', completion_percent: 45, certified: false },
    ],
  }],
  links: {
    repository: 'https://github.com/appolon1908/Codestra-OpenBao',
    pull_requests: 'https://github.com/appolon1908/Codestra-OpenBao/pulls',
  },
  runtime_health: 'NOT_CHECKED', release_certification: 'NOT_CHECKED', mode: 'READ_ONLY',
}
function mount() { render(<MemoryRouter><OpenBaoReadiness /></MemoryRouter>) }
beforeEach(() => {
  vi.clearAllMocks()
  fetchJson.mockImplementation(async path => {
    if (path === '/platform/v1/dashboard/openbao') return snapshot
    if (path === '/platform/v1/dashboard/health') return { status: 'ok' }
    if (path === '/platform/v1/dashboard/openbao/health') return {
      state: 'OBSERVED', initialized: true, sealed: true, standby: false, http_status: 503,
      observed_at: '2026-10-08T20:01:00Z',
    }
    if (path === '/platform/v1/dashboard/contract') return {
      endpoints: { openbao: { path: '/platform/v1/dashboard/openbao' } },
    }
    throw new Error('unknown path')
  })
})
describe('OpenBao read-only frontend ↔ API flow', () => {
  it('renders backend values and never fabricates runtime certification', async () => {
    mount()
    expect(await screen.findByText('REMOTE_AHEAD')).toBeInTheDocument()
    expect(screen.getByText('RED')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(screen.getByText(/runtime health and release certification have not been verified/i)).toBeInTheDocument()
    expect(fetchJson).toHaveBeenCalledWith('/platform/v1/dashboard/openbao')
  })
  it('navigates tabs, filters tasks and tests backend contract', async () => {
    const user = userEvent.setup()
    mount()
    await screen.findByText('REMOTE_AHEAD')
    await user.click(screen.getByRole('button', { name: 'Workstreams' }))
    await user.click(screen.getByRole('button', { name: /CI \/ Governance/i }))
    expect(screen.getByText('OB-15-04')).toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('Filter by section or task…'), 'unrelated')
    expect(screen.getByText(/No workstreams match/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /API diagnostics/i }))
    await user.click(screen.getByRole('button', { name: /Verify backend \+ contract/i }))
    expect(await screen.findByText(/Backend reachable/)).toBeInTheDocument()
    expect(fetchJson).toHaveBeenCalledWith('/platform/v1/dashboard/contract')
    await user.click(screen.getByRole('button', { name: /Probe OpenBao health \(read-only\)/i }))
    expect(await screen.findByText('Health: OBSERVED')).toBeInTheDocument()
    expect(screen.getByText('503')).toBeInTheDocument()
    expect(fetchJson).toHaveBeenCalledWith('/platform/v1/dashboard/openbao/health')
    await user.click(screen.getByRole('button', { name: /Pull requests/i }))
    expect(screen.getByRole('link', { name: /View GitHub PRs/i })).toHaveAttribute('rel', 'noopener noreferrer')
  })
  it('shows API failure with an interactive retry instead of demo data', async () => {
    const user = userEvent.setup()
    fetchJson.mockRejectedValueOnce(new Error('Mission Control API 503'))
    mount()
    expect(await screen.findByRole('alert')).toHaveTextContent('503')
    expect(screen.queryByText('RED')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Retry connection/i }))
    expect(await screen.findByText('REMOTE_AHEAD')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Refresh OpenBao readiness/i }))
    await waitFor(() => expect(fetchJson).toHaveBeenCalledTimes(3))
  })
})
