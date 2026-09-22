import { cn } from '@/lib/utils'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'soft' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  block,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.985]',
        size === 'sm' && 'px-3.5 py-2 text-[13.5px]',
        size === 'md' && 'px-5 py-2.5 text-[14.5px]',
        size === 'lg' && 'px-6.5 py-3.5 text-[15.5px]',
        variant === 'primary' &&
          'bg-primary text-white shadow-[0_6px_18px_-10px_rgba(193,39,45,0.55)] hover:bg-primary-dark',
        variant === 'ghost' && 'border border-border-strong bg-transparent text-ink hover:bg-surface',
        variant === 'outline' && 'border border-border-strong bg-surface text-ink hover:border-ink-secondary',
        variant === 'soft' && 'bg-secondary-soft text-secondary',
        variant === 'danger' && 'bg-primary-soft text-primary-dark',
        block && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
