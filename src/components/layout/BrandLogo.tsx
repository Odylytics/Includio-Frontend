import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Props = {
  to?: string
  /** Smaller height for dense shells; same full logo asset. */
  compact?: boolean
  className?: string
}

export function BrandLogo({ to = '/', compact, className }: Props) {
  const content = (
    <img
      src="/logo-full.svg"
      alt="includio."
      className={cn(
        'w-auto object-contain object-left',
        compact ? 'h-7' : 'h-8',
        className,
      )}
    />
  )

  if (!to) return content
  return (
    <Link to={to} className="inline-flex items-center" aria-label="Includio home">
      {content}
    </Link>
  )
}
