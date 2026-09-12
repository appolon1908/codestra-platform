import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/cn'

export interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
}

export function Tabs({ items, value, defaultValue, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      className={className}
    >
      <RadixTabs.List className="flex items-center gap-1 border-b border-[var(--color-surface-border)]">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              'border-b-2 border-transparent px-3 py-2 text-[length:var(--text-body)] font-medium text-[var(--color-text-secondary)] outline-none transition-colors',
              'data-[state=active]:border-[var(--color-brand-primary)] data-[state=active]:text-[var(--color-brand-primary)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  )
}

export const TabPanel = RadixTabs.Content
