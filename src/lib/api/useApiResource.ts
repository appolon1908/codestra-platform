import { useEffect, useState } from 'react'
import type { ApiFailureReason, ApiResult } from './client'

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'unavailable'; reason: ApiFailureReason; message: string }

/**
 * Fetches once on mount (and whenever `deps` change) and exposes a
 * three-state result: loading / ready / unavailable. "unavailable" covers
 * every non-happy path (real mode off, no dev token, network failure, HTTP
 * error) uniformly — callers render `StatePanel` or fall back to mock data
 * for that one case, never both.
 */
export function useApiResource<T>(fetcher: () => Promise<ApiResult<T>>, deps: unknown[] = []): ResourceState<T> {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetcher().then((result) => {
      if (cancelled) return
      if (result.ok) setState({ status: 'ready', data: result.data })
      else setState({ status: 'unavailable', reason: result.reason, message: result.message })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
