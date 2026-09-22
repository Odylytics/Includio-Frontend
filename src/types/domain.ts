export type CampaignStatus =
  | 'Draft'
  | 'Practice in progress'
  | 'Interviewing'
  | 'Closed'

export type InvitationStatus = 'Not sent' | 'Sent' | 'Accepted' | 'Expired'
export type ApplicationStatus = 'Passed CV' | 'Pending review' | 'Withdrawn'
export type PracticeStatus = '—' | 'Not started' | 'Active' | 'Complete'
export type ReviewStatus = 'Processing' | 'Ready for review' | 'Reviewed'
export type QuestionApproval = 'Draft' | 'Approved' | 'Suggested'
export type ResponseMode = 'voice' | 'text'
export type FeedbackTiming = 'after-each' | 'at-end'

export type QuestionCategory =
  | 'Introduction'
  | 'Behavioural'
  | 'Technical'
  | 'Situational'
  | 'Closing'
  | 'Problem-solving'
  | 'Teamwork'
  | 'Communication'

export interface AccessibilityPreferences {
  largerText: boolean
  reducedMotion: boolean
  captions: boolean
  questionsAsText: boolean
  responseMode: ResponseMode
  additionalThinkingTime: boolean
  optionalBreaks: boolean
  visualClarity: boolean
}

export interface InterviewQuestion {
  id: string
  text: string
  category: QuestionCategory
  competency: string
  estimatedSeconds: number
  language: string
  approval: QuestionApproval
  why?: string
}

export interface InterviewSection {
  id: string
  name: string
  questionCount: number
  timingMinutes: number
}

export interface InterviewTiming {
  totalMinutes: number
  questionCount: number
  timePerQuestionSeconds: number
  thinkingTimeSeconds: number
  transitionSeconds: number
  optionalBreaks: boolean
}

export interface InterviewPlan {
  id: string
  campaignId: string
  sections: InterviewSection[]
  questions: InterviewQuestion[]
  suggestions: InterviewQuestion[]
  timing: InterviewTiming
  status: 'draft' | 'approved'
  version: number
  followUpPolicy: string
}

export interface PracticeConfiguration {
  startDate: string
  endDate: string
  interviewDate: string
  sessionsPerDay: number
  questionsPerSession: number
  totalUsageLimit: number | null
  contentSources: string[]
  practicePrivate: boolean
  feedbackPrivate: boolean
}

export interface Campaign {
  id: string
  name: string
  jobTitle: string
  department: string
  description: string
  skills: string[]
  responsibilities: string[]
  competencies: string[]
  language: string
  targetCandidateCount: number
  status: CampaignStatus
  candidateCount: number
  practiceDays: number
  interviewDate: string
  practice: PracticeConfiguration
  planId: string | null
  createdAt: string
}

export interface Candidate {
  id: string
  campaignId: string
  name: string
  email: string
  applicationStatus: ApplicationStatus
  invitationStatus: InvitationStatus
  practiceStatus: PracticeStatus
  interviewSchedule: string | null
  timezone: string
}

export interface InterviewSchedule {
  id: string
  campaignId: string
  candidateId: string
  datetime: string
  timezone: string
  durationMinutes: number
  invitationDeadline: string
}

export interface PracticeSession {
  id: string
  candidateId: string
  campaignId: string
  questionIds: string[]
  currentIndex: number
  responseMode: ResponseMode
  durationMinutes: number
  thinkingTimeSeconds: number
  feedbackTiming: FeedbackTiming
  status: 'active' | 'completed'
  answers: Record<string, string>
  startedAt: string
}

export interface PracticeFeedback {
  questionId: string
  keyIdeas: string[]
  relevantRequirements: string[]
  suggestedImprovement: string
  answerStructure: string
}

export interface TranscriptEntry {
  id: string
  speaker: 'interviewer' | 'candidate' | 'system'
  text: string
  timestamp: string
  questionId?: string
}

export interface CompetencyEvidence {
  id: string
  competency: string
  excerpt: string
  source: 'candidate' | 'ai-summary'
  questionLabel: string
}

export interface InterviewReport {
  id: string
  candidateId: string
  candidateName: string
  campaignId: string
  campaignTitle: string
  interviewDate: string
  status: ReviewStatus
  duration: string
  questionsCompleted: string
  overview: string
  timeline: { label: string; detail: string }[]
  transcript: TranscriptEntry[]
  competencies: CompetencyEvidence[]
  hrNotes: string
  recordingAvailable: boolean
}

export interface NotificationItem {
  id: string
  message: string
  createdAt: string
  read: boolean
}

export interface LibraryQuestion {
  id: string
  text: string
  category: QuestionCategory
  competency: string
  estimatedSeconds: number
}

export interface DemoUser {
  name: string
  email: string
  org: string
  role: string
  initials: string
}
