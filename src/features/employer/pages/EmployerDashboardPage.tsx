import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useMockStore } from '@/lib/mock/mockStore'
import { employerUser } from '@/lib/mock/seedData'

export function EmployerDashboardPage() {
  const campaigns = useMockStore((s) => s.campaigns)
  const candidates = useMockStore((s) => s.candidates)
  const reports = useMockStore((s) => s.reports)

  const active = campaigns.filter((c) => c.status !== 'Closed' && c.status !== 'Draft')
  const invited = candidates.filter((c) => c.invitationStatus !== 'Not sent').length
  const awaiting = reports.filter((r) => r.status === 'Ready for review').length

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {employerUser.org}
          </p>
          <h1 className="mt-2 text-[clamp(28px,4vw,40px)]">
            Good morning, {employerUser.name.split(' ')[0]}
          </h1>
          <p className="mt-2 text-ink-secondary">Three campaigns are active across two departments.</p>
        </div>
        <Link to="/employer/campaigns/new">
          <Button>Create hiring campaign</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [String(active.length), 'Active campaigns', '2 closing this month'],
          [String(invited), 'Invited candidates', 'Across open roles'],
          ['4', 'Upcoming interviews', 'Next 7 days'],
          [String(awaiting), 'Reports awaiting review', 'Human decision needed'],
        ].map(([value, label, hint]) => (
          <Card key={label}>
            <div className="font-display text-3xl font-extrabold">{value}</div>
            <div className="mt-1 font-semibold">{label}</div>
            <div className="mt-1 text-[13px] text-ink-muted">{hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg">Active hiring campaigns</h2>
            <Link to="/employer/campaigns" className="text-[14px] font-semibold text-secondary">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {campaigns.slice(0, 3).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold">{c.jobTitle}</div>
                  <div className="text-[13px] text-ink-muted">
                    {c.department} · {c.candidateCount} candidates
                  </div>
                </div>
                <Badge
                  tone={
                    c.status === 'Practice in progress'
                      ? 'primary'
                      : c.status === 'Interviewing'
                        ? 'success'
                        : 'muted'
                  }
                >
                  {c.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Upcoming interviews</h2>
          <ul className="space-y-3">
            {[
              ['Amara Reyes', 'Software Engineering Intern', 'Today 14:30'],
              ['Jonah Tan', 'Software Engineering Intern', 'Tomorrow 10:00'],
              ['Diego Fernandez', 'Graduate Business Analyst', 'Jun 20 11:00'],
            ].map(([name, role, when]) => (
              <li key={name} className="flex items-center gap-3">
                <Avatar name={name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{name}</div>
                  <div className="truncate text-[13px] text-ink-muted">{role}</div>
                </div>
                <span className="font-mono text-[12.5px] text-ink-muted">{when}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="bg-secondary-soft">
        <h2 className="text-base">Privacy reminder</h2>
        <p className="mt-2 text-[14.5px] text-ink-secondary">
          Practice answers and feedback remain private to the candidate. HR reviews only the live
          interview evidence and anything a candidate chooses to share.
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg">Recent activity</h2>
        <ul className="space-y-2.5 text-[14.5px] text-ink-secondary">
          <li>
            <span className="mr-2 inline-block size-2 rounded-full bg-secondary" aria-hidden />
            <b className="text-ink">Amara Reyes</b> accepted the invitation{' '}
            <span className="font-mono text-ink-muted">12m ago</span>
          </li>
          <li>
            <span className="mr-2 inline-block size-2 rounded-full bg-primary" aria-hidden />
            Interview plan approved for Software Engineering Intern{' '}
            <span className="font-mono text-ink-muted">1d ago</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
