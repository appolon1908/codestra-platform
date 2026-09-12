import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leadingIcon, trailingIcon, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border bg-[var(--color-surface-card)] px-3 text-[length:var(--text-body)] transition-colors',
          error
            ? 'border-[var(--color-status-error)]'
            : 'border-[var(--color-surface-border)] focus-within:border-[var(--color-brand-interactive)]',
          disabled && 'opacity-50',
          className,
        )}
      >
        {leadingIcon}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error || undefined}
          className="w-full bg-transparent text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-disabled)] disabled:cursor-not-allowed"
          {...props}
        />
        {trailingIcon}
      </div>
    )
  },
)
Input.displayName = 'Input'
