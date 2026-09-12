import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Table } from '../Table'

interface Row {
  id: string
  name: string
  extension: string
}

const rows: Row[] = [
  { id: '1', name: 'Alex Rivera', extension: '6101' },
  { id: '2', name: 'Jordan Lee', extension: '6102' },
]

describe('Table', () => {
  it('renders headers and row cells', () => {
    render(
      <Table
        columns={[
          { key: 'name', header: 'Agent', render: (row: Row) => row.name },
          { key: 'extension', header: 'Extension', render: (row: Row) => row.extension },
        ]}
        rows={rows}
        getRowKey={(row) => row.id}
      />,
    )
    expect(screen.getByText('Agent')).toBeInTheDocument()
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument()
    expect(screen.getByText('6102')).toBeInTheDocument()
  })

  it('renders the empty state when there are no rows', () => {
    render(
      <Table<Row>
        columns={[{ key: 'name', header: 'Agent', render: (row) => row.name }]}
        rows={[]}
        getRowKey={(row) => row.id}
        emptyState={<p>No agents</p>}
      />,
    )
    expect(screen.getByText('No agents')).toBeInTheDocument()
  })
})
