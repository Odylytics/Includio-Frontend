import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Props = {
  /** `null` = logo without link. Omit for home (`/`). */
  to?: string | null
  compact?: boolean
  className?: string
}

export function BrandLogo({ to, compact, className }: Props) {
  const content = (
    <img
      src="/logo-full.svg"
      alt="includio."
      className={cn(
        'w-auto object-contain object-left',
        compact ? 'h-7' : 'h-8 sm:h-9',
        className,
      )}
    />
  )

  if (to === null) return content

  return (
    <Link to={to ?? '/'} className="inline-flex items-center" aria-label="Includio home">
      {content}
    </Link>
  )
}
