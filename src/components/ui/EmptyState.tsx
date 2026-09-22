import { Inbox } from 'lucide-react'
import { Button } from './Button'

type Props = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="grid place-items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <Inbox className="size-8 text-ink-muted" aria-hidden />
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="max-w-md text-[14px] text-ink-muted">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="ghost" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
