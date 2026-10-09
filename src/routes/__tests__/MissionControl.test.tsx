import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MissionControl } from '../MissionControl'

const mock = vi.hoisted(() => ({ json: vi.fn(), realtime: vi.fn() }))
vi.mock('../../mission-control/api', () => ({
  MC_API: '',
  mcJson: mock.json,
}))
vi.mock('../../mission-control/realtime', () => ({
  connectRealtime: mock.realtime,
}))
vi.mock('../../mission-control/auth', () => ({ missionRoles: () => ['Operator'] }))

const repositories = [{repository:'Kong',full_name:'appolon1908/Kong',planning:'ACTIVE',
  sync_state:'SYNCED',open_prs:3,ci_state:'BLOCKED',active_agents:1,wip_percent:45,
  certified_tasks:0,total_tasks:8}]
const agents = [{agent_id:'agent-01',agent_type:'Claude',provider:'test',repository:'Kong',
  state:'ACTIVE',heartbeat_at:new Date().toISOString(),task_id:'KG-01'}]

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState({},'', '/mission-control')
  mock.json.mockImplementation(async (path: string) => {
    if(path.endsWith('/repositories')) return {repositories}
    if(path.endsWith('/agents')) return {agents}
    if(path.includes('/local-work')) return {lanes:[]}
    if(path.includes('/tasks?')) return {tasks:[]}
    return {task:null}
  })
  mock.realtime.mockImplementation((_a: unknown,onStatus:(status:string)=>void)=>{
    onStatus('connected')
    return () => {}
  })
})

describe('Mission Control interaction flow', () => {
  it('opens an agent, its repository, and the external PR review queue', async () => {
    render(<MissionControl/>)
    fireEvent.click(await screen.findByTitle('Inspect agent agent-01'))
    expect(screen.getByText(/Last heartbeat:/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button',{name:/Open repository work/i}))
    await screen.findByText('Kong Development Plan')
    fireEvent.click(screen.getByRole('button',{name:'PR Control'}))
    const anchor=await screen.findByRole('link',{name:/Review PRs/i})
    expect(anchor.getAttribute('href')).toContain('github.com/appolon1908/Kong/pulls')
    expect(anchor.getAttribute('rel')).toContain('noopener')
    expect(window.location.search).toContain('repository=Kong')
  })
  it('shows a recoverable API error instead of a fake green dashboard', async () => {
    mock.json.mockRejectedValue(new Error('Mission Control API returned HTTP 503.'))
    render(<MissionControl/>)
    const notice=await screen.findByRole('alert')
    expect(notice.textContent).toContain('HTTP 503')
    expect(screen.getByRole('button',{name:'Retry connection'})).toBeTruthy()
    fireEvent.click(screen.getByRole('button',{name:'PR Control'}))
    expect(screen.getByText(/PR counts unavailable/i)).toBeTruthy()
  })
  it('opens a repository deep link from URL without a phantom row', async () => {
    window.history.replaceState({},'', '/mission-control?repository=Kong')
    render(<MissionControl/>)
    await waitFor(()=>expect(mock.json).toHaveBeenCalledWith(expect.stringContaining('/tasks?repository=Kong')))
  })
})


it('does not misrepresent missing GitHub PR authority as zero open PRs', async () => {
  const missing={...repositories[0],open_prs:null,ci_state:'UNVERIFIED'}
  mock.json.mockImplementation(async(path: string) => {
    if(path.endsWith('/repositories')) return {repositories:[missing]}
    if(path.endsWith('/agents')) return {agents:[]}
    if(path.includes('/tasks?')) return {tasks:[]}
    if(path.includes('/local-work')) return {lanes:[]}
    return {task:null}
  })
  render(<MissionControl/>)
  fireEvent.click(screen.getByRole('button',{name:'PR Control'}))
  await screen.findByText(/1 repositories have unverified PR counts/)
  expect(screen.getByText('Not verified')).toBeTruthy()
})
