import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mcJson, missionUrl, missionWebSocketUrl, MissionApiError } from '../api'

vi.mock('../auth', () => ({
  ensureAccessToken: vi.fn().mockResolvedValue(null),
  accessToken: vi.fn().mockReturnValue(null),
}))

describe('Mission Control API boundary', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('uses a browser-reachable origin instead of visitor localhost and validates paths', () => {
    expect(missionUrl('/platform/v1/dashboard/repositories')).toBe(window.location.origin + '/platform/v1/dashboard/repositories')
    expect(() => missionUrl('//evil.example/')).toThrow('relative endpoint')
    expect(() => missionUrl('https://evil.example/')).toThrow('relative endpoint')
  })

  it('shows backend failures instead of inventing repository data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(mcJson('/platform/v1/dashboard/repositories')).rejects.toThrow('Cannot connect')
    vi.unstubAllGlobals()
  })

  it('handles missing permissions and invalid responses', async () => {
    const fetcher=vi.fn().mockResolvedValueOnce(new Response('{}',{status:403}))
      .mockResolvedValueOnce(new Response('not JSON',{status:200,headers:{'content-type':'application/json'}}))
    vi.stubGlobal('fetch',fetcher)
    await expect(mcJson('/platform/v1/dashboard/agents')).rejects.toMatchObject({status:403})
    await expect(mcJson('/platform/v1/dashboard/agents')).rejects.toBeInstanceOf(MissionApiError)
    vi.unstubAllGlobals()
  })

  it('does not infer a localhost websocket or downgrade a secure page', () => {
    expect(missionWebSocketUrl()).toBeNull()
  })
})
