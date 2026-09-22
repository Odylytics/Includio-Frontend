import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

type Props = {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: Props) {
  return (
    <div
      className="grid gap-3 rounded-lg border border-primary/30 bg-primary-soft px-5 py-6 text-primary-dark"
      role="alert"
    >
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="size-4" aria-hidden />
        {title}
      </div>
      <p className="text-[14px]">{message}</p>
      {onRetry ? (
        <div>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  )
}
