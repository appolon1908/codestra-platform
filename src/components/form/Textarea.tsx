import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={cn(
          'min-h-20 w-full rounded-[var(--radius-sm)] border bg-[var(--color-surface-card)] px-3 py-2 text-[length:var(--text-body)] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-disabled)] disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-[var(--color-status-error)]'
            : 'border-[var(--color-surface-border)] focus:border-[var(--color-brand-interactive)]',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
