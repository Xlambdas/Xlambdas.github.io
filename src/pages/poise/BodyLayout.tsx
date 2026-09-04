import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { CalendarDays, Dumbbell, RefreshCw, Sun, Layers, Settings, Download } from 'lucide-react'
import { db } from './storage/db'
import { SEED_EXERCISES } from './data/exercises'
import { SEED_SESSIONS } from './data/sessions'
import { SEED_ROUTINES } from './data/routines'
import { usePWAInstall } from './hooks/usePWAInstall'

const NAV_ITEMS = [
  { to: '/sandbox/poise/today', label: 'Today', icon: Sun },
  { to: '/sandbox/poise/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/sandbox/poise/sessions', label: 'Sessions', icon: Layers },
  { to: '/sandbox/poise/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/sandbox/poise/routines', label: 'Routines', icon: RefreshCw },
] as const

const IS_LOCAL = window.location.hostname === 'localhost'

async function exportAllData() {
    const [customExercises, customSessions, sessionLogs, customRoutines, calendarEvents, dailyRoutineConfigs, runConfigs, sessionFeedbacks, preferences] =
        await Promise.all([
            db.exercises.getAll(),
            db.sessions.getAll(),
            db.sessionLogs.getAll(),
            db.routines.getAll(),
            db.calendarEvents.getAll(),
            db.dailyRoutineConfigs.getAll(),
            db.runConfigs.getAll(),
            db.sessionFeedbacks.getAll(),
            db.preferences.get(),
        ])

    // Merge seed + custom, deduplicating by id (custom wins on conflict)
    function merge<T extends { id: string }>(seed: T[], custom: T[]): T[] {
        const map = new Map<string, T>()
        seed.forEach(s => map.set(s.id, s))
        custom.forEach(c => map.set(c.id, c))
        return Array.from(map.values())
    }

    const data = {
        exportedAt: new Date().toISOString(),
        exercises: merge(SEED_EXERCISES, customExercises),
        sessions: merge(SEED_SESSIONS, customSessions),
        routines: merge(SEED_ROUTINES, customRoutines),
        sessionLogs,
        calendarEvents,
        dailyRoutineConfigs,
        runConfigs,
        sessionFeedbacks,
        preferences,
    }

    try {
        const res = await fetch('/api/export-seed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        const result = await res.json()
        if (result.ok) {
            alert(`Saved to data files:\n${result.written.join('\n')}`)
        } else {
            throw new Error(result.error)
        }
    } catch (e: any) {
        // Fallback to JSON download if endpoint not available
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `poise-export-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        console.warn('Export endpoint not available, downloaded JSON instead:', e.message)
    }
}

export default function BodyLayout() {
  const navigate = useNavigate()
  const { canInstall, triggerInstall } = usePWAInstall()
  return (
    <div className="poise-root">
      {/* Top bar */}
      <header className="poise-topbar">
        <span className="poise-wordmark">POISE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {IS_LOCAL && (
            <button
              className="poise-settings-btn"
              onClick={exportAllData}
              title="Export data to JSON (localhost only)"
              style={{ color: '#5BA8A0' }}
            >
              <Download size={17} strokeWidth={1.5} />
            </button>
          )}
          {canInstall && (
            <button
              className="bl-topbar-btn"
              onClick={triggerInstall}
              title="Install Poise"
            >
              <Download size={16} />
            </button>
          )}
          <button className="poise-settings-btn" onClick={() => navigate('/sandbox/poise/preferences')}>
            <Settings size={17} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="poise-main">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="poise-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              ['poise-nav__item', isActive ? 'poise-nav__item--active' : ''].join(' ')
            }
          >
            <Icon size={19} strokeWidth={1.5} />
            <span className="poise-nav__label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        /* ── Tokens ── */
        .poise-root {
          --p-bg:      #0D0D0D;
          --p-surface: #1A1A1A;
          --p-text:    #F0EDE8;
          --p-accent:  #E8A842;
          --p-muted:   #4A4540;
          --p-border:  #2A2520;

          --p-font-display: var(--font-primary,  sans-serif);
          --p-font-body:    var(--font-secondary, sans-serif);

          --p-nav-h: 60px;
          --p-top-h: 52px;
        }

        /* ── Shell ── */
        .poise-root {
          display: flex; flex-direction: column;
          height: 100dvh;
          background: var(--p-bg); color: var(--p-text);
          font-family: var(--p-font-body); overflow: hidden;
        }

        .poise-topbar {
          height: var(--p-top-h); display: flex; align-items: center;
          padding: 0 1.25rem; border-bottom: 1px solid var(--p-border); flex-shrink: 0;
        }

        .poise-topbar { justify-content: space-between; }

        .poise-wordmark {
          font-family: var(--p-font-display); font-size: 0.8rem;
          font-weight: 600; letter-spacing: 0.25em; color: var(--p-accent);
        }

        .poise-settings-btn {
          background: none; border: none; color: var(--p-muted);
          cursor: pointer; padding: 0.35rem; border-radius: 7px;
          display: flex; align-items: center; transition: all 0.15s ease;
        }
        .poise-settings-btn:hover { color: var(--p-text); background: var(--p-border); }

        .poise-main { flex: 1; overflow-y: auto; overflow-x: hidden; }

        .poise-nav {
          height: var(--p-nav-h); display: flex; align-items: stretch;
          background: var(--p-surface); border-top: 1px solid var(--p-border); flex-shrink: 0;
        }

        .poise-nav__item {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 3px;
          color: var(--p-muted); text-decoration: none;
          transition: color 0.15s ease; -webkit-tap-highlight-color: transparent;
        }
        .poise-nav__item:hover { color: var(--p-text); }
        .poise-nav__item--active { color: var(--p-accent); }
        .poise-nav__label { font-size: 0.6rem; letter-spacing: 0.06em; text-transform: uppercase; }

        /* ── Shared page styles ── */
        .poise-page { padding: 1.5rem 1.25rem; }
        .poise-page__date {
          font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--p-muted); margin-bottom: 0.5rem;
        }
        .poise-page__title {
          font-family: var(--p-font-display); font-size: 2rem;
          font-weight: 400; color: var(--p-text); margin-bottom: 1.5rem;
        }
        .poise-page__empty { color: var(--p-muted); font-size: 0.9rem; line-height: 1.6; }

        /* ── Guided session — lives here so styles are always injected ── */

        .gs-root {
          position: fixed;
          inset: 0;
          background: var(--p-bg);
          color: var(--p-text);
          font-family: var(--p-font-body);
          display: flex;
          flex-direction: column;
          z-index: 50;
          overflow: hidden;
        }

        .gs-close {
          position: absolute; top: 1rem; right: 1rem;
          background: none; border: none; color: var(--p-muted);
          cursor: pointer; padding: 0.5rem; z-index: 10;
          transition: color 0.15s ease;
        }
        .gs-close:hover { color: var(--p-text); }

        .gs-header {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem 1.25rem 0.75rem; padding-right: 3.5rem; flex-shrink: 0;
        }

        .gs-progress-bar {
          flex: 1; height: 3px; background: var(--p-border);
          border-radius: 2px; overflow: hidden;
        }
        .gs-progress-bar__fill {
          height: 100%; background: var(--p-accent);
          border-radius: 2px; transition: width 0.4s ease;
        }

        .gs-elapsed {
          font-size: 0.75rem; color: var(--p-muted);
          font-variant-numeric: tabular-nums; flex-shrink: 0;
        }

        .gs-phase-label {
          text-align: center; font-size: 0.7rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--p-muted); padding-top: 1.5rem;
        }

        .gs-exercise {
          flex: 1; display: flex; flex-direction: column;
          padding: 1.5rem 1.5rem 1rem; overflow-y: auto;
        }

        .gs-exercise__top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 0.5rem;
        }

        .gs-exercise__block {
          font-size: 0.65rem; letter-spacing: 0.15em;
          color: var(--p-accent); font-weight: 600;
        }

        .gs-exercise__counter { font-size: 0.7rem; color: var(--p-muted); letter-spacing: 0.05em; }

        .gs-exercise__name {
          font-family: var(--p-font-display); font-size: 2.2rem;
          font-weight: 400; color: var(--p-text);
          line-height: 1.15; margin: 0 0 0.5rem;
        }

        .gs-exercise__spec { font-size: 1rem; color: var(--p-muted); margin: 0 0 1.5rem; }

        .gs-exercise__sets-section {
          margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.65rem;
        }

        .gs-exercise__set-label { font-size: 0.75rem; color: var(--p-muted); letter-spacing: 0.06em; }

        .gs-sets { display: flex; gap: 10px; align-items: center; }

        .gs-set-dot {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid var(--p-border); background: transparent;
          transition: all 0.2s ease; display: inline-block;
        }
        .gs-set-dot--done { background: var(--p-accent); border-color: var(--p-accent); }
        .gs-set-dot--active {
          border-color: var(--p-accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--p-accent) 20%, transparent);
        }

        .gs-instructions {
          margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--p-border);
        }

        .gs-instructions__toggle {
          display: flex; align-items: center; gap: 0.4rem;
          background: none; border: none; color: var(--p-muted);
          font-size: 0.8rem; cursor: pointer; padding: 0;
          font-family: var(--p-font-body); letter-spacing: 0.04em;
          transition: color 0.15s ease;
        }
        .gs-instructions__toggle:hover { color: var(--p-text); }

        .gs-instructions__body {
          margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem;
        }

        .gs-instructions__list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 0.5rem;
        }

        .gs-instructions__item {
          display: flex; gap: 0.75rem; align-items: flex-start;
          font-size: 0.85rem; color: var(--p-text); line-height: 1.55;
        }

        .gs-instructions__num {
          flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%;
          background: var(--p-border); color: var(--p-accent);
          font-size: 0.65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; margin-top: 2px;
        }

        .gs-instructions__cues { display: flex; flex-direction: column; gap: 0.3rem; padding-top: 0.25rem; }

        .gs-instructions__cue {
          font-size: 0.8rem; font-style: italic; color: var(--p-text);
          padding: 0.3rem 0.65rem; border-left: 2px solid var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 5%, transparent);
        }

        .gs-actions {
          display: flex; gap: 0.75rem; padding: 1rem 1.5rem 2rem;
          flex-shrink: 0; border-top: 1px solid var(--p-border);
        }

        .gs-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 0.4rem; border-radius: 12px; font-family: var(--p-font-body);
          font-weight: 600; cursor: pointer; transition: opacity 0.15s ease;
          border: none; font-size: 0.9rem; padding: 0.85rem 1.25rem; letter-spacing: 0.03em;
        }
        .gs-btn--primary { background: var(--p-accent); color: #0D0D0D; flex: 1; }
        .gs-btn--ghost {
          background: var(--p-surface); color: var(--p-muted); border: 1px solid var(--p-border);
        }
        .gs-btn--large { padding: 1rem 2rem; font-size: 1rem; }
        .gs-btn:hover { opacity: 0.85; }

        .gs-overview {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem 1.5rem 3rem; text-align: center; gap: 0.75rem; overflow-y: auto;
        }

        .gs-overview__category {
          font-size: 0.65rem; letter-spacing: 0.2em; color: var(--p-accent); font-weight: 600;
        }

        .gs-overview__name {
          font-family: var(--p-font-display); font-size: 2rem;
          font-weight: 400; color: var(--p-text); margin: 0; line-height: 1.2;
        }

        .gs-overview__meta { font-size: 0.85rem; color: var(--p-muted); margin: 0 0 0.5rem; }

        .gs-overview__exercises {
          width: 100%; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem;
        }

        .gs-overview__exercise {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 1rem; background: var(--p-surface);
          border: 1px solid var(--p-border); border-radius: 8px; text-align: left;
        }

        .gs-overview__exercise-block {
          font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--p-muted); width: 56px; flex-shrink: 0;
        }

        .gs-overview__exercise-name { flex: 1; font-size: 0.875rem; color: var(--p-text); font-weight: 500; }
        .gs-overview__exercise-spec { font-size: 0.75rem; color: var(--p-accent); flex-shrink: 0; }

        .gs-rest {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 2rem; padding: 2rem;
        }

        .gs-rest__label {
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--p-muted); font-weight: 600;
        }

        .gs-rest__ring {
          position: relative; width: 160px; height: 160px;
          display: flex; align-items: center; justify-content: center;
        }

        .gs-rest__svg {
          position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg);
        }

        .gs-rest__track { fill: none; stroke: var(--p-border); stroke-width: 6; }

        .gs-rest__progress {
          fill: none; stroke: var(--p-accent); stroke-width: 6;
          stroke-linecap: round; transition: stroke-dashoffset 0.9s linear;
        }

        .gs-rest__time {
          font-size: 2.5rem; font-variant-numeric: tabular-nums; color: var(--p-text);
          font-family: var(--p-font-display); letter-spacing: -0.02em;
        }

        .gs-complete {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem 1.5rem 3rem; gap: 1rem; text-align: center;
        }

        .gs-complete__icon { color: var(--p-accent); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; }

        .gs-complete__label {
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--p-accent); font-weight: 600;
        }

        .gs-complete__name {
          font-family: var(--p-font-display); font-size: 1.75rem;
          font-weight: 400; color: var(--p-text); margin: 0;
        }

        .gs-complete__stats {
          display: flex; align-items: center; gap: 1.5rem;
          padding: 1.25rem 2rem; background: var(--p-surface);
          border: 1px solid var(--p-border); border-radius: 12px; margin: 0.5rem 0 1rem;
        }

        .gs-complete__stat { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }

        .gs-complete__stat-value {
          font-size: 1.75rem; font-weight: 700; color: var(--p-accent);
          font-variant-numeric: tabular-nums;
        }

        .gs-complete__stat-label {
          font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--p-muted);
        }

        .gs-complete__stat-divider { width: 1px; height: 40px; background: var(--p-border); }

        /* ── Guided routine extras ── */
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