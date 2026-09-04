import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Search, X } from 'lucide-react'
import { useRoutines } from '../hooks/useRoutines'
import { useExercises } from '../hooks/useExercises'
import type { Routine, RoutineCategory, RoutineExercise } from '../types/routine'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: RoutineCategory; label: string }[] = [
    { value: 'morning', label: 'Morning' },
    { value: 'evening', label: 'Evening' },
    { value: 'pre-run', label: 'Pre-run' },
    { value: 'pre-hike', label: 'Pre-hike' },
    { value: 'pre-climb', label: 'Pre-climb' },
    { value: 'post-workout', label: 'Post-workout' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'custom', label: 'Custom' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(name: string): string {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `${slug}-${Date.now()}`
}

interface FormExercise extends Omit<RoutineExercise, 'order'> {
    _key: string
}

interface FormVariant {
    _key: string
    id: string
    label: string
    durationMinutes: number
    exercises: FormExercise[]
}

interface FormState {
    name: string
    category: RoutineCategory
    description: string
    variants: FormVariant[]
    tags: string
}

function emptyVariant(label = 'Normal', copyFrom?: FormExercise[]): FormVariant {
    return {
        _key: `variant-${Date.now()}-${Math.random()}`,
        id: label.toLowerCase(),
        label,
        durationMinutes: 10,
        exercises: copyFrom
            ? copyFrom.map(e => ({ ...e, _key: `${e.exerciseId}-${Date.now()}-${Math.random()}` }))
            : [],
    }
}

function emptyForm(): FormState {
    return {
        name: '',
        category: 'morning',
        description: '',
        variants: [emptyVariant('Normal')],
        tags: '',
    }
}

function routineToForm(r: Routine): FormState {
    return {
        name: r.name,
        category: r.category,
        description: r.description ?? '',
        variants: r.variants.map(v => ({
            _key: `variant-${v.id}`,
            id: v.id,
            label: v.label,
            durationMinutes: v.durationMinutes,
            exercises: v.exercises
                .sort((a, b) => a.order - b.order)
                .map(ex => ({ ...ex, _key: `${ex.exerciseId}-${Math.random()}` })),
        })),
        tags: r.tags.join(', '),
    }
}

function formToRoutine(form: FormState, id: string, existing?: Routine): Routine {
    return {
        id,
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        variants: form.variants.map(v => ({
            id: v.id || v.label.toLowerCase().replace(/\s+/g, '-'),
            label: v.label,
            durationMinutes: v.durationMinutes,
            exercises: v.exercises.map((ex, i) => {
                const { _key, ...rest } = ex
                return { ...rest, order: i }
            }),
        })),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        isCustom: true,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

// ── Exercise picker ───────────────────────────────────────────────────────────

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

export default function RoutineFormPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const { getById, saveRoutine } = useRoutines()
    const { getById: getExercise } = useExercises()

    const isEdit = Boolean(id)
    const existing = id ? getById(id) : undefined

    const [form, setForm] = useState<FormState>(existing ? routineToForm(existing) : emptyForm())
    const [activeVariantIdx, setActiveVariantIdx] = useState(0)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (existing && !form.name) setForm(routineToForm(existing))
    }, [existing])

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: val }))

    // ── Variant management ────────────────────────────────────────────────────

    function addVariant() {
        const prev = form.variants[form.variants.length - 1]
        const newVariant = emptyVariant(
            `Variant ${form.variants.length + 1}`,
            prev?.exercises ?? []   // pre-populate from last variant
        )
        const next = [...form.variants, newVariant]
        set('variants', next)
        setActiveVariantIdx(next.length - 1)
    }

    function removeVariant(idx: number) {
        if (form.variants.length <= 1) return
        const next = form.variants.filter((_, i) => i !== idx)
        set('variants', next)
        setActiveVariantIdx(Math.min(activeVariantIdx, next.length - 1))
    }

    function updateVariant(idx: number, patch: Partial<Omit<FormVariant, '_key'>>) {
        set('variants', form.variants.map((v, i) => i === idx ? { ...v, ...patch } : v))
    }

    // ── Exercise management within active variant ─────────────────────────────

    const activeVariant = form.variants[activeVariantIdx]

    function addExercise(exerciseId: string) {
        const ex = getExercise(exerciseId)
        if (!ex) return
        const newEx: FormExercise = {
            _key: `${exerciseId}-${Date.now()}`,
            exerciseId,
            type: ex.type === 'reps' ? 'reps' : 'timed',
            durationSeconds: ex.type !== 'reps' ? (ex.duration ?? 30) : undefined,
            reps: ex.type === 'reps' ? (ex.defaultReps ?? 10) : undefined,
            restSeconds: undefined,
        }
        updateVariant(activeVariantIdx, {
            exercises: [...activeVariant.exercises, newEx],
        })
    }

    function removeExercise(key: string) {
        updateVariant(activeVariantIdx, {
            exercises: activeVariant.exercises.filter(e => e._key !== key),
        })
    }

    function moveExercise(key: string, dir: -1 | 1) {
        const idx = activeVariant.exercises.findIndex(e => e._key === key)
        if (idx < 0) return
        const next = [...activeVariant.exercises]
        const swap = idx + dir
        if (swap < 0 || swap >= next.length) return
            ;[next[idx], next[swap]] = [next[swap], next[idx]]
        updateVariant(activeVariantIdx, { exercises: next })
    }

    function updateExercise(key: string, patch: Partial<FormExercise>) {
        updateVariant(activeVariantIdx, {
            exercises: activeVariant.exercises.map(e =>
                e._key === key ? { ...e, ...patch } : e
            ),
        })
    }

    // ── Validation & submit ───────────────────────────────────────────────────

    function validate(): boolean {
        const next: Record<string, string> = {}
        if (!form.name.trim()) next.name = 'Name is required'
        if (form.variants.some(v => !v.label.trim())) next.variants = 'All variants need a label'
        if (form.variants.some(v => v.exercises.length === 0)) next.exercises = 'Each variant needs at least one exercise'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit() {
        if (!validate()) return
        setSaving(true)
        try {
            const routineId = isEdit && id ? id : generateId(form.name)
            await saveRoutine(formToRoutine(form, routineId, existing))
            navigate(`/sandbox/poise/routines/${routineId}`)
        } catch {
            setErrors({ name: 'Failed to save. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="poise-page">
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                {isEdit ? 'Routine' : 'Routines'}
            </button>

            <h1 className="poise-page__title">{isEdit ? 'Edit routine' : 'New routine'}</h1>

            <div className="rf-form">

                {/* Name */}
                <div className="rf-field">
                    <label className="rf-label">Name *</label>
                    <input
                        className={['rf-input', errors.name ? 'rf-input--error' : ''].join(' ')}
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Morning Activation"
                    />
                    {errors.name && <span className="rf-error">{errors.name}</span>}
                </div>

                {/* Category */}
                <div className="rf-field">
                    <label className="rf-label">Category</label>
                    <div className="rf-chips">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                type="button"
                                className={['rf-chip', form.category === cat.value ? 'rf-chip--active' : ''].join(' ')}
                                onClick={() => set('category', cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="rf-field">
                    <label className="rf-label">Description</label>
                    <input
                        className="rf-input"
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        placeholder="Short description of this routine's purpose"
                    />
                </div>

                {/* Variants */}
                <div className="rf-field">
                    <div className="rf-variants-header">
                        <label className="rf-label">Variants *</label>
                        <button type="button" className="rf-add-variant-btn" onClick={addVariant}>
                            <Plus size={13} /> Add variant
                        </button>
                    </div>
                    {errors.variants && <span className="rf-error">{errors.variants}</span>}

                    {/* Variant tabs */}
                    <div className="rf-variant-tabs">
                        {form.variants.map((v, i) => (
                            <button
                                key={v._key}
                                type="button"
                                className={['rf-variant-tab', i === activeVariantIdx ? 'rf-variant-tab--active' : ''].join(' ')}
                                onClick={() => setActiveVariantIdx(i)}
                            >
                                {v.label || `Variant ${i + 1}`}
                            </button>
                        ))}
                    </div>

                    {/* Active variant editor */}
                    {activeVariant && (
                        <div className="rf-variant-editor">
                            <div className="rf-variant-editor__header">
                                <div className="rf-row">
                                    <div className="rf-inline-field" style={{ flex: 1 }}>
                                        <span className="rf-inline-label">Label</span>
                                        <input
                                            className="rf-input rf-input--flex"
                                            value={activeVariant.label}
                                            onChange={e => updateVariant(activeVariantIdx, {
                                                label: e.target.value,
                                                id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                            })}
                                            placeholder="e.g. Short"
                                        />
                                    </div>
                                    <div className="rf-inline-field">
                                        <span className="rf-inline-label">Min</span>
                                        <input
                                            type="number" min={1} max={120}
                                            className="rf-input rf-input--num"
                                            value={activeVariant.durationMinutes}
                                            onChange={e => updateVariant(activeVariantIdx, {
                                                durationMinutes: Number(e.target.value) || 1,
                                            })}
                                        />
                                    </div>
                                    {form.variants.length > 1 && (
                                        <button
                                            type="button"
                                            className="rf-icon-btn rf-icon-btn--danger"
                                            onClick={() => removeVariant(activeVariantIdx)}
                                            title="Remove variant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Exercise list */}
                            {errors.exercises && (
                                <span className="rf-error" style={{ padding: '0 0 0.5rem' }}>{errors.exercises}</span>
                            )}

                            {activeVariant.exercises.length > 0 && (
                                <div className="rf-exercise-list">
                                    {activeVariant.exercises.map((item, idx) => {
                                        const ex = getExercise(item.exerciseId)
                                        if (!ex) return null
                                        return (
                                            <div key={item._key} className="rf-exercise-card">
                                                <div className="rf-exercise-card__header">
                                                    <span className="rf-exercise-card__name">{ex.name}</span>
                                                    <div className="rf-exercise-card__actions">
                                                        <button
                                                            type="button"
                                                            className="rf-icon-btn"
                                                            onClick={() => moveExercise(item._key, -1)}
                                                            disabled={idx === 0}
                                                        >
                                                            <ChevronUp size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rf-icon-btn"
                                                            onClick={() => moveExercise(item._key, 1)}
                                                            disabled={idx === activeVariant.exercises.length - 1}
                                                        >
                                                            <ChevronDown size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rf-icon-btn rf-icon-btn--danger"
                                                            onClick={() => removeExercise(item._key)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Type toggle */}
                                                <div className="rf-row">
                                                    <span className="rf-inline-label">Type</span>
                                                    <div className="rf-type-toggle">
                                                        <button
                                                            type="button"
                                                            className={['rf-type-btn', item.type === 'timed' ? 'rf-type-btn--active' : ''].join(' ')}
                                                            onClick={() => updateExercise(item._key, {
                                                                type: 'timed',
                                                                durationSeconds: ex.duration ?? 30,
                                                                reps: undefined,
                                                            })}
                                                        >
                                                            Timed
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={['rf-type-btn', item.type === 'reps' ? 'rf-type-btn--active' : ''].join(' ')}
                                                            onClick={() => updateExercise(item._key, {
                                                                type: 'reps',
                                                                reps: ex.defaultReps ?? 10,
                                                                durationSeconds: undefined,
                                                            })}
                                                        >
                                                            Reps
                                                        </button>
                                                    </div>

                                                    {item.type === 'timed' && (
                                                        <div className="rf-inline-field">
                                                            <span className="rf-inline-label">Sec</span>
                                                            <input
                                                                type="number" min={1} max={7200}
                                                                className="rf-input rf-input--num"
                                                                value={item.durationSeconds ?? ''}
                                                                onChange={e => updateExercise(item._key, {
                                                                    durationSeconds: Number(e.target.value) || undefined,
                                                                })}
                                                            />
                                                        </div>
                                                    )}

                                                    {item.type === 'reps' && (
                                                        <div className="rf-inline-field">
                                                            <span className="rf-inline-label">Reps</span>
                                                            <input
                                                                type="number" min={1} max={200}
                                                                className="rf-input rf-input--num"
                                                                value={item.reps ?? ''}
                                                                onChange={e => updateExercise(item._key, {
                                                                    reps: Number(e.target.value) || undefined,
                                                                })}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="rf-inline-field">
                                                        <span className="rf-inline-label">Rest (s)</span>
                                                        <input
                                                            type="number" min={0} max={300}
                                                            className="rf-input rf-input--num"
                                                            value={item.restSeconds ?? ''}
                                                            onChange={e => updateExercise(item._key, {
                                                                restSeconds: Number(e.target.value) || undefined,
                                                            })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <input
                                                    className="rf-input rf-input--note"
                                                    value={item.notes ?? ''}
                                                    onChange={e => updateExercise(item._key, {
                                                        notes: e.target.value || undefined,
                                                    })}
                                                    placeholder="Note (optional)"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            <button
                                type="button"
                                className="rf-add-btn"
                                onClick={() => setShowPicker(true)}
                            >
                                <Plus size={14} /> Add exercise
                            </button>
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div className="rf-field">
                    <label className="rf-label">Tags</label>
                    <input
                        className="rf-input"
                        value={form.tags}
                        onChange={e => set('tags', e.target.value)}
                        placeholder="morning, daily, activation (comma separated)"
                    />
                </div>

                {/* Submit */}
                <button type="button" className="rf-submit" onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create routine'}
                </button>

            </div>

            {/* Exercise picker */}
            {showPicker && (
                <ExercisePicker
                    onSelect={addExercise}
                    onClose={() => setShowPicker(false)}
                    existingIds={activeVariant.exercises.map(e => e.exerciseId)}
                />
            )}

            <style>{`
        .rf-form { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 3rem; }

        .rf-field { display: flex; flex-direction: column; gap: 0.5rem; }

        .rf-label {
          font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--p-muted); font-weight: 600;
        }

        .rf-error { font-size: 0.75rem; color: #E8734A; }

        .rf-input {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 8px; padding: 0.65rem 0.85rem;
          color: var(--p-text); font-size: 0.9rem; font-family: var(--p-font-body);
          outline: none; transition: border-color 0.15s ease;
          width: 100%; box-sizing: border-box;
        }
        .rf-input:focus { border-color: var(--p-accent); }
        .rf-input--error { border-color: #E8734A; }
        .rf-input--num { width: 68px; padding: 0.5rem 0.6rem; text-align: center; }
        .rf-input--flex { flex: 1; }
        .rf-input--note { font-size: 0.8rem; padding: 0.5rem 0.75rem; }

        .rf-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .rf-chip {
          padding: 0.3rem 0.75rem; border-radius: 999px;
          border: 1px solid var(--p-border); background: transparent;
          color: var(--p-muted); font-size: 0.75rem; cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease;
        }
        .rf-chip:hover { color: var(--p-text); border-color: var(--p-muted); }
        .rf-chip--active {
          background: var(--p-accent); border-color: var(--p-accent);
          color: #0D0D0D; font-weight: 600;
        }

        .rf-variants-header {
          display: flex; align-items: center; justify-content: space-between;
        }

        .rf-add-variant-btn {
          display: inline-flex; align-items: center; gap: 0.25rem;
          background: none; border: none; color: var(--p-accent);
          font-size: 0.75rem; cursor: pointer; font-family: var(--p-font-body);
          padding: 0; transition: opacity 0.15s ease;
        }
        .rf-add-variant-btn:hover { opacity: 0.75; }

        .rf-variant-tabs {
          display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.75rem;
        }

        .rf-variant-tab {
          padding: 0.35rem 0.85rem; border-radius: 999px;
          border: 1px solid var(--p-border); background: transparent;
          color: var(--p-muted); font-size: 0.75rem; cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease;
        }
        .rf-variant-tab:hover { color: var(--p-text); border-color: var(--p-muted); }
        .rf-variant-tab--active {
          background: var(--p-accent); border-color: var(--p-accent);
          color: #0D0D0D; font-weight: 600;
        }

        .rf-variant-editor {
          background: var(--p-surface); border: 1px solid var(--p-border);
          border-radius: 10px; padding: 1rem;
          display: flex; flex-direction: column; gap: 0.75rem;
        }

        .rf-variant-editor__header { display: flex; flex-direction: column; gap: 0.5rem; }

        .rf-row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }

        .rf-inline-field { display: flex; align-items: center; gap: 0.4rem; }
        .rf-inline-label { font-size: 0.72rem; color: var(--p-muted); white-space: nowrap; }

        .rf-exercise-list { display: flex; flex-direction: column; gap: 0.6rem; }

        .rf-exercise-card {
          background: var(--p-bg); border: 1px solid var(--p-border);
          border-radius: 8px; padding: 0.75rem;
          display: flex; flex-direction: column; gap: 0.6rem;
        }

        .rf-exercise-card__header { display: flex; align-items: center; justify-content: space-between; }
        .rf-exercise-card__name { font-size: 0.875rem; font-weight: 600; color: var(--p-text); }
        .rf-exercise-card__actions { display: flex; gap: 0.25rem; }

        .rf-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 6px; border: none;
          background: transparent; color: var(--p-muted); cursor: pointer;
          transition: all 0.15s ease;
        }
        .rf-icon-btn:hover:not(:disabled) { color: var(--p-text); background: var(--p-border); }
        .rf-icon-btn--danger:hover { color: #E8734A !important; }
        .rf-icon-btn:disabled { opacity: 0.25; cursor: not-allowed; }

        .rf-type-toggle { display: flex; border: 1px solid var(--p-border); border-radius: 6px; overflow: hidden; }
        .rf-type-btn {
          padding: 0.3rem 0.65rem; font-size: 0.75rem; border: none;
          background: transparent; color: var(--p-muted); cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease;
        }
        .rf-type-btn--active { background: var(--p-accent); color: #0D0D0D; font-weight: 600; }

        .rf-add-btn {
          display: inline-flex; align-items: center; gap: 0.3rem;
          background: none; border: 1px dashed var(--p-border);
          border-radius: 6px; color: var(--p-muted); font-size: 0.78rem;
          padding: 0.4rem 0.75rem; cursor: pointer;
          font-family: var(--p-font-body); transition: all 0.15s ease; align-self: flex-start;
        }
        .rf-add-btn:hover { color: var(--p-text); border-color: var(--p-muted); }

        .rf-submit {
          width: 100%; padding: 0.9rem; border-radius: 10px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          letter-spacing: 0.04em; transition: opacity 0.15s ease; margin-top: 0.5rem;
        }
        .rf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .rf-submit:not(:disabled):hover { opacity: 0.9; }

        /* Picker — same as session form */
        .picker-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 100; display: flex; align-items: flex-end;
        }
        .picker-sheet {
          width: 100%; background: var(--p-surface);
          border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border);
          max-height: 75dvh; display: flex; flex-direction: column; overflow: hidden;
        }
        .picker-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border); flex-shrink: 0;
        }
        .picker-title { font-size: 0.85rem; font-weight: 600; color: var(--p-text); }
        .picker-close {
          background: none; border: none; color: var(--p-muted);
          font-size: 1rem; cursor: pointer; padding: 0.25rem;
        }
        .picker-search-row {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--p-border); flex-shrink: 0;
        }
        .picker-search {
          flex: 1; background: none; border: none; outline: none;
          color: var(--p-text); font-size: 0.875rem; font-family: var(--p-font-body);
        }
        .picker-search::placeholder { color: var(--p-muted); }
        .picker-list {
          list-style: none; padding: 0.5rem 0; margin: 0; overflow-y: auto; flex: 1;
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