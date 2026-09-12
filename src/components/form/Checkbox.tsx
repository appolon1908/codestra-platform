import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  id?: string
  label?: string
}

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  id,
  label,
}: CheckboxProps) {
  const checkbox = (
    <RadixCheckbox.Root
      id={id}
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(state) => onCheckedChange?.(state === true)}
      disabled={disabled}
      className={cn(
        'flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[var(--color-surface-border-strong)] bg-[var(--color-surface-card)] outline-none transition-colors data-[state=checked]:border-[var(--color-brand-primary)] data-[state=checked]:bg-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <RadixCheckbox.Indicator>
        <Check className="size-3 text-white" aria-hidden="true" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
  if (!label) return checkbox
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-[length:var(--text-body)] text-[var(--color-text-primary)]">
      {checkbox}
      {label}
    </label>
  )
}
