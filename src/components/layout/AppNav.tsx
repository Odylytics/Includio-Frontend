import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type NavItem = {
  to: string
  label: string
  end?: boolean
}

type Props = {
  items: NavItem[]
  className?: string
  /** landing uses hash anchors as `to` like `#how` */
  mode?: 'routes' | 'anchors'
}

const linkBase =
  'relative whitespace-nowrap px-2.5 py-1.5 text-[13.5px] font-medium text-ink-secondary transition hover:text-ink sm:px-3'

/**
 * Flat nav links — no pill container. Shared across landing + product.
 */
export function AppNav({ items, className, mode = 'routes' }: Props) {
  return (
    <nav
      aria-label="Primary"
      className={cn('flex max-w-full items-center justify-center gap-0.5 overflow-x-auto sm:gap-1', className)}
    >
      {items.map((item) =>
        mode === 'anchors' ? (
          <a key={item.to} href={item.to} className={linkBase}>
            {item.label}
          </a>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive &&
                  'font-semibold text-primary after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary sm:after:inset-x-3',
              )
            }
          >
            {item.label}
          </NavLink>
        ),
      )}
    </nav>
  )
}

export const landingNavItems: NavItem[] = [
  { to: '#how', label: 'How it works' },
  { to: '#pillars', label: 'Pillars' },
  { to: '#product', label: 'Product' },
  { to: '#team', label: 'Team' },
  { to: '#faq', label: 'FAQ' },
]

export const employerNavItems: NavItem[] = [
  { to: '/employer/dashboard', label: 'Dashboard', end: true },
  { to: '/employer/campaigns', label: 'Campaigns' },
  { to: '/employer/library', label: 'Library' },
  { to: '/employer/reports', label: 'Reports' },
  { to: '/employer/settings', label: 'Settings' },
]

export const candidateNavItems: NavItem[] = [
  { to: '/candidate/dashboard', label: 'Interviews', end: true },
  { to: '/candidate/practice/setup', label: 'Practice' },
  { to: '/candidate/interview/check', label: 'Schedule' },
  { to: '/candidate/account/accessibility', label: 'Account' },
]
