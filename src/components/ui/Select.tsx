import { cn } from '@/lib/utils'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, id, ...props }: Props) {
  const selectId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className="grid gap-1.5 text-[14px]" htmlFor={selectId}>
      <span className="font-medium text-ink-secondary">{label}</span>
      <select
        id={selectId}
        className={cn(
          'rounded-md border border-border-strong bg-surface px-3.5 py-2.5 text-ink',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
