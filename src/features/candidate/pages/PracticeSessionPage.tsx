import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pause, Play, RotateCcw, Type } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Textarea } from '@/components/ui/Textarea'
import {
  completePracticeSession,
  getPracticeFeedback,
  submitPracticeAnswer,
  toast,
} from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import type { PracticeFeedback } from '@/types/domain'

type Phase = 'thinking' | 'answering' | 'feedback' | 'done'

export function PracticeSessionPage() {
  const navigate = useNavigate()
  const session = useMockStore((s) => s.activePractice)
  const plan = useMockStore((s) => s.plans.find((p) => p.campaignId === 'camp_se_intern'))
  const a11y = useMockStore((s) => s.accessibility)

  const questions = useMemo(() => {
    if (!session || !plan) return []
    return session.questionIds
      .map((id) => plan.questions.find((q) => q.id === id))
      .filter(Boolean)
  }, [session, plan])

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('thinking')
  const [thinkLeft, setThinkLeft] = useState(20)
  const [paused, setPaused] = useState(false)
  const [answer, setAnswer] = useState('')
  const [showText, setShowText] = useState(a11y.questionsAsText)
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null)
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    if (!session) return
    setThinkLeft(session.thinkingTimeSeconds)
    setPhase('thinking')
    setAnswer('')
    setFeedback(null)
  }, [session, index])

  useEffect(() => {
    if (phase !== 'thinking' || paused || !session) return
    if (thinkLeft <= 0) {
      setPhase('answering')
      return
    }
    const t = window.setTimeout(() => setThinkLeft((v) => v - 1), 1000)
    return () => window.clearTimeout(t)
  }, [phase, thinkLeft, paused, session])

  if (!session) {
    return (
      <Card className="text-center">
        <p>No active practice session.</p>
        <Link to="/candidate/practice/setup" className="mt-3 inline-block font-semibold text-secondary">
          Set up practice
        </Link>
      </Card>
    )
  }

  const current = questions[index]
  if (!current) return null

  async function submit() {
    if (!current) return
    await submitPracticeAnswer(session!.id, current.id, answer || '(voice answer simulated)')
    if (session!.feedbackTiming === 'after-each') {
      const fb = await getPracticeFeedback(session!.id, current.id)
      setFeedback(fb)
      setPhase('feedback')
    } else {
      goNext()
    }
  }

  async function goNext() {
    if (index >= questions.length - 1) {
      await completePracticeSession(session!.id)
      setPhase('done')
      toast('Practice session complete. Quota updated.', 'success')
      return
    }
    setIndex((i) => i + 1)
  }

  if (phase === 'done') {
    return (
      <Card className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl">Practice session complete</h1>
        <p className="text-ink-secondary">
          Nice work. Your answers stay private. Ready when you are for another round or the live
          interview.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => navigate('/candidate/practice/setup')}>Practice again</Button>
          <Button variant="ghost" onClick={() => navigate('/candidate/dashboard')}>
            Return to dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-[820px] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            AI Practice Studio · demo
          </p>
          <p className="text-[14px] text-ink-secondary" aria-live="polite">
            Question {index + 1} of {questions.length}
            {phase === 'thinking' ? ` · Thinking ${thinkLeft}s` : ''}
            {paused ? ' · Paused' : ''}
          </p>
        </div>
        <Progress value={index + (phase === 'feedback' || phase === 'answering' ? 1 : 0)} max={questions.length} className="w-40" />
      </div>

      <Card className="space-y-5">
        <div className="flex items-center gap-4">
          <div
            className="grid size-16 place-items-center rounded-full bg-primary-soft text-primary"
            aria-hidden
          >
            <img src="/favicon.svg" alt="" className="h-10 w-auto" />
          </div>
          <div>
            <div className="font-semibold">AI interviewer</div>
            <div className="text-[13px] text-ink-muted">Voice and transcription are simulated</div>
          </div>
        </div>

        {(showText || a11y.captions) && (
          <p className="font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-snug">
            {current.text}
          </p>
        )}
        {!showText && !a11y.captions ? (
          <p className="text-ink-muted">Question audio would play here. Show as text is available.</p>
        ) : null}

        {phase === 'answering' && (
          <div className="space-y-3">
            {session.responseMode === 'text' || a11y.responseMode === 'text' ? (
              <Textarea
                label="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your response…"
              />
            ) : (
              <div className="rounded-md border border-border bg-background p-4 text-center">
                <p className="text-[14px] text-ink-secondary">
                  {recording ? 'Recording… (simulated)' : 'Voice response ready'}
                </p>
                <Button
                  className="mt-3"
                  variant={recording ? 'danger' : 'outline'}
                  onClick={() => {
                    setRecording((r) => !r)
                    if (!recording) toast('Microphone capture is simulated')
                  }}
                >
                  {recording ? 'Stop recording' : 'Start voice response'}
                </Button>
              </div>
            )}
            <Button onClick={submit}>Submit answer</Button>
          </div>
        )}

        {phase === 'feedback' && feedback && (
          <div className="space-y-3 rounded-md border border-success/30 bg-success-soft p-4">
            <h2 className="font-semibold text-success">Private feedback</h2>
            <div>
              <b className="text-[13px]">Key ideas identified</b>
              <ul className="mt-1 list-disc pl-5 text-[14px] text-ink-secondary">
                {feedback.keyIdeas.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <b className="text-[13px]">Relevant job requirements</b>
              <ul className="mt-1 list-disc pl-5 text-[14px] text-ink-secondary">
                {feedback.relevantRequirements.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <p className="text-[14px]">
              <b>Suggested improvement:</b> {feedback.suggestedImprovement}
            </p>
            <p className="text-[13.5px] text-ink-muted">
              Optional structure: {feedback.answerStructure}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setPhase('thinking')
                  setThinkLeft(session.thinkingTimeSeconds)
                  setFeedback(null)
                  setAnswer('')
                }}
              >
                Retry question
              </Button>
              <Button variant="ghost" onClick={() => toast('Similar question queued (demo)')}>
                Practice similar
              </Button>
              <Button onClick={goNext}>Next question</Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={() => setPaused((p) => !p)}>
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPhase('thinking')
              setThinkLeft(session.thinkingTimeSeconds)
              toast('Question repeated')
            }}
          >
            <RotateCcw className="size-4" /> Repeat question
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowText((v) => !v)}>
            <Type className="size-4" /> {showText ? 'Hide text' : 'Show as text'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ml-auto"
            onClick={async () => {
              await completePracticeSession(session.id)
              navigate('/candidate/dashboard')
            }}
          >
            End session
          </Button>
        </div>
      </Card>
    </div>
  )
}
