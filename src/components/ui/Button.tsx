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
        'inline-flex items-center justify-center gap-2 rounded-pill font-semibold tracking-tight transition duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.985]',
        size === 'sm' && 'px-4 py-2 text-[13px]',
        size === 'md' && 'px-5 py-2.5 text-[14px]',
        size === 'lg' && 'px-7 py-3.5 text-[15px]',
        variant === 'primary' &&
          'bg-primary text-white shadow-[0_10px_28px_-12px_rgba(193,39,45,0.65)] hover:bg-primary-dark',
        variant === 'ghost' && 'border border-transparent bg-transparent text-ink hover:bg-surface-muted',
        variant === 'outline' &&
          'border border-border-strong bg-surface/80 text-ink backdrop-blur-sm hover:border-ink',
        variant === 'soft' && 'bg-accent-soft text-accent',
        variant === 'danger' && 'bg-primary-soft text-primary-dark',
        block && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
