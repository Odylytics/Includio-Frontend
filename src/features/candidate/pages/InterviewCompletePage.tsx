import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function InterviewCompletePage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card className="space-y-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Complete
        </p>
        <h1 className="text-[clamp(26px,3vw,34px)]">
          Your interview is complete. Thank you for your time.
        </h1>
        <p className="text-ink-secondary">
          Software Engineering Intern · Northwind Labs · Jun 24, 2026
        </p>
        <ul className="space-y-1 text-[14.5px] text-ink-secondary">
          <li>
            Status: <b className="text-ink">Submitted</b>
          </li>
          <li>
            Duration: <b className="font-mono text-ink">~28 min</b>
          </li>
          <li>
            Questions completed: <b className="font-mono text-ink">7 / 7</b>
          </li>
        </ul>
        <p className="text-[14.5px] text-ink-secondary">
          The hiring team will review your interview. Northwind Labs will contact you directly with
          next steps. We do not show AI results because Includio never makes the hiring decision.
        </p>
        <p className="text-[13px] text-ink-muted">Support: support@includio.demo</p>
        <Link to="/candidate/dashboard">
          <Button>Return to dashboard</Button>
        </Link>
      </Card>
    </div>
  )
}
