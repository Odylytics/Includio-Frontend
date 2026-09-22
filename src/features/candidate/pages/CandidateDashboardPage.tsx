import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { useMockStore } from '@/lib/mock/mockStore'
import { candidateUser } from '@/lib/mock/seedData'

export function CandidateDashboardPage() {
  const used = useMockStore((s) => s.practiceQuotaUsed)
  const max = useMockStore((s) => s.practiceQuotaMax)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Candidate workspace
        </p>
        <h1 className="mt-2 text-[clamp(28px,4vw,40px)]">
          Welcome, {candidateUser.name.split(' ')[0]}
        </h1>
        <p className="mt-2 text-ink-secondary">Your interview with Northwind Labs is in 6 days.</p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              Upcoming interview
            </p>
            <h2 className="mt-1 text-xl">Software Engineering Intern</h2>
            <p className="text-ink-secondary">Northwind Labs</p>
            <p className="mt-2 font-mono text-[13.5px]">Jun 24, 2026 · 14:30 GMT+7 · 30 min</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/candidate/practice/setup">
              <Button>Start practicing</Button>
            </Link>
            <Link to="/candidate/interview/check">
              <Button variant="ghost">View interview details</Button>
            </Link>
          </div>
        </div>
        <p className="text-[14px] text-ink-muted">
          Practice access is open until Jun 23. Practice at your own pace.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg">Practice allowance</h2>
          <p className="mt-2 quota-line text-[14.5px]">
            <b id="quota-used">{used}</b> of <b>{max}</b> practice sessions used today
          </p>
          <Progress className="mt-3" value={used} max={max} label="Today’s sessions" />
          <p className="mt-3 text-[13.5px] text-ink-muted">
            5 questions per session · Access ends Jun 23. This is an upper limit, not a target.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg">Preparation checklist</h2>
          <ul className="mt-3 space-y-2 text-[14.5px] text-ink-secondary">
            <li>✓ Account activated</li>
            <li>✓ Accessibility preferences available</li>
            <li>○ Complete at least one practice session</li>
            <li>○ Device check before the live interview</li>
          </ul>
          <Link to="/candidate/account/accessibility" className="mt-4 inline-block font-semibold text-secondary">
            Customise your interview experience
          </Link>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg">Optional practice ideas</h2>
        <div className="grid gap-2">
          {[
            ['Practice behavioural questions', 'Teamwork and collaboration'],
            ['Review technical scenarios', 'Debugging and testing'],
            ['Try a shorter session', '10 minutes, 3 questions'],
          ].map(([title, sub]) => (
            <Link
              key={title}
              to="/candidate/practice/setup"
              className="rounded-md border border-border px-4 py-3 hover:bg-background"
            >
              <b className="block">{title}</b>
              <small className="text-ink-muted">{sub}</small>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-ink-muted">
          Your practice sessions are private. Nothing here is shared with the employer unless you
          choose to share it.
        </p>
      </Card>
    </div>
  )
}
