import { cn } from '@/lib/utils'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
}

export function Textarea({ label, hint, className, id, ...props }: Props) {
  const areaId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className="grid gap-1.5 text-[14px]" htmlFor={areaId}>
      <span className="font-medium text-ink-secondary">{label}</span>
      <textarea
        id={areaId}
        className={cn(
          'min-h-28 rounded-md border border-border-strong bg-surface px-3.5 py-2.5 text-ink',
          'placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-[13px] text-ink-muted">{hint}</span> : null}
    </label>
  )
}
