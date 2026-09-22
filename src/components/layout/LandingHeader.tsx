import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { AppNav, landingNavItems } from './AppNav'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

const authLink =
  'inline-flex items-center justify-center px-3 py-2 text-[13.5px] font-semibold transition'
const signInClass = `${authLink} text-ink-secondary hover:text-ink`
const signUpClass = `${authLink} text-primary hover:text-primary-dark`

/**
 * Landing navbar: logo left · flat links center · auth right.
 * Soft top-to-bottom fade, no pill chrome.
 */
export function LandingHeader({ className }: Props) {
  return (
    <header className={cn('sticky top-0 z-40', className)}>
      <div className="nav-fade-bar">
        <div className="relative flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center justify-start">
            <BrandLogo to="/" />
          </div>

          <div className="absolute left-1/2 hidden max-w-[min(100%,520px)] -translate-x-1/2 md:block">
            <AppNav items={landingNavItems} mode="anchors" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link to="/employer/login" className={signInClass}>
              Sign in
            </Link>
            <Link to="/start" className={signUpClass}>
              Sign up
            </Link>
          </div>
        </div>

        <div className="flex justify-center px-3 pb-4 md:hidden">
          <AppNav items={landingNavItems} mode="anchors" />
        </div>
      </div>
    </header>
  )
}
