import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  density?: 'compact' | 'comfortable'
  emptyState?: ReactNode
}

export function Table<T>({ columns, rows, getRowKey, density = 'comfortable', emptyState }: TableProps<T>) {
  const cellPadding = density === 'compact' ? 'px-3 py-1.5' : 'px-4 py-3'

  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-surface-border)]">
      <table className="w-full border-collapse text-[length:var(--text-body)]">
        <thead>
          <tr className="border-b border-[var(--color-surface-border)] bg-[var(--color-surface-muted)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  cellPadding,
                  'text-[length:var(--text-label)] font-medium text-[var(--color-text-muted)]',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.align === undefined || col.align === 'left' ? 'text-left' : '',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-[var(--color-surface-border)] last:border-0 hover:bg-[var(--color-surface-muted)]">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    cellPadding,
                    'text-[var(--color-text-primary)]',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
