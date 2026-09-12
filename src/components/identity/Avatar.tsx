import * as RadixAvatar from '@radix-ui/react-avatar'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export const avatarVariants = cva(
  'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-brand-surface)] font-medium text-[var(--color-brand-primary)]',
  {
    variants: {
      size: {
        sm: 'size-6 text-[10px]',
        md: 'size-8 text-xs',
        lg: 'size-10 text-sm',
        xl: 'size-14 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string
  name: string
  className?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function Avatar({ src, name, size, className }: AvatarProps) {
  return (
    <RadixAvatar.Root className={cn(avatarVariants({ size }), className)}>
      <RadixAvatar.Image src={src} alt={name} className="size-full object-cover" />
      <RadixAvatar.Fallback delayMs={src ? 300 : 0}>{initials(name)}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
