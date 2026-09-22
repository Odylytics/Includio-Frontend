import { Bell, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'

type Props = {
  workspace: 'employer' | 'candidate'
  onMenu?: () => void
}

export function Topbar({ workspace, onMenu }: Props) {
  const navigate = useNavigate()
  const unread = useMockStore((s) => s.notifications.filter((n) => !n.read).length)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-[rgba(251,250,248,0.9)] px-4 backdrop-blur-md sm:px-6">
      {onMenu ? (
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-border-strong bg-surface lg:hidden"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu className="size-4" />
        </button>
      ) : null}

      <SegmentedControl
        ariaLabel="Switch workspace"
        value={workspace}
        onChange={(v) => {
          navigate(v === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')
        }}
        options={[
          { value: 'employer', label: 'Employer' },
          { value: 'candidate', label: 'Candidate' },
        ]}
      />

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-[12.5px] text-ink-muted sm:inline">
          Demo prototype — AI and recording are simulated
        </span>
        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-full border border-border-strong bg-surface"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          onClick={() =>
            toast(
              unread
                ? `You have ${unread} new candidate updates`
                : 'No new notifications',
            )
          }
        >
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" aria-hidden />
          ) : null}
        </button>
      </div>
    </header>
  )
}
