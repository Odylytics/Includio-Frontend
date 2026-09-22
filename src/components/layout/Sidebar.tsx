import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Library,
  FileText,
  Settings,
} from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { Avatar } from '@/components/ui/Avatar'
import { employerUser } from '@/lib/mock/seedData'
import { cn } from '@/lib/utils'

const links = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/campaigns', label: 'Hiring campaigns', icon: Briefcase },
  { to: '/employer/library', label: 'Question library', icon: Library },
  { to: '/employer/reports', label: 'Interview reports', icon: FileText },
  { to: '/employer/settings', label: 'Settings', icon: Settings },
]

type Props = {
  mobileOpen: boolean
  onClose: () => void
}

export function Sidebar({ mobileOpen, onClose }: Props) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-[rgba(42,33,28,0.35)] lg:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[var(--sidebar-w)] flex-col gap-1.5 border-r border-border bg-surface px-5 py-6 transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <BrandLogo to="/" compact />
        <div className="mt-5 mb-2 px-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">
          Employer workspace
        </div>
        <nav className="grid gap-1" aria-label="Employer">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14.5px] font-semibold text-ink-secondary',
                  isActive && 'bg-primary-soft text-primary-dark',
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <Avatar name={employerUser.name} />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold">{employerUser.org}</div>
            <div className="truncate text-[12.5px] text-ink-muted">
              {employerUser.name} · {employerUser.role}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
