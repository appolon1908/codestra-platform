import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

// Note: the variant prop is named `variant`, not `type` — `type` is reserved
// by ButtonHTMLAttributes for the native submit/reset/button semantics and
// must never be shadowed by the visual style prop.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium text-[length:var(--text-button)] leading-[var(--text-button--line-height)] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-interactive)] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)]',
        secondary:
          'bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-border)]',
        outline:
          'border border-[var(--color-surface-border-strong)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]',
        ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]',
        danger: 'bg-[var(--color-status-error)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-4',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
