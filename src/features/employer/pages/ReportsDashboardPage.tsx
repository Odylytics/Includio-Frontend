import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useMockStore } from '@/lib/mock/mockStore'
import type { ReviewStatus } from '@/types/domain'

function tone(status: ReviewStatus) {
  if (status === 'Ready for review') return 'primary' as const
  if (status === 'Reviewed') return 'success' as const
  return 'muted' as const
}

export function ReportsDashboardPage() {
  const reports = useMockStore((s) => s.reports)
  const campaigns = useMockStore((s) => s.campaigns)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [campaign, setCampaign] = useState('')

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const q = search.toLowerCase()
      const okSearch =
        !q ||
        r.candidateName.toLowerCase().includes(q) ||
        r.campaignTitle.toLowerCase().includes(q)
      const okStatus = !status || r.status === status
      const okCamp = !campaign || r.campaignId === campaign
      return okSearch && okStatus && okCamp
    })
  }, [reports, search, status, campaign])

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Evidence
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Interview reports</h1>
        <p className="mt-1 text-ink-secondary">
          Review job-related evidence. Includio does not rank candidates or decide hires.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Candidate or campaign"
        />
        <Select
          label="Review status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'Processing', label: 'Processing' },
            { value: 'Ready for review', label: 'Ready for review' },
            { value: 'Reviewed', label: 'Reviewed' },
          ]}
        />
        <Select
          label="Campaign"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          options={[
            { value: '', label: 'All campaigns' },
            ...campaigns.map((c) => ({ value: c.id, label: c.jobTitle })),
          ]}
        />
      </div>

      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        empty={
          <EmptyState
            title="No reports match"
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('')
              setStatus('')
              setCampaign('')
            }}
          />
        }
        columns={[
          { key: 'name', header: 'Candidate', render: (r) => <b>{r.candidateName}</b> },
          { key: 'job', header: 'Campaign', render: (r) => r.campaignTitle },
          { key: 'date', header: 'Date', className: 'font-mono', render: (r) => r.interviewDate },
          { key: 'dur', header: 'Duration', className: 'font-mono', render: (r) => r.duration },
          {
            key: 'q',
            header: 'Questions',
            className: 'font-mono',
            render: (r) => r.questionsCompleted,
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge>,
          },
          {
            key: 'open',
            header: '',
            render: (r) => (
              <Link to={`/employer/reports/${r.id}`} className="font-semibold text-secondary">
                Open report
              </Link>
            ),
          },
        ]}
      />
    </div>
  )
}
