import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Stepper } from '@/components/ui/Stepper'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import {
  addInterviewQuestion,
  approveInterviewPlan,
  createCampaign,
  generateInterviewPlan,
  getPlan,
  removeInterviewQuestion,
  toast,
  updateCampaign,
  updateInterviewQuestion,
} from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import { formatSeconds, uid } from '@/lib/utils'
import type { Campaign, InterviewQuestion, QuestionCategory } from '@/types/domain'

const steps = [
  { id: 1, label: 'Job details' },
  { id: 2, label: 'Practice access' },
  { id: 3, label: 'Interview builder' },
  { id: 4, label: 'Preview & publish' },
]

export function CampaignWizardPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const campaigns = useMockStore((s) => s.campaigns)
  const plans = useMockStore((s) => s.plans)

  const campaignIdParam = params.get('campaignId')
  const stepParam = Number(params.get('step') ?? 1)

  const [step, setStep] = useState(stepParam || 1)
  const [campaignId, setCampaignId] = useState(campaignIdParam ?? '')
  const [busy, setBusy] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [editQ, setEditQ] = useState<InterviewQuestion | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const existing = campaigns.find((c) => c.id === campaignId)

  const [form, setForm] = useState({
    name: existing?.name ?? 'Software Engineering Intern — Summer 2026',
    jobTitle: existing?.jobTitle ?? 'Software Engineering Intern',
    department: existing?.department ?? 'Engineering',
    description:
      existing?.description ??
      'Support backend and frontend feature work on customer-facing products.',
    skills: existing?.skills.join(', ') ?? 'TypeScript, REST APIs, Git, Basic SQL',
    responsibilities:
      existing?.responsibilities.join('\n') ??
      'Ship small features with mentor review\nWrite unit tests\nDocument decisions',
    competencies:
      existing?.competencies.join(', ') ??
      'Communication, Collaboration, Learning agility, Problem-solving',
    language: existing?.language ?? 'English',
    targetCandidateCount: existing?.targetCandidateCount ?? 20,
    sessionsPerDay: existing?.practice.sessionsPerDay ?? 3,
    questionsPerSession: existing?.practice.questionsPerSession ?? 5,
    practiceStart: existing?.practice.startDate ?? '2026-06-10',
    practiceEnd: existing?.practice.endDate ?? '2026-06-23',
    interviewDate: existing?.practice.interviewDate ?? '2026-06-24',
    thinkingTime: 20,
    timePerQuestion: 240,
    totalMinutes: 30,
  })

  useEffect(() => {
    if (existing) setCampaignId(existing.id)
  }, [existing])

  const plan = plans.find((p) => p.campaignId === (campaignId || existing?.id))
  const questions = plan?.questions ?? []
  const suggestions = plan?.suggestions ?? []

  const filteredQuestions = useMemo(() => {
    if (sectionFilter === 'all') return questions
    return questions.filter((q) => q.category === sectionFilter)
  }, [questions, sectionFilter])

  const maxAllowance = form.sessionsPerDay * 14

  const coverage = useMemo(() => {
    const comps = form.competencies.split(',').map((s) => s.trim()).filter(Boolean)
    return comps.map((c) => ({
      name: c,
      count: questions.filter((q) => q.competency === c).length,
    }))
  }, [form.competencies, questions])

  async function ensureCampaign() {
    if (campaignId) {
      await updateCampaign(campaignId, {
        name: form.name,
        jobTitle: form.jobTitle,
        department: form.department,
        description: form.description,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        competencies: form.competencies.split(',').map((s) => s.trim()).filter(Boolean),
        language: form.language,
        targetCandidateCount: form.targetCandidateCount,
        interviewDate: form.interviewDate,
        practice: {
          startDate: form.practiceStart,
          endDate: form.practiceEnd,
          interviewDate: form.interviewDate,
          sessionsPerDay: form.sessionsPerDay,
          questionsPerSession: form.questionsPerSession,
          totalUsageLimit: null,
          contentSources: ['Employer JD', 'Question library'],
          practicePrivate: true,
          feedbackPrivate: true,
        },
      })
      return campaignId
    }
    const created = await createCampaign({
      name: form.name,
      jobTitle: form.jobTitle,
      department: form.department,
      description: form.description,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
      competencies: form.competencies.split(',').map((s) => s.trim()).filter(Boolean),
      language: form.language,
      targetCandidateCount: form.targetCandidateCount,
      interviewDate: form.interviewDate,
      practice: {
        startDate: form.practiceStart,
        endDate: form.practiceEnd,
        interviewDate: form.interviewDate,
        sessionsPerDay: form.sessionsPerDay,
        questionsPerSession: form.questionsPerSession,
        totalUsageLimit: null,
        contentSources: ['Employer JD', 'Question library'],
        practicePrivate: true,
        feedbackPrivate: true,
      },
    })
    setCampaignId(created.id)
    return created.id
  }

  async function goNext(next: number) {
    if (!form.name.trim() || !form.jobTitle.trim()) {
      toast('Campaign name and job title are required', 'error')
      return
    }
    setBusy(true)
    try {
      const id = await ensureCampaign()
      await getPlan(id)
      setStep(next)
      toast(next === 2 ? 'Draft saved' : 'Progress saved', 'success')
    } finally {
      setBusy(false)
    }
  }

  async function onGenerate() {
    const id = await ensureCampaign()
    setGenerating(true)
    try {
      await generateInterviewPlan(id)
      toast('AI interview plan generated — review before approving', 'success')
    } finally {
      setGenerating(false)
    }
  }

  async function moveQuestion(index: number, dir: -1 | 1) {
    if (!plan) return
    const target = index + dir
    if (target < 0 || target >= plan.questions.length) return
    const next = [...plan.questions]
    const tmp = next[index]
    next[index] = next[target]
    next[target] = tmp
    useMockStore.getState().setQuestions(plan.id, next)
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            New campaign
          </p>
          <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Create hiring campaign</h1>
          <p className="mt-1 text-ink-secondary">
            Configure the job, practice window, and AI-assisted interview plan.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={async () => {
            setBusy(true)
            try {
              await ensureCampaign()
              toast('Draft saved', 'success')
            } finally {
              setBusy(false)
            }
          }}
          disabled={busy}
        >
          Save draft
        </Button>
      </div>

      <Stepper steps={steps} current={step} onStepClick={setStep} />

      {step === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-4">
            <Input label="Campaign name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Job title" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
              <Select
                label="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'Design', label: 'Design' },
                ]}
              />
            </div>
            <Textarea label="Job description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input label="Required skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} hint="Comma-separated" />
            <Textarea label="Responsibilities" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} hint="One per line" />
            <Input label="Competency criteria" value={form.competencies} onChange={(e) => setForm({ ...form, competencies: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Interview language"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Vietnamese', label: 'Vietnamese' },
                ]}
              />
              <Input
                label="Target candidate count"
                type="number"
                value={form.targetCandidateCount}
                onChange={(e) => setForm({ ...form, targetCandidateCount: Number(e.target.value) })}
              />
            </div>
            <label className="grid gap-1.5 text-[14px]">
              <span className="font-medium text-ink-secondary">JD upload</span>
              <input type="file" className="rounded-md border border-dashed border-border-strong px-3 py-3" />
              <span className="text-[13px] text-ink-muted">Upload is simulated in this demo.</span>
            </label>
          </Card>
          <Card className="bg-secondary-soft">
            <h3 className="font-semibold">Why competencies matter</h3>
            <p className="mt-2 text-[14.5px] text-ink-secondary">
              Competency criteria are what the AI will map questions against. Keeping them specific
              and job-related makes the report easier to trust.
            </p>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Practice start" type="date" value={form.practiceStart} onChange={(e) => setForm({ ...form, practiceStart: e.target.value })} />
              <Input label="Practice end" type="date" value={form.practiceEnd} onChange={(e) => setForm({ ...form, practiceEnd: e.target.value })} />
              <Input label="Interview date" type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} />
            </div>
            <div className="rounded-md border border-border bg-background p-4">
              <div className="mb-2 text-[13px] font-semibold text-ink-secondary">Practice timeline</div>
              <Progress value={50} label={`${form.practiceStart} → ${form.interviewDate}`} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Sessions per day" type="number" value={form.sessionsPerDay} onChange={(e) => setForm({ ...form, sessionsPerDay: Number(e.target.value) })} />
              <Input label="Questions per session" type="number" value={form.questionsPerSession} onChange={(e) => setForm({ ...form, questionsPerSession: Number(e.target.value) })} />
            </div>
            <div className="rounded-md border border-primary/20 bg-primary-soft p-4 text-primary-dark">
              <b>Maximum allowance: <span className="font-mono">{maxAllowance}</span> sessions</b>
              <p className="mt-1 text-[13.5px]">
                Quotas are upper limits, not performance targets. Practising more never creates an
                advantage in evaluation.
              </p>
            </div>
            <fieldset className="grid gap-2">
              <legend className="font-medium text-ink-secondary">Practice content sources</legend>
              <label className="inline-flex items-center gap-2 text-[14px]">
                <input type="checkbox" defaultChecked className="accent-primary" /> Employer-provided JD
              </label>
              <label className="inline-flex items-center gap-2 text-[14px]">
                <input type="checkbox" defaultChecked className="accent-primary" /> Question library
              </label>
            </fieldset>
          </Card>
          <Card>
            <h3 className="font-semibold">Candidate privacy (default)</h3>
            <ul className="mt-3 space-y-2 text-[14.5px] text-ink-secondary">
              <li>Practice answers remain private.</li>
              <li>Practice feedback is not shared with HR.</li>
              <li>HR sees only explicitly disclosed information.</li>
            </ul>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <Card padding={false} className="overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-[13px] font-semibold text-ink-muted">
              Sections
            </div>
            <ul>
              {['all', 'Introduction', 'Behavioural', 'Technical', 'Situational', 'Closing'].map((s) => {
                const count =
                  s === 'all'
                    ? questions.length
                    : questions.filter((q) => q.category === s).length
                return (
                  <li key={s}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14px] ${
                        sectionFilter === s ? 'bg-primary-soft font-semibold text-primary-dark' : ''
                      }`}
                      onClick={() => setSectionFilter(s)}
                    >
                      <span>{s === 'all' ? 'All questions' : s}</span>
                      <span className="font-mono text-[12px] text-ink-muted">{count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-border px-4 py-3 text-[13px]">
              <div className="flex justify-between">
                <span>Total</span>
                <b className="font-mono">
                  {form.totalMinutes} min · {questions.length} questions
                </b>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  if (!plan) return
                  await addInterviewQuestion(plan.id, {
                    text: 'New question — edit me',
                    category: (sectionFilter === 'all' ? 'Behavioural' : sectionFilter) as QuestionCategory,
                    competency: 'Communication',
                    estimatedSeconds: 240,
                    language: form.language,
                    approval: 'Draft',
                  })
                  toast('Question added')
                }}
              >
                <Plus className="size-4" /> Add question
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toast('Paste multiple questions opens here (demo)')}
              >
                Paste questions
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate('/employer/library')}
              >
                Import from library
              </Button>
            </div>

            {filteredQuestions.length === 0 ? (
              <Card className="text-center text-ink-muted">
                No questions yet. Generate an AI plan or add questions manually.
              </Card>
            ) : (
              filteredQuestions.map((q) => {
                const index = questions.findIndex((x) => x.id === q.id)
                return (
                  <Card key={q.id} className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[12px] text-ink-muted">Q{index + 1}</span>
                      <Badge tone="muted">{q.category}</Badge>
                      <Badge tone={q.approval === 'Approved' ? 'success' : 'primary'}>
                        {q.approval}
                      </Badge>
                      <span className="ml-auto font-mono text-[12.5px]">
                        {formatSeconds(q.estimatedSeconds)}
                      </span>
                    </div>
                    <p className="text-[15px]">{q.text}</p>
                    <div className="flex flex-wrap gap-3 text-[13px] text-ink-muted">
                      <span>{q.competency}</span>
                      <span>{q.language}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditQ(q)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          if (!plan) return
                          await addInterviewQuestion(plan.id, { ...q, id: uid('q'), approval: 'Draft' })
                          toast('Question duplicated')
                        }}
                      >
                        <Copy className="size-3.5" /> Duplicate
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => moveQuestion(index, -1)}>
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => moveQuestion(index, 1)}>
                        <ArrowDown className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={async () => {
                          if (!plan) return
                          await removeInterviewQuestion(plan.id, q.id)
                          toast('Question removed')
                        }}
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </Button>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          <Card className="space-y-4 h-fit">
            <div>
              <h3 className="font-semibold">AI Interview Planner</h3>
              <p className="mt-1 text-[13px] text-ink-muted">
                Simulated suggestions — never auto-publishes.
              </p>
            </div>
            <Button onClick={onGenerate} disabled={generating} block>
              {generating ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Reading JD & competencies…
                </>
              ) : (
                'Generate interview plan'
              )}
            </Button>

            <div>
              <div className="mb-2 text-[13px] font-semibold">Competency coverage</div>
              <ul className="space-y-2">
                {coverage.map((c) => (
                  <li key={c.name} className="flex justify-between text-[13.5px]">
                    <span>{c.name}</span>
                    <span className={c.count === 0 ? 'text-primary' : 'font-mono text-ink-muted'}>
                      {c.count === 0 ? 'Gap' : `${c.count}q`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-2">
              <Input
                label="Thinking time (sec)"
                type="number"
                value={form.thinkingTime}
                onChange={(e) => setForm({ ...form, thinkingTime: Number(e.target.value) })}
              />
              <Input
                label="Time per question (sec)"
                type="number"
                value={form.timePerQuestion}
                onChange={(e) => setForm({ ...form, timePerQuestion: Number(e.target.value) })}
              />
              <Input
                label="Total duration (min)"
                type="number"
                value={form.totalMinutes}
                onChange={(e) => setForm({ ...form, totalMinutes: Number(e.target.value) })}
              />
            </div>

            <p className="text-[13px] text-ink-muted">{plan?.followUpPolicy}</p>

            <div className="space-y-3">
              <div className="text-[13px] font-semibold">AI suggestions</div>
              {suggestions.map((s) => (
                <div key={s.id} className="rounded-md border border-accent/30 bg-accent-soft p-3">
                  <Badge tone="warning">AI suggestion</Badge>
                  <p className="mt-2 text-[14px]">{s.text}</p>
                  <p className="mt-1 text-[12.5px] text-ink-secondary">{s.why}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!plan) return
                        await addInterviewQuestion(plan.id, {
                          ...s,
                          id: uid('q'),
                          approval: 'Draft',
                        })
                        useMockStore
                          .getState()
                          .setSuggestions(
                            plan.id,
                            plan.suggestions.filter((x) => x.id !== s.id),
                          )
                        toast('Added to interview')
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (!plan) return
                        useMockStore
                          .getState()
                          .setSuggestions(
                            plan.id,
                            plan.suggestions.filter((x) => x.id !== s.id),
                          )
                        toast('Suggestion dismissed')
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="space-y-4">
            <h2 className="text-lg">Candidate preview</h2>
            <p className="text-[14px] text-ink-secondary">
              This is exactly what the candidate will experience in the live interview.
            </p>
            {questions.length ? (
              <>
                <div className="rounded-lg border border-border bg-background p-5">
                  <div className="font-mono text-[12px] text-ink-muted">
                    Question {previewIndex + 1} of {questions.length} · {questions[previewIndex].category}
                  </div>
                  <p className="mt-3 font-display text-2xl font-extrabold leading-snug">
                    {questions[previewIndex].text}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-ink-muted">
                    <span>Thinking time: {form.thinkingTime}s</span>
                    <span>Response: voice or text</span>
                    <span>{form.language}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    disabled={previewIndex === 0}
                    onClick={() => setPreviewIndex((i) => i - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={previewIndex >= questions.length - 1}
                    onClick={() => setPreviewIndex((i) => i + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-ink-muted">Generate or add questions before previewing.</p>
            )}
            <div className="rounded-md border border-border bg-secondary-soft p-4 text-[14px] text-ink-secondary">
              Recording and transcription notice will be shown before the live session starts.
              Includio never makes an automated hiring decision.
            </div>
          </Card>
          <Card className="space-y-3 h-fit">
            <div className="text-[13px] text-ink-muted">Summary</div>
            <ul className="space-y-2 text-[14.5px]">
              <li>
                <b>{questions.length}</b> questions · <b>{form.totalMinutes}</b> minutes
              </li>
              <li>Language: {form.language}</li>
              <li>Status: {plan?.status === 'approved' ? 'Approved' : 'Ready to approve'}</li>
            </ul>
            <Button
              block
              disabled={!questions.length}
              onClick={() => setConfirmOpen(true)}
            >
              Confirm interview plan
            </Button>
            {plan?.status === 'approved' ? (
              <p className="text-[14px] text-success">Your interview plan is ready. Version {plan.version}.</p>
            ) : null}
            <Link to={`/employer/campaigns/${campaignId || 'camp_se_intern'}/invitations`}>
              <Button variant="outline" block>
                Continue to invitations
              </Button>
            </Link>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-4">
        <Button
          variant="ghost"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button disabled={busy} onClick={() => goNext(step + 1)}>
            {busy ? 'Saving…' : 'Continue'}
          </Button>
        ) : null}
      </div>

      <Modal
        open={!!editQ}
        title="Edit question"
        onClose={() => setEditQ(null)}
        confirmLabel="Save"
        onConfirm={async () => {
          if (!plan || !editQ) return
          await updateInterviewQuestion(plan.id, editQ.id, editQ)
          setEditQ(null)
          toast('Question updated', 'success')
        }}
      >
        {editQ ? (
          <div className="grid gap-3">
            <Textarea
              label="Question text"
              value={editQ.text}
              onChange={(e) => setEditQ({ ...editQ, text: e.target.value })}
            />
            <Input
              label="Competency"
              value={editQ.competency}
              onChange={(e) => setEditQ({ ...editQ, competency: e.target.value })}
            />
            <Input
              label="Estimated seconds"
              type="number"
              value={editQ.estimatedSeconds}
              onChange={(e) =>
                setEditQ({ ...editQ, estimatedSeconds: Number(e.target.value) })
              }
            />
          </div>
        ) : null}
      </Modal>

      <Modal
        open={confirmOpen}
        title="Approve interview plan?"
        confirmLabel="Approve plan"
        onClose={() => setConfirmOpen(false)}
        busy={busy}
        onConfirm={async () => {
          if (!plan) return
          setBusy(true)
          try {
            await approveInterviewPlan(plan.id)
            setConfirmOpen(false)
            toast('Your interview plan is ready.', 'success')
          } finally {
            setBusy(false)
          }
        }}
      >
        <p>
          Approving locks this version for candidates. You can still edit and create a new version
          later. This does not send invitations yet.
        </p>
      </Modal>
    </div>
  )
}

// ensure Campaign type used
export type WizardCampaign = Campaign
