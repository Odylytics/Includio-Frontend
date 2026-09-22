import { NavLink, Outlet } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardCheck,
  Home,
  Accessibility,
  Sparkles,
} from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { Topbar } from './Topbar'
import { cn } from '@/lib/utils'

const links = [
  { to: '/candidate/dashboard', label: 'My interviews', icon: Home },
  { to: '/candidate/practice/setup', label: 'Practice Studio', icon: Sparkles },
  { to: '/candidate/interview/check', label: 'Schedule', icon: CalendarDays },
  { to: '/candidate/account/accessibility', label: 'My account', icon: Accessibility },
]

export function CandidateShell() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-4 py-4 sm:px-6">
          <BrandLogo to="/candidate/dashboard" compact />
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Candidate">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-pill px-3.5 py-2 text-[14px] font-semibold text-ink-secondary',
                    isActive && 'bg-primary-soft text-primary-dark',
                  )
                }
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <ClipboardCheck className="size-5 text-ink-muted md:hidden" aria-hidden />
        </div>
      </header>
      <Topbar workspace="candidate" />
      <nav
        className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 md:hidden"
        aria-label="Candidate mobile"
      >
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap rounded-pill px-3 py-2 text-[13px] font-semibold text-ink-secondary',
                isActive && 'bg-primary-soft text-primary-dark',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="page-enter mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
