import { cn } from '@/lib/utils'

type Option = { value: string; label: string }

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  className?: string
}

export function SegmentedControl({ options, value, onChange, ariaLabel, className }: Props) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('inline-flex rounded-pill border border-border-strong bg-surface p-1', className)}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            className={cn(
              'rounded-pill px-3.5 py-1.5 text-[13.5px] font-semibold text-ink-secondary',
              on && 'bg-primary-soft text-primary-dark',
            )}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
