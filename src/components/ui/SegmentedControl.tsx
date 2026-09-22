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
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            className={cn(
              'px-2 py-1.5 text-[12.5px] font-semibold text-ink-secondary transition sm:px-2.5 sm:text-[13px]',
              on && 'text-primary',
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
