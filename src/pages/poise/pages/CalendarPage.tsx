import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Play, Trash2, X, RefreshCw, Settings, Wand2 } from 'lucide-react'
import { useCalendarEvents } from '../hooks/useCalendarEvents'
import { useDailyRoutines } from '../hooks/useDailyRoutines'
import { useSessions } from '../hooks/useSessions'
import { useRoutines } from '../hooks/useRoutines'
import { usePlanner } from '../hooks/usePlanner'
import { usePreferences } from '../hooks/usePreferences'
import type { CalendarEvent } from '../types/calendarEvent'
import type { DailyRoutineConfig } from '../types/dailyRoutine'


function toDateStr(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function todayStr(): string {
    const d = new Date()
    return toDateStr(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number): number {
    return (new Date(year, month, 1).getDay() + 6) % 7
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const SLOT_ORDER: Record<string, number> = { morning: 0, midday: 1, evening: 2 }

function EventDot({ type, status, isRecurring }: {
    type: CalendarEvent['type']
    status: CalendarEvent['status']
    isRecurring?: boolean
}) {
    const color = status === 'completed'
        ? '#6BCB77'
        : status === 'skipped'
            ? 'var(--p-muted)'
            : isRecurring
                ? '#5BA8A0'
                : type === 'session'
                    ? 'var(--p-accent)'
                    : type === 'activity'
                        ? '#F0A050'
                : '#A78BFA'

    return (
        <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: color, flexShrink: 0,
        }} />
    )
}

function DailyRoutineSheet({
    configs, onSave, onDelete, onToggle, onClose,
}: {
    configs: DailyRoutineConfig[]
    onSave: (partial: Omit<DailyRoutineConfig, 'id' | 'createdAt'>) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onToggle: (id: string) => Promise<void>
    onClose: () => void
}) {
    const { routines } = useRoutines()
    const [adding, setAdding] = useState(false)
    const [slot, setSlot] = useState<'morning' | 'evening' | 'midday'>('morning')
    const [routineId, setRoutineId] = useState(routines[0]?.id ?? '')
    const [variantId, setVariantId] = useState('')

    const selectedRoutine = routines.find(r => r.id === routineId)

    function handleRoutineChange(id: string) {
        setRoutineId(id)
        const r = routines.find(r => r.id === id)
        setVariantId(r?.variants[0]?.id ?? '')
    }

    if (!variantId && selectedRoutine) {
        setVariantId(selectedRoutine.variants[0]?.id ?? '')
    }

    async function handleAdd() {
        if (!routineId || !variantId) return
        await onSave({ slot, routineId, variantId, activeDays: [], active: true })
        setAdding(false)
    }

    const SLOT_LABELS = { morning: 'Morning', midday: 'Midday', evening: 'Evening' }

    return (
        <div className="cal-overlay" onClick={onClose}>
            <div className="cal-sheet" onClick={e => e.stopPropagation()}>
                <div className="cal-sheet__header">
                    <span className="cal-sheet__title">Daily routines</span>
                    <button className="cal-sheet__close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="cal-sheet__list">
                    <p className="cal-dr-desc">
                        Set once — appears automatically every day. Shown in teal on the calendar.
                    </p>

                    {configs.length === 0 && !adding && (
                        <p style={{ color: 'var(--p-muted)', fontSize: '0.82rem' }}>
                            No daily routines configured yet.
                        </p>
                    )}

                    {configs.map(cfg => {
                        const routine = routines.find(r => r.id === cfg.routineId)
                        const variant = routine?.variants.find(v => v.id === cfg.variantId)
                        return (
                            <div key={cfg.id} className="cal-dr-row">
                                <div className="cal-dr-row__left">
                                    <button
                                        className={['cal-dr-toggle', cfg.active ? 'cal-dr-toggle--on' : ''].join(' ')}
                                        onClick={() => onToggle(cfg.id)}
                                    >
                                        <span className="cal-dr-toggle__dot" />
                                    </button>
                                    <div className="cal-dr-row__body">
                                        <span className="cal-dr-row__slot">{SLOT_LABELS[cfg.slot]}</span>
                                        <span className="cal-dr-row__name">
                                            {routine?.name ?? '—'}{variant ? ` · ${variant.label}` : ''}
                                        </span>
                                        <span className="cal-dr-row__meta">{variant?.durationMinutes} min · every day</span>
                                    </div>
                                </div>
                                <button className="cal-icon-btn cal-icon-btn--danger" onClick={() => onDelete(cfg.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )
                    })}

                    {adding && (
                        <div className="cal-dr-form">
                            <div className="cal-dr-form__row">
                                <span className="cal-dr-form__label">Slot</span>
                                <div className="cal-dr-slots">
                                    {(['morning', 'midday', 'evening'] as const).map(s => (
                                        <button
                                            key={s}
                                            className={['cal-dr-slot-btn', slot === s ? 'cal-dr-slot-btn--active' : ''].join(' ')}
                                            onClick={() => setSlot(s)}
                                        >
                                            {SLOT_LABELS[s]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="cal-dr-form__row">
                                <span className="cal-dr-form__label">Routine</span>
                                <select className="cal-select" value={routineId} onChange={e => handleRoutineChange(e.target.value)}>
                                    {routines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>

                            <div className="cal-dr-form__row">
                                <span className="cal-dr-form__label">Variant</span>
                                <select className="cal-select" value={variantId} onChange={e => setVariantId(e.target.value)}>
                                    {selectedRoutine?.variants.map(v => (
                                        <option key={v.id} value={v.id}>{v.label} · {v.durationMinutes} min</option>
                                    ))}
                                </select>
                            </div>

                            <div className="cal-dr-form__actions">
                                <button className="cal-dr-cancel" onClick={() => setAdding(false)}>Cancel</button>
                                <button className="cal-dr-save" onClick={handleAdd}>Add</button>
                            </div>
                        </div>
                    )}

                    {!adding && (
                        <button className="cal-add-day-btn" onClick={() => setAdding(true)}>
                            <Plus size={15} /> Add daily routine
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function AddEventSheet({ date, onAdd, onClose }: {
    date: string
    onAdd: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<void>
    onClose: () => void
}) {
    const { sessions } = useSessions()
    const { routines } = useRoutines()
    const [tab, setTab] = useState<'session' | 'routine'>('session')
    const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)
    const selectedRoutine = routines.find(r => r.id === selectedRoutineId)

    async function handleAddSession(sessionId: string) {
        await onAdd({ date, type: 'session', refId: sessionId, status: 'planned', source: 'manual' })
        onClose()
    }

        async function handleAddRoutine(routineId: string, variantId: string) {
            await onAdd({ date, type: 'routine', refId: routineId, variantId, status: 'planned', source: 'manual' })
        onClose()
    }

    return (
        <div className="cal-overlay" onClick={onClose}>
            <div className="cal-sheet" onClick={e => e.stopPropagation()}>
                <div className="cal-sheet__header">
                    <span className="cal-sheet__title">Add to {date}</span>
                    <button className="cal-sheet__close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="cal-sheet__tabs">
                    <button className={['cal-tab', tab === 'session' ? 'cal-tab--active' : ''].join(' ')}
                        onClick={() => { setTab('session'); setSelectedRoutineId(null) }}>Session</button>
                    <button className={['cal-tab', tab === 'routine' ? 'cal-tab--active' : ''].join(' ')}
                        onClick={() => { setTab('routine'); setSelectedRoutineId(null) }}>Routine</button>
                </div>

                <div className="cal-sheet__list">
                    {tab === 'session' && sessions.map(s => (
                        <button key={s.id} className="cal-picker-item" onClick={() => handleAddSession(s.id)}>
                            <div className="cal-picker-item__body">
                                <span className="cal-picker-item__name">{s.name}</span>
                                <span className="cal-picker-item__meta">{s.estimatedDuration} min · {s.category}</span>
                            </div>
                            <Plus size={16} color="var(--p-accent)" />
                        </button>
                    ))}

                    {tab === 'routine' && !selectedRoutineId && routines.map(r => (
                        <button key={r.id} className="cal-picker-item" onClick={() => setSelectedRoutineId(r.id)}>
                            <div className="cal-picker-item__body">
                                <span className="cal-picker-item__name">{r.name}</span>
                                <span className="cal-picker-item__meta">{r.variants.map(v => v.label).join(' · ')}</span>
                            </div>
                            <ChevronRight size={16} color="var(--p-muted)" />
                        </button>
                    ))}

                    {tab === 'routine' && selectedRoutineId && selectedRoutine && (
                        <>
                            <button className="cal-back-btn" onClick={() => setSelectedRoutineId(null)}>
                                <ChevronLeft size={14} /> {selectedRoutine.name}
                            </button>
                            {selectedRoutine.variants.map(v => (
                                <button key={v.id} className="cal-picker-item"
                                    onClick={() => handleAddRoutine(selectedRoutine.id, v.id)}>
                                    <div className="cal-picker-item__body">
                                        <span className="cal-picker-item__name">{v.label}</span>
                                        <span className="cal-picker-item__meta">{v.durationMinutes} min</span>
                                    </div>
                                    <Plus size={16} color="var(--p-accent)" />
                                </button>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function DayPanel({ date, storedEvents, virtualEvents, onAdd, onRemove, onStatusChange, onClose }: {
    date: string
    storedEvents: CalendarEvent[]
    virtualEvents: CalendarEvent[]
    onAdd: () => void
    onRemove: (id: string) => void
    onStatusChange: (id: string, status: CalendarEvent['status']) => void
    onClose: () => void
}) {
    const navigate = useNavigate()
    const { getById: getSession } = useSessions()
    const { getById: getRoutine } = useRoutines()
    const { prefs } = usePreferences()

    const [date_year, date_month, date_day] = date.split('-').map(Number)
    const label = new Date(date_year, date_month - 1, date_day).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long',
    })

    function handleStart(evt: CalendarEvent) {
        if (evt.type === 'session') {
            navigate(`/sandbox/poise/sessions/${evt.refId}/go`)
        } else {
            const routine = getRoutine(evt.refId)
            const variantId = evt.variantId ?? routine?.variants[0]?.id ?? ''
            navigate(`/sandbox/poise/routines/${evt.refId}/go/${variantId}`)
        }
    }

    function renderEvent(evt: CalendarEvent, isVirtual: boolean) {
        const session = evt.type === 'session' ? getSession(evt.refId) : undefined
        const routine = evt.type === 'routine' ? getRoutine(evt.refId) : undefined
        const variant = routine?.variants.find(v => v.id === evt.variantId)
        const activityWindow = evt.type === 'activity'
            ? prefs.activityWindows.find(w => w.id === evt.refId)
            : undefined
        const name = session?.name ?? routine?.name ?? activityWindow?.name ?? evt.refId
        const meta = session
            ? `${session.estimatedDuration} min · ${session.category}`
            : variant
                ? `${variant.label} · ${variant.durationMinutes} min`
                : activityWindow
                    ? `${activityWindow.category} · free activity`
                    : ''

        return (
            <div key={evt.id} className={['cal-day-event', isVirtual ? 'cal-day-event--recurring' : ''].join(' ')}>
                <div className="cal-day-event__left">
                    <EventDot type={evt.type} status={evt.status} isRecurring={isVirtual} />
                    <div className="cal-day-event__body">
                        <div className="cal-day-event__name-row">
                            <span className="cal-day-event__name">{name}</span>
                            {isVirtual && <RefreshCw size={10} color="#5BA8A0" style={{ flexShrink: 0 }} />}
                        </div>
                        {meta && <span className="cal-day-event__meta">{meta}</span>}
                    </div>
                </div>
                <div className="cal-day-event__actions">
                    {!isVirtual && (
                        <select
                            className="cal-status-select"
                            value={evt.status}
                            onChange={e => onStatusChange(evt.id, e.target.value as CalendarEvent['status'])}
                            onClick={e => e.stopPropagation()}
                        >
                            <option value="planned">Planned</option>
                            <option value="completed">Done</option>
                            <option value="skipped">Skipped</option>
                        </select>
                    )}
                    <button className="cal-day-event__start" onClick={() => handleStart(evt)} title="Start">
                        <Play size={14} fill="currentColor" />
                    </button>
                    {!isVirtual && (
                        <button className="cal-day-event__remove" onClick={() => onRemove(evt.id)} title="Remove">
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="cal-overlay" onClick={onClose}>
            <div className="cal-sheet" onClick={e => e.stopPropagation()}>
                <div className="cal-sheet__header">
                    <span className="cal-sheet__title">{label}</span>
                    <button className="cal-sheet__close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="cal-sheet__list">
                    {virtualEvents.length === 0 && storedEvents.length === 0 && (
                        <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                            Nothing planned for this day.
                        </p>
                    )}
                    {virtualEvents.map(evt => renderEvent(evt, true))}
                    {storedEvents.map(evt => renderEvent(evt, false))}
                </div>

                <div className="cal-sheet__footer">
                    <button className="cal-add-day-btn" onClick={onAdd}>
                        <Plus size={15} /> Add session or routine
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CalendarPage() {
    const today = todayStr()
    const todayDate = new Date()

    const [year, setYear] = useState(todayDate.getFullYear())
    const [month, setMonth] = useState(todayDate.getMonth())
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [showAddSheet, setShowAddSheet] = useState(false)
    const [showDailySheet, setShowDailySheet] = useState(false)

    const { events, loading, eventsForDate, addEvent, updateStatus, removeEvent } = useCalendarEvents()
    const { configs, loading: drLoading, createConfig, deleteConfig, toggleConfig, virtualEventsForDate } = useDailyRoutines()
    const { replan } = usePlanner()
    const [replanning, setReplanning] = useState(false)
    const { loading: sessionsLoading } = useSessions()
    const { loading: routinesLoading } = useRoutines()

    const dataLoading = loading || drLoading || sessionsLoading || routinesLoading

    function prevMonth() {
        if (month === 0) { setYear(y => y - 1); setMonth(11) }
        else setMonth(m => m - 1)
    }
    function nextMonth() {
        if (month === 11) { setYear(y => y + 1); setMonth(0) }
        else setMonth(m => m + 1)
    }

    const days = daysInMonth(year, month)
    const firstDay = firstDayOfMonth(year, month)

    const selectedStoredEvents = selectedDate ? eventsForDate(selectedDate) : []
    const selectedVirtualEvents = selectedDate ? virtualEventsForDate(selectedDate) : []

    const handleAddEvent = useCallback(
        async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => { await addEvent(event) },
        [addEvent]
    )

    return (
        <div className="poise-page" style={{ paddingBottom: '1rem' }}>

            {/* Month header */}
            <div className="cal-header">
                <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                <div className="cal-month-label">
                    <span className="cal-month-name">{MONTH_NAMES[month]}</span>
                    <span className="cal-month-year">{year}</span>
                </div>
                <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
            </div>

            {/* Daily routines button */}
            <button className="cal-daily-btn" onClick={() => setShowDailySheet(true)}>
                <RefreshCw size={14} />
                Daily routines
                {configs.filter(c => c.active).length > 0 && (
                    <span className="cal-daily-btn__count">{configs.filter(c => c.active).length} active</span>
                )}
                <Settings size={13} color="var(--p-muted)" style={{ marginLeft: 'auto' }} />
            </button>

            {/* Replan button */}
            <button
                className="cal-replan-btn"
                onClick={async () => {
                    setReplanning(true)
                    // Let React render the loading state before the async work starts
                    await new Promise(r => setTimeout(r, 0))
                    try { await replan() } finally { setReplanning(false) }
                }}
                disabled={replanning}
            >
                <Wand2 size={14} />
                {replanning ? 'Planning…' : 'Replan calendar'}
            </button>

            {/* Day labels */}
            <div className="cal-grid cal-grid--labels">
                {DAY_LABELS.map((d, i) => <span key={i} className="cal-day-label">{d}</span>)}
            </div>

            {/* Day cells */}
            {dataLoading ? (
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>Loading…</p>
            ) : (
                <div className="cal-grid cal-grid--days">
                    {Array.from({ length: firstDay }, (_, i) => (
                        <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />
                    ))}
                    {Array.from({ length: days }, (_, i) => {
                        const day = i + 1
                        const dateStr = toDateStr(year, month, day)
                        const storedEvts = eventsForDate(dateStr)
                        const virtualEvts = virtualEventsForDate(dateStr)
                        const allEvts = [...virtualEvts, ...storedEvts]
                        const isToday = dateStr === today
                        const isSelected = dateStr === selectedDate
                        const isPast = dateStr < today

                        return (
                            <button
                                key={day}
                                className={[
                                    'cal-cell',
                                    isToday ? 'cal-cell--today' : '',
                                    isSelected ? 'cal-cell--selected' : '',
                                    isPast && !isToday ? 'cal-cell--past' : '',
                                ].join(' ')}
                                onClick={() => setSelectedDate(prev => prev === dateStr ? null : dateStr)}
                            >
                                <span className="cal-cell__num">{day}</span>
                                {allEvts.length > 0 && (
                                    <div className="cal-cell__dots">
                                        {allEvts.slice(0, 3).map(evt => (
                                            <EventDot
                                                key={evt.id}
                                                type={evt.type}
                                                status={evt.status}
                                                isRecurring={evt.id.startsWith('daily-')}
                                            />
                                        ))}
                                        {allEvts.length > 3 && <span className="cal-cell__more">+{allEvts.length - 3}</span>}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="cal-legend">
                <span className="cal-legend__item"><span className="cal-legend__dot" style={{ background: 'var(--p-accent)' }} /> Session</span>
                <span className="cal-legend__item"><span className="cal-legend__dot" style={{ background: '#A78BFA' }} /> Routine</span>
                <span className="cal-legend__item"><span className="cal-legend__dot" style={{ background: '#5BA8A0' }} /> Daily</span>
                <span className="cal-legend__item"><span className="cal-legend__dot" style={{ background: '#F0A050' }} /> Activity</span>
                <span className="cal-legend__item"><span className="cal-legend__dot" style={{ background: '#6BCB77' }} /> Done</span>
            </div>

            {/* Day panel */}
            {selectedDate && !showAddSheet && !showDailySheet && (
                <DayPanel
                    date={selectedDate}
                    storedEvents={selectedStoredEvents}
                    virtualEvents={selectedVirtualEvents}
                    onAdd={() => setShowAddSheet(true)}
                    onRemove={removeEvent}
                    onStatusChange={updateStatus}
                    onClose={() => setSelectedDate(null)}
                />
            )}

            {/* Add event sheet */}
            {selectedDate && showAddSheet && (
                <AddEventSheet
                    date={selectedDate}
                    onAdd={handleAddEvent}
                    onClose={() => setShowAddSheet(false)}
                />
            )}

            {/* Daily routine config sheet */}
            {showDailySheet && (
                <DailyRoutineSheet
                    configs={configs}
                    onSave={createConfig}
                    onDelete={deleteConfig}
                    onToggle={toggleConfig}
                    onClose={() => setShowDailySheet(false)}
                />
            )}

            <style>{`
        .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .cal-nav-btn {
          background: none; border: none; color: var(--p-muted); cursor: pointer;
          padding: 0.4rem; border-radius: 8px; transition: all 0.15s ease; display: flex; align-items: center;
        }
        .cal-nav-btn:hover { color: var(--p-text); background: var(--p-border); }
        .cal-month-label { display: flex; flex-direction: column; align-items: center; gap: 0.1rem; }
        .cal-month-name { font-family: var(--p-font-display); font-size: 1.25rem; font-weight: 400; color: var(--p-text); line-height: 1; }
        .cal-month-year { font-size: 0.7rem; color: var(--p-muted); letter-spacing: 0.08em; }

        .cal-daily-btn {
          width: 100%; display: flex; align-items: center; gap: 0.5rem;
          padding: 0.55rem 0.85rem; border-radius: 8px;
          border: 1px solid #5BA8A0;
          background: color-mix(in srgb, #5BA8A0 8%, transparent);
          color: #5BA8A0; font-size: 0.78rem; font-family: var(--p-font-body);
          cursor: pointer; margin-bottom: 0.75rem; transition: opacity 0.15s ease;
          font-weight: 600; letter-spacing: 0.03em;
        }
        .cal-daily-btn:hover { opacity: 0.8; }
        .cal-daily-btn__count {
          font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 4px;
          background: #5BA8A0; color: #0D0D0D; font-weight: 700;
        }

        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .cal-grid--labels { margin-bottom: 4px; }
        .cal-day-label { text-align: center; font-size: 0.65rem; letter-spacing: 0.08em; color: var(--p-muted); padding: 0.25rem 0; font-weight: 600; }

        .cal-cell {
          aspect-ratio: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 0.3rem 0.2rem; border-radius: 8px;
          border: 1px solid transparent; background: none;
          cursor: pointer; font-family: var(--p-font-body);
          transition: all 0.15s ease; gap: 3px; min-height: 0;
        }
        .cal-cell:hover { background: var(--p-surface); }
        .cal-cell--empty { cursor: default; pointer-events: none; }
        .cal-cell--today { border-color: var(--p-accent); }
        .cal-cell--selected { background: var(--p-surface); border-color: var(--p-muted); }
        .cal-cell--past { opacity: 0.5; }
        .cal-cell__num { font-size: 0.8rem; color: var(--p-text); line-height: 1; }
        .cal-cell--today .cal-cell__num { color: var(--p-accent); font-weight: 700; }
        .cal-cell__dots { display: flex; gap: 2px; align-items: center; flex-wrap: wrap; justify-content: center; }
        .cal-cell__more { font-size: 0.5rem; color: var(--p-muted); }

        .cal-legend { display: flex; gap: 0.85rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--p-border); flex-wrap: wrap; }
        .cal-legend__item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.7rem; color: var(--p-muted); }
        .cal-legend__dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; }

        .cal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 60; display: flex; align-items: flex-end; }
        .cal-sheet { width: 100%; background: var(--p-surface); border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border); max-height: 70dvh; display: flex; flex-direction: column; overflow: hidden; }
        .cal-sheet__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border); flex-shrink: 0; }
        .cal-sheet__title { font-size: 0.875rem; font-weight: 600; color: var(--p-text); }
        .cal-sheet__close { background: none; border: none; color: var(--p-muted); cursor: pointer; padding: 0.25rem; display: flex; align-items: center; }
        .cal-sheet__list { flex: 1; overflow-y: auto; padding: 0.75rem 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .cal-sheet__footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--p-border); flex-shrink: 0; }
        .cal-sheet__tabs { display: flex; border-bottom: 1px solid var(--p-border); flex-shrink: 0; }
        .cal-tab { flex: 1; padding: 0.65rem; background: none; border: none; color: var(--p-muted); font-size: 0.8rem; font-family: var(--p-font-body); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s ease; margin-bottom: -1px; }
        .cal-tab--active { color: var(--p-accent); border-bottom-color: var(--p-accent); }

        .cal-dr-desc { font-size: 0.78rem; color: var(--p-muted); margin: 0; line-height: 1.5; }
        .cal-dr-row { display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid var(--p-border); gap: 0.75rem; }
        .cal-dr-row:last-child { border-bottom: none; }
        .cal-dr-row__left { display: flex; align-items: center; gap: 0.65rem; flex: 1; }
        .cal-dr-toggle { width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer; padding: 2px; display: flex; align-items: center; background: var(--p-border); transition: background 0.2s ease; flex-shrink: 0; }
        .cal-dr-toggle--on { background: #5BA8A0; justify-content: flex-end; }
        .cal-dr-toggle__dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        .cal-dr-row__body { display: flex; flex-direction: column; gap: 0.15rem; }
        .cal-dr-row__slot { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: #5BA8A0; font-weight: 600; }
        .cal-dr-row__name { font-size: 0.875rem; color: var(--p-text); font-weight: 500; }
        .cal-dr-row__meta { font-size: 0.7rem; color: var(--p-muted); }

        .cal-dr-form { display: flex; flex-direction: column; gap: 0.75rem; padding: 0.75rem; background: var(--p-bg); border: 1px solid var(--p-border); border-radius: 8px; }
        .cal-dr-form__row { display: flex; align-items: center; gap: 0.75rem; }
        .cal-dr-form__label { font-size: 0.7rem; color: var(--p-muted); text-transform: uppercase; letter-spacing: 0.08em; width: 48px; flex-shrink: 0; }
        .cal-dr-slots { display: flex; gap: 0.4rem; }
        .cal-dr-slot-btn { padding: 0.3rem 0.65rem; border-radius: 6px; border: 1px solid var(--p-border); background: transparent; color: var(--p-muted); font-size: 0.75rem; cursor: pointer; font-family: var(--p-font-body); transition: all 0.15s ease; }
        .cal-dr-slot-btn--active { background: #5BA8A0; border-color: #5BA8A0; color: #0D0D0D; font-weight: 700; }
        .cal-select { flex: 1; background: var(--p-surface); border: 1px solid var(--p-border); border-radius: 7px; padding: 0.45rem 0.6rem; color: var(--p-text); font-size: 0.82rem; font-family: var(--p-font-body); outline: none; cursor: pointer; }
        .cal-dr-form__actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .cal-dr-cancel { padding: 0.4rem 0.9rem; border-radius: 7px; border: 1px solid var(--p-border); background: transparent; color: var(--p-muted); font-size: 0.8rem; font-family: var(--p-font-body); cursor: pointer; }
        .cal-dr-save { padding: 0.4rem 0.9rem; border-radius: 7px; border: none; background: #5BA8A0; color: #0D0D0D; font-size: 0.8rem; font-weight: 700; font-family: var(--p-font-body); cursor: pointer; }

        .cal-icon-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; color: var(--p-muted); cursor: pointer; transition: all 0.15s ease; }
        .cal-icon-btn--danger:hover { color: #E8734A; }

        .cal-picker-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; background: none; border: none; border-bottom: 1px solid var(--p-border); cursor: pointer; text-align: left; font-family: var(--p-font-body); transition: opacity 0.15s ease; }
        .cal-picker-item:last-child { border-bottom: none; }
        .cal-picker-item:hover { opacity: 0.75; }
        .cal-picker-item__body { display: flex; flex-direction: column; gap: 0.2rem; }
        .cal-picker-item__name { font-size: 0.9rem; color: var(--p-text); font-weight: 500; }
        .cal-picker-item__meta { font-size: 0.72rem; color: var(--p-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .cal-back-btn { display: inline-flex; align-items: center; gap: 0.3rem; background: none; border: none; color: var(--p-accent); font-size: 0.8rem; cursor: pointer; padding: 0.5rem 0; font-family: var(--p-font-body); transition: opacity 0.15s ease; }
        .cal-back-btn:hover { opacity: 0.75; }

        .cal-day-event { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--p-border); }
        .cal-day-event:last-child { border-bottom: none; }
        .cal-day-event--recurring { background: color-mix(in srgb, #5BA8A0 5%, transparent); margin: 0 -1.25rem; padding: 0.6rem 1.25rem; }
        .cal-day-event__left { display: flex; align-items: center; gap: 0.6rem; flex: 1; min-width: 0; }
        .cal-day-event__body { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
        .cal-day-event__name-row { display: flex; align-items: center; gap: 0.4rem; }
        .cal-day-event__name { font-size: 0.875rem; color: var(--p-text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cal-day-event__meta { font-size: 0.7rem; color: var(--p-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .cal-day-event__actions { display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0; }
        .cal-status-select { background: var(--p-bg); border: 1px solid var(--p-border); border-radius: 6px; padding: 0.25rem 0.4rem; color: var(--p-muted); font-size: 0.7rem; font-family: var(--p-font-body); cursor: pointer; outline: none; }
        .cal-day-event__start { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: none; background: var(--p-accent); color: #0D0D0D; cursor: pointer; transition: opacity 0.15s ease; }
        .cal-day-event__start:hover { opacity: 0.85; }
        .cal-day-event__remove { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--p-border); background: none; color: var(--p-muted); cursor: pointer; transition: all 0.15s ease; }
        .cal-day-event__remove:hover { color: #E8734A; border-color: #E8734A; }

        .cal-add-day-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.75rem; border-radius: 10px; border: 1px dashed var(--p-border); background: none; color: var(--p-muted); font-size: 0.85rem; font-family: var(--p-font-body); cursor: pointer; transition: all 0.15s ease; }
        .cal-add-day-btn:hover { color: var(--p-text); border-color: var(--p-muted); }

        .cal-replan-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.55rem 0.85rem; border-radius: 8px;
          border: 1px solid var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 8%, transparent);
          color: var(--p-accent); font-size: 0.78rem; font-family: var(--p-font-body);
          cursor: pointer; margin-bottom: 0.75rem; transition: opacity 0.15s ease;
          font-weight: 600; letter-spacing: 0.03em;
        }
        .cal-replan-btn:hover { opacity: 0.8; }
        .cal-replan-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    `}</style>
        </div>
    )
}