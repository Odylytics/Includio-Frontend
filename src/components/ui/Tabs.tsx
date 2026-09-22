import { cn } from '@/lib/utils'

type Tab = { id: string; label: string }

type Props = {
  tabs: Tab[]
  value: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: Props) {
  return (
    <div
      role="tablist"
      className={cn('flex flex-wrap gap-1 border-b border-border', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              'px-3.5 py-2.5 text-[14px] font-semibold text-ink-muted',
              selected && 'border-b-2 border-primary text-primary-dark',
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
