import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, UserRound } from 'lucide-react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function StartPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader actionLabel="Landing" actionTo="/" />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Enter Includio
        </p>
        <h1 className="mt-3 text-[clamp(36px,6vw,56px)]">Choose your workspace</h1>
        <p className="mt-3 max-w-md text-ink-secondary">
          Same product, two calm interfaces. You can switch later from the shared nav.
        </p>

        <div className="mt-12 grid w-full gap-4 sm:grid-cols-2">
          <Card className="text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]">
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <Briefcase className="size-5" aria-hidden />
            </div>
            <h2 className="font-brand text-xl font-bold">Employer / HR</h2>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Campaigns, interview builder, invitations, and evidence reports.
            </p>
            <Link to="/employer/login" className="mt-6 inline-flex">
              <Button>
                Continue as HR <ArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>

          <Card className="text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]">
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
              <UserRound className="size-5" aria-hidden />
            </div>
            <h2 className="font-brand text-xl font-bold">Candidate</h2>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Activate invitation, practice privately, then join the live interview.
            </p>
            <Link to="/candidate/activate" className="mt-6 inline-flex">
              <Button variant="outline">
                Continue as candidate <ArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>
        </div>

        <p className="mt-10 text-[13px] text-ink-muted">
          Demo prototype — no real authentication required.
        </p>
      </div>
    </div>
  )
}
