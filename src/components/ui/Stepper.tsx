import { cn } from '@/lib/utils'

type Step = { id: number; label: string }

type Props = {
  steps: Step[]
  current: number
  onStepClick?: (id: number) => void
}

export function Stepper({ steps, current, onStepClick }: Props) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step) => {
        const done = step.id < current
        const on = step.id === current
        return (
          <li key={step.id}>
            <button
              type="button"
              className={cn(
                'rounded-pill border px-3.5 py-2 text-[13px] font-semibold',
                on && 'border-primary bg-primary-soft text-primary-dark',
                done && 'border-success/40 bg-success-soft text-success',
                !on && !done && 'border-border text-ink-muted',
              )}
              onClick={() => onStepClick?.(step.id)}
            >
              <span className="font-mono mr-2">{String(step.id).padStart(2, '0')}</span>
              {step.label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
