import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, id, ...props }: Props) {
  const inputId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className="grid gap-1.5 text-[14px]" htmlFor={inputId}>
      <span className="font-medium text-ink-secondary">{label}</span>
      <input
        id={inputId}
        className={cn(
          'rounded-md border border-border-strong bg-surface px-3.5 py-2.5 text-ink',
          'placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40',
          error && 'border-primary',
          className,
        )}
        {...props}
      />
      {hint && !error ? <span className="text-[13px] text-ink-muted">{hint}</span> : null}
      {error ? <span className="text-[13px] text-primary">{error}</span> : null}
    </label>
  )
}
