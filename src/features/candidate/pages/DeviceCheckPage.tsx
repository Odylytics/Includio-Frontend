import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, CircleAlert, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { toast } from '@/lib/mock/mockApi'

type CheckState = 'idle' | 'ok' | 'issue'

export function DeviceCheckPage() {
  const navigate = useNavigate()
  const [mic, setMic] = useState<CheckState>('idle')
  const [speaker, setSpeaker] = useState<CheckState>('idle')
  const [camera, setCamera] = useState<CheckState>('idle')
  const [consented, setConsented] = useState(false)

  const ready = mic === 'ok' && speaker === 'ok' && consented

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Before your interview
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Device check & waiting room</h1>
        <p className="mt-1 text-ink-secondary">
          Software Engineering Intern · Northwind Labs · Jun 24, 14:30 · 30 minutes
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ['Microphone', mic, setMic],
            ['Speaker', speaker, setSpeaker],
            ['Camera (optional)', camera, setCamera],
          ] as const
        ).map(([label, state, setState]) => (
          <Card key={label} className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{label}</div>
              <div className="text-[13px] text-ink-muted">
                {state === 'ok' ? 'Ready' : state === 'issue' ? 'Needs attention' : 'Not tested'}
              </div>
            </div>
            <Button
              size="sm"
              variant={state === 'ok' ? 'soft' : 'outline'}
              onClick={() => {
                setState('ok')
                toast(`${label} test passed (simulated)`, 'success')
              }}
            >
              {state === 'ok' ? <Check className="size-4" /> : null}
              Test
            </Button>
          </Card>
        ))}
        <Card className="flex items-center gap-3">
          <Wifi className="size-5 text-success" aria-hidden />
          <div>
            <div className="font-semibold">Internet</div>
            <div className="text-[13px] text-ink-muted">Connected · stable</div>
          </div>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg">Accessibility adjustments</h2>
        <p className="text-[14px] text-ink-secondary">
          These were agreed with Northwind Labs and will apply throughout. You can review them in My
          account.
        </p>
        <Link to="/candidate/account/accessibility" className="font-semibold text-secondary">
          Review accessibility preferences
        </Link>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 size-4 text-warning" aria-hidden />
          <div>
            <h2 className="font-semibold">Privacy, recording & transcription</h2>
            <p className="mt-1 text-[14px] text-ink-secondary">
              Recording does not start before you join. Transcription supports review of
              job-related evidence only. Includio does not make hiring decisions.
            </p>
          </div>
        </div>
        <label className="inline-flex items-start gap-2 text-[14px]">
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={consented}
            onChange={(e) => setConsented(e.target.checked)}
          />
          I understand recording and transcription begin when I join the interview.
        </label>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => toast('Support request would open a help channel')}>
          Request support
        </Button>
        <Button
          className="ml-auto"
          disabled={!ready}
          onClick={() => navigate('/candidate/interview/live')}
        >
          Join interview
        </Button>
      </div>
    </div>
  )
}
