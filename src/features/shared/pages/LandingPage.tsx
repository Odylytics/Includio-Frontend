import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { Button } from '@/components/ui/Button'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-[rgba(251,250,248,0.85)] backdrop-blur-md">
        <div className="mx-auto flex h-[70px] max-w-[1200px] items-center gap-6 px-6">
          <BrandLogo compact />
          <nav className="ml-auto hidden items-center gap-6 text-[14.5px] text-ink-secondary sm:flex">
            <a href="#how">How it works</a>
            <Link to="/employer/dashboard">Employer</Link>
            <Link to="/candidate/dashboard">Candidate</Link>
          </nav>
          <Link to="/employer/login" className="ml-auto sm:ml-0">
            <Button>Open the demo</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-primary-dark">
            B2B inclusive hiring platform
          </p>
          <h1 className="max-w-[16ch] text-[clamp(36px,5vw,60px)]">
            Inclusive hiring starts with an interview everyone can{' '}
            <em className="font-accent text-primary">actually do</em>.
          </h1>
          <p className="mt-5 max-w-[34em] text-lg text-ink-secondary">
            Includio pairs a structured, AI-assisted interview builder for HR with a private
            practice studio for candidates — so a different way of communicating is never mistaken
            for a lack of ability.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/employer/login">
              <Button size="lg">Explore the employer flow</Button>
            </Link>
            <Link to="/candidate/activate">
              <Button size="lg" variant="ghost">
                See the candidate side
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-[12.5px] text-ink-muted">
            Demo only — AI, recording and calendar features are simulated.
          </p>
        </div>
        <div className="grid place-items-center">
          <div className="w-full max-w-[330px] rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-2)]">
            <span className="mb-3 block border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              Software Engineering Intern
            </span>
            <div className="space-y-0">
              {[
                ['bg-primary', 'Interview plan ready'],
                ['bg-secondary', '14-day practice window'],
                ['bg-brand-gold', '7 of 7 questions complete'],
              ].map(([dot, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 border-b border-dashed border-border py-2.5 text-[14px] last:border-0"
                >
                  <span className={`size-2.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-border py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            The product, end to end
          </p>
          <h2 className="mt-2 max-w-[18ch] text-[clamp(24px,3vw,34px)]">
            Five connected steps — not a black-box AI screen.
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {[
              ['01', 'Employer configures', 'Job description, competencies, practice quota and interview settings.'],
              ['02', 'AI proposes a plan', 'Questions, competency coverage and timing — all editable by HR.'],
              ['03', 'Candidate practices', 'A private studio inside a structured, employer-set window.'],
              ['04', 'Candidate interviews', 'The approved format, with agreed accommodations applied.'],
              ['05', 'HR reviews evidence', 'Transcript, timeline and competency excerpts for a human decision.'],
            ].map(([n, title, body]) => (
              <li key={n} className="md:border-l md:border-border md:pl-5 first:md:border-0 first:md:pl-0">
                <span className="font-mono text-[12px] tracking-[0.1em] text-primary">{n}</span>
                <b className="mt-2 block font-display text-lg font-extrabold">{title}</b>
                <p className="mt-2 text-[13.5px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-secondary-soft py-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <h2 className="text-[clamp(24px,2.6vw,30px)]">What Includio refuses to do</h2>
          <ul className="grid gap-3.5">
            {[
              'No behavioural scoring from eye contact, tone or speech speed.',
              'No practice history shared with HR unless the candidate shares it.',
              'No AI hiring decision, and no automatic candidate ranking.',
              'No penalty for needing more time to think.',
            ].map((item) => (
              <li key={item} className="relative pl-7 text-base text-ink-secondary">
                <span className="absolute left-0 top-2.5 h-0.5 w-3.5 bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-6 text-[13.5px] text-ink-muted">
          <span className="font-display text-lg font-extrabold text-ink">includio.</span>
          <span>Inclusive Studio — product demo</span>
          <Link to="/employer/login" className="ml-auto">
            <Button variant="ghost">Open the demo</Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
