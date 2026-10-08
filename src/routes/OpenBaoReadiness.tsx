import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleAlert, GitPullRequest, RefreshCw, Search, Server, ShieldAlert } from 'lucide-react'
import { mcJson } from '@/mission-control/api'

type Task = { task_id: string; subarea: string; completion_percent: number; certified: boolean }
type Section = { name: string; total: number; certified: number; tasks: Task[] }
type Snapshot = {
  repository: 'Codestra-OpenBao'
  observed_at: string
  data_state: 'OBSERVED' | 'NO_REGISTRY_DATA'
  registry: {
    sync_state: string; ci_state: string; open_prs: number | null
    remote_head_sha: string | null; last_synced_at: string | null
    active_agents: number | null; certified_tasks: number | null; total_tasks: number | null
  }
  pr_summary: { total: number; ci_green: number; merged: number; post_merge_verified: number }
  sections: Section[]
  links: { repository: string; pull_requests: string }
  runtime_health: 'NOT_CHECKED'
  release_certification: 'NOT_CHECKED'
  mode: 'READ_ONLY'
}
type Page = 'overview' | 'workstreams' | 'prs' | 'api'

const URL = '/platform/v1/dashboard/openbao'
const REQUIRED = '/platform/v1/dashboard/contract'
const cards = 'rounded-xl border border-slate-800 bg-slate-900 p-5'
const button = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50'
const statusTone = (value: string) => {
  const s = value.toUpperCase()
  return s === 'GREEN' || s === 'SYNCED' || s === 'READY'
    ? 'border-emerald-800 bg-emerald-950 text-emerald-200'
    : s === 'RED' || s === 'BLOCKED' || s === 'DIRTY' || s === 'FAILED'
      ? 'border-red-800 bg-red-950 text-red-200'
      : 'border-amber-800 bg-amber-950 text-amber-200'
}

export function OpenBaoReadiness() {
  const [data, setData] = useState<Snapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<Page>('overview')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [apiCheck, setApiCheck] = useState<string | null>(null)
  const [requestId, setRequestId] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await mcJson(URL) as Snapshot
      if (result.repository !== 'Codestra-OpenBao' || result.mode !== 'READ_ONLY') {
        throw new Error('OpenBao API contract mismatch')
      }
      setData(result)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'API request failed')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load, requestId])
  const retry = () => setRequestId(n => n + 1)

  const checkApi = async () => {
    setChecking(true)
    setApiCheck(null)
    try {
      const [health, contract] = await Promise.all([
        mcJson('/platform/v1/dashboard/health'),
        mcJson(REQUIRED),
      ])
      if (health?.status !== 'ok' || contract?.endpoints?.openbao?.path !== URL) {
        throw new Error('API contract or health endpoint does not match')
      }
      setApiCheck('Backend reachable · OpenBao endpoint listed in contract · no runtime secret operations tested')
    } catch (err) {
      setApiCheck('Integration test failed: ' + (err instanceof Error ? err.message : 'unknown error'))
    } finally { setChecking(false) }
  }

  const filtered = useMemo(() => (data?.sections || []).filter(section =>
    (section.name + ' ' + section.tasks.map(task => task.task_id + ' ' + task.subarea).join(' '))
      .toLowerCase().includes(query.toLowerCase())
  ), [data?.sections, query])
  const tabs: { id: Page; label: string }[] = [
    { id: 'overview', label: 'Overview' }, { id: 'workstreams', label: 'Workstreams' },
    { id: 'prs', label: 'Pull requests' }, { id: 'api', label: 'API diagnostics' },
  ]
  const tone = (text: string) => <span className={'rounded-full border px-3 py-1 text-xs font-semibold ' + statusTone(text)}>{text}</span>

  return <main className="min-h-screen bg-slate-950 pb-12 text-slate-100">
    <header className="border-b border-slate-800 bg-slate-950 px-4 py-5 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/mission-control" className="mb-3 inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"><ArrowLeft className="h-4 w-4" /> Mission Control</Link>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-400">Codestra infrastructure / Secrets authority</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">OpenBao readiness</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Repository delivery, certification evidence, and workstream progress. Read-only by design — no unseal, credential reads, production actions, or secret writes.</p>
        </div>
        <button type="button" className={button} disabled={loading} onClick={retry} aria-label="Refresh OpenBao readiness">
          <RefreshCw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} /> Refresh
        </button>
      </div>
      <nav aria-label="OpenBao dashboard sections" className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2">
        {tabs.map(tab => <button key={tab.id} type="button" aria-current={page === tab.id ? 'page' : undefined}
          className={'rounded-lg px-4 py-2 text-sm font-semibold ' + (page === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800')}
          onClick={() => setPage(tab.id)}>{tab.label}</button>)}
      </nav>
    </header>
    <div className="mx-auto max-w-6xl space-y-5 px-4 pt-6 md:px-8">
      {loading && <div role="status" className={cards}>Loading OpenBao repository data from Mission Control…</div>}
      {error && !loading && <div role="alert" className="rounded-xl border border-red-800 bg-red-950/50 p-5">
        <p className="font-semibold text-red-200">Could not connect to the backend.</p>
        <p className="mt-2 text-sm text-red-300">{error}. Check the Mission Control API route and authentication; this screen will not show fabricated health.</p>
        <button type="button" onClick={retry} className={button + ' mt-4'}>Retry connection</button>
      </div>}
      {data && !loading && <>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-800/70 bg-amber-950/30 p-4">
          <span className="inline-flex items-center gap-2 text-sm text-amber-200"><ShieldAlert className="h-5 w-5" /> Runtime health and release certification have not been verified by this API.</span>
          {tone(data.data_state === 'OBSERVED' ? 'Registry observed' : 'No registry data')}
        </div>
        <p className="text-xs text-slate-500">Snapshot: {new Date(data.observed_at).toLocaleString()} · Last reconciler sync: {data.registry.last_synced_at ? new Date(data.registry.last_synced_at).toLocaleString() : 'not reported'}</p>
        {page === 'overview' && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {([
              ['Repository sync', data.registry.sync_state, Server],
              ['CI result', data.registry.ci_state, CheckCircle2],
              ['Open PRs', data.registry.open_prs ?? 'Unknown', GitPullRequest],
              ['Certified tasks', data.registry.certified_tasks == null ? 'Unknown' : data.registry.certified_tasks + ' / ' + (data.registry.total_tasks ?? '?'), ShieldAlert],
            ] as const).map(([label, value, Icon]) => <article key={label} className={cards}>
              <Icon className="mb-4 h-5 w-5 text-blue-400" /><p className="text-xs font-semibold text-slate-400">{label}</p>
              <strong className="mt-2 block break-words text-xl">{String(value)}</strong>
            </article>)}
          </div>
          <div className={cards}>
            <h2 className="text-lg font-semibold">Authority and integration</h2>
            <p className="mt-2 text-sm text-slate-400">The backend reports repository and workflow evidence, not live vault health. Production activation remains subject to independent image-security, identity, recovery, and exact-SHA review.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className={button} onClick={() => setPage('workstreams')} type="button">Inspect workstreams</button>
              <button className={button} onClick={() => setPage('api')} type="button">Check API connection</button>
              <a className={button} href={data.links.repository} target="_blank" rel="noopener noreferrer">View source <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </div>
        </>}
        {page === 'workstreams' && <>
          <label className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4">
            <Search className="h-4 w-4 text-slate-500" />
            <span className="sr-only">Filter OpenBao workstreams</span>
            <input className="w-full bg-transparent py-3 text-sm outline-none" placeholder="Filter by section or task…" value={query} onChange={event => setQuery(event.target.value)} />
          </label>
          {data.sections.length === 0 && <section className={cards}>No OpenBao mission tasks are registered in this API snapshot. Certification cannot be inferred.</section>}
          {data.sections.length > 0 && filtered.length === 0 && <section className={cards}>No workstreams match your search.</section>}
          {filtered.map(section => <section className={cards} key={section.name}>
            <button type="button" className="flex w-full items-center justify-between gap-3 text-left" aria-expanded={expanded === section.name} onClick={() => setExpanded(x => x === section.name ? null : section.name)}>
              <span><strong className="block text-lg">{section.name}</strong><small className="text-slate-400">{section.certified} certified / {section.total} tasks</small></span>
              <span className="rounded-lg border border-slate-700 px-3 py-1 text-sm">{expanded === section.name ? 'Hide' : 'View tasks'}</span>
            </button>
            {expanded === section.name && <ul className="mt-4 space-y-2 border-t border-slate-800 pt-4">
              {section.tasks.map(task => <li key={task.task_id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-950 p-3 text-sm">
                <span><strong className="block text-blue-300">{task.task_id}</strong><small className="text-slate-400">{task.subarea}</small></span>
                <span>{task.completion_percent}% · {tone(task.certified ? 'Certified' : 'Not certified')}</span>
              </li>)}
            </ul>}
          </section>)}
        </>}
        {page === 'prs' && <section className={cards}>
          <h2 className="text-lg font-semibold">Pull-request evidence</h2>
          <p className="mt-2 text-sm text-slate-400">These counts come from Mission Control's reconciled repository snapshot and may lag GitHub. Check GitHub for current checks and reviewer decisions.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(data.pr_summary).map(([key, value]) => <div key={key} className="rounded-lg bg-slate-950 p-3"><p className="text-xs capitalize text-slate-400">{key.replaceAll('_', ' ')}</p><strong className="mt-2 block text-xl">{value}</strong></div>)}
          </div>
          <a className={button + ' mt-5'} href={data.links.pull_requests} target="_blank" rel="noopener noreferrer">View GitHub PRs <ArrowUpRight className="h-4 w-4" /></a>
        </section>}
        {page === 'api' && <section className={cards}>
          <h2 className="text-lg font-semibold">Backend API diagnostics</h2>
          <p className="mt-2 text-sm text-slate-400">Validates the real read-only endpoint and dashboard contract through your authenticated session. This is not an OpenBao secret-engine or runtime certification.</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-950 p-3"><dt className="text-slate-400">Endpoint</dt><dd className="mt-1 break-all font-mono">{URL}</dd></div>
            <div className="rounded-lg bg-slate-950 p-3"><dt className="text-slate-400">Frontend mode</dt><dd className="mt-1">Same-origin, bearer token when configured</dd></div>
            <div className="rounded-lg bg-slate-950 p-3"><dt className="text-slate-400">OpenBao runtime</dt><dd className="mt-1">Not checked</dd></div>
            <div className="rounded-lg bg-slate-950 p-3"><dt className="text-slate-400">Remote repository SHA</dt><dd className="mt-1 break-all font-mono">{data.registry.remote_head_sha || 'Not available'}</dd></div>
          </dl>
          <button type="button" disabled={checking} className={button + ' mt-5'} onClick={() => void checkApi()}>
            <RefreshCw className={'h-4 w-4 ' + (checking ? 'animate-spin' : '')} /> Verify backend + contract
          </button>
          {apiCheck && <p role="status" className={'mt-4 flex gap-2 rounded-lg border p-3 text-sm ' + (apiCheck.startsWith('Integration test failed') ? 'border-red-800 bg-red-950 text-red-200' : 'border-emerald-800 bg-emerald-950 text-emerald-200')}>
            {apiCheck.startsWith('Integration test failed') ? <CircleAlert className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}{apiCheck}
          </p>}
        </section>}
      </>}
    </div>
  </main>
}
