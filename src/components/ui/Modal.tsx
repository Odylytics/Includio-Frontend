import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  title: string
  children: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onClose: () => void
  busy?: boolean
}

export function Modal({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  busy,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(42,33,28,0.38)] p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-3)]',
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="font-display text-xl">
            {title}
          </h2>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-border-strong"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="text-[14.5px] text-ink-secondary">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button onClick={onConfirm} disabled={busy}>
              {busy ? 'Working…' : confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
