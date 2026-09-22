import { cn } from '@/lib/utils'

const tones = {
  default: 'bg-secondary-soft text-secondary',
  primary: 'bg-primary-soft text-primary-dark',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  muted: 'bg-background text-ink-muted border border-border',
} as const

type Props = {
  children: React.ReactNode
  tone?: keyof typeof tones
  className?: string
}

export function Badge({ children, tone = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-[12px] font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
