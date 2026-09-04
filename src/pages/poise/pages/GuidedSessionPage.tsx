import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, ChevronDown, ChevronUp, Check, SkipForward, CheckCircle2 } from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import { useExercises } from '../hooks/useExercises'
import { useSessionLog } from '../hooks/useSessionLog'
import type { SessionExercise } from '../types/session'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSeconds(s: number): string {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
}

function formatSpec(ex: SessionExercise): string {
    const parts: string[] = []
    if (ex.sets && ex.reps) parts.push(`${ex.sets} × ${ex.reps} reps`)
    else if (ex.sets && ex.duration) parts.push(`${ex.sets} × ${formatSeconds(ex.duration)}`)
    else if (ex.duration) parts.push(formatSeconds(ex.duration))
    return parts.join(' · ')
}

function isTimedExercise(ex: SessionExercise): boolean {
    return !ex.reps && !!ex.duration
}

// ── Phase types ───────────────────────────────────────────────────────────────

type Phase = 'overview' | 'exercise' | 'rest' | 'complete'

// ── Rest timer ────────────────────────────────────────────────────────────────

function RestTimer({
    seconds,
    onSkip,
    onDone,
}: {
    seconds: number
    onSkip: () => void
    onDone: () => void
}) {
    const [remaining, setRemaining] = useState(seconds)

    useEffect(() => {
        if (remaining <= 0) { onDone(); return }
        const t = setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(t)
    }, [remaining, onDone])

    const pct = ((seconds - remaining) / seconds) * 100

    return (
        <div className="gs-rest">
            <span className="gs-rest__label">REST</span>
            <div className="gs-rest__ring">
                <svg viewBox="0 0 120 120" className="gs-rest__svg">
                    <circle cx="60" cy="60" r="52" className="gs-rest__track" />
                    <circle
                        cx="60" cy="60" r="52"
                        className="gs-rest__progress"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                    />
                </svg>
                <span className="gs-rest__time">{formatSeconds(remaining)}</span>
            </div>
            <button className="gs-btn gs-btn--ghost" onClick={onSkip}>
                Skip rest
            </button>
        </div>
    )
}

// ── Set dots ──────────────────────────────────────────────────────────────────

function SetDots({
    total,
    completed,
    current,
}: {
    total: number
    completed: number
    current: number
}) {
    return (
        <div className="gs-sets">
            {Array.from({ length: total }, (_, i) => {
                const done = i < completed
                const active = i === current
                return (
                    <span
                        key={i}
                        className={[
                            'gs-set-dot',
                            done ? 'gs-set-dot--done' : '',
                            active ? 'gs-set-dot--active' : '',
                        ].join(' ')}
                    />
                )
            })}
        </div>
    )
}

// ── Instructions panel ────────────────────────────────────────────────────────

function InstructionsPanel({ exerciseId }: { exerciseId: string }) {
    const { getById } = useExercises()
    const [open, setOpen] = useState(false)
    const exercise = getById(exerciseId)
    if (!exercise) return null

    return (
        <div className="gs-instructions">
            <button className="gs-instructions__toggle" onClick={() => setOpen(o => !o)}>
                How to perform
                {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {open && (
                <div className="gs-instructions__body">
                    <ol className="gs-instructions__list">
                        {exercise.instructions.map((step, i) => (
                            <li key={i} className="gs-instructions__item">
                                <span className="gs-instructions__num">{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                    {exercise.cues.length > 0 && (
                        <div className="gs-instructions__cues">
                            {exercise.cues.map(cue => (
                                <span key={cue} className="gs-instructions__cue">— {cue}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GuidedSessionPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getById: getSession } = useSessions()
    const { getById: getExercise } = useExercises()
    const { startLog, completeSet, skipExercise, finishSession, abandonSession } = useSessionLog()

    const session = id ? getSession(id) : undefined

    // ── State ─────────────────────────────────────────────────────────────────

    const [phase, setPhase] = useState<Phase>('overview')
    const [exerciseIndex, setExerciseIndex] = useState(0)
    const [currentSet, setCurrentSet] = useState(0)      // 0-based
    const [completedSets, setCompletedSets] = useState(0)
    const [sessionStarted, setSessionStarted] = useState(false)
    const [totalSetsCompleted, setTotalSetsCompleted] = useState(0)
    const [sessionStartTime] = useState(Date.now())
    const [elapsed, setElapsed] = useState(0)

    // Tick elapsed timer
    useEffect(() => {
        if (phase === 'complete') return
        const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000)), 1000)
        return () => clearInterval(t)
    }, [phase, sessionStartTime])

    // ── Start ─────────────────────────────────────────────────────────────────

    function handleBegin() {
        if (!session) return
        if (!sessionStarted) {
            startLog(session)
            setSessionStarted(true)
        }
        setPhase('exercise')
    }

    // ── Navigation helpers ────────────────────────────────────────────────────

    const sortedExercises = session
        ? [...session.exercises].sort((a, b) => a.order - b.order)
        : []

    const currentSessionEx = sortedExercises[exerciseIndex]
    const exercise = currentSessionEx ? getExercise(currentSessionEx.exerciseId) : undefined

    const totalSets = currentSessionEx?.sets ?? 1
    const restSeconds = currentSessionEx?.rest ?? 60
    const isTimed = currentSessionEx ? isTimedExercise(currentSessionEx) : false

    function advanceToNext() {
        const nextIdx = exerciseIndex + 1
        if (nextIdx >= sortedExercises.length) {
            finishSession().then(() => setPhase('complete'))
        } else {
            setExerciseIndex(nextIdx)
            setCurrentSet(0)
            setCompletedSets(0)
            setPhase('exercise')
        }
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    const handleCompleteSet = useCallback(() => {
        if (!currentSessionEx) return
        completeSet(currentSessionEx.exerciseId, currentSet + 1)
        const newCompleted = completedSets + 1
        setCompletedSets(newCompleted)
        setTotalSetsCompleted(t => t + 1)

        if (newCompleted >= totalSets) {
            // All sets done — move to next exercise (with rest if applicable)
            if (restSeconds > 0 && exerciseIndex < sortedExercises.length - 1) {
                setPhase('rest')
            } else {
                advanceToNext()
            }
        } else {
            // More sets remain — show rest then come back
            setCurrentSet(s => s + 1)
            if (restSeconds > 0) {
                setPhase('rest')
            }
        }
    }, [currentSessionEx, currentSet, completedSets, totalSets, restSeconds, exerciseIndex])

    function handleAfterRest() {
        if (completedSets >= totalSets) {
            advanceToNext()
        } else {
            setPhase('exercise')
        }
    }

    const handleSkipExercise = useCallback(() => {
        if (!currentSessionEx) return
        skipExercise(currentSessionEx.exerciseId)
        advanceToNext()
    }, [currentSessionEx, exerciseIndex])

    async function handleAbandon() {
        await abandonSession()
        navigate(-1)
    }

    // ── Not found ────────────────────────────────────────────────────────────

    if (!session) {
        return (
            <div className="gs-root">
                <p style={{ color: 'var(--p-muted)', padding: '2rem' }}>Session not found.</p>
            </div>
        )
    }

    // ── Overview phase ────────────────────────────────────────────────────────

    if (phase === 'overview') {
        return (
            <div className="gs-root">
                <button className="gs-close" onClick={() => navigate(-1)}><X size={20} /></button>
                <div className="gs-overview">
                    <span className="gs-overview__category">{session.category.toUpperCase()}</span>
                    <h1 className="gs-overview__name">{session.name}</h1>
                    <p className="gs-overview__meta">
                        {sortedExercises.length} exercises · ~{session.estimatedDuration} min
                    </p>
                    <div className="gs-overview__exercises">
                        {sortedExercises.map((ex, i) => {
                            const exData = getExercise(ex.exerciseId)
                            return (
                                <div key={i} className="gs-overview__exercise">
                                    <span className="gs-overview__exercise-block">{ex.block}</span>
                                    <span className="gs-overview__exercise-name">{exData?.name ?? ex.exerciseId}</span>
                                    <span className="gs-overview__exercise-spec">{formatSpec(ex)}</span>
                                </div>
                            )
                        })}
                    </div>
                    <button className="gs-btn gs-btn--primary gs-btn--large" onClick={handleBegin}>
                        Begin
                    </button>
                </div>
            </div>
        )
    }

    // ── Complete phase ────────────────────────────────────────────────────────

    if (phase === 'complete') {
        const elapsedMin = Math.max(1, Math.round(elapsed / 60))
        return (
            <div className="gs-root">
                <div className="gs-complete">
                    <div className="gs-complete__icon"><CheckCircle2 size={48} strokeWidth={1} /></div>
                    <span className="gs-complete__label">SESSION COMPLETE</span>
                    <h1 className="gs-complete__name">{session.name}</h1>
                    <div className="gs-complete__stats">
                        <div className="gs-complete__stat">
                            <span className="gs-complete__stat-value">{elapsedMin}</span>
                            <span className="gs-complete__stat-label">min</span>
                        </div>
                        <div className="gs-complete__stat-divider" />
                        <div className="gs-complete__stat">
                            <span className="gs-complete__stat-value">{sortedExercises.length}</span>
                            <span className="gs-complete__stat-label">exercises</span>
                        </div>
                        <div className="gs-complete__stat-divider" />
                        <div className="gs-complete__stat">
                            <span className="gs-complete__stat-value">{totalSetsCompleted}</span>
                            <span className="gs-complete__stat-label">sets</span>
                        </div>
                    </div>
                    <button
                        className="gs-btn gs-btn--primary gs-btn--large"
                        onClick={() => navigate(`/sandbox/poise/sessions/${session.id}`, { replace: true })}
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    // ── Rest phase ────────────────────────────────────────────────────────────

    if (phase === 'rest') {
        return (
            <div className="gs-root">
                <button className="gs-close" onClick={handleAbandon}><X size={20} /></button>
                <div className="gs-phase-label">
                    {exerciseIndex + 1} of {sortedExercises.length}
                </div>
                <RestTimer
                    seconds={restSeconds}
                    onSkip={handleAfterRest}
                    onDone={handleAfterRest}
                />
            </div>
        )
    }

    // ── Exercise phase ────────────────────────────────────────────────────────

    if (!exercise || !currentSessionEx) return null

    const spec = formatSpec(currentSessionEx)
    const blockLabel = currentSessionEx.block.toUpperCase().replace('-', ' ')

    return (
        <div className="gs-root">
            {/* Header */}
            <div className="gs-header">
                <button className="gs-close" onClick={handleAbandon}><X size={20} /></button>
                <div className="gs-progress-bar">
                    <div
                        className="gs-progress-bar__fill"
                        style={{ width: `${(exerciseIndex / sortedExercises.length) * 100}%` }}
                    />
                </div>
                <span className="gs-elapsed">{formatSeconds(elapsed)}</span>
            </div>

            {/* Exercise content */}
            <div className="gs-exercise">
                <div className="gs-exercise__top">
                    <span className="gs-exercise__block">{blockLabel}</span>
                    <span className="gs-exercise__counter">
                        {exerciseIndex + 1} / {sortedExercises.length}
                    </span>
                </div>

                <h2 className="gs-exercise__name">{exercise.name}</h2>

                {spec && <p className="gs-exercise__spec">{spec}</p>}

                {/* Set dots for multi-set exercises */}
                {totalSets > 1 && (
                    <div className="gs-exercise__sets-section">
                        <span className="gs-exercise__set-label">
                            Set {currentSet + 1} of {totalSets}
                        </span>
                        <SetDots
                            total={totalSets}
                            completed={completedSets}
                            current={currentSet}
                        />
                    </div>
                )}

                {/* Instructions */}
                <InstructionsPanel exerciseId={exercise.id} />
            </div>

            {/* Actions */}
            <div className="gs-actions">
                <button className="gs-btn gs-btn--ghost" onClick={handleSkipExercise}>
                    <SkipForward size={16} />
                    Skip
                </button>
                <button className="gs-btn gs-btn--primary" onClick={handleCompleteSet}>
                    <Check size={18} strokeWidth={2.5} />
                    {isTimed
                        ? 'Done'
                        : totalSets > 1
                            ? `Complete set ${currentSet + 1}`
                            : 'Complete'}
                </button>
            </div>
        </div>
    )
}