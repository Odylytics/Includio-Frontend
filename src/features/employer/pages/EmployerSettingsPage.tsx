import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { employerUser } from '@/lib/mock/seedData'
import { toast } from '@/lib/mock/mockApi'
import { Button } from '@/components/ui/Button'

export function EmployerSettingsPage() {
  return (
    <div className="mx-auto max-w-[720px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Organisation
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Settings</h1>
        <p className="mt-1 text-ink-secondary">
          {employerUser.org} · 6 team members
        </p>
      </div>
      <Card className="space-y-4">
        <Input label="Organisation name" defaultValue={employerUser.org} />
        <Input label="Default interview language" defaultValue="English" />
        <Input label="Default thinking time (seconds)" type="number" defaultValue={20} />
        <p className="text-[13.5px] text-ink-muted">
          These settings apply to every new campaign unless changed during setup.
        </p>
        <Button onClick={() => toast('Organisation settings saved (demo)', 'success')}>
          Save settings
        </Button>
      </Card>
    </div>
  )
}
