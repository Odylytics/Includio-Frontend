import { Link, useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { SiteHeader } from './SiteHeader'
import { AppNav, type NavItem } from './AppNav'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import { cn } from '@/lib/utils'

type Props = {
  workspace: 'employer' | 'candidate'
  navItems: NavItem[]
  children: React.ReactNode
  className?: string
}

/**
 * Unified product shell — fade navbar with flat links (no pills).
 */
export function AppShell({ workspace, navItems, children, className }: Props) {
  const navigate = useNavigate()
  const unread = useMockStore((s) => s.notifications.filter((n) => !n.read).length)

  return (
    <div className={cn('min-h-screen', className)}>
      <SiteHeader
        logoTo="/"
        actionLabel="Demo"
        onAction={() => toast('Demo prototype — AI and recording are simulated')}
        leftSlot={
          <SegmentedControl
            ariaLabel="Switch workspace"
            value={workspace}
            onChange={(v) => {
              navigate(v === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')
            }}
            options={[
              { value: 'employer', label: 'HR' },
              { value: 'candidate', label: 'Candidate' },
            ]}
          />
        }
        centerSlot={<AppNav items={navItems} />}
        rightSlot={
          <button
            type="button"
            className="relative grid size-9 place-items-center text-ink-secondary transition hover:text-ink"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            onClick={() =>
              toast(unread ? `You have ${unread} new updates` : 'No new notifications')
            }
          >
            <Bell className="size-4" />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" aria-hidden />
            ) : null}
          </button>
        }
      />

      <main className="page-enter mx-auto max-w-[var(--maxw)] px-4 py-8 sm:px-6">{children}</main>

      <p className="mx-auto max-w-[var(--maxw)] px-4 pb-8 text-center text-[12px] text-ink-muted sm:px-6">
        <Link to="/" className="font-medium text-ink-secondary underline-offset-2 hover:underline">
          ← Back to landing
        </Link>
        {' · '}
        Inclusive Studio prototype
      </p>
    </div>
  )
}
