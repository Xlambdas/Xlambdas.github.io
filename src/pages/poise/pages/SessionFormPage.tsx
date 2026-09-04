import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Search, X } from 'lucide-react'
import { useSessions } from '../hooks/useSessions'
import { useExercises } from '../hooks/useExercises'
import type { Session, SessionCategory, SessionBlock, SessionExercise } from '../types/session'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: SessionCategory; label: string }[] = [
    { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'strength', label: 'Strength' },
    { value: 'mobility', label: 'Mobility' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'hiking', label: 'Hiking' },
    { value: 'cycling', label: 'Cycling' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'climbing', label: 'Climbing' },
    { value: 'morning-routine', label: 'Morning Routine' },
    { value: 'evening-routine', label: 'Evening Routine' },
    { value: 'custom', label: 'Custom' },
]

const BLOCKS: { value: SessionBlock; label: string }[] = [
    { value: 'warm-up', label: 'Warm-up' },
    { value: 'skill', label: 'Skill' },
    { value: 'strength', label: 'Strength' },
    { value: 'pull', label: 'Pull' },
    { value: 'push', label: 'Push' },
    { value: 'legs', label: 'Legs' },
    { value: 'core', label: 'Core' },
    { value: 'cooldown', label: 'Cooldown' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'free', label: 'Free' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(name: string): string {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `${slug}-${Date.now()}`
}

function estimateDuration(exercises: SessionExercise[]): number {
    let total = 0
    for (const ex of exercises) {
        const sets = ex.sets ?? 1
        const duration = ex.duration ?? 30
        const reps = ex.reps ?? 10
        const rest = ex.rest ?? 60
        if (ex.reps) {
            // ~4 sec per rep + rest between sets
            total += sets * (reps * 4) + (sets - 1) * rest
        } else if (ex.duration) {
            total += sets * duration + (sets - 1) * rest
        } else {
            total += duration
        }
    }
    return Math.max(1, Math.round(total / 60))
}

interface FormExercise extends Omit<SessionExercise, 'order'> {
    _key: string // local unique key for React list
}

interface FormState {
    name: string
    category: SessionCategory
    difficulty: 1 | 2 | 3 | 4 | 5
    exercises: FormExercise[]
    tags: string
    notes: string
}

function emptyForm(): FormState {
    return {
        name: '',
        category: 'calisthenics',
        difficulty: 3,
        exercises: [],
        tags: '',
        notes: '',
    }
}

function sessionToForm(s: Session): FormState {
    return {
        name: s.name,
        category: s.category,
        difficulty: s.difficulty,
        exercises: s.exercises
            .sort((a, b) => a.order - b.order)
            .map(ex => ({ ...ex, _key: `${ex.exerciseId}-${Math.random()}` })),
        tags: s.tags.join(', '),
        notes: s.notes ?? '',
    }
}

function formToSession(form: FormState, id: string): Session {
    const exercises: SessionExercise[] = form.exercises.map((ex, i) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _key, ...rest } = ex
        return { ...rest, order: i }
    })
    return {
        id,
        name: form.name.trim(),
        category: form.category,
        difficulty: form.difficulty,
        estimatedDuration: estimateDuration(exercises),
        exercises,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        notes: form.notes.trim() || undefined,
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

// ── Exercise picker modal ─────────────────────────────────────────────────────

function ExercisePicker({
    onSelect,
    onClose,
    existingIds,
}: {
    onSelect: (id: string) => void
    onClose: () => void
    existingIds: string[]
}) {
    const { exercises } = useExercises()
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return exercises.filter(
            e => e.name.toLowerCase().includes(q) || e.tags.some(t => t.includes(q))
        )
    }, [exercises, query])

    return (
        <div className="picker-overlay" onClick={onClose}>
            <div className="picker-sheet" onClick={e => e.stopPropagation()}>
                <div className="picker-header">
                    <span className="picker-title">Add exercise</span>
                    <button className="picker-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="picker-search-row">
                    <Search size={14} color="var(--p-muted)" />
                    <input
                        className="picker-search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search exercises…"
                        autoFocus
                    />
                </div>

                <ul className="picker-list">
                    {filtered.map(ex => {
                        const already = existingIds.includes(ex.id)
                        return (
                            <li key={ex.id}>
                                <button
                                    className={['picker-item', already ? 'picker-item--added' : ''].join(' ')}
                                    onClick={() => { onSelect(ex.id); onClose() }}
                                    disabled={already}
                                >
                                    <div>
                                        <span className="picker-item__name">{ex.name}</span>
                                        <span className="picker-item__cat">{ex.category}</span>
                                    </div>
                                    {already && <span className="picker-item__check">✓</span>}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function SessionFormPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const { getById, saveSession } = useSessions()
    const { getById: getExercise } = useExercises()

    const isEdit = Boolean(id)
    const existing = id ? getById(id) : undefined

    const [form, setForm] = useState<FormState>(existing ? sessionToForm(existing) : emptyForm())
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (existing && !form.name) setForm(sessionToForm(existing))
    }, [existing])

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: val }))

    // ── Exercise list manipulation ─────────────────────────────────────────────

    function addExercise(exerciseId: string) {
        const ex = getExercise(exerciseId)
        if (!ex) return
        const newEx: FormExercise = {
            _key: `${exerciseId}-${Date.now()}`,
            exerciseId,
            block: 'free',
            sets: ex.defaultSets,
            reps: ex.defaultReps,
            duration: ex.duration,
            rest: 60,
        }
        set('exercises', [...form.exercises, newEx])
    }

    function removeExercise(key: string) {
        set('exercises', form.exercises.filter(e => e._key !== key))
    }

    function moveExercise(key: string, dir: -1 | 1) {
        const idx = form.exercises.findIndex(e => e._key === key)
        if (idx < 0) return
        const next = [...form.exercises]
        const swap = idx + dir
        if (swap < 0 || swap >= next.length) return
            ;[next[idx], next[swap]] = [next[swap], next[idx]]
        set('exercises', next)
    }

    function updateExercise(key: string, patch: Partial<FormExercise>) {
        set('exercises', form.exercises.map(e => e._key === key ? { ...e, ...patch } : e))
    }

    // ── Validation & submit ────────────────────────────────────────────────────

    function validate(): boolean {
        const next: Record<string, string> = {}
        if (!form.name.trim()) next.name = 'Name is required'
        if (form.exercises.length === 0) next.exercises = 'Add at least one exercise'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit() {
        if (!validate()) return
        setSaving(true)
        try {
            const sessionId = isEdit && id ? id : generateId(form.name)
            await saveSession(formToSession(form, sessionId))
            navigate(`/sandbox/poise/sessions/${sessionId}`)
        } catch {
            setErrors({ name: 'Failed to save. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    const estimatedDuration = estimateDuration(
        form.exercises.map((e, i) => ({ ...e, order: i }))
    )

    return (
        <div className="poise-page">
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                {isEdit ? 'Session' : 'Sessions'}
            </button>

            <h1 className="poise-page__title">{isEdit ? 'Edit session' : 'New session'}</h1>

            <div className="sf-form">

                {/* Name */}
                <div className="sf-field">
                    <label className="sf-label">Name *</label>
                    <input
                        className={['sf-input', errors.name ? 'sf-input--error' : ''].join(' ')}
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Calisthenics Upper A"
                    />
                    {errors.name && <span className="sf-error">{errors.name}</span>}
                </div>

                {/* Category */}
                <div className="sf-field">
                    <label className="sf-label">Category</label>
                    <div className="sf-chips">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                type="button"
                                className={['sf-chip', form.category === cat.value ? 'sf-chip--active' : ''].join(' ')}
                                onClick={() => set('category', cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="sf-field">
                    <label className="sf-label">Difficulty</label>
                    <div className="sf-chips">
                        {([1, 2, 3, 4, 5] as const).map(level => (
                            <button
                                key={level}
                                type="button"
                                className={['sf-chip', form.difficulty === level ? 'sf-chip--active' : ''].join(' ')}
                                onClick={() => set('difficulty', level)}
                            >
                                {['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Advanced'][level]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Exercises */}
                <div className="sf-field">
                    <div className="sf-exercises-header">
                        <label className="sf-label">
                            Exercises *
                            {estimatedDuration > 0 && (
                                <span className="sf-duration-hint"> · ~{estimatedDuration} min</span>
                            )}
                        </label>
                    </div>

                    {errors.exercises && <span className="sf-error">{errors.exercises}</span>}

                    {form.exercises.length > 0 && (
                        <div className="sf-exercise-list">
                            {form.exercises.map((item, idx) => {
                                const exercise = getExercise(item.exerciseId)
                                if (!exercise) return null
                                return (
                                    <div key={item._key} className="sf-exercise-card">
                                        {/* Exercise name + reorder + remove */}
                                        <div className="sf-exercise-card__header">
                                            <span className="sf-exercise-card__name">{exercise.name}</span>
                                            <div className="sf-exercise-card__actions">
                                                <button
                                                    type="button"
                                                    className="sf-icon-btn"
                                                    onClick={() => moveExercise(item._key, -1)}
                                                    disabled={idx === 0}
                                                >
                                                    <ChevronUp size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="sf-icon-btn"
                                                    onClick={() => moveExercise(item._key, 1)}
                                                    disabled={idx === form.exercises.length - 1}
                                                >
                                                    <ChevronDown size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="sf-icon-btn sf-icon-btn--danger"
                                                    onClick={() => removeExercise(item._key)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Block */}
                                        <div className="sf-exercise-card__row">
                                            <span className="sf-inline-label">Block</span>
                                            <select
                                                className="sf-select"
                                                value={item.block}
                                                onChange={e => updateExercise(item._key, { block: e.target.value as SessionBlock })}
                                            >
                                                {BLOCKS.map(b => (
                                                    <option key={b.value} value={b.value}>{b.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Sets / Reps / Duration / Rest */}
                                        <div className="sf-exercise-card__row sf-exercise-card__row--wrap">
                                            {exercise.type !== 'duration' && (
                                                <div className="sf-num-field">
                                                    <span className="sf-inline-label">Sets</span>
                                                    <input
                                                        type="number" min={1} max={20}
                                                        className="sf-input sf-input--num"
                                                        value={item.sets ?? ''}
                                                        onChange={e => updateExercise(item._key, { sets: Number(e.target.value) || undefined })}
                                                    />
                                                </div>
                                            )}
                                            {exercise.type === 'reps' && (
                                                <div className="sf-num-field">
                                                    <span className="sf-inline-label">Reps</span>
                                                    <input
                                                        type="number" min={1} max={200}
                                                        className="sf-input sf-input--num"
                                                        value={item.reps ?? ''}
                                                        onChange={e => updateExercise(item._key, { reps: Number(e.target.value) || undefined })}
                                                    />
                                                </div>
                                            )}
                                            {(exercise.type === 'timed' || exercise.type === 'duration') && (
                                                <div className="sf-num-field">
                                                    <span className="sf-inline-label">Sec</span>
                                                    <input
                                                        type="number" min={1} max={7200}
                                                        className="sf-input sf-input--num"
                                                        value={item.duration ?? ''}
                                                        onChange={e => updateExercise(item._key, { duration: Number(e.target.value) || undefined })}
                                                    />
                                                </div>
                                            )}
                                            {exercise.type !== 'duration' && (
                                                <div className="sf-num-field">
                                                    <span className="sf-inline-label">Rest (s)</span>
                                                    <input
                                                        type="number" min={0} max={600}
                                                        className="sf-input sf-input--num"
                                                        value={item.rest ?? ''}
                                                        onChange={e => updateExercise(item._key, { rest: Number(e.target.value) || undefined })}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Note */}
                                        <input
                                            className="sf-input sf-input--note"
                                            value={item.notes ?? ''}
                                            onChange={e => updateExercise(item._key, { notes: e.target.value || undefined })}
                                            placeholder="Note (optional)"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <button
                        type="button"
                        className="sf-add-btn"
                        onClick={() => setShowPicker(true)}
                    >
                        <Plus size={14} /> Add exercise
                    </button>
                </div>

                {/* Tags */}
                <div className="sf-field">
                    <label className="sf-label">Tags</label>
                    <input
                        className="sf-input"
                        value={form.tags}
                        onChange={e => set('tags', e.target.value)}
                        placeholder="bodyweight, upper-body (comma separated)"
                    />
                </div>

                {/* Notes */}
                <div className="sf-field">
                    <label className="sf-label">Notes</label>
                    <textarea
                        className="sf-input sf-textarea"
                        value={form.notes}
                        onChange={e => set('notes', e.target.value)}
                        placeholder="General notes about this session…"
                        rows={3}
                    />
                </div>

                {/* Submit */}
                <button type="button" className="sf-submit" onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create session'}
                </button>

            </div>

            {/* Exercise picker */}
            {showPicker && (
                <ExercisePicker
                    onSelect={addExercise}
                    onClose={() => setShowPicker(false)}
                    existingIds={form.exercises.map(e => e.exerciseId)}
                />
            )}

            <style>{`
        .sf-form { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 3rem; }
        .sf-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .sf-label {
          font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--p-muted); font-weight: 600;
        }
        .sf-duration-hint { color: var(--p-accent); font-style: normal; }
        .sf-error { font-size: 0.75rem; color: #E8734A; }

        .sf-input {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 8px; padding: 0.65rem 0.85rem;
          color: var(--p-text); font-size: 0.9rem; font-family: var(--p-font-body);
          outline: none; transition: border-color 0.15s ease;
          width: 100%; box-sizing: border-box;
        }
        .sf-input:focus { border-color: var(--p-accent); }
        .sf-input--error { border-color: #E8734A; }
        .sf-input--num { width: 64px; padding: 0.5rem 0.6rem; text-align: center; }
        .sf-input--note { font-size: 0.8rem; padding: 0.5rem 0.75rem; }
        .sf-textarea { resize: vertical; min-height: 80px; }

        .sf-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .sf-chip {
          padding: 0.3rem 0.75rem; border-radius: 999px;
          border: 1px solid var(--p-border); background: transparent;
          color: var(--p-muted); font-size: 0.75rem; cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease;
        }
        .sf-chip:hover { color: var(--p-text); border-color: var(--p-muted); }
        .sf-chip--active {
          background: var(--p-accent); border-color: var(--p-accent);
          color: #0D0D0D; font-weight: 600;
        }

        .sf-exercises-header { display: flex; align-items: center; justify-content: space-between; }

        .sf-exercise-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 0.75rem; }

        .sf-exercise-card {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 10px; padding: 0.85rem; display: flex;
          flex-direction: column; gap: 0.65rem;
        }

        .sf-exercise-card__header { display: flex; align-items: center; justify-content: space-between; }
        .sf-exercise-card__name { font-size: 0.9rem; font-weight: 600; color: var(--p-text); }
        .sf-exercise-card__actions { display: flex; gap: 0.25rem; }

        .sf-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 6px; border: none;
          background: transparent; color: var(--p-muted); cursor: pointer;
          transition: all 0.15s ease;
        }
        .sf-icon-btn:hover:not(:disabled) { color: var(--p-text); background: var(--p-border); }
        .sf-icon-btn--danger:hover { color: #E8734A !important; }
        .sf-icon-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        .sf-exercise-card__row {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .sf-exercise-card__row--wrap { flex-wrap: wrap; }

        .sf-inline-label { font-size: 0.72rem; color: var(--p-muted); white-space: nowrap; }

        .sf-num-field { display: flex; align-items: center; gap: 0.4rem; }

        .sf-select {
          background: var(--p-bg); border: 1px solid var(--p-border);
          border-radius: 6px; padding: 0.4rem 0.6rem; color: var(--p-text);
          font-size: 0.8rem; font-family: var(--p-font-body); outline: none;
          cursor: pointer;
        }
        .sf-select:focus { border-color: var(--p-accent); }

        .sf-add-btn {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: none; border: 1px dashed var(--p-border);
          border-radius: 6px; color: var(--p-muted); font-size: 0.78rem;
          padding: 0.4rem 0.75rem; cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease; align-self: flex-start;
        }
        .sf-add-btn:hover { color: var(--p-text); border-color: var(--p-muted); }

        .sf-submit {
          width: 100%; padding: 0.9rem; border-radius: 10px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s ease; margin-top: 0.5rem;
        }
        .sf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .sf-submit:not(:disabled):hover { opacity: 0.9; }

        /* Picker */
        .picker-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 100; display: flex; align-items: flex-end;
        }
        .picker-sheet {
          width: 100%; background: var(--p-surface);
          border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border);
          max-height: 75dvh; display: flex; flex-direction: column;
          overflow: hidden;
        }
        .picker-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border);
          flex-shrink: 0;
        }
        .picker-title { font-size: 0.85rem; font-weight: 600; color: var(--p-text); letter-spacing: 0.04em; }
        .picker-close {
          background: none; border: none; color: var(--p-muted);
          font-size: 1rem; cursor: pointer; padding: 0.25rem;
        }
        .picker-search-row {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--p-border);
          flex-shrink: 0;
        }
        .picker-search {
          flex: 1; background: none; border: none; outline: none;
          color: var(--p-text); font-size: 0.875rem; font-family: var(--p-font-body);
        }
        .picker-search::placeholder { color: var(--p-muted); }
        .picker-list {
          list-style: none; padding: 0.5rem 0; margin: 0;
          overflow-y: auto; flex: 1;
        }
        .picker-item {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1.25rem; background: none; border: none;
          cursor: pointer; text-align: left; font-family: var(--p-font-body);
          transition: background 0.1s ease;
        }
        .picker-item:hover:not(:disabled) { background: var(--p-border); }
        .picker-item--added { opacity: 0.45; cursor: default; }
        .picker-item__name { display: block; font-size: 0.9rem; color: var(--p-text); }
        .picker-item__cat {
          display: block; font-size: 0.7rem; color: var(--p-muted);
          text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;
        }
        .picker-item__check { color: var(--p-accent); font-size: 0.9rem; }
      `}</style>
        </div>
    )
}