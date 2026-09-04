import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Pencil, Trash2, Play, Layers } from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import { useExercises } from '../hooks/useExercises'
import type { SessionBlock, SessionCategory } from '../types/session'

const CATEGORY_LABELS: Record<SessionCategory, string> = {
    calisthenics: 'Calisthenics',
    strength: 'Strength',
    mobility: 'Mobility',
    endurance: 'Endurance',
    hiit: 'HIIT',
    recovery: 'Recovery',
    hiking: 'Hiking',
    cycling: 'Cycling',
    swimming: 'Swimming',
    climbing: 'Climbing',
    running: 'Running',
    'morning-routine': 'Morning Routine',
    'evening-routine': 'Evening Routine',
    custom: 'Custom',
}

const BLOCK_LABELS: Record<SessionBlock, string> = {
    'warm-up': 'Warm-up',
    skill: 'Skill',
    strength: 'Strength',
    pull: 'Pull',
    push: 'Push',
    legs: 'Legs',
    core: 'Core',
    cooldown: 'Cooldown',
    cardio: 'Cardio',
    free: 'Free',
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m}m ${s}s` : `${m} min`
}

function formatExerciseSpec(
    sets?: number,
    reps?: number,
    duration?: number,
    rest?: number
): string {
    const parts: string[] = []
    if (sets && reps) parts.push(`${sets} × ${reps} reps`)
    else if (sets && duration) parts.push(`${sets} × ${formatDuration(duration)}`)
    else if (duration) parts.push(formatDuration(duration))
    if (rest) parts.push(`${formatDuration(rest)} rest`)
    return parts.join(' · ')
}

const DifficultyBar = ({ level }: { level: number }) => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{
                display: 'inline-block', width: 24, height: 4, borderRadius: 2,
                background: i < level ? 'var(--p-accent)' : 'var(--p-border)',
            }} />
        ))}
        <span style={{ fontSize: '0.75rem', color: 'var(--p-muted)', marginLeft: 4 }}>
            {['', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Advanced'][level]}
        </span>
    </div>
)

export default function SessionDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getById: getSession, deleteSession, loading: sessionsLoading } = useSessions()
    const { getById: getExercise, loading: exercisesLoading } = useExercises()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const loading = sessionsLoading || exercisesLoading
    const session = id ? getSession(id) : undefined

    if (loading) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Sessions
                </button>
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <p style={{ color: 'var(--p-muted)', marginTop: '2rem' }}>Session not found.</p>
            </div>
        )
    }

    // Group exercises by block, preserving order
    const blocks = session.exercises.reduce<Record<string, typeof session.exercises>>(
        (acc, ex) => {
            const key = ex.block
            if (!acc[key]) acc[key] = []
            acc[key].push(ex)
            return acc
        },
        {}
    )

    async function handleDelete() {
        if (!id) return
        setDeleting(true)
        await deleteSession(id)
        navigate('/sandbox/poise/sessions', { replace: true })
    }

    return (
        <div className="poise-page">
            {/* Back */}
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Sessions
            </button>

            {/* Header */}
            <div className="detail-header">
                <div className="detail-header__top">
                    <div>
                        <span className="detail-category">{CATEGORY_LABELS[session.category]}</span>
                        {session.isCustom && <span className="detail-custom-badge">custom</span>}
                    </div>
                    {session.isCustom && (
                        <div className="detail-actions">
                            <button
                                className="detail-action-btn"
                                onClick={() => navigate(`/sandbox/poise/sessions/${session.id}/edit`)}
                                title="Edit"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                className="detail-action-btn detail-action-btn--danger"
                                onClick={() => setConfirmDelete(true)}
                                title="Delete"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    )}
                </div>
                <h1 className="detail-name">{session.name}</h1>
                <DifficultyBar level={session.difficulty} />
            </div>

            {/* Delete confirmation */}
            {confirmDelete && (
                <div className="detail-confirm">
                    <p className="detail-confirm__text">
                        Delete <strong>{session.name}</strong>? This cannot be undone.
                    </p>
                    <div className="detail-confirm__actions">
                        <button className="detail-confirm__btn detail-confirm__btn--cancel" onClick={() => setConfirmDelete(false)}>
                            Cancel
                        </button>
                        <button className="detail-confirm__btn detail-confirm__btn--delete" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}

            {/* Stats row */}
            <div className="detail-stats">
                <div className="detail-stat">
                    <Clock size={14} color="var(--p-accent)" />
                    <span>{session.estimatedDuration} min</span>
                </div>
                <div className="detail-stat">
                    <Layers size={14} color="var(--p-accent)" />
                    <span>{session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Start button */}
            <button
                className="sd-start-btn"
                onClick={() => navigate(`/sandbox/poise/sessions/${session.id}/go`)}
            >
                <Play size={16} fill="currentColor" />
                Start session
            </button>

            {/* Exercises by block */}
            {Object.entries(blocks).map(([block, items]) => (
                <div key={block} className="detail-section">
                    <h2 className="detail-section__title">{BLOCK_LABELS[block as SessionBlock]}</h2>
                    <div className="sd-exercise-list">
                        {items
                            .sort((a, b) => a.order - b.order)
                            .map(item => {
                                const exercise = getExercise(item.exerciseId)
                                if (!exercise) return null
                                const spec = formatExerciseSpec(item.sets, item.reps, item.duration, item.rest)
                                return (
                                    <button
                                        key={item.exerciseId}
                                        className="sd-exercise-row"
                                        onClick={() => navigate(`/sandbox/poise/exercises/${exercise.id}`)}
                                    >
                                        <div className="sd-exercise-row__body">
                                            <span className="sd-exercise-row__name">{exercise.name}</span>
                                            {spec && <span className="sd-exercise-row__spec">{spec}</span>}
                                            {item.notes && <span className="sd-exercise-row__note">{item.notes}</span>}
                                        </div>
                                        <ArrowLeft size={13} color="var(--p-muted)" style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                )
                            })}
                    </div>
                </div>
            ))}

            {/* Tags */}
            {session.tags.length > 0 && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Tags</h2>
                    <div className="detail-tags">
                        {session.tags.map(tag => (
                            <span key={tag} className="detail-tag">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            {session.notes && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Notes</h2>
                    <p className="detail-notes">{session.notes}</p>
                </div>
            )}

            <style>{`
        .detail-back {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: none; border: none; color: var(--p-muted);
          font-size: 0.8rem; cursor: pointer; padding: 0;
          margin-bottom: 1.5rem; font-family: var(--p-font-body);
          transition: color 0.15s ease; letter-spacing: 0.04em;
        }
        .detail-back:hover { color: var(--p-text); }

        .detail-header { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .detail-header__top { display: flex; align-items: center; justify-content: space-between; }

        .detail-category {
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--p-accent); margin-right: 0.5rem;
        }
        .detail-custom-badge {
          font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.1rem 0.4rem; border-radius: 4px;
          border: 1px solid var(--p-accent); color: var(--p-accent);
        }
        .detail-actions { display: flex; gap: 0.5rem; }
        .detail-action-btn {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid var(--p-border); background: transparent;
          color: var(--p-muted); cursor: pointer; transition: all 0.15s ease;
        }
        .detail-action-btn:hover { color: var(--p-text); border-color: var(--p-muted); }
        .detail-action-btn--danger:hover { color: #E8734A; border-color: #E8734A; }

        .detail-confirm {
          padding: 1rem; border: 1px solid #E8734A; border-radius: 10px;
          background: color-mix(in srgb, #E8734A 8%, transparent); margin-bottom: 1.5rem;
        }
        .detail-confirm__text { font-size: 0.875rem; color: var(--p-text); margin-bottom: 0.75rem; line-height: 1.5; }
        .detail-confirm__actions { display: flex; gap: 0.5rem; }
        .detail-confirm__btn {
          padding: 0.45rem 1rem; border-radius: 7px; font-size: 0.8rem;
          font-weight: 600; cursor: pointer; font-family: var(--p-font-body);
          transition: opacity 0.15s ease; border: none;
        }
        .detail-confirm__btn--cancel { background: var(--p-border); color: var(--p-text); }
        .detail-confirm__btn--delete { background: #E8734A; color: #fff; }
        .detail-confirm__btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .detail-name {
          font-family: var(--p-font-display); font-size: 1.75rem;
          font-weight: 400; color: var(--p-text); margin: 0; line-height: 1.2;
        }

        .detail-stats {
          display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem;
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 10px; margin-bottom: 1rem;
        }
        .detail-stat { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--p-text); }

        .sd-start-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.85rem; border-radius: 10px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s ease; margin-bottom: 1.5rem;
        }
        .sd-start-btn:hover { opacity: 0.9; }

        .detail-section { margin-bottom: 1.5rem; }
        .detail-section__title {
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--p-muted); margin-bottom: 0.6rem; font-weight: 600;
        }

        .sd-exercise-list { display: flex; flex-direction: column; gap: 0.4rem; }

        .sd-exercise-row {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem; background: var(--p-surface);
          border: 1px solid var(--p-border); border-radius: 8px;
          cursor: pointer; text-align: left; font-family: var(--p-font-body);
          transition: border-color 0.15s ease;
        }
        .sd-exercise-row:hover { border-color: var(--p-muted); }

        .sd-exercise-row__body { display: flex; flex-direction: column; gap: 0.2rem; }

        .sd-exercise-row__name { font-size: 0.9rem; color: var(--p-text); font-weight: 500; }
        .sd-exercise-row__spec { font-size: 0.75rem; color: var(--p-accent); }
        .sd-exercise-row__note { font-size: 0.75rem; color: var(--p-muted); font-style: italic; }

        .detail-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .detail-tag {
          font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px;
          background: var(--p-border); color: var(--p-muted); letter-spacing: 0.04em;
        }
        .detail-notes { font-size: 0.875rem; color: var(--p-muted); line-height: 1.6; font-style: italic; }
      `}</style>
        </div>
    )
}