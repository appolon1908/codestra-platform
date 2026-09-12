import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  name?: string
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select…',
  disabled,
  error,
  name,
}: SelectProps) {
  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <RadixSelect.Trigger
        aria-invalid={error || undefined}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border bg-[var(--color-surface-card)] px-3 text-[length:var(--text-body)] text-[var(--color-text-primary)] outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-[var(--color-status-error)]'
            : 'border-[var(--color-surface-border)] focus:border-[var(--color-brand-interactive)]',
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="size-4 text-[var(--color-text-muted)]" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className="z-50 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-floating)]"
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="flex cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-[length:var(--text-body)] text-[var(--color-text-primary)] outline-none data-[highlighted]:bg-[var(--color-surface-muted)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check className="size-4 text-[var(--color-brand-primary)]" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
