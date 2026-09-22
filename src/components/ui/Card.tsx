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
        'rounded-lg border border-border bg-surface shadow-[var(--shadow-1)]',
        padding && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}
