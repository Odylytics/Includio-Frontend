import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandLogo } from '@/components/layout/BrandLogo'
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
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <BrandLogo compact to="/" />
        </div>
        <Card className="space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            Invitation from Northwind Labs
          </p>
          <h1 className="text-[28px]">Activate your account</h1>
          <p className="text-ink-secondary">
            Software Engineering Intern · interview on{' '}
            <b className="font-mono">Jun 24, 14:30 (GMT+7)</b>
          </p>
          <div className="rounded-md bg-background p-3 text-[13.5px] text-ink-secondary">
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
            You can customise accessibility preferences without sharing a diagnosis. Ordinary
            settings like larger text, captions, and extra thinking time are available to everyone.
          </p>
          <Button
            block
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
        </Card>
      </div>
    </div>
  )
}
