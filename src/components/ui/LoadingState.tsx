import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-ink-secondary',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-5 animate-spin text-primary" aria-hidden />
      <span>{label}</span>
    </div>
  )
}
