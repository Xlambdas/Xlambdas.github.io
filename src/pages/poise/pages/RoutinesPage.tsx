import { useNavigate } from 'react-router-dom'
import { Plus, Clock, Layers, Sunrise, Moon, PersonStanding, Mountain, Trophy, Snowflake, RefreshCw, Settings } from 'lucide-react'
import { useRoutines } from '../hooks/useRoutines'
import type { RoutineCategory } from '../types/routine'

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

const CATEGORY_ICON: Record<RoutineCategory, React.ReactNode> = {
    morning: <Sunrise size={20} strokeWidth={1.5} />,
    evening: <Moon size={20} strokeWidth={1.5} />,
    'pre-run': <PersonStanding size={20} strokeWidth={1.5} />,
    'pre-hike': <Mountain size={20} strokeWidth={1.5} />,
    'pre-climb': <Trophy size={20} strokeWidth={1.5} />,
    'post-workout': <Snowflake size={20} strokeWidth={1.5} />,
    recovery: <RefreshCw size={20} strokeWidth={1.5} />,
    custom: <Settings size={20} strokeWidth={1.5} />,
}

export default function RoutinesPage() {
    const navigate = useNavigate()
    const { routines, loading } = useRoutines()

    return (
        <div className="poise-page">
            <div className="rx-header">
                <h1 className="poise-page__title" style={{ margin: 0 }}>Routines</h1>
                <button className="rx-new-btn" onClick={() => navigate('/sandbox/poise/routines/new')}>
                    <Plus size={16} /> New
                </button>
            </div>

            {loading && <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>}

            {!loading && (
                <ul className="rx-list">
                    {routines.map(routine => {
                        const minDuration = Math.min(...routine.variants.map(v => v.durationMinutes))
                        const maxDuration = Math.max(...routine.variants.map(v => v.durationMinutes))
                        const durationStr = minDuration === maxDuration
                            ? `${minDuration} min`
                            : `${minDuration}–${maxDuration} min`

                        return (
                            <li key={routine.id}>
                                <button
                                    className="rx-card"
                                    onClick={() => navigate(`/sandbox/poise/routines/${routine.id}`)}
                                >
                                    <div className="rx-card__icon">
                                        {CATEGORY_ICON[routine.category]}
                                    </div>
                                    <div className="rx-card__body">
                                        <div className="rx-card__meta">
                                            <span className="rx-card__category">{CATEGORY_LABELS[routine.category]}</span>
                                            {routine.isCustom && <span className="rx-custom-badge">custom</span>}
                                        </div>
                                        <span className="rx-card__name">{routine.name}</span>
                                        {routine.description && (
                                            <span className="rx-card__desc">{routine.description}</span>
                                        )}
                                        <div className="rx-card__info">
                                            <span className="rx-card__duration">
                                                <Clock size={12} style={{ display: 'inline', marginRight: 3 }} />
                                                {durationStr}
                                            </span>
                                            <span className="rx-card__variants">
                                                <Layers size={12} style={{ display: 'inline', marginRight: 3 }} />
                                                {routine.variants.map(v => v.label).join(' · ')}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                    {routines.length === 0 && (
                        <li><p className="poise-page__empty">No routines yet. Create your first one.</p></li>
                    )}
                </ul>
            )}

            <style>{`
        .rx-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 1.25rem;
        }
        .rx-new-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.45rem 0.9rem; border-radius: 8px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.8rem;
          font-weight: 700; font-family: var(--p-font-body);
          cursor: pointer; transition: opacity 0.15s ease;
        }
        .rx-new-btn:hover { opacity: 0.85; }

        .rx-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 0.5rem;
        }

        .rx-card {
          width: 100%; display: flex; align-items: flex-start; gap: 1rem;
          padding: 1rem; background: var(--p-surface);
          border: 1px solid var(--p-border); border-radius: 10px;
          cursor: pointer; text-align: left; transition: border-color 0.15s ease;
          font-family: var(--p-font-body);
        }
        .rx-card:hover { border-color: var(--p-muted); }

        .rx-card__icon {
            flex-shrink: 0; color: var(--p-accent);
            width: 36px; height: 36px;
            display: flex; align-items: center; justify-content: center;
            background: color-mix(in srgb, var(--p-accent) 10%, transparent);
            border-radius: 8px; margin-top: 2px;
        }

        .rx-card__body { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }

        .rx-card__meta { display: flex; align-items: center; gap: 0.5rem; }

        .rx-card__category {
          font-size: 0.65rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--p-muted);
        }

        .rx-custom-badge {
          font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.1rem 0.4rem; border-radius: 4px;
          border: 1px solid var(--p-accent); color: var(--p-accent);
        }

        .rx-card__name { font-size: 1rem; color: var(--p-text); font-weight: 500; }

        .rx-card__desc {
          font-size: 0.8rem; color: var(--p-muted); line-height: 1.4;
        }

        .rx-card__info { display: flex; gap: 1rem; align-items: center; margin-top: 0.1rem; }

        .rx-card__duration,
        .rx-card__variants {
          font-size: 0.75rem; color: var(--p-muted); display: flex; align-items: center;
        }
      `}</style>
        </div>
    )
}