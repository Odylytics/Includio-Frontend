import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className, padding = true }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface/90 shadow-[var(--shadow-1)] backdrop-blur-sm',
        padding && 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}
