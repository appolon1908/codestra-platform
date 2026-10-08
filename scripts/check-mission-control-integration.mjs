#!/usr/bin/env node
/**
 * Read-only, fail-closed end-to-end contract probe.
 * Required: MC_API_URL=https://<staging-gateway> MC_ACCESS_TOKEN=<OIDC bearer>.
 * Never mutates data or authorizes deployment; CI must run on the exact SHA.
 */
const origin = process.env.MC_API_URL
const token = process.env.MC_ACCESS_TOKEN
if (!origin || !token) {
  console.error('NOT_CERTIFIED: MC_API_URL and MC_ACCESS_TOKEN are required; unauthenticated probes are prohibited')
  process.exit(2)
}
let base
try {
  base = new URL(origin)
  if (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(base.hostname))) {
    throw new Error('staging requires TLS')
  }
} catch {
  console.error('NOT_CERTIFIED: invalid or insecure MC_API_URL')
  process.exit(2)
}
async function check(path, key) {
  const url = new URL(path, base)
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 7000)
  try {
    const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' }, signal: controller.signal, redirect: 'error' })
    if (!response.ok) throw new Error('HTTP '+response.status)
    const data = await response.json()
    if (key && (!Array.isArray(data[key]))) throw new Error('missing array '+key)
    console.log('PASS '+url.pathname+' '+(key?data[key].length+' '+key:'contract'))
    return data
  } finally { clearTimeout(t) }
}
try {
  await check('/platform/v1/dashboard/contract')
  const repos = await check('/platform/v1/dashboard/repositories', 'repositories')
  await check('/platform/v1/dashboard/agents','agents')
  const repo = repos.repositories[0]?.repository
  if (repo) {
    await check('/platform/v1/dashboard/tasks?repository='+encodeURIComponent(repo),'tasks')
    await check('/platform/v1/dashboard/local-work?repository='+encodeURIComponent(repo)+'&recent_hours=48','lanes')
  }
  console.log('MISSION_CONTROL_READONLY_API_CERTIFICATION=PASS')
} catch (e) {
  console.error('MISSION_CONTROL_READONLY_API_CERTIFICATION=FAIL '+e.message)
  process.exitCode=1
}
