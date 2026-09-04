import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, CheckCircle2, CalendarDays, Clock, Wand2, Check } from 'lucide-react'
import { useCalendarEvents } from '../hooks/useCalendarEvents'
import { useSessions } from '../hooks/useSessions'
import { useRoutines } from '../hooks/useRoutines'
import { useDailyRoutines } from '../hooks/useDailyRoutines'
import { usePreferences } from '../hooks/usePreferences'
import { useRunConfigs } from '../hooks/useRunConfigs'
import RunLogModal from './RunLogModal'
import { usePlanner } from '../hooks/usePlanner'
import type { CalendarEvent } from '../types/calendarEvent'
import CompletionModal, { exertionToIntensity } from './CompletionModal'
import { useSessionFeedbacks } from '../hooks/useSessionFeedbacks'
import type { PerceivedExertion } from '../types/sessionFeedback'

// ── Date helpers ──────────────────────────────────────────────────────────────

function todayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(str: string): { weekday: string; day: string; month: string } {
    const [y, m, d] = str.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return {
        weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
        day: String(d),
        month: date.toLocaleDateString('en-GB', { month: 'long' }),
    }
}

function shortWeekday(str: string): string {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short' })
}

const WEEK_DAYS = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return dateStr(d)
})

// ── Event card ────────────────────────────────────────────────────────────────

function EventCard({
    evt,
    onComplete,
    onSkip,
}: {
    evt: CalendarEvent
    onComplete?: (id: string) => void
    onSkip?: (id: string) => void
}) {
    const navigate = useNavigate()
    const { getById: getSession } = useSessions()
    const { getById: getRoutine } = useRoutines()
    const { prefs } = usePreferences()
    const { runConfigs, logRun } = useRunConfigs()
    const { addFeedback } = useSessionFeedbacks()
    const [showCompletion, setShowCompletion] = useState(false)
    const [showRunLog, setShowRunLog] = useState(false)
    const [localDone, setLocalDone] = useState(evt.status === 'completed')
    const [localSkipped, setLocalSkipped] = useState(evt.status === 'skipped')

    const session = evt.type === 'session' ? getSession(evt.refId) : undefined
    const routine = evt.type === 'routine' ? getRoutine(evt.refId) : undefined
    const variant = routine?.variants.find(v => v.id === evt.variantId) ?? routine?.variants[0]
    const activityWindow = evt.type === 'activity'
        ? prefs.activityWindows.find(w => w.id === evt.refId)
        : undefined

    const runConfig = activityWindow
        ? runConfigs.find((r: typeof runConfigs[0]) => r.name === activityWindow.name)
        : undefined

    const name = session?.name ?? routine?.name ?? activityWindow?.name ?? '—'
    const duration = session?.estimatedDuration ?? variant?.durationMinutes ?? activityWindow?.preferredDuration
    const category = session?.category ?? routine?.category ?? activityWindow?.category ?? ''
    const isDaily = evt.id.startsWith('daily-')
    const isActivity = evt.type === 'activity'
    const isPlanner = evt.source === 'planner' && !isDaily

    const indicatorColor = isDaily
        ? '#5BA8A0'
        : isActivity
            ? '#F0A050'
            : evt.type === 'session'
                ? 'var(--p-accent)'
                : '#A78BFA'

    function handleStart() {
        if (evt.type === 'session') {
            navigate(`/sandbox/poise/sessions/${evt.refId}/go`)
        } else if (evt.type === 'routine') {
            const variantId = variant?.id ?? ''
            navigate(`/sandbox/poise/routines/${evt.refId}/go/${variantId}`)
        }
    }

    function handleDone() {
        // For sessions and activities: show completion modal to capture intensity
        if ((evt.type === 'session' || evt.type === 'activity') && !isDaily) {
            setShowCompletion(true)
        } else {
            setLocalDone(true)
            onComplete?.(evt.id)
        }
    }

    async function handleCompletionSave(exertion: PerceivedExertion) {
        // Find windowId from event
        const windowId = (evt as any).windowId
        await addFeedback(evt.id, evt.date, exertion, windowId)
        setLocalDone(true)
        onComplete?.(evt.id)
    }

    async function handleRunLog(actualKm: number, counted: boolean) {
        if (runConfig) {
            await logRun(runConfig.id, {
                date: evt.date,
                plannedKm: evt.plannedKm ?? runConfig.currentTargetKm,
                actualKm,
                counted,
            })
        }
        setLocalDone(true)
        onComplete?.(evt.id)
    }

    function handleSkip() {
        setLocalSkipped(true)
        onSkip?.(evt.id)
    }

    const done = localDone
    const skipped = localSkipped

    return (
        <div className={['td-event', done ? 'td-event--done' : '', skipped ? 'td-event--skipped' : ''].join(' ')}>
            <div className="td-event__left">
                <div className="td-event__indicator" style={{ background: indicatorColor }} />
                <div className="td-event__body">
                    <div className="td-event__name-row">
                        <span className="td-event__name">{name}</span>
                        {isPlanner && (
                            <Wand2 size={11} color="var(--p-muted)" style={{ flexShrink: 0 }} />
                        )}
                    </div>
                    <div className="td-event__meta">
                        {duration && (
                            <span className="td-event__duration">
                                <Clock size={11} />
                                {duration} min
                            </span>
                        )}
                        {category && <span className="td-event__category">{category}</span>}
                        {variant && <span className="td-event__variant">{variant.label}</span>}
                    </div>
                </div>
            </div>

            <div className="td-event__right">
                {done && <CheckCircle2 size={20} color="#6BCB77" strokeWidth={1.5} />}
                {skipped && <span className="td-event__skipped-label">Skipped</span>}

                {!done && !skipped && isActivity && !evt.plannedKm && (
                    <button className="td-event__btn td-event__btn--activity" onClick={handleDone}>
                        <CheckCircle2 size={14} />
                        Done
                    </button>
                )}
                {!done && !skipped && isActivity && evt.plannedKm && (
                    <button className="td-event__btn td-event__btn--run" onClick={() => setShowRunLog(true)}>
                        <CheckCircle2 size={14} />
                        Log run
                    </button>
                )}

                {!done && !skipped && !isActivity && isDaily && (
                    <button className="td-event__btn td-event__btn--start" onClick={handleStart}>
                        <Play size={14} fill="currentColor" />
                        Start
                    </button>
                )}

                {!done && !skipped && !isActivity && !isDaily && (
                    <div className="td-event__actions">
                        <button className="td-event__btn td-event__btn--start" onClick={handleStart}>
                            <Play size={14} fill="currentColor" />
                            Start
                        </button>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <button className="td-event__btn td-event__btn--done-sm" onClick={() => setShowCompletion(true)}>
                                <Check size={12} strokeWidth={3} />
                            </button>
                            <button className="td-event__btn td-event__btn--skip" onClick={handleSkip}>
                                Skip
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {showRunLog && runConfig && evt.plannedKm && (
                <RunLogModal
                    runConfig={runConfig}
                    plannedKm={evt.plannedKm}
                    date={evt.date}
                    onSave={handleRunLog}
                    onClose={() => setShowRunLog(false)}
                />
            )}

            {showCompletion && (
                <CompletionModal
                    sessionName={name}
                    eventId={evt.id}
                    date={evt.date}
                    windowId={(evt as any).windowId}
                    defaultIntensity={
                        activityWindow?.muscleLoad?.defaultIntensity
                    }
                    onSave={handleCompletionSave}
                    onClose={() => setShowCompletion(false)}
                />
            )}
        </div>
    )
}

// ── Week sidebar (desktop) / strip (mobile) ───────────────────────────────────

function WeekPanel({ isSidebar }: { isSidebar: boolean }) {
    const navigate = useNavigate()
    const { eventsForDate } = useCalendarEvents()
    const { virtualEventsForDate } = useDailyRoutines()
    const { getById: getSession } = useSessions()
    const { getById: getRoutine } = useRoutines()
    const { prefs } = usePreferences()

    return (
        <div className={isSidebar ? 'td-sidebar' : 'td-week'}>
            {!isSidebar && <div className="td-section-title" style={{ marginTop: '2rem' }}>Coming up</div>}
            {isSidebar && <div className="td-sidebar__title">Coming up</div>}
            {WEEK_DAYS.map(date => {
                const stored = eventsForDate(date)
                const virtual = virtualEventsForDate(date)
                const dayEvents = [...virtual, ...stored]
                const weekday = shortWeekday(date)
                const [, , d] = date.split('-')

                return (
                    <button
                        key={date}
                        className={isSidebar ? 'td-sidebar-row' : 'td-week-row'}
                        onClick={() => navigate('/sandbox/poise/calendar')}
                    >
                        <div className="td-week-row__date">
                            <span className="td-week-row__weekday">{weekday}</span>
                            <span className="td-week-row__day">{Number(d)}</span>
                        </div>
                        <div className="td-week-row__events">
                            {dayEvents.length === 0 ? (
                                <span className="td-week-row__empty">—</span>
                            ) : (
                                dayEvents.map(evt => {
                                    const isDaily = evt.id.startsWith('daily-')
                                    const isActivity = evt.type === 'activity'
                                    const name = evt.type === 'session'
                                        ? getSession(evt.refId)?.name
                                        : evt.type === 'routine'
                                            ? getRoutine(evt.refId)?.name
                                            : prefs.activityWindows.find(w => w.id === evt.refId)?.name
                                    const color = isDaily ? '#5BA8A0'
                                        : isActivity ? '#F0A050'
                                            : evt.type === 'session' ? 'var(--p-accent)'
                                                : '#A78BFA'
                                    return (
                                        <span
                                            key={evt.id}
                                            className="td-week-row__pill"
                                            style={{
                                                background: `color-mix(in srgb, ${color} 15%, transparent)`,
                                                color,
                                            }}
                                        >
                                            {name ?? '—'}
                                        </span>
                                    )
                                })
                            )}
                        </div>
                    </button>
                )
            })}
        </div>
    )
}

// ── Today page ────────────────────────────────────────────────────────────────

export default function TodayPage() {
    const navigate = useNavigate()
    const today = todayStr()
    const { weekday, day, month } = formatDate(today)

    const { eventsForDate, updateStatus, loading: eventsLoading } = useCalendarEvents()
    const { loading: sessionsLoading } = useSessions()
    const { loading: routinesLoading } = useRoutines()
    const { virtualEventsForDate, loading: drLoading } = useDailyRoutines()
    const { replan } = usePlanner()

    const dataLoading = eventsLoading || sessionsLoading || routinesLoading || drLoading

    const dailyVirtualEvents = useMemo(() => virtualEventsForDate(today), [today, virtualEventsForDate])
    const storedEvents = useMemo(() => eventsForDate(today), [today, eventsForDate])
    const todayEvents = useMemo(() => [...dailyVirtualEvents, ...storedEvents], [dailyVirtualEvents, storedEvents])

    const planned = todayEvents.filter(e => e.status === 'planned')
    const done = todayEvents.filter(e => e.status === 'completed')
    const skipped = todayEvents.filter(e => e.status === 'skipped')

    async function handleComplete(id: string) {
        // Only update stored events (daily virtual events have no DB record)
        if (!id.startsWith('daily-')) {
            await updateStatus(id, 'completed')
        }
        // No replan on complete — completed days stay locked
    }

    async function handleSkip(id: string) {
        if (!id.startsWith('daily-')) {
            await updateStatus(id, 'skipped')
        }
        setTimeout(() => replan(), 150)
    }

    return (
        <div className="poise-page td-root">
            {/* Left / main column */}
            <div className="td-main">
                {/* Date header */}
                <div className="td-date">
                    <span className="td-date__weekday">{weekday}</span>
                    <div className="td-date__full">
                        <span className="td-date__day">{day}</span>
                        <span className="td-date__month">{month}</span>
                    </div>
                </div>

                {dataLoading ? (
                    <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
                ) : (
                    <>
                        <div className="td-section-title">Today</div>

                        {todayEvents.length === 0 ? (
                            <div className="td-empty">
                                <p className="td-empty__text">Nothing planned for today.</p>
                                <button
                                    className="td-empty__cta"
                                    onClick={() => navigate('/sandbox/poise/calendar')}
                                >
                                    <CalendarDays size={15} />
                                    Open Calendar
                                </button>
                            </div>
                        ) : (
                            <div className="td-events">
                                {planned.map(evt => (
                                    <EventCard
                                        key={evt.id}
                                        evt={evt}
                                        onComplete={handleComplete}
                                        onSkip={handleSkip}
                                    />
                                ))}
                                {done.map(evt => <EventCard key={evt.id} evt={evt} />)}
                                {skipped.map(evt => <EventCard key={evt.id} evt={evt} />)}
                            </div>
                        )}

                        {/* Mobile only: week strip below */}
                        <div className="td-mobile-week">
                            <WeekPanel isSidebar={false} />
                        </div>
                    </>
                )}
            </div>

            {/* Desktop sidebar: coming up */}
            {!dataLoading && (
                <div className="td-desktop-sidebar">
                    <WeekPanel isSidebar={true} />
                </div>
            )}

            <style>{`
        /* ── Layout ── */
        .td-root {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          max-width: 100%;
        }

        .td-main {
          flex: 1;
          min-width: 0;
        }

        /* Desktop sidebar — hidden on mobile */
        .td-desktop-sidebar {
          display: none;
          width: 260px;
          flex-shrink: 0;
          position: sticky;
          top: 1rem;
        }

        /* Mobile week strip — hidden on desktop */
        .td-mobile-week { display: block; }

        @media (min-width: 720px) {
          .td-desktop-sidebar { display: block; }
          .td-mobile-week { display: none; }
          .poise-page.td-root { padding-top: 1.5rem; }
        }

        /* ── Date header ── */
        .td-date { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.25rem; }
        .td-date__weekday { font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--p-accent); font-weight: 600; }
        .td-date__full { display: flex; align-items: baseline; gap: 0.5rem; }
        .td-date__day { font-family: var(--p-font-display); font-size: 3rem; font-weight: 400; color: var(--p-text); line-height: 1; }
        .td-date__month { font-family: var(--p-font-display); font-size: 1.25rem; color: var(--p-muted); font-weight: 400; }

        .td-section-title { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--p-muted); font-weight: 600; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--p-border); display: flex; align-items: center; }

        /* ── Empty state ── */
        .td-empty { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: var(--p-surface); border: 1px solid var(--p-border); border-radius: 10px; align-items: center; text-align: center; }
        .td-empty__text { color: var(--p-muted); font-size: 0.875rem; margin: 0; }
        .td-empty__cta { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.55rem 1.1rem; border-radius: 8px; border: 1px solid var(--p-border); background: transparent; color: var(--p-text); font-size: 0.8rem; font-family: var(--p-font-body); cursor: pointer; transition: all 0.15s ease; }
        .td-empty__cta:hover { border-color: var(--p-accent); color: var(--p-accent); }

        /* ── Event cards ── */
        .td-events { display: flex; flex-direction: column; gap: 0.5rem; }

        .td-event {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem 1rem; background: var(--p-surface);
          border: 1px solid var(--p-border); border-radius: 10px; gap: 0.75rem;
          transition: border-color 0.2s ease, opacity 0.3s ease;
        }
        .td-event--done    { opacity: 0.45; border-color: #6BCB77; }
        .td-event--skipped { opacity: 0.3; }

        .td-event__left { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
        .td-event__indicator { width: 3px; height: 36px; border-radius: 2px; flex-shrink: 0; transition: background 0.3s ease; }
        .td-event__body { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
        .td-event__name-row { display: flex; align-items: center; gap: 0.4rem; }
        .td-event__name { font-size: 0.95rem; font-weight: 500; color: var(--p-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .td-event__meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .td-event__duration { display: flex; align-items: center; gap: 0.25rem; font-size: 0.72rem; color: var(--p-muted); }
        .td-event__category, .td-event__variant { font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--p-muted); }
        .td-event__right { flex-shrink: 0; display: flex; align-items: center; }
        .td-event__actions { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-end; }
        .td-event__skipped-label { font-size: 0.7rem; color: var(--p-muted); letter-spacing: 0.06em; text-transform: uppercase; }

        .td-event__btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.5rem 0.9rem; border-radius: 8px; font-size: 0.78rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s ease; border: none;
        }
        .td-event__btn:hover { opacity: 0.85; }
        .td-event__btn--start { background: var(--p-accent); color: #0D0D0D; }
        .td-event__btn--activity { background: color-mix(in srgb, #F0A050 10%, transparent); color: #F0A050; border: 1px solid #F0A050; }
        .td-event__btn--run { background: color-mix(in srgb, #F0A050 10%, transparent); color: #F0A050; border: 1px solid #F0A050; }
        .td-event__btn--skip { background: transparent; color: var(--p-muted); border: 1px solid var(--p-border); font-size: 0.72rem; padding: 0.3rem 0.7rem; }
        .td-event__btn--skip:hover { color: var(--p-text); border-color: var(--p-muted); opacity: 1; }
        .td-event__btn--done-sm { background: color-mix(in srgb, #6BCB77 15%, transparent); color: #6BCB77; border: 1px solid #6BCB77; padding: 0.3rem 0.5rem; }

        /* ── Sidebar (desktop) ── */
        .td-sidebar {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; gap: 0;
        }

        .td-sidebar__title {
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--p-muted); font-weight: 600; margin-bottom: 0.5rem;
          padding-bottom: 0.5rem; border-bottom: 1px solid var(--p-border);
        }

        .td-sidebar-row {
          width: 100%; display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.6rem 0; background: none; border: none;
          border-bottom: 1px solid var(--p-border); cursor: pointer;
          font-family: var(--p-font-body); text-align: left; transition: opacity 0.15s ease;
        }
        .td-sidebar-row:hover { opacity: 0.7; }
        .td-sidebar-row:last-child { border-bottom: none; }

        /* ── Week strip (mobile) ── */
        .td-week { display: flex; flex-direction: column; gap: 0; margin-top: 2rem; }

        .td-week-row {
          width: 100%; display: flex; align-items: center; gap: 1rem;
          padding: 0.6rem 0; background: none; border: none;
          border-bottom: 1px solid var(--p-border); cursor: pointer;
          font-family: var(--p-font-body); text-align: left; transition: opacity 0.15s ease;
        }
        .td-week-row:hover { opacity: 0.7; }
        .td-week-row:last-child { border-bottom: none; }

        .td-week-row__date {
          display: flex; flex-direction: column; align-items: center;
          width: 32px; flex-shrink: 0; gap: 0.1rem;
        }
        .td-week-row__weekday { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--p-muted); }
        .td-week-row__day { font-size: 0.9rem; color: var(--p-text); font-weight: 500; }
        .td-week-row__events { flex: 1; display: flex; flex-wrap: wrap; gap: 0.3rem; align-items: center; }
        .td-week-row__empty { font-size: 0.8rem; color: var(--p-border); }
        .td-week-row__pill {
          font-size: 0.68rem; padding: 0.2rem 0.5rem; border-radius: 4px;
          font-weight: 500; letter-spacing: 0.02em; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; max-width: 140px;
        }
      `}</style>
        </div>
    )
}