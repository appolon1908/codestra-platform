import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('toggles checked state and calls onCheckedChange', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox id="agree" label="I agree" onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'I agree' })
    await userEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not respond when disabled', async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox id="agree" label="I agree" disabled onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'I agree' })
    await userEvent.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
