import { cn } from '@/lib/utils'

/** Frosted / liquid-glass surface used across the interview room. */
export function glassPanel(extra?: string) {
  return cn(
    'rounded-[28px] border border-white/25 bg-white/12 shadow-[0_8px_40px_rgba(0,0,0,0.22)]',
    'backdrop-blur-[22px] backdrop-saturate-150',
    extra,
  )
}

export function GlassButton({
  label,
  onClick,
  danger,
  active,
  children,
  className,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  active?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'grid size-12 place-items-center rounded-full border transition sm:size-[52px]',
        'backdrop-blur-xl backdrop-saturate-150',
        danger
          ? 'border-red-400/40 bg-[#e53935] text-white shadow-[0_6px_24px_rgba(229,57,53,0.45)] hover:bg-[#c62828]'
          : active
            ? 'border-white/40 bg-white/35 text-white'
            : 'border-white/30 bg-white/15 text-white hover:bg-white/25',
        className,
      )}
    >
      {children}
    </button>
  )
}
