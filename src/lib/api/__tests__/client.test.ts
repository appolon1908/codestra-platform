import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from '../client'
import { setDevApiToken } from '../config'

function setRealMode(enabled: boolean) {
  vi.stubEnv('VITE_USE_REAL_API', enabled ? 'true' : 'false')
}

describe('apiGet', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns mode-disabled when real API mode is off, without calling fetch', async () => {
    setRealMode(false)
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await apiGet('/platform/v1/calls')

    expect(result).toEqual({ ok: false, reason: 'mode-disabled', message: expect.any(String) })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns no-token when real mode is on but no dev token is configured', async () => {
    setRealMode(true)
    setDevApiToken(null)
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await apiGet('/platform/v1/calls')

    expect(result).toEqual({ ok: false, reason: 'no-token', message: expect.any(String) })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('attaches the bearer token and returns parsed JSON on success', async () => {
    setRealMode(true)
    setDevApiToken('secret-token')
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    })
    vi.stubGlobal('fetch', fetchSpy)

    const result = await apiGet<{ items: unknown[] }>('/platform/v1/calls')

    expect(result).toEqual({ ok: true, data: { items: [] } })
    const [, init] = fetchSpy.mock.calls[0]
    expect(init.headers.Authorization).toBe('Bearer secret-token')
  })

  it('returns a network reason when fetch throws', async () => {
    setRealMode(true)
    setDevApiToken('secret-token')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))

    const result = await apiGet('/platform/v1/calls')

    expect(result).toEqual({ ok: false, reason: 'network', message: 'boom' })
  })

  it('returns an http reason on a non-ok response', async () => {
    setRealMode(true)
    setDevApiToken('secret-token')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    const result = await apiGet('/platform/v1/calls')

    expect(result).toEqual({ ok: false, reason: 'http', status: 503, message: expect.any(String) })
  })
})
