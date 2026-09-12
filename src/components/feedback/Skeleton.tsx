import { cn } from '@/lib/cn'

export interface SkeletonProps {
  className?: string
  width?: number | string
  height?: number | string
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-border)]', className)}
      style={{ width, height }}
    />
  )
}
