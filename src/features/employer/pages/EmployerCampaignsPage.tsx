import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { useMockStore } from '@/lib/mock/mockStore'
import type { Campaign } from '@/types/domain'

function statusTone(status: Campaign['status']) {
  if (status === 'Practice in progress') return 'primary' as const
  if (status === 'Interviewing') return 'success' as const
  if (status === 'Draft') return 'muted' as const
  return 'warning' as const
}

export function EmployerCampaignsPage() {
  const campaigns = useMockStore((s) => s.campaigns)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [department, setDepartment] = useState('')

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const okSearch =
        !search ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      const okStatus = !status || c.status === status
      const okDept = !department || c.department === department
      return okSearch && okStatus && okDept
    })
  }, [campaigns, search, status, department])

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
            Hiring
          </p>
          <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Hiring campaigns</h1>
          <p className="mt-1 text-ink-secondary">Configure practice windows and interview plans.</p>
        </div>
        <Link to="/employer/campaigns/new">
          <Button>Create campaign</Button>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input
          label="Search by job title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. Software Engineering"
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: '', label: 'All statuses' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Practice in progress', label: 'Practice in progress' },
            { value: 'Interviewing', label: 'Interviewing' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />
        <Select
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={[
            { value: '', label: 'All departments' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Operations', label: 'Operations' },
            { value: 'Design', label: 'Design' },
          ]}
        />
      </div>

      <DataTable
        rows={filtered}
        rowKey={(r) => r.id}
        empty={
          <EmptyState
            title="No campaigns match those filters"
            description="Try clearing search or status filters."
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('')
              setStatus('')
              setDepartment('')
            }}
          />
        }
        columns={[
          {
            key: 'job',
            header: 'Campaign',
            render: (r) => (
              <div>
                <div className="font-semibold">{r.jobTitle}</div>
                <div className="text-[13px] text-ink-muted">{r.department}</div>
              </div>
            ),
          },
          {
            key: 'candidates',
            header: 'Candidates',
            className: 'font-mono',
            render: (r) => r.candidateCount,
          },
          {
            key: 'practice',
            header: 'Practice',
            className: 'font-mono',
            render: (r) => `${r.practiceDays} days`,
          },
          {
            key: 'interview',
            header: 'Interview',
            className: 'font-mono',
            render: (r) => r.interviewDate,
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge>,
          },
          {
            key: 'actions',
            header: '',
            render: (r) => (
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/employer/campaigns/new?campaignId=${r.id}&step=3`}
                  className="font-semibold text-secondary"
                >
                  Open
                </Link>
                <Link
                  to={`/employer/campaigns/${r.id}/invitations`}
                  className="font-semibold text-secondary"
                >
                  Invite
                </Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
