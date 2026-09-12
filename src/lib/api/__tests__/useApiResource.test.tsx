import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useApiResource } from '../useApiResource'
import type { ApiResult } from '../client'

describe('useApiResource', () => {
  it('starts loading then resolves to ready on success', async () => {
    const { result } = renderHook(() =>
      useApiResource<{ value: number }>(async () => ({ ok: true, data: { value: 42 } }) as ApiResult<{ value: number }>, []),
    )

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current).toEqual({ status: 'ready', data: { value: 42 } })
  })

  it('resolves to unavailable with the reason and message on failure', async () => {
    const { result } = renderHook(() =>
      useApiResource(async () => ({ ok: false, reason: 'network', message: 'boom' }) as ApiResult<unknown>, []),
    )

    await waitFor(() => expect(result.current.status).toBe('unavailable'))
    expect(result.current).toEqual({ status: 'unavailable', reason: 'network', message: 'boom' })
  })
})
