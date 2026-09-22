import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { useMockStore } from '@/lib/mock/mockStore'
import { formatSeconds } from '@/lib/utils'

export function QuestionLibraryPage() {
  const library = useMockStore((s) => s.library)

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          Library
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Question library</h1>
        <p className="mt-1 text-ink-secondary">Reusable questions by competency and type.</p>
      </div>
      <div className="grid gap-3">
        {library.map((q) => (
          <Card key={q.id} className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted">{q.category}</Badge>
              <Badge>{q.competency}</Badge>
              <span className="ml-auto font-mono text-[12.5px] text-ink-muted">
                {formatSeconds(q.estimatedSeconds)}
              </span>
            </div>
            <p>{q.text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
