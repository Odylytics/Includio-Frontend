import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'

export function CandidateActivatePage() {
  const navigate = useNavigate()
  const setActivated = useMockStore((s) => s.setCandidateActivated)
  const [name, setName] = useState('Amara Reyes')
  const [email, setEmail] = useState('amara.reyes@mail.com')
  const [password, setPassword] = useState('demo-password')
  const [confirm, setConfirm] = useState('demo-password')

  return (
    <div className="min-h-screen">
      <SiteHeader actionLabel="Start" actionTo="/start" />
      <div className="mx-auto grid max-w-lg place-items-center px-4 py-10">
        <Card className="w-full space-y-4">
          <p className="font-brand text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Invitation from Northwind Labs
          </p>
          <h1 className="text-[32px]">Activate your account</h1>
          <p className="text-ink-secondary">
            Software Engineering Intern · interview on{' '}
            <b className="font-mono">Jun 24, 14:30 (GMT+7)</b>
          </p>
          <div className="rounded-md bg-surface-muted p-3 text-[13.5px] text-ink-secondary">
            Practice access: Jun 10–23 · Daily allowance:{' '}
            <b className="font-mono">3 sessions · 5 questions</b>
          </div>
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={confirm !== password ? 'Passwords do not match' : undefined}
          />
          <p className="text-[13.5px] text-ink-muted">
            Customise accessibility preferences without sharing a diagnosis. Ordinary settings are
            available to everyone.
          </p>
          <Button
            block
            size="lg"
            onClick={() => {
              if (password !== confirm) {
                toast('Passwords do not match', 'error')
                return
              }
              setActivated(true)
              toast('Account activated', 'success')
              navigate('/candidate/dashboard')
            }}
          >
            Activate account
          </Button>
          <p className="text-center text-[12.5px] text-ink-muted">
            <Link to="/" className="font-semibold text-ink-secondary">
              Back to landing
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
