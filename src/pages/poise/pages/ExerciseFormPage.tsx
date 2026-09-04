import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useExercises } from '../hooks/useExercises'
import type {
    Exercise,
    ExerciseCategory,
    ExerciseType,
    Equipment,
    BodyArea,
} from '../types/exercise'

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: ExerciseCategory; label: string }[] = [
    { value: 'strength', label: 'Strength' },
    { value: 'skill', label: 'Skill' },
    { value: 'mobility', label: 'Mobility' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'recovery', label: 'Recovery' },
    { value: 'warmup', label: 'Warm-up' },
]

const TYPES: { value: ExerciseType; label: string; hint: string }[] = [
    { value: 'reps', label: 'Reps', hint: '3 × 12' },
    { value: 'timed', label: 'Timed', hint: '3 × 30s' },
    { value: 'duration', label: 'Duration', hint: '10 min continuous' },
]

const EQUIPMENT_OPTIONS: Equipment[] = [
    'none', 'pull-up-bar', 'rings', 'parallettes', 'resistance-band', 'bike', 'rope',
]

const BODY_AREAS: BodyArea[] = [
    'full-body', 'upper-body', 'lower-body', 'core',
    'chest', 'back', 'shoulders', 'arms',
    'wrists', 'hips', 'legs', 'ankles', 'spine',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(name: string): string {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    return `${slug}-${Date.now()}`
}

function emptyForm(): FormState {
    return {
        name: '',
        category: 'strength',
        type: 'reps',
        difficulty: 3,
        targetAreas: [],
        equipment: ['none'],
        defaultSets: 3,
        defaultReps: 10,
        duration: 30,
        instructions: [''],
        cues: [''],
        tags: '',
        contraindications: '',
        notes: '',
    }
}

interface FormState {
    name: string
    category: ExerciseCategory
    type: ExerciseType
    difficulty: 1 | 2 | 3 | 4 | 5
    targetAreas: BodyArea[]
    equipment: Equipment[]
    defaultSets: number
    defaultReps: number
    duration: number
    instructions: string[]
    cues: string[]
    tags: string
    contraindications: string
    notes: string
}

function exerciseToForm(e: Exercise): FormState {
    return {
        name: e.name,
        category: e.category,
        type: e.type,
        difficulty: e.difficulty,
        targetAreas: e.targetAreas,
        equipment: e.equipment,
        defaultSets: e.defaultSets ?? 3,
        defaultReps: e.defaultReps ?? 10,
        duration: e.duration ?? 30,
        instructions: e.instructions.length > 0 ? e.instructions : [''],
        cues: e.cues.length > 0 ? e.cues : [''],
        tags: e.tags.join(', '),
        contraindications: (e.contraindications ?? []).join(', '),
        notes: e.notes ?? '',
    }
}

function formToExercise(form: FormState, id: string): Exercise {
    return {
        id,
        name: form.name.trim(),
        category: form.category,
        type: form.type,
        difficulty: form.difficulty,
        targetAreas: form.targetAreas,
        equipment: form.equipment.length > 0 ? form.equipment : ['none'],
        defaultSets: form.type !== 'duration' ? form.defaultSets : undefined,
        defaultReps: form.type === 'reps' ? form.defaultReps : undefined,
        duration: form.type !== 'reps' ? form.duration : undefined,
        instructions: form.instructions.map(s => s.trim()).filter(Boolean),
        cues: form.cues.map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
        contraindications: form.contraindications
            ? form.contraindications.split(',').map(s => s.trim()).filter(Boolean)
            : undefined,
        notes: form.notes.trim() || undefined,
        isCustom: true,
    }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="ef-label">{children}</label>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="ef-section-title">{children}</h2>
}

function ChipGroup<T extends string>({
    options,
    selected,
    onChange,
    multi = true,
}: {
    options: T[]
    selected: T[]
    onChange: (next: T[]) => void
    multi?: boolean
}) {
    const toggle = (val: T) => {
        if (multi) {
            onChange(
                selected.includes(val)
                    ? selected.filter(v => v !== val)
                    : [...selected, val]
            )
        } else {
            onChange([val])
        }
    }
    return (
        <div className="ef-chips">
            {options.map(opt => (
                <button
                    key={opt}
                    type="button"
                    className={['ef-chip', selected.includes(opt) ? 'ef-chip--active' : ''].join(' ')}
                    onClick={() => toggle(opt)}
                >
                    {opt}
                </button>
            ))}
        </div>
    )
}

function StringListEditor({
    items,
    onChange,
    placeholder,
}: {
    items: string[]
    onChange: (next: string[]) => void
    placeholder: string
}) {
    const update = (i: number, val: string) => {
        const next = [...items]
        next[i] = val
        onChange(next)
    }
    const add = () => onChange([...items, ''])
    const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))

    return (
        <div className="ef-list-editor">
            {items.map((item, i) => (
                <div key={i} className="ef-list-row">
                    <span className="ef-list-num">{i + 1}</span>
                    <input
                        className="ef-input ef-input--flex"
                        value={item}
                        onChange={e => update(i, e.target.value)}
                        placeholder={placeholder}
                    />
                    {items.length > 1 && (
                        <button type="button" className="ef-icon-btn" onClick={() => remove(i)}>
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            ))}
            <button type="button" className="ef-add-btn" onClick={add}>
                <Plus size={14} /> Add
            </button>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ExerciseFormPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id?: string }>()
    const { getById, saveExercise } = useExercises()

    const isEdit = Boolean(id)
    const existing = id ? getById(id) : undefined

    const [form, setForm] = useState<FormState>(
        existing ? exerciseToForm(existing) : emptyForm()
    )
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

    // If editing and exercise loads after mount (async hook), sync form
    useEffect(() => {
        if (existing && !form.name) {
            setForm(exerciseToForm(existing))
        }
    }, [existing])

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: val }))

    function validate(): boolean {
        const next: typeof errors = {}
        if (!form.name.trim()) next.name = 'Name is required'
        if (form.targetAreas.length === 0) next.targetAreas = 'Select at least one area'
        setErrors(next)
        return Object.keys(next).length === 0
    }

    async function handleSubmit() {
        if (!validate()) return
        setSaving(true)
        try {
            const exerciseId = isEdit && id ? id : generateId(form.name)
            const exercise = formToExercise(form, exerciseId)
            await saveExercise(exercise)
            navigate(`/sandbox/poise/exercises/${exerciseId}`)
        } catch {
            setErrors({ name: 'Failed to save. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="poise-page">
            {/* Back */}
            <button className="detail-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />
                <span>{isEdit ? 'Exercise' : 'Exercises'}</span>
            </button>

            <h1 className="poise-page__title">
                {isEdit ? 'Edit exercise' : 'New exercise'}
            </h1>

            <div className="ef-form">

                {/* ── Name ── */}
                <div className="ef-field">
                    <FieldLabel>Name *</FieldLabel>
                    <input
                        className={['ef-input', errors.name ? 'ef-input--error' : ''].join(' ')}
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Wall Handstand — Wrist Friendly"
                    />
                    {errors.name && <span className="ef-error">{errors.name}</span>}
                </div>

                {/* ── Category ── */}
                <div className="ef-field">
                    <FieldLabel>Category</FieldLabel>
                    <div className="ef-select-row">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                type="button"
                                className={['ef-chip', form.category === cat.value ? 'ef-chip--active' : ''].join(' ')}
                                onClick={() => set('category', cat.value)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Type ── */}
                <div className="ef-field">
                    <FieldLabel>Type</FieldLabel>
                    <div className="ef-type-row">
                        {TYPES.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                className={['ef-type-btn', form.type === t.value ? 'ef-type-btn--active' : ''].join(' ')}
                                onClick={() => set('type', t.value)}
                            >
                                <span className="ef-type-btn__label">{t.label}</span>
                                <span className="ef-type-btn__hint">{t.hint}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Sets / Reps / Duration ── */}
                <div className="ef-field">
                    <FieldLabel>
                        {form.type === 'reps' && 'Default sets & reps'}
                        {form.type === 'timed' && 'Default sets & hold duration'}
                        {form.type === 'duration' && 'Total duration (seconds)'}
                    </FieldLabel>
                    <div className="ef-row">
                        {form.type !== 'duration' && (
                            <div className="ef-inline-field">
                                <span className="ef-inline-label">Sets</span>
                                <input
                                    className="ef-input ef-input--sm"
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={form.defaultSets}
                                    onChange={e => set('defaultSets', Number(e.target.value))}
                                />
                            </div>
                        )}
                        {form.type === 'reps' && (
                            <div className="ef-inline-field">
                                <span className="ef-inline-label">Reps</span>
                                <input
                                    className="ef-input ef-input--sm"
                                    type="number"
                                    min={1}
                                    max={200}
                                    value={form.defaultReps}
                                    onChange={e => set('defaultReps', Number(e.target.value))}
                                />
                            </div>
                        )}
                        {(form.type === 'timed' || form.type === 'duration') && (
                            <div className="ef-inline-field">
                                <span className="ef-inline-label">Seconds</span>
                                <input
                                    className="ef-input ef-input--sm"
                                    type="number"
                                    min={1}
                                    max={7200}
                                    value={form.duration}
                                    onChange={e => set('duration', Number(e.target.value))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Difficulty ── */}
                <div className="ef-field">
                    <FieldLabel>Difficulty</FieldLabel>
                    <div className="ef-difficulty-row">
                        {([1, 2, 3, 4, 5] as const).map(level => (
                            <button
                                key={level}
                                type="button"
                                className={['ef-diff-btn', form.difficulty === level ? 'ef-diff-btn--active' : ''].join(' ')}
                                onClick={() => set('difficulty', level)}
                            >
                                {['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Advanced'][level]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Target areas ── */}
                <div className="ef-field">
                    <FieldLabel>Target areas *</FieldLabel>
                    <ChipGroup
                        options={BODY_AREAS}
                        selected={form.targetAreas}
                        onChange={val => set('targetAreas', val as BodyArea[])}
                    />
                    {errors.targetAreas && <span className="ef-error">{errors.targetAreas}</span>}
                </div>

                {/* ── Equipment ── */}
                <div className="ef-field">
                    <FieldLabel>Equipment</FieldLabel>
                    <ChipGroup
                        options={EQUIPMENT_OPTIONS}
                        selected={form.equipment}
                        onChange={val => set('equipment', val as Equipment[])}
                    />
                </div>

                {/* ── Instructions ── */}
                <div className="ef-field">
                    <SectionTitle>Instructions</SectionTitle>
                    <StringListEditor
                        items={form.instructions}
                        onChange={val => set('instructions', val)}
                        placeholder="Describe this step…"
                    />
                </div>

                {/* ── Cues ── */}
                <div className="ef-field">
                    <SectionTitle>Coaching cues</SectionTitle>
                    <StringListEditor
                        items={form.cues}
                        onChange={val => set('cues', val)}
                        placeholder="e.g. Hollow body"
                    />
                </div>

                {/* ── Tags ── */}
                <div className="ef-field">
                    <FieldLabel>Tags</FieldLabel>
                    <input
                        className="ef-input"
                        value={form.tags}
                        onChange={e => set('tags', e.target.value)}
                        placeholder="bodyweight, push, upper-body (comma separated)"
                    />
                </div>

                {/* ── Contraindications ── */}
                <div className="ef-field">
                    <FieldLabel>Precautions</FieldLabel>
                    <input
                        className="ef-input"
                        value={form.contraindications}
                        onChange={e => set('contraindications', e.target.value)}
                        placeholder="e.g. wrist pain, knee pain (comma separated)"
                    />
                </div>

                {/* ── Notes ── */}
                <div className="ef-field">
                    <FieldLabel>Personal notes</FieldLabel>
                    <textarea
                        className="ef-input ef-textarea"
                        value={form.notes}
                        onChange={e => set('notes', e.target.value)}
                        placeholder="Anything you want to remember about this exercise…"
                        rows={3}
                    />
                </div>

                {/* ── Submit ── */}
                <button
                    type="button"
                    className="ef-submit"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create exercise'}
                </button>

            </div>

            <style>{`
        .ef-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 3rem;
        }

        .ef-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ef-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--p-muted);
          font-weight: 600;
        }

        .ef-section-title {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--p-muted);
          font-weight: 600;
          padding-top: 0.5rem;
          border-top: 1px solid var(--p-border);
        }

        .ef-input {
          background: var(--p-surface);
          border: 1px solid var(--p-border);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          color: var(--p-text);
          font-size: 0.9rem;
          font-family: var(--p-font-body);
          outline: none;
          transition: border-color 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .ef-input:focus { border-color: var(--p-accent); }
        .ef-input--error { border-color: #E8734A; }
        .ef-input--flex { flex: 1; }
        .ef-input--sm { width: 72px; }
        .ef-textarea { resize: vertical; min-height: 80px; }

        .ef-error {
          font-size: 0.75rem;
          color: #E8734A;
        }

        .ef-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .ef-chip {
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          border: 1px solid var(--p-border);
          background: transparent;
          color: var(--p-muted);
          font-size: 0.75rem;
          cursor: pointer;
          font-family: var(--p-font-body);
          transition: all 0.15s ease;
        }
        .ef-chip:hover { color: var(--p-text); border-color: var(--p-muted); }
        .ef-chip--active {
          background: var(--p-accent);
          border-color: var(--p-accent);
          color: #0D0D0D;
          font-weight: 600;
        }

        .ef-select-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .ef-type-row {
          display: flex;
          gap: 0.5rem;
        }

        .ef-type-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.65rem 0.5rem;
          border-radius: 8px;
          border: 1px solid var(--p-border);
          background: transparent;
          color: var(--p-muted);
          cursor: pointer;
          font-family: var(--p-font-body);
          transition: all 0.15s ease;
        }
        .ef-type-btn:hover { border-color: var(--p-muted); color: var(--p-text); }
        .ef-type-btn--active {
          border-color: var(--p-accent);
          color: var(--p-accent);
          background: color-mix(in srgb, var(--p-accent) 8%, transparent);
        }
        .ef-type-btn__label { font-size: 0.85rem; font-weight: 600; }
        .ef-type-btn__hint  { font-size: 0.65rem; opacity: 0.7; }

        .ef-difficulty-row {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .ef-diff-btn {
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          border: 1px solid var(--p-border);
          background: transparent;
          color: var(--p-muted);
          font-size: 0.75rem;
          cursor: pointer;
          font-family: var(--p-font-body);
          transition: all 0.15s ease;
        }
        .ef-diff-btn:hover { color: var(--p-text); border-color: var(--p-muted); }
        .ef-diff-btn--active {
          background: var(--p-accent);
          border-color: var(--p-accent);
          color: #0D0D0D;
          font-weight: 600;
        }

        .ef-row {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .ef-inline-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ef-inline-label {
          font-size: 0.8rem;
          color: var(--p-muted);
          white-space: nowrap;
        }

        .ef-list-editor {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ef-list-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ef-list-num {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--p-border);
          color: var(--p-accent);
          font-size: 0.65rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ef-icon-btn {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--p-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }
        .ef-icon-btn:hover { color: #E8734A; }

        .ef-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: 1px dashed var(--p-border);
          border-radius: 6px;
          color: var(--p-muted);
          font-size: 0.78rem;
          padding: 0.4rem 0.75rem;
          cursor: pointer;
          font-family: var(--p-font-body);
          transition: all 0.15s ease;
          align-self: flex-start;
        }
        .ef-add-btn:hover {
          color: var(--p-text);
          border-color: var(--p-muted);
        }

        .ef-submit {
          width: 100%;
          padding: 0.9rem;
          border-radius: 10px;
          border: none;
          background: var(--p-accent);
          color: #0D0D0D;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: var(--p-font-body);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: opacity 0.15s ease;
          margin-top: 0.5rem;
        }
        .ef-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ef-submit:not(:disabled):hover { opacity: 0.9; }
      `}</style>
        </div>
    )
}