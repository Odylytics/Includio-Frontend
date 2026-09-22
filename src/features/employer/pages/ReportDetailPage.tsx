import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Tabs } from '@/components/ui/Tabs'
import { ErrorState } from '@/components/ui/ErrorState'
import { markReportReviewed, saveHrNotes, toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'

export function ReportDetailPage() {
  const { reportId = '' } = useParams()
  const report = useMockStore((s) => s.reports.find((r) => r.id === reportId))
  const [tab, setTab] = useState('overview')
  const [notes, setNotes] = useState(report?.hrNotes ?? '')
  const [busy, setBusy] = useState(false)

  if (!report) {
    return (
      <ErrorState
        title="Report not found"
        message="This report id is not in the demo data."
      />
    )
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            {report.campaignTitle} · Northwind Labs
          </p>
          <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">{report.candidateName}</h1>
          <p className="mt-1 text-ink-secondary">
            Interviewed {report.interviewDate} · {report.duration} · {report.questionsCompleted}{' '}
            questions complete
          </p>
          <div className="mt-3">
            <Badge
              tone={
                report.status === 'Reviewed'
                  ? 'success'
                  : report.status === 'Ready for review'
                    ? 'primary'
                    : 'muted'
              }
            >
              {report.status}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => toast('Download is simulated in this demo')}>
            Download report
          </Button>
          <Button
            disabled={report.status === 'Reviewed' || busy}
            onClick={async () => {
              setBusy(true)
              try {
                await markReportReviewed(report.id)
                toast('Report marked as reviewed', 'success')
              } finally {
                setBusy(false)
              }
            }}
          >
            {report.status === 'Reviewed' ? 'Reviewed' : 'Mark as reviewed'}
          </Button>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'transcript', label: 'Transcript' },
          { id: 'evidence', label: 'Competency evidence' },
          { id: 'notes', label: 'HR notes' },
        ]}
      />

      {tab === 'overview' && (
        <Card className="space-y-3">
          <h2 className="text-lg">Interview overview</h2>
          <p className="text-[15px] text-ink-secondary">{report.overview}</p>
          <div className="rounded-md border border-border bg-background p-4 text-[14px] text-ink-secondary">
            Descriptive metrics only. Response length, speech speed, latency, accent, eye contact,
            facial expression, and vocal emotion are not used as universal measures of ability.
          </div>
          <Card className="bg-secondary-soft">
            <h3 className="font-semibold">Recording</h3>
            <p className="mt-1 text-[14px] text-ink-secondary">
              {report.recordingAvailable
                ? 'Recording available'
                : 'Recording unavailable in this demo prototype.'}
            </p>
          </Card>
        </Card>
      )}

      {tab === 'timeline' && (
        <Card>
          <h2 className="mb-3 text-lg">Response timeline</h2>
          <ul className="space-y-3">
            {report.timeline.map((item) => (
              <li key={item.label} className="grid gap-1 border-b border-border pb-3 last:border-0 sm:grid-cols-[140px_1fr]">
                <span className="font-mono text-[13px] text-ink-muted">{item.label}</span>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === 'transcript' && (
        <Card className="space-y-4">
          <h2 className="text-lg">Transcript</h2>
          {report.transcript.length === 0 ? (
            <p className="text-ink-muted">Transcript is still processing or unavailable.</p>
          ) : (
            report.transcript.map((entry) => (
              <div key={entry.id} className="rounded-md border border-border p-3">
                <div className="mb-1 flex items-center gap-2 text-[12.5px]">
                  <Badge tone={entry.speaker === 'candidate' ? 'success' : 'muted'}>
                    {entry.speaker === 'candidate'
                      ? 'Candidate statement'
                      : entry.speaker === 'interviewer'
                        ? 'Interviewer'
                        : 'System'}
                  </Badge>
                  <span className="font-mono text-ink-muted">{entry.timestamp}</span>
                </div>
                <p className="text-[14.5px]">{entry.text}</p>
              </div>
            ))
          )}
        </Card>
      )}

      {tab === 'evidence' && (
        <Card className="space-y-3">
          <h2 className="text-lg">Competency evidence</h2>
          {report.competencies.map((ev) => (
            <div key={ev.id} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <b>{ev.competency}</b>
                <Badge tone={ev.source === 'ai-summary' ? 'warning' : 'success'}>
                  {ev.source === 'ai-summary' ? 'AI-generated summary' : 'Candidate statement'}
                </Badge>
                <span className="text-[13px] text-ink-muted">{ev.questionLabel}</span>
              </div>
              <p className="mt-2 text-[14.5px] text-ink-secondary">{ev.excerpt}</p>
            </div>
          ))}
        </Card>
      )}

      {tab === 'notes' && (
        <Card className="space-y-3">
          <h2 className="text-lg">Private HR notes</h2>
          <p className="text-[13.5px] text-ink-muted">
            Notes are private to your organisation and are not shown to candidates.
          </p>
          <Textarea
            label="Your observations"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            onClick={async () => {
              await saveHrNotes(report.id, notes)
              toast('HR notes saved', 'success')
            }}
          >
            Save notes
          </Button>
        </Card>
      )}

      <Link to="/employer/reports" className="inline-block font-semibold text-secondary">
        ← Back to reports
      </Link>
    </div>
  )
}
