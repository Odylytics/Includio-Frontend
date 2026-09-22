import { cn } from '@/lib/utils'

type Props = {
  value: number
  max?: number
  label?: string
  className?: string
}

export function Progress({ value, max = 100, label, className }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('grid gap-2', className)}>
      {label ? (
        <div className="flex justify-between text-[13px] text-ink-secondary">
          <span>{label}</span>
          <span className="font-mono">{pct}%</span>
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-pill bg-border"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div className="h-full rounded-pill bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
