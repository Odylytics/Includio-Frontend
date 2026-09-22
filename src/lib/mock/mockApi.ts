import type {
  AccessibilityPreferences,
  Campaign,
  Candidate,
  InterviewPlan,
  InterviewQuestion,
  PracticeFeedback,
  PracticeSession,
} from '@/types/domain'
import { delay, uid } from '@/lib/utils'
import { practiceFeedbackBank, seedSuggestions } from './seedData'
import { useMockStore } from './mockStore'

async function withDelay<T>(value: T, ms = 420): Promise<T> {
  await delay(ms)
  return value
}

export async function getCampaigns() {
  return withDelay(useMockStore.getState().campaigns)
}

export async function getCampaign(id: string) {
  await delay()
  const campaign = useMockStore.getState().campaigns.find((c) => c.id === id)
  if (!campaign) throw new Error('Campaign not found')
  return campaign
}

export async function createCampaign(input: Partial<Campaign>) {
  await delay(500)
  const id = uid('camp')
  const campaign: Campaign = {
    id,
    name: input.name ?? 'Untitled campaign',
    jobTitle: input.jobTitle ?? '',
    department: input.department ?? 'Engineering',
    description: input.description ?? '',
    skills: input.skills ?? [],
    responsibilities: input.responsibilities ?? [],
    competencies: input.competencies ?? [],
    language: input.language ?? 'English',
    targetCandidateCount: input.targetCandidateCount ?? 10,
    status: 'Draft',
    candidateCount: 0,
    practiceDays: input.practiceDays ?? 14,
    interviewDate: input.interviewDate ?? '2026-07-01',
    practice: input.practice ?? {
      startDate: '2026-06-15',
      endDate: '2026-06-28',
      interviewDate: '2026-07-01',
      sessionsPerDay: 3,
      questionsPerSession: 5,
      totalUsageLimit: null,
      contentSources: ['Employer JD', 'Question library'],
      practicePrivate: true,
      feedbackPrivate: true,
    },
    planId: null,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  useMockStore.getState().upsertCampaign(campaign)
  return campaign
}

export async function updateCampaign(id: string, input: Partial<Campaign>) {
  await delay(350)
  useMockStore.getState().updateCampaign(id, input)
  return useMockStore.getState().campaigns.find((c) => c.id === id)!
}

export async function getPlan(campaignId: string) {
  await delay()
  let plan = useMockStore.getState().plans.find((p) => p.campaignId === campaignId)
  if (!plan) {
    plan = {
      id: uid('plan'),
      campaignId,
      sections: [
        { id: 'sec_intro', name: 'Introduction', questionCount: 0, timingMinutes: 3 },
        { id: 'sec_beh', name: 'Behavioural', questionCount: 0, timingMinutes: 8 },
        { id: 'sec_tech', name: 'Technical', questionCount: 0, timingMinutes: 10 },
        { id: 'sec_sit', name: 'Situational', questionCount: 0, timingMinutes: 5 },
        { id: 'sec_close', name: 'Closing', questionCount: 0, timingMinutes: 3 },
      ],
      questions: [],
      suggestions: [],
      timing: {
        totalMinutes: 30,
        questionCount: 0,
        timePerQuestionSeconds: 240,
        thinkingTimeSeconds: 20,
        transitionSeconds: 10,
        optionalBreaks: false,
      },
      status: 'draft',
      version: 1,
      followUpPolicy: 'Clarifying follow-ups allowed once per question when requested.',
    }
    useMockStore.getState().setPlan(plan)
  }
  return plan
}

export async function generateInterviewPlan(campaignId: string) {
  await delay(1400)
  const existing = await getPlan(campaignId)
  const generated: InterviewQuestion[] = [
    {
      id: uid('q'),
      text: 'Tell us a little about yourself and what drew you to this role.',
      category: 'Introduction',
      competency: 'Communication',
      estimatedSeconds: 180,
      language: 'English',
      approval: 'Draft',
    },
    {
      id: uid('q'),
      text: 'Tell us about a time you handled a challenging situation in a team project.',
      category: 'Behavioural',
      competency: 'Collaboration',
      estimatedSeconds: 240,
      language: 'English',
      approval: 'Draft',
    },
    {
      id: uid('q'),
      text: 'Describe a moment you had to learn something quickly to finish a task.',
      category: 'Behavioural',
      competency: 'Learning agility',
      estimatedSeconds: 240,
      language: 'English',
      approval: 'Draft',
    },
    {
      id: uid('q'),
      text: 'How would you approach debugging a request that is slow only for some users?',
      category: 'Technical',
      competency: 'Problem-solving',
      estimatedSeconds: 360,
      language: 'English',
      approval: 'Draft',
    },
    {
      id: uid('q'),
      text: 'How would you test a function you did not write yourself?',
      category: 'Technical',
      competency: 'Problem-solving',
      estimatedSeconds: 360,
      language: 'English',
      approval: 'Draft',
    },
    {
      id: uid('q'),
      text: 'What questions do you have for us, or what would you like to know about the team?',
      category: 'Closing',
      competency: 'Communication',
      estimatedSeconds: 180,
      language: 'English',
      approval: 'Draft',
    },
  ]
  const next: InterviewPlan = {
    ...existing,
    questions: generated,
    suggestions: seedSuggestions.map((s) => ({ ...s, id: uid('sug') })),
    timing: { ...existing.timing, questionCount: generated.length },
    status: 'draft',
  }
  useMockStore.getState().setPlan(next)
  useMockStore.getState().updateCampaign(campaignId, { planId: next.id })
  return next
}

export async function addInterviewQuestion(
  planId: string,
  question: Omit<InterviewQuestion, 'id'> & { id?: string },
) {
  await delay(250)
  const plan = useMockStore.getState().plans.find((p) => p.id === planId)
  if (!plan) throw new Error('Plan not found')
  const nextQ: InterviewQuestion = {
    ...question,
    id: question.id ?? uid('q'),
    approval: question.approval ?? 'Draft',
  }
  useMockStore.getState().setQuestions(planId, [...plan.questions, nextQ])
  return nextQ
}

export async function updateInterviewQuestion(
  planId: string,
  questionId: string,
  input: Partial<InterviewQuestion>,
) {
  await delay(250)
  const plan = useMockStore.getState().plans.find((p) => p.id === planId)
  if (!plan) throw new Error('Plan not found')
  useMockStore.getState().setQuestions(
    planId,
    plan.questions.map((q) => (q.id === questionId ? { ...q, ...input } : q)),
  )
}

export async function removeInterviewQuestion(planId: string, questionId: string) {
  await delay(200)
  const plan = useMockStore.getState().plans.find((p) => p.id === planId)
  if (!plan) throw new Error('Plan not found')
  useMockStore.getState().setQuestions(
    planId,
    plan.questions.filter((q) => q.id !== questionId),
  )
}

export async function reorderInterviewQuestions(planId: string, questionIds: string[]) {
  await delay(200)
  const plan = useMockStore.getState().plans.find((p) => p.id === planId)
  if (!plan) throw new Error('Plan not found')
  const map = new Map(plan.questions.map((q) => [q.id, q]))
  const ordered = questionIds.map((id) => map.get(id)).filter(Boolean) as InterviewQuestion[]
  useMockStore.getState().setQuestions(planId, ordered)
}

export async function approveInterviewPlan(planId: string) {
  await delay(500)
  useMockStore.getState().updatePlan(planId, { status: 'approved', version: 1 })
  const plan = useMockStore.getState().plans.find((p) => p.id === planId)!
  useMockStore.getState().updateCampaign(plan.campaignId, { status: 'Practice in progress' })
  return plan
}

export async function getCandidates(campaignId: string) {
  return withDelay(
    useMockStore.getState().candidates.filter((c) => c.campaignId === campaignId),
  )
}

export async function addCandidates(
  campaignId: string,
  inputs: { name?: string; email: string }[],
) {
  await delay(400)
  if (inputs.some((i) => i.email.includes('fail@'))) {
    throw new Error('One or more email addresses could not be validated. Please check and try again.')
  }
  const people: Candidate[] = inputs.map((i) => ({
    id: uid('cand'),
    campaignId,
    name: i.name ?? i.email.split('@')[0].replace(/\./g, ' '),
    email: i.email,
    applicationStatus: 'Passed CV',
    invitationStatus: 'Not sent',
    practiceStatus: '—',
    interviewSchedule: null,
    timezone: 'GMT+7',
  }))
  useMockStore.getState().addCandidates(campaignId, people)
  return people
}

export async function sendInvitations(campaignId: string) {
  await delay(700)
  useMockStore.getState().markInvitationsSent(campaignId)
  return true
}

export async function getReports(filters?: {
  search?: string
  status?: string
  campaign?: string
}) {
  await delay()
  let rows = useMockStore.getState().reports
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.candidateName.toLowerCase().includes(q) ||
        r.campaignTitle.toLowerCase().includes(q),
    )
  }
  if (filters?.status) rows = rows.filter((r) => r.status === filters.status)
  if (filters?.campaign) rows = rows.filter((r) => r.campaignId === filters.campaign)
  return rows
}

export async function getInterviewReport(reportId: string) {
  await delay()
  const report = useMockStore.getState().reports.find((r) => r.id === reportId)
  if (!report) throw new Error('Report not found')
  return report
}

export async function markReportReviewed(reportId: string) {
  await delay(400)
  useMockStore.getState().updateReport(reportId, { status: 'Reviewed' })
  return useMockStore.getState().reports.find((r) => r.id === reportId)!
}

export async function saveHrNotes(reportId: string, notes: string) {
  await delay(300)
  useMockStore.getState().updateReport(reportId, { hrNotes: notes })
}

export async function getAccessibilityPreferences() {
  return withDelay(useMockStore.getState().accessibility, 200)
}

export async function updateAccessibilityPreferences(input: AccessibilityPreferences) {
  await delay(300)
  useMockStore.getState().setAccessibility(input)
  return input
}

export async function startPracticeSession(input: {
  candidateId: string
  campaignId: string
  questionIds: string[]
  responseMode: PracticeSession['responseMode']
  durationMinutes: number
  thinkingTimeSeconds: number
  feedbackTiming: PracticeSession['feedbackTiming']
}) {
  await delay(500)
  const { practiceQuotaUsed, practiceQuotaMax } = useMockStore.getState()
  if (practiceQuotaUsed >= practiceQuotaMax) {
    throw new Error('You have used today’s practice allowance. Come back tomorrow.')
  }
  const session: PracticeSession = {
    id: uid('prac'),
    ...input,
    currentIndex: 0,
    status: 'active',
    answers: {},
    startedAt: new Date().toISOString(),
  }
  useMockStore.getState().setActivePractice(session)
  return session
}

export async function submitPracticeAnswer(sessionId: string, questionId: string, answer: string) {
  await delay(350)
  const session = useMockStore.getState().activePractice
  if (!session || session.id !== sessionId) throw new Error('Practice session not found')
  const next = {
    ...session,
    answers: { ...session.answers, [questionId]: answer },
  }
  useMockStore.getState().setActivePractice(next)
  return next
}

export async function getPracticeFeedback(
  _sessionId: string,
  questionId: string,
): Promise<PracticeFeedback> {
  await delay(800)
  return {
    questionId,
    ...practiceFeedbackBank,
  }
}

export async function completePracticeSession(sessionId: string) {
  await delay(400)
  const session = useMockStore.getState().activePractice
  if (!session || session.id !== sessionId) throw new Error('Practice session not found')
  useMockStore.getState().setActivePractice({ ...session, status: 'completed' })
  const used = useMockStore.getState().practiceQuotaUsed + 1
  useMockStore.getState().setPracticeQuota(used)
  return used
}

export async function getLibraryQuestions() {
  return withDelay(useMockStore.getState().library)
}

export function toast(message: string, tone?: 'default' | 'success' | 'error') {
  useMockStore.getState().pushToast(message, tone)
}
