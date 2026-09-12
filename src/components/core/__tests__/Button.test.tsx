import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children and responds to click', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Call now</Button>)
    const button = screen.getByRole('button', { name: 'Call now' })
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disables interaction while loading', () => {
    render(<Button loading>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
