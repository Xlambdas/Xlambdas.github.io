import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pencil, Trash2, Clock } from 'lucide-react'
import { useRoutines } from '../hooks/useRoutines'
import { useExercises } from '../hooks/useExercises'
import type { RoutineCategory, RoutineVariant } from '../types/routine'

const CATEGORY_LABELS: Record<RoutineCategory, string> = {
    morning: 'Morning',
    evening: 'Evening',
    'pre-run': 'Pre-run',
    'pre-hike': 'Pre-hike',
    'pre-climb': 'Pre-climb',
    'post-workout': 'Post-workout',
    recovery: 'Recovery',
    custom: 'Custom',
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m}m ${s}s` : `${m} min`
}

function VariantPanel({
    variant,
    getExercise,
}: {
    variant: RoutineVariant
    getExercise: (id: string) => ReturnType<ReturnType<typeof useExercises>['getById']>
}) {
    return (
        <div className="rd-variant">
            <div className="rd-variant__header">
                <span className="rd-variant__label">{variant.label}</span>
                <span className="rd-variant__duration">
                    <Clock size={12} />
                    {variant.durationMinutes} min
                </span>
            </div>
            <div className="rd-exercise-list">
                {variant.exercises
                    .sort((a, b) => a.order - b.order)
                    .map((item, i) => {
                        const ex = getExercise(item.exerciseId)
                        const spec = item.type === 'timed' && item.durationSeconds
                            ? formatDuration(item.durationSeconds)
                            : item.reps
                                ? `${item.reps} reps`
                                : ''
                        return (
                            <div key={i} className="rd-exercise-row">
                                <span className="rd-exercise-row__num">{i + 1}</span>
                                <div className="rd-exercise-row__body">
                                    <span className="rd-exercise-row__name">{ex?.name ?? item.exerciseId}</span>
                                    {item.notes && (
                                        <span className="rd-exercise-row__note">{item.notes}</span>
                                    )}
                                </div>
                                <span className="rd-exercise-row__spec">{spec}</span>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default function RoutineDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getById: getRoutine, deleteRoutine, loading: routinesLoading } = useRoutines()
    const { getById: getExercise, loading: exercisesLoading } = useExercises()
    const [selectedVariant, setSelectedVariant] = useState(0)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const loading = routinesLoading || exercisesLoading
    const routine = id ? getRoutine(id) : undefined

    if (loading) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Routines
                </button>
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
            </div>
        )
    }

    if (!routine) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <p style={{ color: 'var(--p-muted)', marginTop: '2rem' }}>Routine not found.</p>
            </div>
        )
    }

    async function handleDelete() {
        if (!id) return
        setDeleting(true)
        await deleteRoutine(id)
        navigate('/sandbox/poise/routines', { replace: true })
    }

    const variant = routine.variants[selectedVariant]
    console.log('routine:', routine)
    console.log('variant:', variant)
    console.log('first exerciseId:', variant?.exercises[0]?.exerciseId)
    console.log('getExercise result:', getExercise(variant?.exercises[0]?.exerciseId ?? ''))

    return (
        <div className="poise-page">
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Routines
            </button>

            {/* Header */}
            <div className="detail-header">
                <div className="detail-header__top">
                    <div>
                        <span className="detail-category">{CATEGORY_LABELS[routine.category]}</span>
                        {routine.isCustom && <span className="detail-custom-badge">custom</span>}
                    </div>
                    {routine.isCustom && (
                        <div className="detail-actions">
                            <button
                                className="detail-action-btn"
                                onClick={() => navigate(`/sandbox/poise/routines/${routine.id}/edit`)}
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                className="detail-action-btn detail-action-btn--danger"
                                onClick={() => setConfirmDelete(true)}
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    )}
                </div>
                <h1 className="detail-name">{routine.name}</h1>
                {routine.description && (
                    <p className="rd-description">{routine.description}</p>
                )}
            </div>

            {/* Delete confirmation */}
            {confirmDelete && (
                <div className="detail-confirm">
                    <p className="detail-confirm__text">
                        Delete <strong>{routine.name}</strong>? This cannot be undone.
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

            {/* Variant picker */}
            {routine.variants.length > 1 && (
                <div className="rd-variants-row">
                    {routine.variants.map((v, i) => (
                        <button
                            key={v.id}
                            className={['rd-variant-tab', i === selectedVariant ? 'rd-variant-tab--active' : ''].join(' ')}
                            onClick={() => setSelectedVariant(i)}
                        >
                            <span>{v.label}</span>
                            <span className="rd-variant-tab__duration">{v.durationMinutes} min</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Start button */}
            <button
                className="rd-start-btn"
                onClick={() => navigate(`/sandbox/poise/routines/${routine.id}/go/${variant.id}`)}
            >
                <Play size={16} fill="currentColor" />
                Start {variant.label} · {variant.durationMinutes} min
            </button>

            {/* Exercise list for selected variant */}
            <VariantPanel variant={variant} getExercise={getExercise} />

            {/* Tags */}
            {routine.tags.length > 0 && (
                <div className="detail-section" style={{ marginTop: '1rem' }}>
                    <h2 className="detail-section__title">Tags</h2>
                    <div className="detail-tags">
                        {routine.tags.map(tag => (
                            <span key={tag} className="detail-tag">{tag}</span>
                        ))}
                    </div>
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
          font-size: 0.65rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--p-accent); margin-right: 0.5rem;
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
        .detail-confirm__text { font-size: 0.875rem; color: var(--p-text); margin-bottom: 0.75rem; }
        .detail-confirm__actions { display: flex; gap: 0.5rem; }
        .detail-confirm__btn {
          padding: 0.45rem 1rem; border-radius: 7px; font-size: 0.8rem;
          font-weight: 600; cursor: pointer; font-family: var(--p-font-body); border: none;
        }
        .detail-confirm__btn--cancel { background: var(--p-border); color: var(--p-text); }
        .detail-confirm__btn--delete { background: #E8734A; color: #fff; }
        .detail-confirm__btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .detail-name {
          font-family: var(--p-font-display); font-size: 1.75rem;
          font-weight: 400; color: var(--p-text); margin: 0; line-height: 1.2;
        }

        .rd-description { font-size: 0.875rem; color: var(--p-muted); margin: 0; line-height: 1.5; }

        .rd-variants-row {
          display: flex; gap: 0.5rem; margin-bottom: 1rem;
        }

        .rd-variant-tab {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          padding: 0.6rem 0.5rem; border-radius: 8px;
          border: 1px solid var(--p-border); background: transparent;
          cursor: pointer; font-family: var(--p-font-body); transition: all 0.15s ease;
          font-size: 0.85rem; font-weight: 600; color: var(--p-muted);
        }
        .rd-variant-tab:hover { border-color: var(--p-muted); color: var(--p-text); }
        .rd-variant-tab--active {
          border-color: var(--p-accent); color: var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 8%, transparent);
        }
        .rd-variant-tab__duration { font-size: 0.65rem; font-weight: 400; opacity: 0.8; }

        .rd-start-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; padding: 0.85rem; border-radius: 10px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s ease; margin-bottom: 1.25rem;
        }
        .rd-start-btn:hover { opacity: 0.9; }

        .rd-variant {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 10px; overflow: hidden;
        }

        .rd-variant__header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-border);
        }

        .rd-variant__label {
          font-size: 0.7rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--p-muted); font-weight: 600;
        }

        .rd-variant__duration {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.75rem; color: var(--p-muted);
        }

        .rd-exercise-list { display: flex; flex-direction: column; }

        .rd-exercise-row {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.65rem 1rem; border-bottom: 1px solid var(--p-border);
        }
        .rd-exercise-row:last-child { border-bottom: none; }

        .rd-exercise-row__num {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
          background: var(--p-border); color: var(--p-accent);
          font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }

        .rd-exercise-row__body { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
        .rd-exercise-row__name { font-size: 0.875rem; color: var(--p-text); font-weight: 500; }
        .rd-exercise-row__note { font-size: 0.75rem; color: var(--p-muted); font-style: italic; }
        .rd-exercise-row__spec { font-size: 0.8rem; color: var(--p-accent); flex-shrink: 0; }

        .detail-section { margin-bottom: 1.5rem; }
        .detail-section__title {
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--p-muted); margin-bottom: 0.6rem; font-weight: 600;
        }
        .detail-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .detail-tag {
          font-size: 0.75rem; padding: 0.25rem 0.65rem; border-radius: 4px;
          background: var(--p-border); color: var(--p-muted); letter-spacing: 0.04em;
        }
      `}</style>
        </div>
    )
}