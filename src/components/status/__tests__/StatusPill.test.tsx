import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusPill } from '../StatusPill'

describe('StatusPill', () => {
  it('renders the default label for a call state', () => {
    render(<StatusPill state="ringing" />)
    expect(screen.getByText('Ringing')).toBeInTheDocument()
  })

  it('renders a custom label when provided', () => {
    render(<StatusPill state="active" label="On a call with John" />)
    expect(screen.getByText('On a call with John')).toBeInTheDocument()
  })
})
