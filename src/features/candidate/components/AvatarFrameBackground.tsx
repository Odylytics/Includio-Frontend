import { useEffect, useState } from 'react'
import { AVATAR_FRAME_COUNT, avatarFrameSrc } from './avatarFrames'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** fps for frame cycling */
  fps?: number
  paused?: boolean
}

/**
 * Full-bleed background that cycles JPEG frames extracted from the 3D avatar loop.
 */
export function AvatarFrameBackground({ className, fps = 12, paused }: Props) {
  const [frame, setFrame] = useState(0)
  const reduced =
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduce-motion'))

  useEffect(() => {
    if (paused || reduced) return
    const ms = Math.max(1000 / fps, 40)
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % AVATAR_FRAME_COUNT)
    }, ms)
    return () => window.clearInterval(id)
  }, [fps, paused, reduced])

  // Prefetch a few upcoming frames for smoother playback
  useEffect(() => {
    if (reduced) return
    for (let i = 1; i <= 6; i++) {
      const img = new Image()
      img.src = avatarFrameSrc(frame + i)
    }
  }, [frame, reduced])

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-[#1a1a1c]', className)} aria-hidden>
      <img
        src={avatarFrameSrc(frame)}
        alt=""
        className="h-full w-full object-cover object-center"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
    </div>
  )
}
