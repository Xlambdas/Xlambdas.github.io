import { useState } from 'react'
import { X, Check, Zap } from 'lucide-react'
import type { PerceivedExertion } from '../types/sessionFeedback'
import type { Intensity } from '../types/preferences'

interface CompletionModalProps {
    sessionName: string
    eventId: string
    date: string
    windowId?: string
    defaultIntensity?: Intensity
    onSave: (exertion: PerceivedExertion) => Promise<void>
    onClose: () => void
}

const EXERTION_LABELS: Record<PerceivedExertion, { label: string; desc: string; color: string }> = {
    1: { label: 'Very easy', desc: 'Could have gone much longer', color: '#6BCB77' },
    2: { label: 'Easy', desc: 'Comfortable, could go harder', color: '#A8D87A' },
    3: { label: 'Moderate', desc: 'Challenging but sustainable', color: 'var(--p-accent)' },
    4: { label: 'Hard', desc: 'Pushed myself, needed focus', color: '#E8734A' },
    5: { label: 'Max effort', desc: 'Could not have gone harder', color: '#E84A4A' },
}

// Map exertion to intensity for recovery calculation
export function exertionToIntensity(e: PerceivedExertion): Intensity {
    if (e <= 2) return 'light'
    if (e <= 3) return 'medium'
    return 'hard'
}

export default function CompletionModal({
    sessionName,
    defaultIntensity,
    onSave,
    onClose,
}: CompletionModalProps) {
    // Pre-select based on default intensity
    const defaultExertion: PerceivedExertion =
        defaultIntensity === 'light' ? 2 :
            defaultIntensity === 'hard' ? 4 : 3

    const [selected, setSelected] = useState<PerceivedExertion>(defaultExertion)
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        await onSave(selected)
        onClose()
    }

    return (
        <div className="cm-overlay" onClick={onClose}>
            <div className="cm-sheet" onClick={e => e.stopPropagation()}>
                <div className="cm-header">
                    <div className="cm-header__left">
                        <Check size={16} color="#6BCB77" strokeWidth={3} />
                        <span className="cm-title">Session complete</span>
                    </div>
                    <button className="cm-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="cm-body">
                    <p className="cm-session-name">{sessionName}</p>

                    <div className="cm-field">
                        <label className="cm-label">
                            <Zap size={13} />
                            How hard was it?
                        </label>
                        <div className="cm-exertion-grid">
                            {([1, 2, 3, 4, 5] as PerceivedExertion[]).map(e => {
                                const info = EXERTION_LABELS[e]
                                const active = selected === e
                                return (
                                    <button
                                        key={e}
                                        type="button"
                                        className={['cm-exertion-btn', active ? 'cm-exertion-btn--active' : ''].join(' ')}
                                        style={active ? { borderColor: info.color, background: `color-mix(in srgb, ${info.color} 12%, transparent)` } : {}}
                                        onClick={() => setSelected(e)}
                                    >
                                        <span className="cm-exertion-num" style={active ? { color: info.color } : {}}>{e}</span>
                                        <span className="cm-exertion-label">{info.label}</span>
                                        <span className="cm-exertion-desc">{info.desc}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="cm-recovery-note">
                        <span style={{ color: EXERTION_LABELS[selected].color, fontWeight: 600 }}>
                            {EXERTION_LABELS[selected].label}
                        </span>
                        {' — '}
                        {exertionToIntensity(selected) === 'light' && 'Light load. No special recovery needed.'}
                        {exertionToIntensity(selected) === 'medium' && 'Moderate load. Planner will allow similar sessions tomorrow.'}
                        {exertionToIntensity(selected) === 'hard' && 'Heavy load. Planner will suggest mobility/recovery before next similar session.'}
                    </div>

                    <button
                        className="cm-save"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Check size={16} strokeWidth={3} />
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            <style>{`
        .cm-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 90; display: flex; align-items: flex-end;
        }
        .cm-sheet {
          width: 100%; background: var(--p-surface);
          border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border);
        }
        .cm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border);
        }
        .cm-header__left { display: flex; align-items: center; gap: 0.5rem; }
        .cm-title { font-size: 0.875rem; font-weight: 600; color: var(--p-text); }
        .cm-close {
          background: none; border: none; color: var(--p-muted);
          cursor: pointer; display: flex; align-items: center; padding: 0.25rem;
        }
        .cm-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .cm-session-name { font-size: 1rem; color: var(--p-text); font-weight: 500; margin: 0; }

        .cm-field { display: flex; flex-direction: column; gap: 0.6rem; }
        .cm-label {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--p-muted); font-weight: 600;
        }

        .cm-exertion-grid { display: flex; flex-direction: column; gap: 0.4rem; }
        .cm-exertion-btn {
          display: flex; align-items: center; gap: 0.85rem;
          padding: 0.65rem 0.85rem; border-radius: 8px;
          border: 1px solid var(--p-border); background: transparent;
          cursor: pointer; font-family: var(--p-font-body); text-align: left;
          transition: all 0.15s ease;
        }
        .cm-exertion-btn:hover { border-color: var(--p-muted); }
        .cm-exertion-num {
          font-size: 1.1rem; font-weight: 700; color: var(--p-muted);
          width: 24px; flex-shrink: 0; text-align: center;
          transition: color 0.15s ease;
        }
        .cm-exertion-label {
          font-size: 0.85rem; font-weight: 600; color: var(--p-text); flex-shrink: 0;
          width: 90px;
        }
        .cm-exertion-desc { font-size: 0.75rem; color: var(--p-muted); }

        .cm-recovery-note {
          font-size: 0.8rem; color: var(--p-muted); line-height: 1.5;
          padding: 0.75rem; background: var(--p-bg);
          border: 1px solid var(--p-border); border-radius: 8px;
        }

        .cm-save {
          width: 100%; padding: 0.9rem; border-radius: 10px; border: none;
          background: #6BCB77; color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: opacity 0.15s ease;
        }
        .cm-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .cm-save:not(:disabled):hover { opacity: 0.9; }
      `}</style>
        </div>
    )
}