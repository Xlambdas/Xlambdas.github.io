import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, ChevronDown, ChevronUp, Check, SkipForward, CheckCircle2, Timer, Hash } from 'lucide-react'
import { useRoutines } from '../hooks/useRoutines'
import { useExercises } from '../hooks/useExercises'
import type { RoutineExercise } from '../types/routine'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSeconds(s: number): string {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
}

// ── Instructions panel (reused pattern) ──────────────────────────────────────

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

// ── Countdown timer ring ──────────────────────────────────────────────────────

function CountdownRing({
    total,
    remaining,
}: {
    total: number
    remaining: number
}) {
    const pct = ((total - remaining) / total) * 100
    const r = 52
    const circ = 2 * Math.PI * r

    return (
        <div className="gr-ring">
            <svg viewBox="0 0 120 120" className="gr-ring__svg">
                <circle cx="60" cy="60" r={r} className="gs-rest__track" />
                <circle
                    cx="60" cy="60" r={r}
                    className="gs-rest__progress"
                    strokeDasharray={`${circ}`}
                    strokeDashoffset={`${circ * (1 - pct / 100)}`}
                />
            </svg>
            <span className="gr-ring__time">{formatSeconds(remaining)}</span>
        </div>
    )
}

// ── Rest screen between exercises ─────────────────────────────────────────────

function RestScreen({
    seconds,
    onDone,
}: {
    seconds: number
    onDone: () => void
}) {
    const [remaining, setRemaining] = useState(seconds)

    useEffect(() => {
        if (remaining <= 0) { onDone(); return }
        const t = setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(t)
    }, [remaining, onDone])

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
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - ((seconds - remaining) / seconds))}`}
                    />
                </svg>
                <span className="gs-rest__time">{formatSeconds(remaining)}</span>
            </div>
            <button className="gs-btn gs-btn--ghost" onClick={onDone}>Skip rest</button>
        </div>
    )
}

// ── Timed exercise ────────────────────────────────────────────────────────────

function TimedExercise({
    item,
    onComplete,
    onSkip,
}: {
    item: RoutineExercise
    onComplete: () => void
    onSkip: () => void
}) {
    const total = item.durationSeconds ?? 30
    const [remaining, setRemaining] = useState(total)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused || remaining <= 0) return
        if (remaining === 0) { onComplete(); return }
        const t = setTimeout(() => setRemaining(r => r - 1), 1000)
        return () => clearTimeout(t)
    }, [remaining, paused, onComplete])

    useEffect(() => {
        if (remaining <= 0) onComplete()
    }, [remaining])

    return (
        <>
            <div className="gr-timed-center">
                <CountdownRing total={total} remaining={remaining} />
                <button
                    className="gr-pause-btn"
                    onClick={() => setPaused(p => !p)}
                >
                    {paused ? 'Resume' : 'Pause'}
                </button>
            </div>
            <div className="gs-actions">
                <button className="gs-btn gs-btn--ghost" onClick={onSkip}>
                    <SkipForward size={16} /> Skip
                </button>
                <button className="gs-btn gs-btn--primary" onClick={onComplete}>
                    <Check size={18} strokeWidth={2.5} /> Done
                </button>
            </div>
        </>
    )
}

// ── Rep exercise ──────────────────────────────────────────────────────────────

function RepExercise({
    item,
    onComplete,
    onSkip,
}: {
    item: RoutineExercise
    onComplete: () => void
    onSkip: () => void
}) {
    return (
        <>
            <div className="gr-reps-center">
                <span className="gr-reps-target">{item.reps}</span>
                <span className="gr-reps-label">reps</span>
            </div>
            <div className="gs-actions">
                <button className="gs-btn gs-btn--ghost" onClick={onSkip}>
                    <SkipForward size={16} /> Skip
                </button>
                <button className="gs-btn gs-btn--primary" onClick={onComplete}>
                    <Check size={18} strokeWidth={2.5} /> Done
                </button>
            </div>
        </>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

type Phase = 'overview' | 'exercise' | 'rest' | 'complete'

export default function GuidedRoutinePage() {
    const { id, variantId } = useParams<{ id: string; variantId: string }>()
    const navigate = useNavigate()
    const { getById: getRoutine } = useRoutines()
    const { getById: getExercise } = useExercises()

    const routine = id ? getRoutine(id) : undefined
    const variant = routine?.variants.find(v => v.id === variantId) ?? routine?.variants[0]
    const sortedExercises = variant
        ? [...variant.exercises].sort((a, b) => a.order - b.order)
        : []

    const [phase, setPhase] = useState<Phase>('overview')
    const [exerciseIndex, setExerciseIndex] = useState(0)
    const [sessionStartTime] = useState(Date.now())
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (phase === 'complete') return
        const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStartTime) / 1000)), 1000)
        return () => clearInterval(t)
    }, [phase, sessionStartTime])

    const currentItem = sortedExercises[exerciseIndex]
    const currentExercise = currentItem ? getExercise(currentItem.exerciseId) : undefined

    const advanceToNext = useCallback(() => {
        const nextIdx = exerciseIndex + 1
        if (nextIdx >= sortedExercises.length) {
            setPhase('complete')
        } else {
            setExerciseIndex(nextIdx)
            setPhase('exercise')
        }
    }, [exerciseIndex, sortedExercises.length])

    const handleComplete = useCallback(() => {
        if (currentItem?.restSeconds) {
            setPhase('rest')
        } else {
            advanceToNext()
        }
    }, [currentItem, advanceToNext])

    const handleSkip = useCallback(() => {
        advanceToNext()
    }, [advanceToNext])

    if (!routine || !variant) {
        return (
            <div className="gs-root">
                <p style={{ color: 'var(--p-muted)', padding: '2rem' }}>Routine not found.</p>
            </div>
        )
    }

    // ── Overview ──────────────────────────────────────────────────────────────

    if (phase === 'overview') {
        return (
            <div className="gs-root">
                <button className="gs-close" onClick={() => navigate(-1)}><X size={20} /></button>
                <div className="gs-overview">
                    <span className="gs-overview__category">{routine.category.toUpperCase()}</span>
                    <h1 className="gs-overview__name">{routine.name}</h1>
                    <p className="gs-overview__meta">
                        {variant.label} · {variant.durationMinutes} min · {sortedExercises.length} exercises
                    </p>
                    {routine.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--p-muted)', margin: '0 0 0.5rem' }}>
                            {routine.description}
                        </p>
                    )}
                    <div className="gs-overview__exercises">
                        {sortedExercises.map((item, i) => {
                            const ex = getExercise(item.exerciseId)
                            const spec = item.type === 'timed' && item.durationSeconds
                                ? formatSeconds(item.durationSeconds)
                                : item.reps ? `${item.reps} reps` : ''
                            return (
                                <div key={i} className="gs-overview__exercise">
                                    <span className="gs-overview__exercise-block">
                                        {item.type === 'timed' ? <Timer size={13} /> : <Hash size={13} />}
                                    </span>
                                    <span className="gs-overview__exercise-name">{ex?.name ?? item.exerciseId}</span>
                                    <span className="gs-overview__exercise-spec">{spec}</span>
                                </div>
                            )
                        })}
                    </div>
                    <button className="gs-btn gs-btn--primary gs-btn--large" onClick={() => setPhase('exercise')}>
                        Begin
                    </button>
                </div>
            </div>
        )
    }

    // ── Complete ──────────────────────────────────────────────────────────────

    if (phase === 'complete') {
        const elapsedMin = Math.max(1, Math.round(elapsed / 60))
        return (
            <div className="gs-root">
                <div className="gs-complete">
                    <div className="gs-complete__icon"><CheckCircle2 size={48} strokeWidth={1} /></div>
                    <span className="gs-complete__label">ROUTINE COMPLETE</span>
                    <h1 className="gs-complete__name">{routine.name}</h1>
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
                    </div>
                    <button
                        className="gs-btn gs-btn--primary gs-btn--large"
                        onClick={() => navigate(`/sandbox/poise/routines/${routine.id}`, { replace: true })}
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    // ── Rest ──────────────────────────────────────────────────────────────────

    if (phase === 'rest') {
        return (
            <div className="gs-root">
                <button className="gs-close" onClick={() => navigate(-1)}><X size={20} /></button>
                <div className="gs-phase-label">{exerciseIndex + 1} of {sortedExercises.length}</div>
                <RestScreen seconds={currentItem?.restSeconds ?? 30} onDone={advanceToNext} />
            </div>
        )
    }

    // ── Exercise ──────────────────────────────────────────────────────────────

    if (!currentItem || !currentExercise) return null

    const blockLabel = currentItem.type === 'timed' ? 'TIMED' : 'REPS'

    return (
        <div className="gs-root">
            <div className="gs-header">
                <button className="gs-close" style={{ position: 'static' }} onClick={() => navigate(-1)}>
                    <X size={20} />
                </button>
                <div className="gs-progress-bar">
                    <div
                        className="gs-progress-bar__fill"
                        style={{ width: `${(exerciseIndex / sortedExercises.length) * 100}%` }}
                    />
                </div>
                <span className="gs-elapsed">{formatSeconds(elapsed)}</span>
            </div>

            <div className="gs-exercise">
                <div className="gs-exercise__top">
                    <span className="gs-exercise__block">{blockLabel}</span>
                    <span className="gs-exercise__counter">
                        {exerciseIndex + 1} / {sortedExercises.length}
                    </span>
                </div>
                <h2 className="gs-exercise__name">{currentExercise.name}</h2>
                {currentItem.notes && (
                    <p className="gs-exercise__spec">{currentItem.notes}</p>
                )}
                <InstructionsPanel exerciseId={currentExercise.id} />
            </div>

            {currentItem.type === 'timed' ? (
                <TimedExercise
                    key={`${exerciseIndex}-timed`}
                    item={currentItem}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                />
            ) : (
                <RepExercise
                    key={`${exerciseIndex}-reps`}
                    item={currentItem}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                />
            )}

            <style>{`
        .gr-timed-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem; padding: 1rem 1.5rem;
        }

        .gr-ring {
          position: relative; width: 160px; height: 160px;
          display: flex; align-items: center; justify-content: center;
        }

        .gr-ring__svg {
          position: absolute; inset: 0; width: 100%; height: 100%;
          transform: rotate(-90deg);
        }

        .gr-ring__time {
          font-size: 2.5rem; font-variant-numeric: tabular-nums;
          color: var(--p-text); font-family: var(--p-font-display);
          letter-spacing: -0.02em;
        }

        .gr-pause-btn {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 8px; padding: 0.45rem 1.25rem;
          color: var(--p-muted); font-size: 0.8rem; font-family: var(--p-font-body);
          cursor: pointer; transition: all 0.15s ease;
        }
        .gr-pause-btn:hover { color: var(--p-text); border-color: var(--p-muted); }

        .gr-reps-center {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.25rem; padding: 2rem 1.5rem;
        }

        .gr-reps-target {
          font-family: var(--p-font-display); font-size: 6rem;
          font-weight: 400; color: var(--p-accent); line-height: 1;
          letter-spacing: -0.03em;
        }

        .gr-reps-label {
          font-size: 0.8rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--p-muted);
        }
      `}</style>
        </div>
    )
}