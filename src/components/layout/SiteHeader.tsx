import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { cn } from '@/lib/utils'

type Props = {
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
  className?: string
  logoTo?: string | null
  leftSlot?: React.ReactNode
  centerSlot?: React.ReactNode
  rightSlot?: React.ReactNode
  /** When false, skip the default right action control */
  showAction?: boolean
}

const actionClass =
  'inline-flex items-center justify-center px-3 py-2 text-[13px] font-semibold text-ink-secondary transition hover:text-ink'

function ActionControl({
  label,
  to,
  onClick,
}: {
  label: string
  to?: string
  onClick?: () => void
}) {
  if (onClick) {
    return (
      <button type="button" className={actionClass} onClick={onClick}>
        {label}
      </button>
    )
  }
  if (!to) return null
  if (to.startsWith('mailto:') || to.startsWith('http')) {
    return (
      <a href={to} className={actionClass}>
        {label}
      </a>
    )
  }
  return (
    <Link to={to} className={actionClass}>
      {label}
    </Link>
  )
}

export function SiteHeader({
  actionLabel = 'Start',
  actionTo = '/start',
  onAction,
  className,
  logoTo = '/',
  leftSlot,
  centerSlot,
  rightSlot,
  showAction = true,
}: Props) {
  return (
    <header className={cn('sticky top-0 z-40', className)}>
      <div className="nav-fade-bar">
        <div className="relative flex min-h-[72px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <BrandLogo to={logoTo} compact />
            {leftSlot}
          </div>

          {centerSlot ? (
            <div className="absolute left-1/2 hidden max-w-[min(100%,560px)] -translate-x-1/2 md:block">
              {centerSlot}
            </div>
          ) : null}

          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            {rightSlot}
            {showAction ? (
              <ActionControl
                label={actionLabel}
                to={onAction ? undefined : actionTo}
                onClick={onAction}
              />
            ) : null}
          </div>
        </div>

        {centerSlot ? (
          <div className="flex justify-center px-3 pb-4 md:hidden">{centerSlot}</div>
        ) : null}
      </div>
    </header>
  )
}
