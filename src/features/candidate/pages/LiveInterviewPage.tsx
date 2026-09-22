import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, Pause, RotateCcw, Type } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'

export function LiveInterviewPage() {
  const navigate = useNavigate()
  const plan = useMockStore((s) => s.plans.find((p) => p.id === 'plan_se_intern'))
  const a11y = useMockStore((s) => s.accessibility)
  const questions = plan?.questions ?? []

  const [index, setIndex] = useState(0)
  const [thinkLeft, setThinkLeft] = useState(plan?.timing.thinkingTimeSeconds ?? 20)
  const [phase, setPhase] = useState<'thinking' | 'answering'>('thinking')
  const [showText, setShowText] = useState(a11y.questionsAsText)
  const [answer, setAnswer] = useState('')
  const [warning, setWarning] = useState(false)

  const current = questions[index]
  const responseAllowance = current?.estimatedSeconds ?? 240

  useEffect(() => {
    setThinkLeft(plan?.timing.thinkingTimeSeconds ?? 20)
    setPhase('thinking')
    setAnswer('')
    setWarning(false)
  }, [index, plan?.timing.thinkingTimeSeconds])

  useEffect(() => {
    if (phase !== 'thinking') return
    if (thinkLeft <= 0) {
      setPhase('answering')
      return
    }
    const t = window.setTimeout(() => setThinkLeft((v) => v - 1), 1000)
    return () => window.clearTimeout(t)
  }, [phase, thinkLeft])

  useEffect(() => {
    if (phase !== 'answering') return
    const t = window.setTimeout(() => setWarning(true), Math.max(8000, responseAllowance * 40))
    return () => window.clearTimeout(t)
  }, [phase, responseAllowance, index])

  if (!current) {
    return (
      <Card>
        <p>No approved interview plan found in the demo data.</p>
      </Card>
    )
  }

  function nextQuestion() {
    if (index >= questions.length - 1) {
      navigate('/candidate/interview/complete')
      return
    }
    setIndex((i) => i + 1)
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            Live interview · Software Engineering Intern
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge tone="primary">Recording</Badge>
            <Badge tone="muted">Transcription on</Badge>
            <Badge tone="success">Connected</Badge>
          </div>
        </div>
        <Progress
          value={index + 1}
          max={questions.length}
          className="w-44"
          label={`Q${index + 1}/${questions.length}`}
        />
      </div>

      <Card className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary-soft to-brand-cream">
            <img src="/favicon.svg" alt="" className="h-12 w-auto" aria-hidden />
          </div>
          <div>
            <div className="font-semibold">AI interviewer</div>
            <p className="text-[13px] text-ink-muted" aria-live="polite">
              {phase === 'thinking'
                ? `Thinking time · ${thinkLeft}s remaining`
                : warning
                  ? 'Gentle reminder: wrap up when you are ready — there is no rush.'
                  : 'Listening · take your time'}
            </p>
          </div>
        </div>

        {(showText || a11y.captions || a11y.questionsAsText) && (
          <div>
            <div className="font-mono text-[12px] text-ink-muted">
              Question {index + 1} of {questions.length} · {current.category}
            </div>
            <p className="mt-2 font-display text-[clamp(22px,3.2vw,32px)] font-extrabold leading-snug">
              {current.text}
            </p>
          </div>
        )}

        {phase === 'answering' && (
          <div className="space-y-3">
            {a11y.responseMode === 'text' ? (
              <Textarea
                label="Your response"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            ) : (
              <div className="rounded-md border border-border bg-background p-5 text-center text-ink-secondary">
                Voice response in progress (simulated). You can switch to text if needed.
              </div>
            )}
            <Button onClick={nextQuestion}>
              {index >= questions.length - 1 ? 'Finish interview' : 'Submit & continue'}
            </Button>
          </div>
        )}

        {phase === 'thinking' && (
          <Button onClick={() => setPhase('answering')}>Start response</Button>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={() => toast('Paused briefly (demo)')}>
            <Pause className="size-4" /> Pause
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPhase('thinking')
              setThinkLeft(plan?.timing.thinkingTimeSeconds ?? 20)
            }}
          >
            <RotateCcw className="size-4" /> Repeat question
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast('Clarification: take a moment and answer in your own words.')}
          >
            <HelpCircle className="size-4" /> Request clarification
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowText((v) => !v)}>
            <Type className="size-4" /> Text option
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ml-auto"
            onClick={() => toast('Technical issue reported (demo)')}
          >
            Report technical issue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/candidate/interview/complete')}
          >
            End interview
          </Button>
        </div>
      </Card>
    </div>
  )
}
