import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Check, Pencil, X } from 'lucide-react'
import { usePreferences } from '../hooks/usePreferences'
import { usePlanner } from '../hooks/usePlanner'
import { useRunConfigs } from '../hooks/useRunConfigs'
import type { RunConfig, ProgressionType } from '../types/runConfig'
import type {
    UserPreferences,
    DayAvailability,
    PreferredTime,
    RecoveryRule,
    ActivityWindow,
    Intensity,
    MuscleLoad,
} from '../types/preferences'
import type { SessionCategory } from '../types/session'
import type { BodyArea } from '../types/exercise'

// ── Constants ─────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PREFERRED_TIMES: { value: PreferredTime; label: string }[] = [
    { value: 'morning', label: 'Morning' },
    { value: 'midday', label: 'Midday' },
    { value: 'afternoon', label: 'Afternoon' },
    { value: 'evening', label: 'Evening' },
]

const SESSION_CATEGORIES: { value: SessionCategory; label: string }[] = [
    { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'strength', label: 'Strength' },
    { value: 'mobility', label: 'Mobility' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'running', label: 'Running' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'hiking', label: 'Hiking' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'climbing', label: 'Climbing' },
]

const BODY_AREAS: BodyArea[] = [
    'full-body', 'upper-body', 'lower-body', 'core',
    'chest', 'back', 'shoulders', 'arms',
    'wrists', 'hips', 'legs', 'ankles', 'spine',
]

const COMMON_SENSITIVITIES = ['knees', 'wrists', 'lower back', 'shoulders', 'ankles', 'hips', 'neck']

function generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
}

function emptyWindow(): ActivityWindow {
    return {
        id: generateId(),
        name: '',
        category: 'calisthenics',
        allowedDays: [0, 1, 2, 3, 4, 5, 6],
        preferredDuration: 45,
        targetAreas: [],
        active: true,
    }
}

// ── Day availability row ──────────────────────────────────────────────────────

function DayRow({ dayIdx, avail, onChange }: {
    dayIdx: number
    avail: DayAvailability
    onChange: (next: DayAvailability) => void
}) {
    return (
        <div className="pr-day-row">
            <div className="pr-day-row__name">
                <button
                    type="button"
                    className={['pr-day-toggle', avail.available ? 'pr-day-toggle--on' : ''].join(' ')}
                    onClick={() => onChange({ ...avail, available: !avail.available })}
                >
                    <span className="pr-day-toggle__dot" />
                </button>
                <span className={['pr-day-label', !avail.available ? 'pr-day-label--off' : ''].join(' ')}>
                    {DAY_NAMES[dayIdx]}
                </span>
            </div>
            {avail.available && (
                <div className="pr-day-row__controls">
                    <div className="pr-inline-field">
                        <span className="pr-inline-label">Max</span>
                        <input
                            type="number" min={15} max={480} step={15}
                            className="pr-input pr-input--num"
                            value={avail.maxMinutes ?? ''}
                            onChange={e => onChange({ ...avail, maxMinutes: Number(e.target.value) || undefined })}
                            placeholder="—"
                        />
                        <span className="pr-inline-label">min</span>
                    </div>
                    <select
                        className="pr-select"
                        value={avail.preferredTime ?? ''}
                        onChange={e => onChange({ ...avail, preferredTime: (e.target.value as PreferredTime) || undefined })}
                    >
                        <option value="">Any time</option>
                        {PREFERRED_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>
            )}
            {avail.available && (
                <input
                    className="pr-input pr-input--note"
                    value={avail.note ?? ''}
                    onChange={e => onChange({ ...avail, note: e.target.value || undefined })}
                    placeholder="Note (e.g. Swimming at 12:00)"
                />
            )}
        </div>
    )
}

// ── Recovery rule row ─────────────────────────────────────────────────────────

function RecoveryRuleRow({ rule, onChange, onRemove }: {
    rule: RecoveryRule
    onChange: (next: RecoveryRule) => void
    onRemove: () => void
}) {
    return (
        <div className="pr-rule-row">
            <div className="pr-rule-row__top">
                <input
                    className="pr-input pr-input--flex"
                    value={rule.label}
                    onChange={e => onChange({ ...rule, label: e.target.value })}
                    placeholder="e.g. Hard lower body"
                />
                <div className="pr-inline-field">
                    <input
                        type="number" min={12} max={168} step={12}
                        className="pr-input pr-input--num"
                        value={rule.minHoursBetween}
                        onChange={e => onChange({ ...rule, minHoursBetween: Number(e.target.value) || 48 })}
                    />
                    <span className="pr-inline-label">h min</span>
                </div>
                <button type="button" className="pr-icon-btn pr-icon-btn--danger" onClick={onRemove}>
                    <Trash2 size={14} />
                </button>
            </div>
            <input
                className="pr-input pr-input--note"
                value={rule.tags.join(', ')}
                onChange={e => onChange({ ...rule, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Session tags this applies to (comma separated)"
            />
        </div>
    )
}

// ── Activity window form ──────────────────────────────────────────────────────

function WindowForm({ initial, onSave, onCancel }: {
    initial: ActivityWindow
    onSave: (w: ActivityWindow) => void
    onCancel: () => void
}) {
    const [w, setW] = useState<ActivityWindow>(initial)
    const set = <K extends keyof ActivityWindow>(k: K, v: ActivityWindow[K]) =>
        setW(prev => ({ ...prev, [k]: v }))

    function toggleDay(day: number) {
        const days = w.allowedDays.includes(day)
            ? w.allowedDays.filter(d => d !== day)
            : [...w.allowedDays, day].sort()
        set('allowedDays', days)
    }

    function toggleArea(area: BodyArea) {
        const areas = w.targetAreas ?? []
        set('targetAreas', areas.includes(area)
            ? areas.filter(a => a !== area)
            : [...areas, area])
    }

    const valid = w.name.trim() && w.allowedDays.length > 0

    return (
        <div className="obj-form-overlay" onClick={onCancel}>
            <div className="obj-form" onClick={e => e.stopPropagation()}>
                <div className="obj-form__header">
                    <span className="obj-form__title">
                        {initial.name ? 'Edit window' : 'New activity window'}
                    </span>
                    <button className="pr-icon-btn" onClick={onCancel}><X size={16} /></button>
                </div>

                <div className="obj-form__body">
                    {/* Name */}
                    <div className="pr-field">
                        <label className="pr-label">Name *</label>
                        <input
                            className="pr-input"
                            value={w.name}
                            onChange={e => set('name', e.target.value)}
                            placeholder="e.g. Pool, Bike, Body"
                        />
                    </div>

                    {/* Category */}
                    <div className="pr-field">
                        <label className="pr-label">Activity type *</label>
                        <div className="pr-chips">
                            {SESSION_CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={['pr-chip', w.category === cat.value ? 'pr-chip--active' : ''].join(' ')}
                                    onClick={() => set('category', cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Allowed days */}
                    <div className="pr-field">
                        <label className="pr-label">Available on *</label>
                        <div className="aw-days">
                            {DAY_SHORT.map((label, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={['aw-day-btn', w.allowedDays.includes(i) ? 'aw-day-btn--active' : ''].join(' ')}
                                    onClick={() => toggleDay(i)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {w.allowedDays.length === 7 && (
                            <p className="pr-field-hint">Every day — planner will find the best slots.</p>
                        )}
                    </div>

                    {/* Preferred duration */}
                    <div className="pr-field">
                        <label className="pr-label">Preferred duration</label>
                        <div className="pr-inline-field">
                            <input
                                type="number" min={15} max={300} step={5}
                                className="pr-input pr-input--num"
                                value={w.preferredDuration ?? ''}
                                onChange={e => set('preferredDuration', Number(e.target.value) || undefined)}
                                placeholder="45"
                            />
                            <span className="pr-inline-label">min</span>
                        </div>
                        <p className="pr-field-hint">Planner picks the session closest to this duration.</p>
                    </div>

                    {/* Target areas */}
                    <div className="pr-field">
                        <label className="pr-label">Focus areas (optional)</label>
                        <div className="pr-chips">
                            {BODY_AREAS.map(area => (
                                <button
                                    key={area}
                                    type="button"
                                    className={['pr-chip', (w.targetAreas ?? []).includes(area) ? 'pr-chip--active' : ''].join(' ')}
                                    onClick={() => toggleArea(area)}
                                >
                                    {(w.targetAreas ?? []).includes(area) && <Check size={11} strokeWidth={3} />}
                                    {area}
                                </button>
                            ))}
                        </div>
                        <p className="pr-field-hint">Planner prefers sessions targeting these areas.</p>
                    </div>

                    {/* Muscle load */}
                    <div className="pr-field">
                        <label className="pr-label">Muscle groups loaded</label>
                        <div className="pr-chips">
                            {BODY_AREAS.map(area => (
                                <button
                                    key={area} type="button"
                                    className={['pr-chip', (w.muscleLoad?.areas ?? []).includes(area) ? 'pr-chip--active' : ''].join(' ')}
                                    onClick={() => {
                                        const areas = w.muscleLoad?.areas ?? []
                                        const next = areas.includes(area) ? areas.filter(a => a !== area) : [...areas, area]
                                        set('muscleLoad', next.length === 0 ? undefined : {
                                            areas: next,
                                            defaultIntensity: w.muscleLoad?.defaultIntensity ?? 'medium',
                                            recoveryHours: w.muscleLoad?.recoveryHours ?? { light: 12, medium: 24, hard: 48 },
                                        })
                                    }}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                        <p className="pr-field-hint">Used to calculate recovery time between sessions.</p>
                    </div>

                    {w.muscleLoad && w.muscleLoad.areas.length > 0 && (
                        <>
                            <div className="pr-field">
                                <label className="pr-label">Default intensity</label>
                                <div className="pr-chips">
                                    {(['light', 'medium', 'hard'] as Intensity[]).map(lvl => (
                                        <button key={lvl} type="button"
                                            className={['pr-chip', w.muscleLoad?.defaultIntensity === lvl ? 'pr-chip--active' : ''].join(' ')}
                                            onClick={() => set('muscleLoad', { ...w.muscleLoad!, defaultIntensity: lvl })}
                                        >
                                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <p className="pr-field-hint">Used when no session feedback is recorded.</p>
                            </div>

                            <div className="pr-field">
                                <label className="pr-label">Recovery hours</label>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {(['light', 'medium', 'hard'] as Intensity[]).map(lvl => (
                                        <div key={lvl} className="pr-inline-field">
                                            <span className="pr-inline-label">{lvl.charAt(0).toUpperCase() + lvl.slice(1)}</span>
                                            <input type="number" min={0} max={168} step={6}
                                                className="pr-input pr-input--num"
                                                value={w.muscleLoad?.recoveryHours[lvl] ?? (lvl === 'light' ? 12 : lvl === 'medium' ? 24 : 48)}
                                                onChange={e => set('muscleLoad', {
                                                    ...w.muscleLoad!,
                                                    recoveryHours: { ...w.muscleLoad!.recoveryHours, [lvl]: Number(e.target.value) || 0 },
                                                })}
                                            />
                                            <span className="pr-inline-label">h</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Active */}
                    <div className="pr-field">
                        <div className="pr-inline-field" style={{ gap: '0.75rem' }}>
                            <button
                                type="button"
                                className={['pr-day-toggle', w.active ? 'pr-day-toggle--on' : ''].join(' ')}
                                onClick={() => set('active', !w.active)}
                            >
                                <span className="pr-day-toggle__dot" />
                            </button>
                            <span className="pr-label" style={{ margin: 0 }}>Active</span>
                        </div>
                    </div>
                </div>

                <div className="obj-form__footer">
                    <button type="button" className="obj-cancel-btn" onClick={onCancel}>Cancel</button>
                    <button
                        type="button"
                        className="obj-save-btn"
                        onClick={() => valid && onSave(w)}
                        disabled={!valid}
                    >
                        Save window
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Window card ───────────────────────────────────────────────────────────────

function WindowCard({ w, onEdit, onRemove, onToggle }: {
    w: ActivityWindow
    onEdit: () => void
    onRemove: () => void
    onToggle: () => void
}) {
    const catLabel = SESSION_CATEGORIES.find(c => c.value === w.category)?.label ?? w.category
    const dayLabels = w.allowedDays.length === 7
        ? 'Every day'
        : w.allowedDays.map(d => DAY_SHORT[d]).join(' · ')

    const muscleInfo = w.muscleLoad && w.muscleLoad.areas.length > 0
        ? `${w.muscleLoad.areas.slice(0, 2).join(', ')} · ${w.muscleLoad.defaultIntensity} default`
        : null

    return (
        <div className={['obj-card', !w.active ? 'obj-card--inactive' : ''].join(' ')}>
            <div className="obj-card__left">
                <button
                    type="button"
                    className={['pr-day-toggle', w.active ? 'pr-day-toggle--on' : ''].join(' ')}
                    onClick={onToggle}
                    style={{ flexShrink: 0 }}
                >
                    <span className="pr-day-toggle__dot" />
                </button>
                <div className="obj-card__body">
                    <span className="obj-card__title">{w.name}</span>
                    <span className="obj-card__meta">{catLabel}</span>
                    <span className="obj-card__cats">{dayLabels}</span>
                    {w.preferredDuration && (
                        <span className="obj-card__strategy">~{w.preferredDuration} min preferred</span>
                    )}
                    {muscleInfo && (
                        <span className="obj-card__strategy">Load: {muscleInfo}</span>
                    )}
                </div>
            </div>
            <div className="obj-card__actions">
                <button className="pr-icon-btn" onClick={onEdit}><Pencil size={14} /></button>
                <button className="pr-icon-btn pr-icon-btn--danger" onClick={onRemove}><Trash2 size={14} /></button>
            </div>
        </div>
    )
}

// ── Sensitivity editor ────────────────────────────────────────────────────────

function SensitivityEditor({ values, onChange }: {
    values: string[]
    onChange: (next: string[]) => void
}) {
    const [custom, setCustom] = useState('')
    function toggle(s: string) {
        onChange(values.includes(s) ? values.filter(v => v !== s) : [...values, s])
    }
    function addCustom() {
        const trimmed = custom.trim().toLowerCase()
        if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed])
        setCustom('')
    }

    return (
        <div className="pr-sensitivity">
            <div className="pr-chips">
                {COMMON_SENSITIVITIES.map(s => (
                    <button
                        key={s} type="button"
                        className={['pr-chip', values.includes(s) ? 'pr-chip--active' : ''].join(' ')}
                        onClick={() => toggle(s)}
                    >
                        {values.includes(s) && <Check size={11} strokeWidth={3} />}
                        {s}
                    </button>
                ))}
            </div>
            {values.filter(v => !COMMON_SENSITIVITIES.includes(v)).map(v => (
                <div key={v} className="pr-custom-tag">
                    <span>{v}</span>
                    <button type="button" className="pr-icon-btn" onClick={() => onChange(values.filter(x => x !== v))}>
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
            <div className="pr-add-row">
                <input
                    className="pr-input pr-input--flex"
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    placeholder="Add other sensitivity…"
                />
                <button type="button" className="pr-icon-btn" onClick={addCustom}>
                    <Plus size={15} />
                </button>
            </div>
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PreferencesPage() {
    const navigate = useNavigate()
    const { prefs, loading, savePrefs } = usePreferences()
    const { replan } = usePlanner()
    const { runConfigs, createRunConfig, deleteRunConfig } = useRunConfigs()
    const [showNewRun, setShowNewRun] = useState(false)
    const [newRunName, setNewRunName] = useState('')
    const [newRunTarget, setNewRunTarget] = useState(3)
    const [newRunStep, setNewRunStep] = useState(0.5)
    const [newRunMax, setNewRunMax] = useState<number | undefined>(undefined)
    const [newRunProgType, setNewRunProgType] = useState<ProgressionType>('fixed')
    const [local, setLocal] = useState<UserPreferences | null>(null)
    const [saved, setSaved] = useState(false)
    const [replanning, setReplanning] = useState(false)
    const [editingWindow, setEditingWindow] = useState<ActivityWindow | null>(null)
    const [showNewWindow, setShowNewWindow] = useState(false)

    const current: UserPreferences = {
        ...prefs,
        activityWindows: prefs.activityWindows ?? [],
        recoveryRules: prefs.recoveryRules ?? [],
        ...(local ?? {}),
    }

    if (loading) {
        return (
            <div className="poise-page">
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back
                </button>
                <p style={{ color: 'var(--p-muted)', fontSize: '0.85rem' }}>Loading…</p>
            </div>
        )
    }

    function patch(next: Partial<UserPreferences>) {
        setLocal({ ...current, ...next })
        setSaved(false)
    }

    function saveWindow(w: ActivityWindow) {
        const exists = current.activityWindows.some(aw => aw.id === w.id)
        patch({
            activityWindows: exists
                ? current.activityWindows.map(aw => aw.id === w.id ? w : aw)
                : [...current.activityWindows, w],
        })
        setEditingWindow(null)
        setShowNewWindow(false)
    }

    function removeWindow(id: string) {
        patch({ activityWindows: current.activityWindows.filter(w => w.id !== id) })
    }

    function toggleWindow(id: string) {
        patch({
            activityWindows: current.activityWindows.map(w =>
                w.id === id ? { ...w, active: !w.active } : w
            ),
        })
    }

    async function handleSave() {
        await savePrefs(current)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    async function handleSaveAndReplan() {
        setReplanning(true)
        await new Promise(r => setTimeout(r, 0))
        try {
            await savePrefs(current)
            await replan()
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } finally {
            setReplanning(false)
        }
    }

    return (
        <div className="poise-page">
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            <h1 className="poise-page__title">Preferences</h1>

            <div className="pr-form">

                {/* Activity windows */}
                <section className="pr-section">
                    <div className="pr-section-header">
                        <h2 className="pr-section-title">Activity windows</h2>
                        <button type="button" className="pr-add-link" onClick={() => setShowNewWindow(true)}>
                            <Plus size={13} /> Add window
                        </button>
                    </div>
                    <p className="pr-section-desc">
                        Define what activities you can do and when. The planner fills your calendar based on these windows and your availability.
                    </p>
                    {current.activityWindows.length === 0 && (
                        <p className="pr-empty">No windows yet. Add one to activate the planner.</p>
                    )}
                    <div className="pr-obj-list">
                        {current.activityWindows.map(w => (
                            <WindowCard
                                key={w.id}
                                w={w}
                                onEdit={() => setEditingWindow(w)}
                                onRemove={() => removeWindow(w.id)}
                                onToggle={() => toggleWindow(w.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* Weekly availability */}
                <section className="pr-section">
                    <h2 className="pr-section-title">Weekly availability</h2>
                    <p className="pr-section-desc">How much time you have each day.</p>
                    <div className="pr-days">
                        {Array.from({ length: 7 }, (_, i) => (
                            <DayRow
                                key={i}
                                dayIdx={i}
                                avail={current.availability[i] ?? { available: false }}
                                onChange={avail => patch({ availability: { ...current.availability, [i]: avail } })}
                            />
                        ))}
                    </div>
                </section>

                {/* Recovery rules */}
                {/* <section className="pr-section">
                    <div className="pr-section-header">
                        <h2 className="pr-section-title">Recovery rules</h2>
                        <button type="button" className="pr-add-link" onClick={() =>
                            patch({ recoveryRules: [...current.recoveryRules, { id: generateId(), label: '', tags: [], minHoursBetween: 48 }] })
                        }>
                            <Plus size={13} /> Add rule
                        </button>
                    </div>
                    <p className="pr-section-desc">Minimum rest between certain types of sessions.</p>
                    {current.recoveryRules.length === 0 && (
                        <p className="pr-empty">No recovery rules set yet.</p>
                    )}
                    <div className="pr-rule-list">
                        {current.recoveryRules.map(rule => (
                            <RecoveryRuleRow
                                key={rule.id}
                                rule={rule}
                                onChange={next => patch({ recoveryRules: current.recoveryRules.map(r => r.id === rule.id ? next : r) })}
                                onRemove={() => patch({ recoveryRules: current.recoveryRules.filter(r => r.id !== rule.id) })}
                            />
                        ))}
                    </div>
                </section> */}

                {/* Sensitivities */}
                <section className="pr-section">
                    <h2 className="pr-section-title">Physical sensitivities</h2>
                    <p className="pr-section-desc">Areas to be mindful of. Not medical advice.</p>
                    <SensitivityEditor
                        values={current.constraints.sensitivities}
                        onChange={s => patch({ constraints: { ...current.constraints, sensitivities: s } })}
                    />
                </section>

                {/* Run progressions */}
                <section className="pr-section">
                    <div className="pr-section-header">
                        <h2 className="pr-section-title">Run progressions</h2>
                        <button type="button" className="pr-add-link" onClick={() => setShowNewRun(r => !r)}>
                            <Plus size={13} /> Add run
                        </button>
                    </div>
                    <p className="pr-section-desc">
                        Define a run with progressive distance. The planner embeds the current target when scheduling runs.
                    </p>

                    {runConfigs.map(cfg => (
                        <div key={cfg.id} className="pr-rule-row">
                            <div className="pr-rule-row__top">
                                <div style={{ flex: 1 }}>
                                    <div className="pr-day-label">{cfg.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--p-muted)', marginTop: 2 }}>
                                        Current target: <span style={{ color: 'var(--p-accent)', fontWeight: 600 }}>{cfg.currentTargetKm} km</span>
                                        {' · '}{cfg.progressionType === 'fixed' ? `+${cfg.progressionValue} km/run` : `+${cfg.progressionValue}%/run`}
                                        {cfg.maxKm ? ` · max ${cfg.maxKm} km` : ''}
                                    </div>
                                    {cfg.history.length > 0 && (
                                        <div style={{ fontSize: '0.72rem', color: 'var(--p-muted)', marginTop: 2 }}>
                                            Last run: {cfg.history[cfg.history.length - 1].actualKm} km on {cfg.history[cfg.history.length - 1].date}
                                        </div>
                                    )}
                                </div>
                                <button type="button" className="pr-icon-btn pr-icon-btn--danger" onClick={() => deleteRunConfig(cfg.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {showNewRun && (
                        <div className="pr-rule-row" style={{ flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="pr-rule-row__top">
                                <input
                                    className="pr-input pr-input--flex"
                                    value={newRunName}
                                    onChange={e => setNewRunName(e.target.value)}
                                    placeholder="e.g. Morning Run"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <div className="pr-inline-field">
                                    <span className="pr-inline-label">Start</span>
                                    <input type="number" min={0.5} max={100} step={0.5}
                                        className="pr-input pr-input--num" value={newRunTarget}
                                        onChange={e => setNewRunTarget(parseFloat(e.target.value) || 3)} />
                                    <span className="pr-inline-label">km</span>
                                </div>
                                <div className="pr-inline-field">
                                    <span className="pr-inline-label">Step</span>
                                    <input type="number" min={0.1} max={20} step={0.1}
                                        className="pr-input pr-input--num" value={newRunStep}
                                        onChange={e => setNewRunStep(parseFloat(e.target.value) || 0.5)} />
                                    <select className="pr-select" value={newRunProgType}
                                        onChange={e => setNewRunProgType(e.target.value as ProgressionType)}>
                                        <option value="fixed">km</option>
                                        <option value="percentage">%</option>
                                    </select>
                                </div>
                                <div className="pr-inline-field">
                                    <span className="pr-inline-label">Max</span>
                                    <input type="number" min={0} max={200} step={1}
                                        className="pr-input pr-input--num" value={newRunMax ?? ''}
                                        onChange={e => setNewRunMax(parseFloat(e.target.value) || undefined)}
                                        placeholder="—" />
                                    <span className="pr-inline-label">km</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" className="obj-cancel-btn" onClick={() => setShowNewRun(false)}>Cancel</button>
                                <button
                                    type="button" className="obj-save-btn"
                                    disabled={!newRunName.trim()}
                                    onClick={async () => {
                                        await createRunConfig({
                                            name: newRunName.trim(),
                                            currentTargetKm: newRunTarget,
                                            progressionType: newRunProgType,
                                            progressionValue: newRunStep,
                                            maxKm: newRunMax,
                                        })
                                        setShowNewRun(false)
                                        setNewRunName('')
                                        setNewRunTarget(3)
                                        setNewRunStep(0.5)
                                        setNewRunMax(undefined)
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* Save buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        type="button"
                        className="pr-save pr-save--replan"
                        onClick={handleSaveAndReplan}
                        disabled={replanning}
                    >
                        {replanning ? 'Planning…' : 'Save & replan calendar'}
                    </button>
                    <button
                        type="button"
                        className={['pr-save pr-save--quiet', saved ? 'pr-save--saved' : ''].join(' ')}
                        onClick={handleSave}
                    >
                        {saved ? <><Check size={16} strokeWidth={3} /> Saved</> : 'Save only'}
                    </button>
                </div>

            </div>

            {/* Window form overlay */}
            {(showNewWindow || editingWindow) && (
                <WindowForm
                    initial={editingWindow ?? emptyWindow()}
                    onSave={saveWindow}
                    onCancel={() => { setEditingWindow(null); setShowNewWindow(false) }}
                />
            )}

            <style>{`
        .pr-form { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 3rem; }
        .pr-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .pr-section-header { display: flex; align-items: center; justify-content: space-between; }
        .pr-section-title {
          font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--p-muted); font-weight: 600;
          padding-bottom: 0.5rem; border-bottom: 1px solid var(--p-border); flex: 1;
        }
        .pr-section-desc { font-size: 0.8rem; color: var(--p-muted); line-height: 1.5; margin: 0; }
        .pr-field-hint { font-size: 0.72rem; color: var(--p-muted); margin: 0.25rem 0 0; font-style: italic; }
        .pr-add-link {
          display: inline-flex; align-items: center; gap: 0.25rem;
          background: none; border: none; color: var(--p-accent);
          font-size: 0.75rem; cursor: pointer; font-family: var(--p-font-body);
          padding: 0 0 0 0.75rem; transition: opacity 0.15s ease;
        }
        .pr-add-link:hover { opacity: 0.75; }
        .pr-empty { font-size: 0.8rem; color: var(--p-border); margin: 0; font-style: italic; }
        .pr-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .pr-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--p-muted); font-weight: 600; }

        .pr-days { display: flex; flex-direction: column; gap: 0.25rem; }
        .pr-day-row { display: flex; flex-direction: column; gap: 0.4rem; padding: 0.75rem; background: var(--p-surface); border: 1px solid var(--p-border); border-radius: 8px; }
        .pr-day-row__name { display: flex; align-items: center; gap: 0.75rem; }
        .pr-day-toggle { width: 36px; height: 20px; border-radius: 10px; border: none; cursor: pointer; padding: 2px; display: flex; align-items: center; background: var(--p-border); transition: background 0.2s ease; flex-shrink: 0; }
        .pr-day-toggle--on { background: var(--p-accent); justify-content: flex-end; }
        .pr-day-toggle__dot { width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
        .pr-day-label { font-size: 0.875rem; color: var(--p-text); font-weight: 500; }
        .pr-day-label--off { color: var(--p-muted); }
        .pr-day-row__controls { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

        .pr-input { background: var(--p-bg); border: 1px solid var(--p-border); border-radius: 7px; padding: 0.5rem 0.7rem; color: var(--p-text); font-size: 0.875rem; font-family: var(--p-font-body); outline: none; transition: border-color 0.15s ease; width: 100%; box-sizing: border-box; }
        .pr-input:focus { border-color: var(--p-accent); }
        .pr-input--num { width: 64px; text-align: center; padding: 0.5rem 0.4rem; }
        .pr-input--flex { flex: 1; }
        .pr-input--note { font-size: 0.78rem; }
        .pr-select { background: var(--p-bg); border: 1px solid var(--p-border); border-radius: 7px; padding: 0.5rem 0.6rem; color: var(--p-text); font-size: 0.8rem; font-family: var(--p-font-body); outline: none; cursor: pointer; }
        .pr-inline-field { display: flex; align-items: center; gap: 0.4rem; }
        .pr-inline-label { font-size: 0.72rem; color: var(--p-muted); white-space: nowrap; }

        .pr-icon-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; border: none; background: transparent; color: var(--p-muted); cursor: pointer; transition: all 0.15s ease; flex-shrink: 0; }
        .pr-icon-btn:hover { color: var(--p-text); background: var(--p-border); }
        .pr-icon-btn--danger:hover { color: #E8734A !important; }

        .pr-rule-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .pr-rule-row { display: flex; flex-direction: column; gap: 0.4rem; padding: 0.75rem; background: var(--p-surface); border: 1px solid var(--p-border); border-radius: 8px; }
        .pr-rule-row__top { display: flex; align-items: center; gap: 0.5rem; }

        .pr-obj-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .obj-card { display: flex; align-items: flex-start; justify-content: space-between; padding: 0.85rem; background: var(--p-surface); border: 1px solid var(--p-border); border-radius: 10px; gap: 0.75rem; transition: opacity 0.15s ease; }
        .obj-card--inactive { opacity: 0.45; }
        .obj-card__left { display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; }
        .obj-card__body { display: flex; flex-direction: column; gap: 0.2rem; }
        .obj-card__title { font-size: 0.9rem; font-weight: 600; color: var(--p-text); }
        .obj-card__meta { font-size: 0.72rem; color: var(--p-accent); text-transform: uppercase; letter-spacing: 0.06em; }
        .obj-card__cats { font-size: 0.75rem; color: var(--p-text); }
        .obj-card__strategy { font-size: 0.72rem; color: var(--p-muted); font-style: italic; }
        .obj-card__actions { display: flex; gap: 0.25rem; flex-shrink: 0; }

        .pr-sensitivity { display: flex; flex-direction: column; gap: 0.6rem; }
        .pr-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .pr-chip { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--p-border); background: transparent; color: var(--p-muted); font-size: 0.75rem; cursor: pointer; font-family: var(--p-font-body); transition: all 0.15s ease; }
        .pr-chip:hover { color: var(--p-text); border-color: var(--p-muted); }
        .pr-chip--active { background: color-mix(in srgb, var(--p-accent) 12%, transparent); border-color: var(--p-accent); color: var(--p-accent); }
        .pr-custom-tag { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--p-border); color: var(--p-text); font-size: 0.78rem; align-self: flex-start; }
        .pr-add-row { display: flex; align-items: center; gap: 0.5rem; }

        /* Activity window day buttons */
        .aw-days { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .aw-day-btn { width: 44px; height: 44px; border-radius: 8px; border: 1px solid var(--p-border); background: transparent; color: var(--p-muted); font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: var(--p-font-body); transition: all 0.15s ease; }
        .aw-day-btn:hover { border-color: var(--p-muted); color: var(--p-text); }
        .aw-day-btn--active { background: var(--p-accent); border-color: var(--p-accent); color: #0D0D0D; }

        .pr-save { width: 100%; padding: 0.9rem; border-radius: 10px; border: none; font-size: 0.9rem; font-weight: 700; font-family: var(--p-font-body); cursor: pointer; letter-spacing: 0.04em; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .pr-save--replan { background: var(--p-accent); color: #0D0D0D; }
        .pr-save--replan:disabled { opacity: 0.5; cursor: not-allowed; }
        .pr-save--quiet { background: var(--p-surface); color: var(--p-muted); border: 1px solid var(--p-border); }
        .pr-save--saved { background: #6BCB77 !important; color: #0D0D0D !important; border-color: #6BCB77 !important; }
        .pr-save:not(:disabled):hover { opacity: 0.9; }

        .obj-form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 80; display: flex; align-items: flex-end; }
        .obj-form { width: 100%; background: var(--p-surface); border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border); max-height: 85dvh; display: flex; flex-direction: column; overflow: hidden; }
        .obj-form__header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border); flex-shrink: 0; }
        .obj-form__title { font-size: 0.875rem; font-weight: 600; color: var(--p-text); }
        .obj-form__body { flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .obj-form__footer { display: flex; gap: 0.75rem; padding: 1rem 1.25rem; border-top: 1px solid var(--p-border); flex-shrink: 0; }
        .obj-cancel-btn { flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--p-border); background: transparent; color: var(--p-muted); font-size: 0.85rem; font-family: var(--p-font-body); cursor: pointer; }
        .obj-save-btn { flex: 2; padding: 0.75rem; border-radius: 8px; border: none; background: var(--p-accent); color: #0D0D0D; font-size: 0.85rem; font-weight: 700; font-family: var(--p-font-body); cursor: pointer; transition: opacity 0.15s ease; }
        .obj-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
        </div>
    )
}