import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { cn } from '@/lib/utils'

export type AvatarVideoHandle = {
  setMuted: (muted: boolean) => void
  isMuted: () => boolean
}

type Props = {
  className?: string
  paused?: boolean
  /** Start muted — browsers block autoplay with sound until user gesture */
  muted?: boolean
  onMuteChange?: (muted: boolean) => void
  /** Fires when the ~10s video loops back to the start */
  onLoop?: () => void
}

/**
 * Full-bleed 3D avatar video background (loop + optional audio).
 */
export const AvatarVideoBackground = forwardRef<AvatarVideoHandle, Props>(
  function AvatarVideoBackground(
    { className, paused, muted = true, onMuteChange, onLoop },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const lastTimeRef = useRef(0)
    const onLoopRef = useRef(onLoop)
    onLoopRef.current = onLoop

    useImperativeHandle(ref, () => ({
      setMuted(next) {
        const el = videoRef.current
        if (!el) return
        el.muted = next
        onMuteChange?.(next)
      },
      isMuted() {
        return videoRef.current?.muted ?? true
      },
    }))

    useEffect(() => {
      const el = videoRef.current
      if (!el) return
      el.muted = muted
    }, [muted])

    useEffect(() => {
      const el = videoRef.current
      if (!el) return
      if (paused) {
        el.pause()
      } else {
        void el.play().catch(() => undefined)
      }
    }, [paused])

    useEffect(() => {
      const el = videoRef.current
      if (!el) return

      const onTimeUpdate = () => {
        const t = el.currentTime
        // Detect wrap-around when the looping video restarts
        if (lastTimeRef.current > 1.5 && t < 0.5) {
          onLoopRef.current?.()
        }
        lastTimeRef.current = t
      }

      el.addEventListener('timeupdate', onTimeUpdate)
      return () => el.removeEventListener('timeupdate', onTimeUpdate)
    }, [])

    return (
      <div className={cn('absolute inset-0 overflow-hidden bg-[#1a1a1c]', className)} aria-hidden>
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center"
          src="/avatar-speaking.mp4"
          autoPlay
          loop
          playsInline
          muted={muted}
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
      </div>
    )
  },
)
