import { useEffect } from 'react'
import { useMockStore } from '@/lib/mock/mockStore'
import { cn } from '@/lib/utils'

export function ToastViewport() {
  const toasts = useMockStore((s) => s.toasts)
  const dismiss = useMockStore((s) => s.dismissToast)

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((t) =>
      window.setTimeout(() => dismiss(t.id), 3200),
    )
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [toasts, dismiss])

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto rounded-md border px-4 py-3 text-[14px] shadow-[var(--shadow-2)]',
            t.tone === 'error'
              ? 'border-primary bg-primary-soft text-primary-dark'
              : t.tone === 'success'
                ? 'border-success/30 bg-success-soft text-success'
                : 'border-border bg-surface text-ink',
          )}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
