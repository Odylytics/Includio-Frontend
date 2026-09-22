import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { landingNavItems } from './AppNav'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

const navLink =
  'relative whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-secondary transition hover:bg-white/45 hover:text-ink lg:px-3.5'
const authLink =
  'inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition'
const signInClass = `${authLink} text-ink-secondary hover:bg-white/45 hover:text-ink`
const signUpClass = `${authLink} text-primary hover:bg-primary-soft`

/**
 * Landing navbar: logo · liquid-glass nav pill · liquid-glass account pill.
 * Mobile: hamburger in a glass pill opens a glass panel.
 */
export function LandingHeader({ className }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (mq.matches) setMenuOpen(false)
    }
    mq.addEventListener('change', closeOnDesktop)
    return () => mq.removeEventListener('change', closeOnDesktop)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={cn('sticky top-0 z-40', className)}>
      <div className="relative flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center justify-start">
          <BrandLogo to="/" />
        </div>

        {/* Desktop: centered nav pill */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <nav
            aria-label="Primary"
            className="liquid-glass-pill flex max-w-[min(100vw-16rem,560px)] items-center gap-0.5 overflow-x-auto rounded-full px-1.5 py-1.5"
          >
            {landingNavItems.map((item) => (
              <a key={item.to} href={item.to} className={navLink}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Desktop: account pill */}
        <div className="ml-auto hidden shrink-0 md:block">
          <div className="liquid-glass-pill flex items-center gap-0.5 rounded-full px-1.5 py-1.5">
            <Link to="/employer/login" className={signInClass}>
              Sign in
            </Link>
            <Link to="/start" className={signUpClass}>
              Sign up
            </Link>
          </div>
        </div>

        {/* Mobile: menu toggle pill */}
        <button
          type="button"
          className="liquid-glass-pill ml-auto inline-flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-white/40 md:hidden"
          aria-expanded={menuOpen}
          aria-controls={panelId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn('md:hidden', menuOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Dismiss menu"
          className={cn(
            'fixed inset-0 z-40 bg-[rgba(40,35,35,0.22)] transition-opacity duration-200',
            menuOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMenu}
        />

        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={cn(
            'fixed inset-x-3 top-[76px] z-50 mx-auto max-h-[calc(100svh-88px)] max-w-md overflow-y-auto rounded-[28px] transition duration-200 ease-out',
            'liquid-glass-pill !rounded-[28px]',
            menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          <nav aria-label="Primary" className="flex flex-col gap-0.5 px-2.5 py-3">
            {landingNavItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                tabIndex={menuOpen ? 0 : -1}
                className="rounded-full px-4 py-3 text-[15px] font-medium text-ink-secondary transition hover:bg-white/50 hover:text-ink"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mx-3 mb-3 border-t border-white/40 px-1 pt-3 pb-1">
            <p className="mb-1.5 px-3 font-brand text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Account
            </p>
            <div className="flex flex-col gap-0.5">
              <Link
                to="/employer/login"
                tabIndex={menuOpen ? 0 : -1}
                className="rounded-full px-4 py-3 text-[15px] font-semibold text-ink-secondary transition hover:bg-white/50 hover:text-ink"
                onClick={closeMenu}
              >
                Sign in
              </Link>
              <Link
                to="/start"
                tabIndex={menuOpen ? 0 : -1}
                className="rounded-full px-4 py-3 text-[15px] font-semibold text-primary transition hover:bg-primary-soft"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
