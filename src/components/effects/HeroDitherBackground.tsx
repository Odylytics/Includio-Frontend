import { useEffect, useRef, useState } from 'react'
import Dither from '@/components/effects/Dither'
import { useMockStore } from '@/lib/mock/mockStore'

/** #C1272D brand red as RGB 0–1 */
const WAVE_RED: [number, number, number] = [193 / 255, 39 / 255, 45 / 255]
/** #FFFAF2 cream app background */
const BG_CREAM: [number, number, number] = [255 / 255, 250 / 255, 242 / 255]

const LOGO_SELECTOR = '[data-hero-logo]'

type FixedClear = {
  pos: [number, number]
  radius: [number, number]
  strength: number
}

/**
 * Includio hero background — React Bits Dither, tinted to brand palette.
 * Keeps a fixed soft-clear pocket centered on the wordmark for type contrast.
 */
export function HeroDitherBackground() {
  const a11yReduced = useMockStore((s) => s.accessibility.reducedMotion)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [fixedClear, setFixedClear] = useState<FixedClear | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setPrefersReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const syncLogoClear = () => {
      const canvas = root.querySelector('canvas')
      const logo = document.querySelector(LOGO_SELECTOR)
      if (!canvas || !logo) {
        setFixedClear(null)
        return
      }

      const cr = canvas.getBoundingClientRect()
      const lr = logo.getBoundingClientRect()
      if (cr.width < 1 || cr.height < 1) return

      const cx = lr.left + lr.width / 2 - cr.left
      const cy = lr.top + lr.height / 2 - cr.top

      const aspect = cr.width / cr.height
      const radiusX = Math.max((lr.width / cr.width) * aspect * 0.95, 0.42)
      const radiusY = Math.max((lr.height / cr.height) * 1.85, 0.22)

      setFixedClear({
        pos: [cx, cy],
        radius: [radiusX, radiusY],
        strength: 0.92,
      })
    }

    syncLogoClear()
    const ro = new ResizeObserver(syncLogoClear)
    ro.observe(root)
    window.addEventListener('resize', syncLogoClear)

    // Wordmark may mount after the background — keep syncing briefly.
    let frames = 0
    let raf = 0
    const tick = () => {
      syncLogoClear()
      const logo = document.querySelector(LOGO_SELECTOR)
      if (logo) ro.observe(logo)
      frames += 1
      if (frames < 45) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', syncLogoClear)
    }
  }, [])

  const reduceMotion = a11yReduced || prefersReduced

  return (
    <div ref={rootRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Dither
        waveColor={WAVE_RED}
        backgroundColor={BG_CREAM}
        disableAnimation={reduceMotion}
        enableMouseInteraction={!reduceMotion}
        mouseRadius={0.3}
        colorNum={4}
        pixelSize={2}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
        fixedClear={fixedClear}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(255,250,242,0.4)] via-transparent to-[rgba(255,250,242,0.55)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
