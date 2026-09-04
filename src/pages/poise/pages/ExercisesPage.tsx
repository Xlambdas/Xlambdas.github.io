import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus } from 'lucide-react'
import { useExercises } from '../hooks/useExercises'
import type { ExerciseCategory } from '../types/exercise'

const CATEGORY_LABELS: Record<ExerciseCategory | 'all', string> = {
    all: 'All',
    strength: 'Strength',
    skill: 'Skill',
    mobility: 'Mobility',
    endurance: 'Endurance',
    recovery: 'Recovery',
    warmup: 'Warm-up',
}

const DifficultyDots = ({ level }: { level: number }) => (
    <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                style={{
                    display: 'inline-block',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: i < level ? 'var(--p-accent)' : 'var(--p-border)',
                }}
            />
        ))}
    </span>
)

export default function ExercisesPage() {
    const navigate = useNavigate()
    const { exercises, loading } = useExercises()
    const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'all'>('all')

    const categories: (ExerciseCategory | 'all')[] = [
        'all', 'strength', 'skill', 'mobility', 'warmup', 'endurance', 'recovery',
    ]

    const filtered = activeCategory === 'all'
        ? exercises
        : exercises.filter(e => e.category === activeCategory)

    return (
        <div className="poise-page">
            {/* Header row */}
            <div className="ex-header">
                <h1 className="poise-page__title" style={{ margin: 0 }}>Exercises</h1>
                <button
                    className="ex-new-btn"
                    onClick={() => navigate('/sandbox/poise/exercises/new')}
                >
                    <Plus size={16} />
                    New
                </button>
            </div>

            {/* Category filter */}
            <div className="ex-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={['ex-filter-btn', activeCategory === cat ? 'ex-filter-btn--active' : ''].join(' ')}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
            )}

            {/* Exercise list */}
            {!loading && (
                <ul className="ex-list">
                    {filtered.map(exercise => (
                        <li key={exercise.id}>
                            <button
                                className="ex-card"
                                onClick={() => navigate(`/sandbox/poise/exercises/${exercise.id}`)}
                            >
                                <div className="ex-card__body">
                                    <div className="ex-card__meta">
                                        <span className="ex-card__category">{CATEGORY_LABELS[exercise.category]}</span>
                                        <DifficultyDots level={exercise.difficulty} />
                                        {exercise.isCustom && (
                                            <span className="ex-custom-badge">custom</span>
                                        )}
                                    </div>
                                    <span className="ex-card__name">{exercise.name}</span>
                                    <div className="ex-card__tags">
                                        {exercise.equipment.filter(e => e !== 'none').map(eq => (
                                            <span key={eq} className="ex-tag ex-tag--equipment">{eq}</span>
                                        ))}
                                        {exercise.targetAreas.slice(0, 2).map(area => (
                                            <span key={area} className="ex-tag">{area}</span>
                                        ))}
                                    </div>
                                </div>
                                <ChevronRight size={16} color="var(--p-muted)" />
                            </button>
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li>
                            <p className="poise-page__empty">No exercises in this category yet.</p>
                        </li>
                    )}
                </ul>
            )}

            <style>{`
        .ex-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .ex-new-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          border: none;
          background: var(--p-accent);
          color: #0D0D0D;
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--p-font-body);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: opacity 0.15s ease;
        }
        .ex-new-btn:hover { opacity: 0.85; }

        .ex-filters {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          scrollbar-width: none;
        }
        .ex-filters::-webkit-scrollbar { display: none; }

        .ex-filter-btn {
          flex-shrink: 0;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          border: 1px solid var(--p-border);
          background: transparent;
          color: var(--p-muted);
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--p-font-body);
        }
        .ex-filter-btn:hover { color: var(--p-text); border-color: var(--p-muted); }
        .ex-filter-btn--active {
          background: var(--p-accent);
          border-color: var(--p-accent);
          color: #0D0D0D;
          font-weight: 600;
        }

        .ex-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ex-card {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--p-surface);
          border: 1px solid var(--p-border);
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease;
          font-family: var(--p-font-body);
        }
        .ex-card:hover { border-color: var(--p-muted); }

        .ex-card__body {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .ex-card__meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ex-card__category {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--p-muted);
        }

        .ex-custom-badge {
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--p-accent);
          color: var(--p-accent);
        }

        .ex-card__name {
          font-size: 1rem;
          color: var(--p-text);
          font-weight: 500;
        }

        .ex-card__tags {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .ex-tag {
          font-size: 0.65rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          background: var(--p-border);
          color: var(--p-muted);
          letter-spacing: 0.04em;
        }
        .ex-tag--equipment {
          color: var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 10%, transparent);
        }
      `}</style>
        </div>
    )
}