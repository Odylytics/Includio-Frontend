import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { startPracticeSession, toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import type { FeedbackTiming, ResponseMode } from '@/types/domain'

export function PracticeSetupPage() {
  const navigate = useNavigate()
  const a11y = useMockStore((s) => s.accessibility)
  const plan = useMockStore((s) => s.plans.find((p) => p.id === 'plan_se_intern'))
  const used = useMockStore((s) => s.practiceQuotaUsed)
  const max = useMockStore((s) => s.practiceQuotaMax)

  const [source, setSource] = useState('personalized')
  const [duration, setDuration] = useState('20')
  const [count, setCount] = useState('5')
  const [mode, setMode] = useState<ResponseMode>(a11y.responseMode)
  const [thinking, setThinking] = useState(a11y.additionalThinkingTime ? '40' : '20')
  const [feedback, setFeedback] = useState<FeedbackTiming>('after-each')
  const [busy, setBusy] = useState(false)

  const summary = useMemo(
    () =>
      `${source === 'personalized' ? 'Personalised' : 'Library'} · ${count} questions · ~${duration} min · ${mode} · ${thinking}s thinking time`,
    [source, count, duration, mode, thinking],
  )

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Practice Studio
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Set up a practice session</h1>
        <p className="mt-1 text-ink-secondary">
          Practice at your own pace. Take your time. There is no rush.
        </p>
      </div>

      <Card className="space-y-4">
        <SegmentedControl
          ariaLabel="Practice content"
          value={source}
          onChange={setSource}
          options={[
            { value: 'personalized', label: 'Personalised practice' },
            { value: 'library', label: 'Question library' },
          ]}
        />

        {source === 'personalized' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-md border border-dashed border-border-strong p-3 text-[14px]">
              <span className="font-medium">Job description</span>
              <input type="file" className="mt-2 block w-full text-[13px]" />
              <small className="text-ink-muted">Provided by Northwind Labs</small>
            </label>
            <label className="rounded-md border border-dashed border-border-strong p-3 text-[14px]">
              <span className="font-medium">Your resume (optional)</span>
              <input type="file" className="mt-2 block w-full text-[13px]" />
              <small className="text-ink-muted">Upload is simulated</small>
            </label>
          </div>
        ) : (
          <Select
            label="Library category"
            defaultValue="Behavioural"
            options={[
              { value: 'Behavioural', label: 'Behavioural' },
              { value: 'Technical', label: 'Technical' },
              { value: 'Problem-solving', label: 'Problem-solving' },
              { value: 'Teamwork', label: 'Teamwork' },
              { value: 'Communication', label: 'Communication' },
              { value: 'Situational', label: 'Situational' },
            ]}
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            options={[
              { value: '10', label: '10 minutes' },
              { value: '20', label: '20 minutes' },
              { value: '30', label: '30 minutes' },
            ]}
          />
          <Select
            label="Question count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            options={[
              { value: '3', label: '3 questions' },
              { value: '5', label: '5 questions' },
              { value: '7', label: '7 questions' },
            ]}
          />
          <Select
            label="Response mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as ResponseMode)}
            options={[
              { value: 'voice', label: 'Voice' },
              { value: 'text', label: 'Text' },
            ]}
          />
          <Select
            label="Thinking time"
            value={thinking}
            onChange={(e) => setThinking(e.target.value)}
            options={[
              { value: '10', label: '10 seconds' },
              { value: '20', label: '20 seconds' },
              { value: '40', label: '40 seconds' },
            ]}
          />
        </div>

        <SegmentedControl
          ariaLabel="Feedback timing"
          value={feedback}
          onChange={(v) => setFeedback(v as FeedbackTiming)}
          options={[
            { value: 'after-each', label: 'Feedback after each question' },
            { value: 'at-end', label: 'Feedback at the end' },
          ]}
        />
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <b>Session summary</b>
          <p className="text-ink-secondary">{summary}</p>
          <p className="mt-1 text-[13px] text-ink-muted">
            Quota impact: uses 1 of {max - used} remaining sessions today.
          </p>
        </div>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              const questionIds = (plan?.questions ?? [])
                .slice(0, Number(count))
                .map((q) => q.id)
              await startPracticeSession({
                candidateId: 'cand_amara',
                campaignId: 'camp_se_intern',
                questionIds,
                responseMode: mode,
                durationMinutes: Number(duration),
                thinkingTimeSeconds: Number(thinking),
                feedbackTiming: feedback,
              })
              navigate('/candidate/practice/session')
            } catch (err) {
              toast(err instanceof Error ? err.message : 'Could not start practice', 'error')
            } finally {
              setBusy(false)
            }
          }}
        >
          Start practice
        </Button>
      </Card>
    </div>
  )
}
