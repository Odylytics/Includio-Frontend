import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Maximize2,
  Menu,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  Video,
  VideoOff,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AvatarFrameBackground } from '@/features/candidate/components/AvatarFrameBackground'
import { GlassButton, glassPanel } from '@/features/candidate/components/GlassUI'
import {
  completePracticeSession,
  getPracticeFeedback,
  submitPracticeAnswer,
  toast,
} from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import { candidateUser } from '@/lib/mock/seedData'
import { cn } from '@/lib/utils'
import type { PracticeFeedback } from '@/types/domain'

type Phase = 'thinking' | 'answering' | 'feedback' | 'done'

type TranscriptLine = {
  id: string
  speaker: 'ai' | 'you'
  text: string
  time: string
}

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function PracticeSessionPage() {
  const navigate = useNavigate()
  const session = useMockStore((s) => s.activePractice)
  const plan = useMockStore((s) => s.plans.find((p) => p.campaignId === 'camp_se_intern'))
  const a11y = useMockStore((s) => s.accessibility)

  const questions = useMemo(() => {
    if (!session || !plan) return []
    return session.questionIds
      .map((id) => plan.questions.find((q) => q.id === id))
      .filter(Boolean)
  }, [session, plan])

  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('thinking')
  const [thinkLeft, setThinkLeft] = useState(20)
  const [paused, setPaused] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const [aiNote, setAiNote] = useState(
    'Take your time. Practice answers stay private unless you choose to share them.',
  )

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  const current = questions[index]

  useEffect(() => {
    if (!session) return
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 540 } },
          audio: true,
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }
        setCameraReady(true)
        setCameraError(null)
      } catch {
        setCameraError('Camera permission needed for your preview.')
        setCameraReady(false)
        setCameraOn(false)
      }
    }

    void startCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [session])

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraReady])

  useEffect(() => {
    if (!session || !current) return
    setThinkLeft(session.thinkingTimeSeconds)
    setPhase('thinking')
    setAnswer('')
    setFeedback(null)
    setRecording(false)
    setTranscript((prev) => [
      ...prev,
      {
        id: `q-${current.id}-${Date.now()}`,
        speaker: 'ai',
        text: current.text,
        time: nowStamp(),
      },
    ])
    setAiNote(`Question ${index + 1}: focus on a concrete example and what you did.`)
  }, [session, index]) // eslint-disable-line react-hooks/exhaustive-deps -- only re-run on question change

  useEffect(() => {
    if (phase !== 'thinking' || paused || !session) return
    if (thinkLeft <= 0) {
      setPhase('answering')
      return
    }
    const t = window.setTimeout(() => setThinkLeft((v) => v - 1), 1000)
    return () => window.clearTimeout(t)
  }, [phase, thinkLeft, paused, session])

  function toggleCamera() {
    const track = streamRef.current?.getVideoTracks()[0]
    if (!track) {
      toast(cameraError ?? 'Camera unavailable', 'error')
      return
    }
    track.enabled = !cameraOn
    setCameraOn(!cameraOn)
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0]
    if (!track) {
      toast('Microphone unavailable', 'error')
      return
    }
    track.enabled = !micOn
    setMicOn(!micOn)
  }

  async function endAndLeave() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (session) await completePracticeSession(session.id)
    navigate('/candidate/dashboard')
  }

  async function submit() {
    if (!current || !session) return
    const text = answer.trim() || '(voice answer)'
    setTranscript((prev) => [
      ...prev,
      { id: `a-${current.id}-${Date.now()}`, speaker: 'you', text, time: nowStamp() },
    ])
    await submitPracticeAnswer(session.id, current.id, text)
    setRecording(false)
    if (session.feedbackTiming === 'after-each') {
      const fb = await getPracticeFeedback(session.id, current.id)
      setFeedback(fb)
      setPhase('feedback')
      setAiNote(fb.suggestedImprovement)
    } else {
      await goNext()
    }
  }

  async function goNext() {
    if (!session) return
    if (index >= questions.length - 1) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      await completePracticeSession(session.id)
      setPhase('done')
      toast('Practice session complete. Quota updated.', 'success')
      return
    }
    setIndex((i) => i + 1)
  }

  if (!session) {
    return (
      <Card className="text-center">
        <p>No active practice session.</p>
        <Link
          to="/candidate/practice/setup"
          className="mt-3 inline-block font-semibold text-secondary"
        >
          Set up practice
        </Link>
      </Card>
    )
  }

  if (!current) return null

  if (phase === 'done') {
    return (
      <Card className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl">Practice session complete</h1>
        <p className="text-ink-secondary">
          Nice work. Your answers stay private.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => navigate('/candidate/practice/setup')}>Practice again</Button>
          <Button variant="ghost" onClick={() => navigate('/candidate/dashboard')}>
            Return to dashboard
          </Button>
        </div>
      </Card>
    )
  }

  const progressPct = Math.round(((index + (phase === 'feedback' ? 1 : 0.4)) / questions.length) * 100)

  // Lock page scroll while the meeting room covers the viewport
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const room = (
    <div
      className="fixed inset-0 z-[100] h-dvh w-screen overflow-hidden text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Practice interview room"
    >
      <AvatarFrameBackground paused={paused} />

      {/* —— Top bar —— */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <div className={cn(glassPanel('flex items-center gap-2 rounded-full px-3 py-2'))}>
            <img src="/blinkmark.svg" alt="" className="h-5 w-auto" aria-hidden />
            <span className="font-brand text-[13px] font-bold tracking-tight">includio</span>
          </div>
          <button
            type="button"
            className={cn(glassPanel('grid size-10 place-items-center rounded-full'))}
            aria-label="Back"
            onClick={() => void endAndLeave()}
          >
            <span className="text-lg leading-none">←</span>
          </button>
          <div className={cn(glassPanel('flex items-center gap-2 rounded-full px-3 py-2 text-[12px]'))}>
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            Recording
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className={cn(glassPanel('rounded-full px-4 py-2 text-[12px] text-white/85'))}>
            Practice Studio · Q{index + 1}/{questions.length}
          </div>
          <div className="flex -space-x-2">
            {['AR', 'AI', 'SC'].map((ini) => (
              <div
                key={ini}
                className="grid size-9 place-items-center rounded-full border-2 border-white/40 bg-white/20 text-[11px] font-semibold backdrop-blur-md"
              >
                {ini}
              </div>
            ))}
          </div>
        </div>

        <div className={cn(glassPanel('flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3'))}>
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#f05a24] to-[#f0b624] text-[11px] font-bold text-white">
            {candidateUser.initials}
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-[12px] font-semibold leading-tight">{candidateUser.name}</div>
            <div className="text-[10px] text-white/65">Candidate</div>
          </div>
          <button type="button" className="text-white/80" aria-label="Menu">
            <Menu className="size-4" />
          </button>
        </div>
      </header>

      {/* —— Left: transcript —— */}
      <aside
        className={cn(
          glassPanel(
            'absolute left-4 top-24 z-20 flex w-[min(320px,calc(100vw-2rem))] flex-col overflow-hidden sm:left-5',
          ),
          'bottom-[210px] max-h-[calc(100vh-280px)] sm:bottom-[230px]',
        )}
      >
        <div className="border-b border-white/15 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Conversation
          </div>
          <div className="mt-0.5 font-brand text-[15px] font-bold">Transcript</div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
          {transcript.length === 0 ? (
            <p className="px-1 text-[13px] text-white/55">The conversation will appear here.</p>
          ) : (
            transcript.map((line) => (
              <div
                key={line.id}
                className={cn(
                  'rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed',
                  line.speaker === 'ai' ? 'bg-white/10' : 'bg-[#f05a24]/25',
                )}
              >
                <div className="mb-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wide text-white/50">
                  <span>{line.speaker === 'ai' ? 'AI interviewer' : 'You'}</span>
                  <span className="font-mono normal-case">{line.time}</span>
                </div>
                {line.text}
              </div>
            ))
          )}
        </div>
        {phase === 'answering' ? (
          <div className="border-t border-white/15 p-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              placeholder="Type a reply (optional)…"
              className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[13px] text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f8d56c]"
            />
            <button
              type="button"
              onClick={() => void submit()}
              className="mt-2 w-full rounded-full bg-white/90 py-2 text-[13px] font-semibold text-[#282323] hover:bg-white"
            >
              Send answer
            </button>
          </div>
        ) : null}
      </aside>

      {/* —— Right column: PiP + candidate info —— */}
      <div className="absolute right-4 top-24 z-20 flex w-[min(300px,calc(100vw-2rem))] flex-col gap-3 sm:right-5">
        {/* Self camera PiP */}
        <div className={cn(glassPanel('overflow-hidden rounded-[22px] p-1.5'))}>
          <div className="relative aspect-video overflow-hidden rounded-[18px] bg-black/40">
            <video
              ref={videoRef}
              className={cn(
                'h-full w-full object-cover scale-x-[-1]',
                (!cameraOn || !cameraReady) && 'invisible',
              )}
              playsInline
              muted
              autoPlay
            />
            {(!cameraOn || !cameraReady) && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2a2a2e]/80 text-[12px] text-white/70">
                {cameraError ?? 'Camera off'}
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] backdrop-blur-sm">
              You {micOn ? '' : '· muted'}
            </div>
          </div>
        </div>

        {/* Candidate info panel */}
        <div className={cn(glassPanel('overflow-hidden'))}>
          <div className="flex items-center gap-3 border-b border-white/15 px-4 py-3">
            <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#f6921e] to-[#c1272d] font-brand text-sm font-bold">
              {candidateUser.initials}
            </div>
            <div>
              <div className="font-brand text-[15px] font-bold leading-tight">{candidateUser.name}</div>
              <div className="text-[12px] text-white/65">Software Engineering Intern</div>
            </div>
          </div>
          <ul className="divide-y divide-white/10 px-2 py-1">
            {[
              ['General info', 'Northwind Labs invitation · GMT+7'],
              ['Skills', 'TypeScript · REST · Git · Collaboration'],
              ['Experience', 'University projects & internships'],
              ['Preferences', a11y.responseMode === 'text' ? 'Text responses' : 'Voice responses'],
            ].map(([label, detail]) => (
              <li key={label}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-2 py-3 text-left hover:bg-white/5"
                  onClick={() => toast(`${label} panel — coming next`)}
                >
                  <span>
                    <span className="block text-[13px] font-semibold">{label}</span>
                    <span className="block text-[11px] text-white/55">{detail}</span>
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-white/45" />
                </button>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-4 gap-1.5 p-3 pt-1">
            {['#F05A24', '#5C7355', '#C1272D', '#4A90A4'].map((c, i) => (
              <div
                key={c}
                className="aspect-square rounded-lg opacity-90"
                style={{ background: c }}
                title={['Practice', 'Privacy', 'Evidence', 'Access'][i]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* —— Center status chip (thinking) —— */}
      {phase === 'thinking' && !paused ? (
        <div className="absolute left-1/2 top-[42%] z-10 -translate-x-1/2">
          <div className={cn(glassPanel('rounded-full px-5 py-2.5 font-mono text-sm'))}>
            Thinking · {thinkLeft}s
          </div>
        </div>
      ) : null}

      {/* —— Feedback glass card (center-bottom overlay when needed) —— */}
      {phase === 'feedback' && feedback ? (
        <div
          className={cn(
            glassPanel('absolute bottom-44 left-1/2 z-30 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 p-4'),
          )}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#f8d56c]">
            Private feedback
          </div>
          <p className="mt-2 text-[13px] text-white/85">{feedback.suggestedImprovement}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[12px] font-semibold"
              onClick={() => {
                setPhase('thinking')
                setThinkLeft(session.thinkingTimeSeconds)
                setFeedback(null)
              }}
            >
              Retry
            </button>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#282323]"
              onClick={() => void goNext()}
            >
              Next question
            </button>
          </div>
        </div>
      ) : null}

      {/* —— Bottom dock + timeline —— */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 sm:px-6 sm:pb-5">
        {/* AI note */}
        <div className="mb-3 flex justify-center">
          <div className="flex max-w-md items-start gap-2 rounded-2xl border border-[#f0b624]/50 bg-[#f8d56c] px-3 py-2 text-[#282323] shadow-[0_8px_24px_rgba(240,182,36,0.35)]">
            <Sparkles className="mt-0.5 size-4 shrink-0" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide">AI practice notes</div>
              <p className="text-[12px] leading-snug">{aiNote}</p>
            </div>
          </div>
        </div>

        {/* Control dock */}
        <div className="mb-3 flex justify-center">
          <div className={cn(glassPanel('flex items-center gap-2.5 rounded-full px-3 py-2'))}>
            <GlassButton
              label={cameraOn ? 'Turn camera off' : 'Turn camera on'}
              onClick={toggleCamera}
              active={cameraOn && cameraReady}
            >
              {cameraOn && cameraReady ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </GlassButton>
            <GlassButton
              label={micOn ? 'Mute' : 'Unmute'}
              onClick={toggleMic}
              active={micOn}
            >
              {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </GlassButton>
            <GlassButton
              label={
                phase === 'answering'
                  ? recording
                    ? 'Submit answer'
                    : 'Start speaking'
                  : 'Speaker'
              }
              active={recording}
              onClick={() => {
                if (phase !== 'answering') {
                  toast('Audio output (demo)')
                  return
                }
                if (!recording) {
                  setRecording(true)
                  toast('Listening… (voice simulated)')
                } else {
                  void submit()
                }
              }}
            >
              <Volume2 className="size-5" />
            </GlassButton>
            <GlassButton label="Leave" danger onClick={() => void endAndLeave()}>
              <PhoneOff className="size-5" />
            </GlassButton>
          </div>
        </div>

        {/* Timeline */}
        <div className={cn(glassPanel('mx-auto max-w-4xl px-4 py-3'))}>
          <div className="mb-2 flex items-center justify-between text-[11px] text-white/60">
            <span className="font-semibold uppercase tracking-wide">Timeline generation</span>
            <span className="font-mono">{progressPct}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f05a24] to-[#f0b624] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/70">
            {questions.map((q, i) => (
              <span
                key={q!.id}
                className={cn(i === index && 'font-semibold text-[#f8d56c]')}
              >
                {String(i + 1).padStart(2, '0')} · {q!.category}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-white/45">
            <button
              type="button"
              className="hover:text-white"
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? 'Resume avatar' : 'Pause avatar'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-white"
              onClick={() => toast('Expand timeline — coming next')}
            >
              Expand <Maximize2 className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(room, document.body)
}
