import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, RotateCcw, Tag, Pencil, Trash2 } from 'lucide-react'
import { useExercises } from '../hooks/useExercises'
import type { ExerciseCategory } from '../types/exercise'

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
    strength: 'Strength',
    skill: 'Skill',
    mobility: 'Mobility',
    endurance: 'Endurance',
    recovery: 'Recovery',
    warmup: 'Warm-up',
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m}m ${s}s` : `${m} min`
}

const DifficultyBar = ({ level }: { level: number }) => (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                style={{
                    display: 'inline-block',
                    width: 24,
                    height: 4,
                    borderRadius: 2,
                    background: i < level ? 'var(--p-accent)' : 'var(--p-border)',
                }}
            />
        ))}
        <span style={{ fontSize: '0.75rem', color: 'var(--p-muted)', marginLeft: 4 }}>
            {['', 'Beginner', 'Easy', 'Intermediate', 'Hard', 'Advanced'][level]}
        </span>
    </div>
)

export default function ExerciseDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getById, deleteExercise, loading } = useExercises()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const exercise = id ? getById(id) : undefined

    if (loading) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Exercises
                </button>
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
            </div>
        )
    }

    if (!exercise) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <p style={{ color: 'var(--p-muted)', marginTop: '2rem' }}>Exercise not found.</p>
            </div>
        )
    }

    async function handleDelete() {
        if (!id) return
        setDeleting(true)
        await deleteExercise(id)
        navigate('/sandbox/poise/exercises', { replace: true })
    }

    const defaultInfo = [
        exercise.defaultSets && exercise.defaultReps
            ? `${exercise.defaultSets} × ${exercise.defaultReps} reps`
            : null,
        exercise.defaultSets && exercise.duration && exercise.type === 'timed'
            ? `${exercise.defaultSets} × ${formatDuration(exercise.duration)}`
            : null,
        exercise.type === 'duration' && exercise.duration
            ? formatDuration(exercise.duration)
            : null,
    ].filter(Boolean)

    return (
        <div className="poise-page">
            {/* Back */}
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                <span>Exercises</span>
            </button>

            {/* Header */}
            <div className="detail-header">
                <div className="detail-header__top">
                    <div>
                        <span className="detail-category">{CATEGORY_LABELS[exercise.category]}</span>
                        {exercise.isCustom && (
                            <span className="detail-custom-badge">custom</span>
                        )}
                    </div>
                    {/* Edit / Delete — only for custom exercises */}
                    {exercise.isCustom && (
                        <div className="detail-actions">
                            <button
                                className="detail-action-btn"
                                onClick={() => navigate(`/sandbox/poise/exercises/${exercise.id}/edit`)}
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
                <h1 className="detail-name">{exercise.name}</h1>
                <DifficultyBar level={exercise.difficulty} />
            </div>

            {/* Delete confirmation */}
            {confirmDelete && (
                <div className="detail-confirm">
                    <p className="detail-confirm__text">
                        Delete <strong>{exercise.name}</strong>? This cannot be undone.
                    </p>
                    <div className="detail-confirm__actions">
                        <button
                            className="detail-confirm__btn detail-confirm__btn--cancel"
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="detail-confirm__btn detail-confirm__btn--delete"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}

            {/* Quick stats */}
            <div className="detail-stats">
                {defaultInfo.length > 0 && (
                    <div className="detail-stat">
                        <RotateCcw size={14} color="var(--p-accent)" />
                        <span>{defaultInfo[0]}</span>
                    </div>
                )}
                {exercise.equipment.filter(e => e !== 'none').length > 0 && (
                    <div className="detail-stat">
                        <Tag size={14} color="var(--p-accent)" />
                        <span>{exercise.equipment.join(', ')}</span>
                    </div>
                )}
                {exercise.type === 'duration' && exercise.duration && (
                    <div className="detail-stat">
                        <Clock size={14} color="var(--p-accent)" />
                        <span>{formatDuration(exercise.duration)}</span>
                    </div>
                )}
            </div>

            {/* Target areas */}
            <div className="detail-section">
                <h2 className="detail-section__title">Target areas</h2>
                <div className="detail-tags">
                    {exercise.targetAreas.map(area => (
                        <span key={area} className="detail-tag">{area}</span>
                    ))}
                </div>
            </div>

            {/* Instructions */}
            {exercise.instructions.length > 0 && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Instructions</h2>
                    <ol className="detail-instructions">
                        {exercise.instructions.map((step, i) => (
                            <li key={i} className="detail-instruction">
                                <span className="detail-instruction__num">{i + 1}</span>
                                <span className="detail-instruction__text">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Coaching cues */}
            {exercise.cues.length > 0 && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Coaching cues</h2>
                    <div className="detail-cues">
                        {exercise.cues.map(cue => (
                            <span key={cue} className="detail-cue">— {cue}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Contraindications */}
            {exercise.contraindications && exercise.contraindications.length > 0 && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Precautions</h2>
                    <div className="detail-caution">
                        {exercise.contraindications.map(c => (
                            <span key={c} className="detail-caution__item">⚠ {c}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            {exercise.notes && (
                <div className="detail-section">
                    <h2 className="detail-section__title">Notes</h2>
                    <p className="detail-notes">{exercise.notes}</p>
                </div>
            )}

            <style>{`
        .detail-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          color: var(--p-muted);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
          margin-bottom: 1.5rem;
          font-family: var(--p-font-body);
          transition: color 0.15s ease;
          letter-spacing: 0.04em;
        }
        .detail-back:hover { color: var(--p-text); }

        .detail-header {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-header__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-category {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--p-accent);
          margin-right: 0.5rem;
        }

        .detail-custom-badge {
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--p-accent);
          color: var(--p-accent);
        }

        .detail-actions {
          display: flex;
          gap: 0.5rem;
        }

        .detail-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--p-border);
          background: transparent;
          color: var(--p-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .detail-action-btn:hover {
          color: var(--p-text);
          border-color: var(--p-muted);
        }
        .detail-action-btn--danger:hover {
          color: #E8734A;
          border-color: #E8734A;
        }

        .detail-confirm {
          padding: 1rem;
          border: 1px solid #E8734A;
          border-radius: 10px;
          background: color-mix(in srgb, #E8734A 8%, transparent);
          margin-bottom: 1.5rem;
        }

        .detail-confirm__text {
          font-size: 0.875rem;
          color: var(--p-text);
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .detail-confirm__actions {
          display: flex;
          gap: 0.5rem;
        }

        .detail-confirm__btn {
          padding: 0.45rem 1rem;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--p-font-body);
          transition: opacity 0.15s ease;
          border: none;
        }
        .detail-confirm__btn--cancel {
          background: var(--p-border);
          color: var(--p-text);
        }
        .detail-confirm__btn--delete {
          background: #E8734A;
          color: #fff;
        }
        .detail-confirm__btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .detail-name {
          font-family: var(--p-font-display);
          font-size: 1.75rem;
          font-weight: 400;
          color: var(--p-text);
          margin: 0;
          line-height: 1.2;
        }

        .detail-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem;
          background: var(--p-surface);
          border: 1px solid var(--p-border);
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .detail-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--p-text);
        }

        .detail-section { margin-bottom: 1.5rem; }

        .detail-section__title {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--p-muted);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .detail-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

        .detail-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.65rem;
          border-radius: 4px;
          background: var(--p-border);
          color: var(--p-muted);
          letter-spacing: 0.04em;
        }

        .detail-instructions {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-instruction {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .detail-instruction__num {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--p-border);
          color: var(--p-accent);
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-instruction__text {
          font-size: 0.9rem;
          color: var(--p-text);
          line-height: 1.6;
          padding-top: 2px;
        }

        .detail-cues { display: flex; flex-direction: column; gap: 0.4rem; }

        .detail-cue {
          font-size: 0.85rem;
          color: var(--p-text);
          font-style: italic;
          padding: 0.4rem 0.75rem;
          border-left: 2px solid var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 5%, transparent);
        }

        .detail-caution { display: flex; flex-direction: column; gap: 0.4rem; }

        .detail-caution__item {
          font-size: 0.85rem;
          color: #E8734A;
          padding: 0.4rem 0.75rem;
          border-left: 2px solid #E8734A;
          background: color-mix(in srgb, #E8734A 8%, transparent);
        }

        .detail-notes {
          font-size: 0.875rem;
          color: var(--p-muted);
          line-height: 1.6;
          font-style: italic;
        }
      `}</style>
        </div>
    )
}