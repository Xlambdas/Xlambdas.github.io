import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Plus, Clock } from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import type { SessionCategory } from '../types/session'

const CATEGORY_LABELS: Record<SessionCategory | 'all', string> = {
    all: 'All',
    calisthenics: 'Calisthenics',
    strength: 'Strength',
    mobility: 'Mobility',
    endurance: 'Endurance',
    running: 'Running',
    hiit: 'HIIT',
    recovery: 'Recovery',
    hiking: 'Hiking',
    cycling: 'Cycling',
    swimming: 'Swimming',
    climbing: 'Climbing',
    'morning-routine': 'Morning',
    'evening-routine': 'Evening',
    custom: 'Custom',
}

const CATEGORY_FILTER: (SessionCategory | 'all')[] = [
    'all', 'calisthenics', 'strength', 'mobility', 'endurance',
    'running', 'recovery', 'hiking', 'cycling', 'swimming', 'climbing',
    'morning-routine', 'evening-routine',
]

const DifficultyDots = ({ level }: { level: number }) => (
    <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{
                display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                background: i < level ? 'var(--p-accent)' : 'var(--p-border)',
            }} />
        ))}
    </span>
)

export default function SessionsPage() {
    const navigate = useNavigate()
    const { sessions, loading } = useSessions()
    const [activeCategory, setActiveCategory] = useState<SessionCategory | 'all'>('all')

    const filtered = activeCategory === 'all'
        ? sessions
        : sessions.filter(s => s.category === activeCategory)

    return (
        <div className="poise-page">
            <div className="sx-header">
                <h1 className="poise-page__title" style={{ margin: 0 }}>Sessions</h1>
                <button className="sx-new-btn" onClick={() => navigate('/sandbox/poise/sessions/new')}>
                    <Plus size={16} /> New
                </button>
            </div>

            {/* Category filter */}
            <div className="sx-filters">
                {CATEGORY_FILTER.map(cat => (
                    <button
                        key={cat}
                        className={['sx-filter-btn', activeCategory === cat ? 'sx-filter-btn--active' : ''].join(' ')}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {loading && <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>}

            {!loading && (
                <ul className="sx-list">
                    {filtered.map(session => (
                        <li key={session.id}>
                            <button
                                className="sx-card"
                                onClick={() => navigate(`/sandbox/poise/sessions/${session.id}`)}
                            >
                                <div className="sx-card__body">
                                    <div className="sx-card__meta">
                                        <span className="sx-card__category">{CATEGORY_LABELS[session.category]}</span>
                                        <DifficultyDots level={session.difficulty} />
                                        {session.isCustom && <span className="sx-custom-badge">custom</span>}
                                    </div>
                                    <span className="sx-card__name">{session.name}</span>
                                    <div className="sx-card__info">
                                        <span className="sx-card__duration">
                                            <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                                            {session.estimatedDuration} min
                                        </span>
                                        <span className="sx-card__count">
                                            {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight size={16} color="var(--p-muted)" />
                            </button>
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li><p className="poise-page__empty">No sessions in this category yet.</p></li>
                    )}
                </ul>
            )}

            <style>{`
        .sx-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .sx-new-btn {
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
          transition: opacity 0.15s ease;
        }
        .sx-new-btn:hover { opacity: 0.85; }

        .sx-filters {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          scrollbar-width: none;
        }
        .sx-filters::-webkit-scrollbar { display: none; }

        .sx-filter-btn {
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
        .sx-filter-btn:hover { color: var(--p-text); border-color: var(--p-muted); }
        .sx-filter-btn--active {
          background: var(--p-accent);
          border-color: var(--p-accent);
          color: #0D0D0D;
          font-weight: 600;
        }

        .sx-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sx-card {
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
        .sx-card:hover { border-color: var(--p-muted); }

        .sx-card__body {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .sx-card__meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .sx-card__category {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--p-muted);
        }

        .sx-custom-badge {
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--p-accent);
          color: var(--p-accent);
        }

        .sx-card__name {
          font-size: 1rem;
          color: var(--p-text);
          font-weight: 500;
        }

        .sx-card__info {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .sx-card__duration,
        .sx-card__count {
          font-size: 0.75rem;
          color: var(--p-muted);
          display: flex;
          align-items: center;
        }
      `}</style>
        </div>
    )
}