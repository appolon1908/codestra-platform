import * as RadixSwitch from '@radix-ui/react-switch'
import { cn } from '@/lib/cn'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  id?: string
  label?: string
}

export function Switch({ checked, defaultChecked, onCheckedChange, disabled, name, id, label }: SwitchProps) {
  const control = (
    <RadixSwitch.Root
      id={id}
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-[var(--radius-pill)] bg-[var(--color-surface-border-strong)] outline-none transition-colors data-[state=checked]:bg-[var(--color-brand-primary)] disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <RadixSwitch.Thumb className="block size-4 translate-x-0.5 rounded-[var(--radius-pill)] bg-white shadow-[var(--shadow-card)] transition-transform data-[state=checked]:translate-x-[18px]" />
    </RadixSwitch.Root>
  )
  if (!label) return control
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-[length:var(--text-body)] text-[var(--color-text-primary)]">
      {control}
      {label}
    </label>
  )
}
