import { create } from 'zustand'
import type {
  AccessibilityPreferences,
  Campaign,
  Candidate,
  InterviewPlan,
  InterviewQuestion,
  InterviewReport,
  LibraryQuestion,
  NotificationItem,
  PracticeSession,
} from '@/types/domain'
import {
  defaultAccessibility,
  seedCampaigns,
  seedCandidates,
  seedLibrary,
  seedNotifications,
  seedPlans,
  seedReports,
} from './seedData'

export interface ToastItem {
  id: string
  message: string
  tone?: 'default' | 'success' | 'error'
}

interface MockState {
  campaigns: Campaign[]
  candidates: Candidate[]
  plans: InterviewPlan[]
  reports: InterviewReport[]
  library: LibraryQuestion[]
  notifications: NotificationItem[]
  accessibility: AccessibilityPreferences
  practiceQuotaUsed: number
  practiceQuotaMax: number
  activePractice: PracticeSession | null
  wizardDraft: Partial<Campaign> | null
  toasts: ToastItem[]
  candidateActivated: boolean

  setWizardDraft: (draft: Partial<Campaign> | null) => void
  upsertCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, patch: Partial<Campaign>) => void
  setPlan: (plan: InterviewPlan) => void
  updatePlan: (id: string, patch: Partial<InterviewPlan>) => void
  setQuestions: (planId: string, questions: InterviewQuestion[]) => void
  setSuggestions: (planId: string, suggestions: InterviewQuestion[]) => void
  addCandidates: (campaignId: string, people: Candidate[]) => void
  updateCandidate: (id: string, patch: Partial<Candidate>) => void
  markInvitationsSent: (campaignId: string) => void
  updateReport: (id: string, patch: Partial<InterviewReport>) => void
  setAccessibility: (prefs: AccessibilityPreferences) => void
  setPracticeQuota: (used: number, max?: number) => void
  setActivePractice: (session: PracticeSession | null) => void
  pushToast: (message: string, tone?: ToastItem['tone']) => void
  dismissToast: (id: string) => void
  setCandidateActivated: (value: boolean) => void
}

export const useMockStore = create<MockState>((set) => ({
  campaigns: structuredClone(seedCampaigns),
  candidates: structuredClone(seedCandidates),
  plans: structuredClone(seedPlans),
  reports: structuredClone(seedReports),
  library: structuredClone(seedLibrary),
  notifications: structuredClone(seedNotifications),
  accessibility: { ...defaultAccessibility },
  practiceQuotaUsed: 2,
  practiceQuotaMax: 3,
  activePractice: null,
  wizardDraft: null,
  toasts: [],
  candidateActivated: false,

  setWizardDraft: (draft) => set({ wizardDraft: draft }),

  upsertCampaign: (campaign) =>
    set((s) => {
      const exists = s.campaigns.some((c) => c.id === campaign.id)
      return {
        campaigns: exists
          ? s.campaigns.map((c) => (c.id === campaign.id ? campaign : c))
          : [campaign, ...s.campaigns],
      }
    }),

  updateCampaign: (id, patch) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  setPlan: (plan) =>
    set((s) => {
      const exists = s.plans.some((p) => p.id === plan.id)
      return {
        plans: exists ? s.plans.map((p) => (p.id === plan.id ? plan : p)) : [...s.plans, plan],
      }
    }),

  updatePlan: (id, patch) =>
    set((s) => ({
      plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  setQuestions: (planId, questions) =>
    set((s) => ({
      plans: s.plans.map((p) =>
        p.id === planId
          ? {
              ...p,
              questions,
              timing: { ...p.timing, questionCount: questions.length },
            }
          : p,
      ),
    })),

  setSuggestions: (planId, suggestions) =>
    set((s) => ({
      plans: s.plans.map((p) => (p.id === planId ? { ...p, suggestions } : p)),
    })),

  addCandidates: (campaignId, people) =>
    set((s) => ({
      candidates: [...s.candidates, ...people],
      campaigns: s.campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, candidateCount: c.candidateCount + people.length }
          : c,
      ),
    })),

  updateCandidate: (id, patch) =>
    set((s) => ({
      candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  markInvitationsSent: (campaignId) =>
    set((s) => ({
      candidates: s.candidates.map((c) =>
        c.campaignId === campaignId && c.invitationStatus === 'Not sent'
          ? { ...c, invitationStatus: 'Sent' }
          : c,
      ),
    })),

  updateReport: (id, patch) =>
    set((s) => ({
      reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  setAccessibility: (prefs) => set({ accessibility: prefs }),

  setPracticeQuota: (used, max) =>
    set((s) => ({
      practiceQuotaUsed: used,
      practiceQuotaMax: max ?? s.practiceQuotaMax,
    })),

  setActivePractice: (session) => set({ activePractice: session }),

  pushToast: (message, tone = 'default') =>
    set((s) => ({
      toasts: [...s.toasts, { id: `toast_${Date.now()}_${s.toasts.length}`, message, tone }],
    })),

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setCandidateActivated: (value) => set({ candidateActivated: value }),
}))
