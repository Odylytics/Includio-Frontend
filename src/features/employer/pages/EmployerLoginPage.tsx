import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from '@/lib/mock/mockApi'

export function EmployerLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('sarah.chen@northwindlabs.com')
  const [password, setPassword] = useState('demo-password')

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo compact />
        </div>
        <div className="rounded-lg border border-border bg-surface p-7 shadow-[var(--shadow-2)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            Employer sign in
          </p>
          <h1 className="mt-2 text-[28px]">Welcome back</h1>
          <p className="mt-2 text-[15px] text-ink-secondary">
            Sign in to configure inclusive interview experiences.
          </p>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/employer/dashboard')
            }}
          >
            <Input
              label="Work email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="flex items-center justify-between text-[14px]">
              <label className="inline-flex items-center gap-2 text-ink-secondary">
                <input type="checkbox" defaultChecked className="accent-primary" />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-secondary"
                onClick={() => toast('A reset link would be emailed to you')}
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" block>
              Sign in
            </Button>
            <Button
              type="button"
              variant="outline"
              block
              onClick={() => toast('Google SSO is not connected in this demo')}
            >
              Continue with Google
            </Button>
          </form>
          <p className="mt-4 text-center text-[12.5px] text-ink-muted">
            Not an admin?{' '}
            <button
              type="button"
              className="font-semibold text-secondary"
              onClick={() => toast('Contact your organisation administrator')}
            >
              Contact your administrator
            </button>
            .
          </p>
        </div>
        <p className="mt-4 text-center text-[13px] text-ink-muted">
          <Link to="/" className="font-semibold text-secondary">
            Back to home
          </Link>
          {' · '}
          <Link to="/candidate/activate" className="font-semibold text-secondary">
            Candidate invitation
          </Link>
        </p>
      </div>
    </div>
  )
}
