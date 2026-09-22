import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { LandingHeader } from '@/components/layout/LandingHeader'
import { HeroDitherBackground } from '@/components/effects/HeroDitherBackground'
import { Button } from '@/components/ui/Button'
import { BrandLogo } from '@/components/layout/BrandLogo'

const pillars = [
  {
    n: '01',
    title: 'Configure with care',
    body: 'HR builds structured interviews from job criteria — not black-box scoring.',
    glow: 'from-[#C1272D]/25 to-transparent',
  },
  {
    n: '02',
    title: 'Practice in private',
    body: 'Candidates rehearse with an AI studio. Practice stays private by default.',
    glow: 'from-[#F05A24]/30 to-transparent',
  },
  {
    n: '03',
    title: 'Review evidence',
    body: 'Transcripts and competency excerpts support a human hiring decision.',
    glow: 'from-[#F0B624]/40 to-transparent',
  },
]

const showcase = [
  {
    n: '01',
    title: 'Interview Builder',
    body: 'AI suggests questions. HR edits, reorders, and approves every line.',
    stat: '100%',
    statLabel: 'HR control',
  },
  {
    n: '02',
    title: 'Practice Studio',
    body: 'Voice or text, thinking time, and constructive private feedback.',
    stat: '0',
    statLabel: 'shared with HR',
  },
  {
    n: '03',
    title: 'Live Interview Room',
    body: 'Calm pacing, accessibility settings, and clear recording disclosure.',
    stat: 'AA',
    statLabel: 'contrast goal',
  },
  {
    n: '04',
    title: 'Evidence Report',
    body: 'Descriptive metrics only — never an automated hire / no-hire verdict.',
    stat: '1',
    statLabel: 'human decision',
  },
]

const faqs = [
  {
    q: 'Does Includio decide who gets hired?',
    a: 'No. Includio helps candidates prepare and helps HR review job-related evidence. Hiring decisions stay with people.',
  },
  {
    q: 'Is practice shared with employers?',
    a: 'Practice answers and feedback remain private unless a candidate chooses to share them.',
  },
  {
    q: 'Do candidates need to disclose a diagnosis?',
    a: 'No. Accessibility preferences such as larger text, captions, and extra thinking time are available to everyone.',
  },
  {
    q: 'Is this a live product?',
    a: 'This build is a frontend prototype. AI, recording, and calendar features are simulated for demonstration.',
  },
]

const team = [
  { name: 'Sarah Chen', role: 'HR Lead · Northwind Labs' },
  { name: 'Amara Reyes', role: 'Candidate journey' },
  { name: 'Jonah Tan', role: 'Interview design' },
  { name: 'Lena Kovac', role: 'Inclusive research' },
]

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [teamIndex, setTeamIndex] = useState(0)

  return (
    <div className="overflow-x-hidden">
      {/* —— HERO —— */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroDitherBackground />
        <LandingHeader />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-6 text-center">
          <p className="mb-4 font-brand text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Inclusive Studio
          </p>
          <h1 className="mx-auto w-[min(90vw,520px)]">
            <img
              data-hero-logo
              src="/logo-wordmark.svg"
              alt="Includio"
              className="h-auto w-full select-none"
            />
          </h1>
          <p className="mt-5 max-w-md text-[16px] text-ink-secondary sm:text-[17px]">
            Inclusive hiring starts with an interview everyone can{' '}
            <em className="font-accent text-primary">actually do</em>.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/start">
              <Button size="lg">
                Start <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline">
                Explore the story
              </Button>
            </a>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-muted">
            Demo only — AI, recording and calendar are simulated.
          </p>
        </div>
      </section>

      {/* —— PHILOSOPHY —— */}
      <section id="how" className="mx-auto grid max-w-[var(--maxw)] gap-10 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-[clamp(28px,4vw,42px)]">
            Built for people — not for behavioural theatre.
          </h2>
          <div className="mt-8 overflow-hidden rounded-lg border border-border shadow-[var(--shadow-2)]">
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-cream via-accent-soft to-primary-soft relative">
              <img
                src="/favicon.svg"
                alt=""
                className="absolute left-1/2 top-1/2 h-28 w-auto -translate-x-1/2 -translate-y-1/2 opacity-90"
                aria-hidden
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(193,39,45,0.15),transparent_50%)]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[16px] leading-relaxed text-ink-secondary">
            Includio pairs a structured interview builder for HR with a private practice studio for
            candidates — so a different way of communicating is never mistaken for a lack of ability.
          </p>
          <ul className="mt-10 space-y-5">
            {[
              ['Employer-funded', 'Practice access is part of the hiring process, not a paywall.'],
              ['Evidence, not scores', 'Reports surface what was said — not eye contact or speech speed.'],
              ['Human oversight', 'AI assists preparation and structure. People make the call.'],
            ].map(([title, body]) => (
              <li key={title} className="border-t border-border pt-4">
                <div className="font-brand text-[15px] font-bold">{title}</div>
                <p className="mt-1 text-[14px] text-ink-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* —— VALUE CARD —— */}
      <section className="mx-auto max-w-[var(--maxw)] px-4 pb-20 sm:px-6">
        <h2 className="text-center text-[clamp(26px,3.5vw,36px)]">One platform. Two calm workspaces.</h2>
        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-surface shadow-[var(--shadow-2)] lg:grid lg:grid-cols-2">
          <div className="min-h-[220px] bg-gradient-to-br from-[#FBE6A6] via-[#F8D56C]/70 to-[#F6921E]/40 p-8 flex items-end">
            <p className="font-display text-3xl text-ink">Employer configures → Candidate practices → HR reviews.</p>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-[15.5px] leading-relaxed text-ink-secondary">
              From job description to live interview to evidence report — every step stays
              transparent, editable, and respectful of privacy.
            </p>
            <Link to="/start" className="mt-6 inline-flex">
              <Button>
                Enter the product <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* —— PILLARS —— */}
      <section id="pillars" className="border-y border-border bg-background-elevated py-24">
        <div className="mx-auto max-w-[var(--maxw)] px-4 sm:px-6">
          <h2 className="text-center text-[clamp(26px,3.5vw,36px)]">Three pillars</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-ink-secondary">
            A connected journey — not a black-box AI screen.
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.n} className="text-center">
                <div
                  className={`mx-auto mb-6 grid size-24 place-items-center rounded-full bg-gradient-to-b ${p.glow} border border-border bg-surface shadow-[var(--shadow-glow)]`}
                >
                  <span className="font-brand text-lg font-extrabold text-primary">{p.n}</span>
                </div>
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-2 text-[14px] text-ink-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— QUOTE —— */}
      <section className="mx-auto grid max-w-[var(--maxw)] items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="font-display text-6xl leading-none text-primary/40" aria-hidden>
            “
          </span>
          <blockquote className="mt-2 font-display text-[clamp(24px,3vw,34px)] font-medium leading-snug text-ink">
            A different way of communicating is never a lack of ability.
          </blockquote>
          <p className="mt-6 text-[14px] text-ink-muted">— Includio product principle</p>
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-lg border border-border bg-gradient-to-b from-accent-soft via-brand-cream to-surface-muted shadow-[var(--shadow-2)]">
          <div className="flex h-full flex-col justify-end p-6">
            <BrandLogo to={null} compact className="mb-4 opacity-80" />
            <p className="font-brand text-sm font-semibold">Inclusive by design</p>
            <p className="text-[13px] text-ink-muted">No emotion scoring. No ranking. No diagnosis required.</p>
          </div>
        </div>
      </section>

      {/* —— PRODUCT SHOWCASE —— */}
      <section id="product" className="mx-auto max-w-[var(--maxw)] px-4 pb-24 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(26px,3.5vw,36px)]">Inside the product</h2>
          <Link to="/start">
            <Button variant="outline" size="sm">
              See all · Start
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {showcase.map((item) => (
            <article
              key={item.n}
              className="relative overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-1)] sm:p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cream/40 via-transparent to-accent-soft/30" aria-hidden />
              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <span className="font-mono text-[12px] text-primary">{item.n}</span>
                  <h3 className="mt-2 text-xl sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-[14.5px] text-ink-secondary">{item.body}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-primary">{item.stat}</div>
                  <div className="text-[12px] uppercase tracking-wide text-ink-muted">{item.statLabel}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* —— FEATURES / FUNCTIONS —— */}
      <section className="mx-auto max-w-[var(--maxw)] px-4 pb-24 sm:px-6">
        <h2 className="text-center text-[clamp(26px,3.5vw,36px)]">Features & functions</h2>
        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface via-surface to-surface-muted shadow-[var(--shadow-2)] md:grid md:grid-cols-2">
          <div className="border-b border-border p-8 md:border-b-0 md:border-r">
            <h3 className="font-brand text-sm font-bold uppercase tracking-[0.14em] text-primary">
              Features
            </h3>
            <ul className="mt-5 space-y-3 text-[14.5px] text-ink-secondary">
              {[
                'Campaign wizard & interview plan',
                'AI question suggestions (editable)',
                'Candidate practice quotas',
                'Accessibility preferences',
                'Evidence-oriented HR reports',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8">
            <h3 className="font-brand text-sm font-bold uppercase tracking-[0.14em] text-accent">
              Functions
            </h3>
            <ul className="mt-5 space-y-3 text-[14.5px] text-ink-secondary">
              {[
                'Simulate AI plan generation',
                'Practice sessions with feedback',
                'Device check & live room flow',
                'Invitations & scheduling UI',
                'Mark reports reviewed + HR notes',
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* —— TEAM —— */}
      <section id="team" className="border-y border-border bg-background-elevated py-24">
        <div className="mx-auto max-w-[var(--maxw)] px-4 sm:px-6">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="text-[clamp(26px,3.5vw,36px)]">Meet the demo cast</h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-border-strong bg-surface"
                aria-label="Previous"
                onClick={() => setTeamIndex((i) => (i === 0 ? team.length - 1 : i - 1))}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full border border-border-strong bg-surface"
                aria-label="Next"
                onClick={() => setTeamIndex((i) => (i + 1) % team.length)}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <div
                key={m.name}
                className={`rounded-lg border border-border bg-surface p-5 transition ${
                  i === teamIndex ? 'shadow-[var(--shadow-2)] ring-1 ring-primary/20' : ''
                }`}
              >
                <div className="mb-4 aspect-[3/4] rounded-md bg-gradient-to-b from-brand-mustard/50 to-accent-soft" />
                <div className="font-brand font-bold">{m.name}</div>
                <div className="text-[13px] text-ink-muted">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— FAQ + NEWSLETTER —— */}
      <section id="faq" className="mx-auto max-w-[var(--maxw)] px-4 py-24 sm:px-6">
        <h2 className="text-center text-[clamp(26px,3.5vw,36px)]">Questions</h2>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-border border-y border-border">
          {faqs.map((item, i) => {
            const open = openFaq === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span className="font-brand text-[15px] font-semibold">{item.q}</span>
                  <Plus
                    className={`size-4 shrink-0 text-ink-muted transition ${open ? 'rotate-45' : ''}`}
                  />
                </button>
                {open ? (
                  <p className="pb-5 text-[14.5px] text-ink-secondary">{item.a}</p>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="mt-16 overflow-hidden rounded-lg bg-gradient-to-r from-[#C1272D] via-[#F05A24] to-[#F0B624] p-8 text-white shadow-[var(--shadow-3)] sm:p-10">
          <h3 className="font-display text-3xl text-white">Stay in the loop</h3>
          <p className="mt-2 max-w-md text-[14.5px] text-white/85">
            Prototype updates and inclusive hiring notes. No spam — this form is simulated.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <label className="sr-only" htmlFor="nl-email">
              Email
            </label>
            <input
              id="nl-email"
              type="email"
              placeholder="you@company.com"
              className="min-w-0 flex-1 rounded-pill border-0 bg-white/95 px-5 py-3 text-ink placeholder:text-ink-muted"
            />
            <Button type="submit" variant="outline" className="border-white/40 bg-white text-primary hover:bg-brand-cream">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* —— FOOTER —— */}
      <footer className="relative overflow-hidden border-t border-border pt-20">
        <div className="relative z-10 mx-auto max-w-[var(--maxw)] px-4 text-center sm:px-6">
          <h2 className="font-display text-[clamp(48px,10vw,96px)] font-semibold text-ink">
            Includio
          </h2>
          <p className="mt-2 text-ink-muted">Inclusive Studio</p>
          <div className="mt-10 grid gap-8 border-t border-border py-10 text-left text-[13.5px] text-ink-secondary sm:grid-cols-4">
            <div>
              <BrandLogo to="/" compact />
              <p className="mt-3 text-ink-muted">Frontend prototype · 2026</p>
            </div>
            <div>
              <div className="font-brand font-bold text-ink">Product</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link to="/start">Start</Link>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-brand font-bold text-ink">Workspaces</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link to="/employer/login">Employer</Link>
                </li>
                <li>
                  <Link to="/candidate/activate">Candidate</Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-brand font-bold text-ink">Contact</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href="mailto:hello@includio.demo">hello@includio.demo</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 warm-wave" aria-hidden />
      </footer>
    </div>
  )
}
