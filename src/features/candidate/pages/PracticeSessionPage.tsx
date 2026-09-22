import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Captions,
  Mic,
  MicOff,
  MonitorUp,
  MoreVertical,
  Pause,
  PhoneOff,
  Play,
  RotateCcw,
  Send,
  Type,
  Video,
  VideoOff,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  completePracticeSession,
  getPracticeFeedback,
  submitPracticeAnswer,
  toast,
} from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import { cn } from '@/lib/utils'
import type { PracticeFeedback } from '@/types/domain'

type Phase = 'thinking' | 'answering' | 'feedback' | 'done'

function ControlBtn({
  label,
  active,
  danger,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  danger?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'grid size-12 place-items-center rounded-full transition sm:size-14',
        danger
          ? 'bg-[#c1272d] text-white hover:bg-[#84171c]'
          : active
            ? 'bg-white/20 text-white'
            : 'bg-[#3c4043] text-white hover:bg-[#5f6368]',
      )}
    >
      {children}
    </button>
  )
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
  const [showText, setShowText] = useState(a11y.questionsAsText || a11y.captions)
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null)
  const [recording, setRecording] = useState(false)
  const [textPanelOpen, setTextPanelOpen] = useState(
    () => a11y.responseMode === 'text' || session?.responseMode === 'text',
  )

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)

  // Start camera when session is active
  useEffect(() => {
    if (!session) return
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
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
        toast('Camera and microphone connected', 'success')
      } catch {
        setCameraError(
          'Camera access was blocked or unavailable. Allow camera permission to see your preview.',
        )
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

  // Keep video element attached if remounted
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [cameraReady, phase])

  useEffect(() => {
    if (!session) return
    setThinkLeft(session.thinkingTimeSeconds)
    setPhase('thinking')
    setAnswer('')
    setFeedback(null)
    setRecording(false)
  }, [session, index])

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
      toast(cameraError ?? 'Camera is not available', 'error')
      return
    }
    const next = !cameraOn
    track.enabled = next
    setCameraOn(next)
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0]
    if (!track) {
      toast('Microphone is not available', 'error')
      return
    }
    const next = !micOn
    track.enabled = next
    setMicOn(next)
  }

  async function endAndLeave() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (session) await completePracticeSession(session.id)
    navigate('/candidate/dashboard')
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

  const current = questions[index]
  if (!current) return null

  async function submit() {
    if (!current) return
    await submitPracticeAnswer(session!.id, current.id, answer || '(voice answer)')
    setRecording(false)
    if (session!.feedbackTiming === 'after-each') {
      const fb = await getPracticeFeedback(session!.id, current.id)
      setFeedback(fb)
      setPhase('feedback')
    } else {
      await goNext()
    }
  }

  async function goNext() {
    if (index >= questions.length - 1) {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      await completePracticeSession(session!.id)
      setPhase('done')
      toast('Practice session complete. Quota updated.', 'success')
      return
    }
    setIndex((i) => i + 1)
  }

  if (phase === 'done') {
    return (
      <Card className="mx-auto max-w-lg space-y-4 text-center">
        <h1 className="text-2xl">Practice session complete</h1>
        <p className="text-ink-secondary">
          Nice work. Your answers stay private. Ready when you are for another round or the live
          interview.
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

  const statusLine =
    phase === 'thinking'
      ? `Thinking · ${thinkLeft}s`
      : phase === 'answering'
        ? recording
          ? 'Listening…'
          : 'Your turn to answer'
        : 'Private feedback'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#202124] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="truncate text-[13px] text-white/70">
            Includio Practice Studio · Software Engineering Intern
          </div>
          <div className="truncate text-[15px] font-medium" aria-live="polite">
            Question {index + 1} of {questions.length}
            {paused ? ' · Paused' : ''} · {statusLine}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-white/60">
          <span className="hidden rounded-full bg-white/10 px-3 py-1 sm:inline">Demo meeting</span>
          <span className="font-mono tabular-nums">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 px-3 pb-2 sm:px-5">
        <div className="relative h-full overflow-hidden rounded-2xl bg-[#3c4043]">
          {/* AI interviewer main tile */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#2b2d31] to-[#1e1f22]">
            <div className="relative mb-5">
              <div
                className={cn(
                  'grid size-36 place-items-center rounded-full bg-[#282323] shadow-[0_0_0_4px_rgba(241,79,83,0.35)] sm:size-44',
                  phase === 'answering' && recording && 'animate-pulse',
                )}
              >
                <img src="/logo-app.svg" alt="" className="h-24 w-auto sm:h-28" aria-hidden />
              </div>
              {phase === 'thinking' && !paused ? (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-mono text-[12px] font-semibold">
                  {thinkLeft}s
                </div>
              ) : null}
            </div>
            <div className="text-lg font-medium">AI Interviewer</div>
            <div className="mt-1 text-[13px] text-white/55">
              {phase === 'thinking'
                ? 'Preparing the next question…'
                : phase === 'answering'
                  ? 'Listening'
                  : 'Sharing private feedback'}
            </div>
          </div>

          {/* Captions / question strip */}
          {showText ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-5 pt-16 sm:px-8">
              <p className="mx-auto max-w-3xl text-center text-[clamp(16px,2.4vw,22px)] font-medium leading-snug text-white">
                {current.text}
              </p>
            </div>
          ) : null}

          {/* Self view PiP */}
          <div className="absolute bottom-4 right-4 w-[38%] max-w-[280px] overflow-hidden rounded-xl border border-white/15 bg-[#202124] shadow-2xl sm:bottom-5 sm:right-5 sm:w-[28%]">
            <div className="relative aspect-video bg-[#3c4043]">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#3c4043] p-3 text-center">
                  <div className="grid size-14 place-items-center rounded-full bg-[#5f6368] text-lg font-semibold">
                    You
                  </div>
                  <p className="text-[11px] text-white/60">
                    {cameraError ? 'Camera off / blocked' : 'Camera off'}
                  </p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[11px] font-medium">
                You {micOn ? '' : '· Muted'}
              </div>
            </div>
          </div>

          {/* Feedback overlay */}
          {phase === 'feedback' && feedback ? (
            <div className="absolute inset-3 z-10 overflow-y-auto rounded-xl border border-white/10 bg-[#202124]/95 p-5 backdrop-blur-md sm:inset-auto sm:bottom-4 sm:left-4 sm:right-[calc(28%+1.5rem)] sm:top-4 sm:max-w-xl">
              <h2 className="text-lg font-semibold text-[#f8d56c]">Private feedback</h2>
              <p className="mt-1 text-[12px] text-white/50">Not shared with the employer</p>
              <div className="mt-4 space-y-3 text-[14px] text-white/85">
                <div>
                  <b className="text-white">Key ideas</b>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-white/70">
                    {feedback.keyIdeas.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <b className="text-white">Relevant requirements</b>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-white/70">
                    {feedback.relevantRequirements.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <p>
                  <b className="text-white">Suggested improvement:</b>{' '}
                  <span className="text-white/70">{feedback.suggestedImprovement}</span>
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10"
                  onClick={() => {
                    setPhase('thinking')
                    setThinkLeft(session.thinkingTimeSeconds)
                    setFeedback(null)
                    setAnswer('')
                  }}
                >
                  Retry
                </Button>
                <Button size="sm" onClick={() => void goNext()}>
                  Next question
                </Button>
              </div>
            </div>
          ) : null}

          {/* Text answer drawer */}
          {phase === 'answering' && textPanelOpen ? (
            <div className="absolute inset-x-3 top-3 z-10 rounded-xl border border-white/10 bg-[#202124]/95 p-4 backdrop-blur-md sm:left-4 sm:right-auto sm:w-[min(420px,90%)]">
              <label className="mb-2 block text-[13px] text-white/70" htmlFor="meet-answer">
                Type your response
              </label>
              <textarea
                id="meet-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[14px] text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f05a24]"
                placeholder="Take your time…"
              />
              <Button className="mt-3" size="sm" onClick={() => void submit()}>
                <Send className="size-3.5" /> Submit answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom meet controls */}
      <footer className="flex flex-col items-center gap-3 px-3 pb-5 pt-2 sm:px-6">
        {cameraError ? (
          <p className="max-w-xl text-center text-[12px] text-[#f8d56c]" role="status">
            {cameraError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <ControlBtn label={micOn ? 'Mute microphone' : 'Unmute microphone'} onClick={toggleMic}>
            {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
          </ControlBtn>
          <ControlBtn label={cameraOn ? 'Turn camera off' : 'Turn camera on'} onClick={toggleCamera}>
            {cameraOn && cameraReady ? <Video className="size-5" /> : <VideoOff className="size-5" />}
          </ControlBtn>
          <ControlBtn
            label={showText ? 'Hide captions' : 'Show captions'}
            active={showText}
            onClick={() => setShowText((v) => !v)}
          >
            <Captions className="size-5" />
          </ControlBtn>
          <ControlBtn
            label={paused ? 'Resume' : 'Pause'}
            active={paused}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </ControlBtn>
          <ControlBtn
            label="Repeat question"
            onClick={() => {
              setPhase('thinking')
              setThinkLeft(session.thinkingTimeSeconds)
              toast('Question repeated')
            }}
          >
            <RotateCcw className="size-5" />
          </ControlBtn>
          <ControlBtn
            label={textPanelOpen ? 'Hide text response' : 'Text response'}
            active={textPanelOpen}
            onClick={() => setTextPanelOpen((v) => !v)}
          >
            <Type className="size-5" />
          </ControlBtn>
          <ControlBtn
            label="Present (demo)"
            onClick={() => toast('Screen share is simulated in this demo')}
          >
            <MonitorUp className="size-5" />
          </ControlBtn>
          <ControlBtn label="More" onClick={() => toast('More options (demo)')}>
            <MoreVertical className="size-5" />
          </ControlBtn>

          {phase === 'answering' && !textPanelOpen ? (
            <ControlBtn
              label={recording ? 'Stop and submit' : 'Start speaking'}
              active={recording}
              onClick={() => {
                if (!recording) {
                  if (!micOn) toast('Unmute your microphone to speak', 'error')
                  else {
                    setRecording(true)
                    toast('Listening… (voice capture simulated)')
                  }
                } else {
                  void submit()
                }
              }}
            >
              {recording ? <Send className="size-5" /> : <Mic className="size-5" />}
            </ControlBtn>
          ) : null}

          <ControlBtn label="Leave call" danger onClick={() => void endAndLeave()}>
            <PhoneOff className="size-5" />
          </ControlBtn>
        </div>

        <p className="text-[11px] text-white/40">
          Practice meeting · camera uses your device · nothing is uploaded in this demo
        </p>
      </footer>
    </div>
  )
}
