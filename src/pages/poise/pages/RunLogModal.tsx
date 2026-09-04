import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { RunConfig } from '../types/runConfig'

interface RunLogModalProps {
    runConfig: RunConfig
    plannedKm: number
    date: string
    onSave: (actualKm: number, counted: boolean) => void
    onClose: () => void
}

export default function RunLogModal({
    runConfig,
    plannedKm,
    date,
    onSave,
    onClose,
}: RunLogModalProps) {
    const [actualKm, setActualKm] = useState(plannedKm)
    const [counted, setCounted] = useState(true)

    // Compute what next target will be
    const nextTarget = counted
        ? runConfig.progressionType === 'fixed'
            ? Math.round((actualKm + runConfig.progressionValue) * 10) / 10
            : Math.round(actualKm * (1 + runConfig.progressionValue / 100) * 10) / 10
        : runConfig.currentTargetKm

    const cappedNext = runConfig.maxKm ? Math.min(nextTarget, runConfig.maxKm) : nextTarget

    function handleSave() {
        if (actualKm <= 0) return
        onSave(actualKm, counted)
        onClose()
    }

    return (
        <div className="rl-overlay" onClick={onClose}>
            <div className="rl-sheet" onClick={e => e.stopPropagation()}>
                <div className="rl-header">
                    <span className="rl-title">{runConfig.name}</span>
                    <button className="rl-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div className="rl-body">
                    <p className="rl-date">{date}</p>

                    <div className="rl-field">
                        <label className="rl-label">Planned</label>
                        <span className="rl-planned">{plannedKm} km</span>
                    </div>

                    <div className="rl-field">
                        <label className="rl-label">Actual distance *</label>
                        <div className="rl-km-row">
                            <input
                                type="number"
                                className="rl-input"
                                value={actualKm}
                                min={0}
                                max={200}
                                step={0.1}
                                onChange={e => setActualKm(parseFloat(e.target.value) || 0)}
                                autoFocus
                            />
                            <span className="rl-unit">km</span>
                        </div>
                    </div>

                    {/* Counted toggle */}
                    <div className="rl-counted-row">
                        <div className="rl-counted-info">
                            <span className="rl-counted-label">Count for progression</span>
                            <span className="rl-counted-desc">
                                {counted
                                    ? `Next target: ${cappedNext} km`
                                    : `Next target stays at ${runConfig.currentTargetKm} km`}
                            </span>
                        </div>
                        <button
                            type="button"
                            className={['rl-toggle', counted ? 'rl-toggle--on' : ''].join(' ')}
                            onClick={() => setCounted(c => !c)}
                        >
                            <span className="rl-toggle__dot" />
                        </button>
                    </div>

                    <button
                        className="rl-save"
                        onClick={handleSave}
                        disabled={actualKm <= 0}
                    >
                        <Check size={16} strokeWidth={3} />
                        Save run
                    </button>
                </div>
            </div>

            <style>{`
        .rl-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          z-index: 90; display: flex; align-items: flex-end;
        }
        .rl-sheet {
          width: 100%; background: var(--p-surface);
          border-radius: 16px 16px 0 0; border-top: 1px solid var(--p-border);
          overflow: hidden;
        }
        .rl-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem; border-bottom: 1px solid var(--p-border);
        }
        .rl-title { font-size: 0.875rem; font-weight: 600; color: var(--p-text); }
        .rl-close {
          background: none; border: none; color: var(--p-muted);
          cursor: pointer; display: flex; align-items: center; padding: 0.25rem;
        }
        .rl-body {
          padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem;
        }
        .rl-date {
          font-size: 0.72rem; color: var(--p-muted); text-transform: uppercase;
          letter-spacing: 0.1em; margin: 0;
        }
        .rl-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .rl-label {
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--p-muted); font-weight: 600;
        }
        .rl-planned { font-size: 1rem; color: var(--p-muted); }
        .rl-km-row { display: flex; align-items: center; gap: 0.75rem; }
        .rl-input {
          width: 120px; background: var(--p-bg); border: 1px solid var(--p-border);
          border-radius: 8px; padding: 0.65rem 0.85rem; color: var(--p-text);
          font-size: 1.25rem; font-family: var(--p-font-body); outline: none;
          transition: border-color 0.15s ease; text-align: center;
          font-weight: 600;
        }
        .rl-input:focus { border-color: var(--p-accent); }
        .rl-unit { font-size: 1rem; color: var(--p-muted); }

        .rl-counted-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1rem; background: var(--p-bg);
          border: 1px solid var(--p-border); border-radius: 10px;
        }
        .rl-counted-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .rl-counted-label { font-size: 0.875rem; color: var(--p-text); font-weight: 500; }
        .rl-counted-desc { font-size: 0.75rem; color: var(--p-accent); }

        .rl-toggle {
          width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer;
          padding: 2px; display: flex; align-items: center;
          background: var(--p-border); transition: background 0.2s ease; flex-shrink: 0;
        }
        .rl-toggle--on { background: var(--p-accent); justify-content: flex-end; }
        .rl-toggle__dot {
          width: 20px; height: 20px; border-radius: 50%; background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .rl-save {
          width: 100%; padding: 0.9rem; border-radius: 10px; border: none;
          background: var(--p-accent); color: #0D0D0D; font-size: 0.9rem;
          font-weight: 700; font-family: var(--p-font-body); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: opacity 0.15s ease;
        }
        .rl-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .rl-save:not(:disabled):hover { opacity: 0.9; }
      `}</style>
        </div>
    )
}