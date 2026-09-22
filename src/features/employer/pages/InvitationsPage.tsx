import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { addCandidates, sendInvitations, toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'

export function InvitationsPage() {
  const { campaignId = 'camp_se_intern' } = useParams()
  const campaign = useMockStore((s) => s.campaigns.find((c) => c.id === campaignId))
  const candidates = useMockStore((s) =>
    s.candidates.filter((c) => c.campaignId === campaignId),
  )

  const [emails, setEmails] = useState('')
  const [datetime, setDatetime] = useState('2026-06-24T14:30')
  const [timezone, setTimezone] = useState('GMT+7')
  const [deadline, setDeadline] = useState('2026-06-22')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const practice = campaign?.practice

  const preview = useMemo(
    () => ({
      subject: `You're invited to interview — ${campaign?.jobTitle ?? 'Role'}`,
      body: `Hi there, Northwind Labs would like to invite you to prepare for your upcoming interview with Includio.`,
    }),
    [campaign?.jobTitle],
  )

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          {campaign?.jobTitle ?? 'Campaign'}
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Invitations & scheduling</h1>
        <p className="mt-1 text-ink-secondary">
          Add candidates, set interview times, and send invitations.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <Textarea
            label="Add candidates (comma-separated emails)"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            hint="Try fail@example.com to see a representative error state."
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={async () => {
                const list = emails
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                if (!list.length) {
                  toast('Enter at least one email address', 'error')
                  return
                }
                setBusy(true)
                try {
                  await addCandidates(
                    campaignId,
                    list.map((email) => ({ email })),
                  )
                  setEmails('')
                  toast(
                    `${list.length} candidate${list.length === 1 ? '' : 's'} added`,
                    'success',
                  )
                } catch (err) {
                  toast(err instanceof Error ? err.message : 'Could not add candidates', 'error')
                } finally {
                  setBusy(false)
                }
              }}
              disabled={busy}
            >
              Add candidates
            </Button>
            <Button variant="ghost" onClick={() => toast('CSV upload is simulated in this demo')}>
              Upload CSV
            </Button>
          </div>

          <DataTable
            rows={candidates}
            rowKey={(r) => r.id}
            columns={[
              {
                key: 'name',
                header: 'Candidate',
                render: (r) => (
                  <div>
                    <div className="font-semibold capitalize">{r.name}</div>
                    <div className="text-[13px] text-ink-muted">{r.email}</div>
                  </div>
                ),
              },
              {
                key: 'app',
                header: 'Application',
                render: (r) => <Badge tone="success">{r.applicationStatus}</Badge>,
              },
              {
                key: 'invite',
                header: 'Invitation',
                render: (r) => (
                  <Badge
                    tone={
                      r.invitationStatus === 'Accepted'
                        ? 'success'
                        : r.invitationStatus === 'Sent'
                          ? 'primary'
                          : 'muted'
                    }
                  >
                    {r.invitationStatus}
                  </Badge>
                ),
              },
              {
                key: 'practice',
                header: 'Practice',
                render: (r) => <Badge tone="muted">{r.practiceStatus}</Badge>,
              },
              {
                key: 'schedule',
                header: 'Interview',
                className: 'font-mono text-[13px]',
                render: (r) =>
                  r.interviewSchedule
                    ? new Date(r.interviewSchedule).toLocaleString()
                    : '—',
              },
            ]}
          />
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <Input
              label="Interview date & time"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
            <Input label="Time zone" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            <Input
              label="Invitation deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="rounded-md bg-background p-3 text-[13.5px] text-ink-secondary">
              Practice period:{' '}
              <b className="font-mono text-ink">
                {practice?.startDate} → {practice?.endDate}
              </b>
              <br />
              Daily allowance:{' '}
              <b className="font-mono text-ink">
                {practice?.sessionsPerDay} sessions · {practice?.questionsPerSession} questions
              </b>
            </div>
          </Card>

          <Card>
            <div className="text-[13px] font-semibold text-ink-muted">Invitation preview</div>
            <p className="mt-2 font-semibold">{preview.subject}</p>
            <p className="mt-2 text-[14px] text-ink-secondary">{preview.body}</p>
            <ul className="mt-3 space-y-1 text-[13.5px] text-ink-secondary">
              <li>Interview: <b className="font-mono">{datetime.replace('T', ' ')} ({timezone})</b></li>
              <li>
                Daily allowance:{' '}
                <b className="font-mono">
                  {practice?.sessionsPerDay} · {practice?.questionsPerSession}
                </b>
              </li>
            </ul>
            <Button className="mt-4" block onClick={() => setConfirmOpen(true)}>
              Send invitations
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Send invitations?"
        confirmLabel="Send now"
        busy={busy}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setBusy(true)
          try {
            await sendInvitations(campaignId)
            setConfirmOpen(false)
            toast('Invitations sent (simulated)', 'success')
          } finally {
            setBusy(false)
          }
        }}
      >
        <p>
          This will email {candidates.filter((c) => c.invitationStatus === 'Not sent').length || candidates.length}{' '}
          candidate(s) with practice access details. Email delivery is simulated in this demo.
        </p>
      </Modal>
    </div>
  )
}
