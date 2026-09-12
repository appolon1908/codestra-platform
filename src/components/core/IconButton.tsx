import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-sm)] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-interactive)] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]',
        secondary:
          'bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-border)]',
        ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]',
        danger: 'bg-transparent text-[var(--color-status-error)] hover:bg-[var(--color-status-error-bg)]',
      },
      size: {
        sm: 'size-8',
        md: 'size-9',
        lg: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, label, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'
