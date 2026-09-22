import { Navigate, Route, Routes } from 'react-router-dom'
import { EmployerShell } from '@/components/layout/EmployerShell'
import { CandidateShell } from '@/components/layout/CandidateShell'
import { LandingPage } from '@/features/shared/pages/LandingPage'
import { StartPage } from '@/features/shared/pages/StartPage'
import { EmployerLoginPage } from '@/features/employer/pages/EmployerLoginPage'
import { EmployerDashboardPage } from '@/features/employer/pages/EmployerDashboardPage'
import { EmployerCampaignsPage } from '@/features/employer/pages/EmployerCampaignsPage'
import { CampaignWizardPage } from '@/features/employer/pages/CampaignWizardPage'
import { InvitationsPage } from '@/features/employer/pages/InvitationsPage'
import { ReportsDashboardPage } from '@/features/employer/pages/ReportsDashboardPage'
import { ReportDetailPage } from '@/features/employer/pages/ReportDetailPage'
import { QuestionLibraryPage } from '@/features/employer/pages/QuestionLibraryPage'
import { EmployerSettingsPage } from '@/features/employer/pages/EmployerSettingsPage'
import { CandidateActivatePage } from '@/features/candidate/pages/CandidateActivatePage'
import { CandidateDashboardPage } from '@/features/candidate/pages/CandidateDashboardPage'
import { PracticeSetupPage } from '@/features/candidate/pages/PracticeSetupPage'
import { PracticeSessionPage } from '@/features/candidate/pages/PracticeSessionPage'
import { DeviceCheckPage } from '@/features/candidate/pages/DeviceCheckPage'
import { LiveInterviewPage } from '@/features/candidate/pages/LiveInterviewPage'
import { InterviewCompletePage } from '@/features/candidate/pages/InterviewCompletePage'
import { AccessibilityPage } from '@/features/candidate/pages/AccessibilityPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/employer/login" element={<EmployerLoginPage />} />

      <Route path="/employer" element={<EmployerShell />}>
        <Route path="dashboard" element={<EmployerDashboardPage />} />
        <Route path="campaigns" element={<EmployerCampaignsPage />} />
        <Route path="campaigns/new" element={<CampaignWizardPage />} />
        <Route path="campaigns/:campaignId/invitations" element={<InvitationsPage />} />
        <Route path="reports" element={<ReportsDashboardPage />} />
        <Route path="reports/:reportId" element={<ReportDetailPage />} />
        <Route path="library" element={<QuestionLibraryPage />} />
        <Route path="settings" element={<EmployerSettingsPage />} />
      </Route>

      <Route path="/candidate/activate" element={<CandidateActivatePage />} />

      <Route path="/candidate" element={<CandidateShell />}>
        <Route path="dashboard" element={<CandidateDashboardPage />} />
        <Route path="practice/setup" element={<PracticeSetupPage />} />
        <Route path="practice/session" element={<PracticeSessionPage />} />
        <Route path="interview/check" element={<DeviceCheckPage />} />
        <Route path="interview/live" element={<LiveInterviewPage />} />
        <Route path="interview/complete" element={<InterviewCompletePage />} />
        <Route path="account/accessibility" element={<AccessibilityPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
