import { cn, initials } from '@/lib/utils'

type Props = {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

export function Avatar({ name, size = 'md', className }: Props) {
  return (
    <span
      className={cn(
        'inline-grid place-items-center rounded-full bg-secondary-soft font-semibold text-secondary',
        size === 'sm' ? 'size-8 text-[12px]' : 'size-10 text-[13px]',
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
