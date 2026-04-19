// src/pages/accessibility/panels/MotionPanel.tsx
import { type MotionPanelProps, TOGGLE_FEATURES } from '../constants';

export const MotionPanel: React.FC<MotionPanelProps> = ({ theme, onToggle, t }) => {
    const isEnabled = (feature: 'reducedMotion' | 'highContrast') => theme[feature];

    return (
        <div role="tabpanel" id="motion-panel" className="mb-12">
            <div
                className="p-6 sm:p-8 rounded-xl border-2 max-w-2xl transition-all"
                style={{ borderColor: 'var(--color-primary)' }}
            >
                <div className="space-y-6">
                    {TOGGLE_FEATURES(t).map(({ feature, label }) => {
                        const enabled = isEnabled(feature);
                        return (
                            <div
                                key={feature}
                                className="flex items-center justify-between p-4 rounded-lg transition-all"
                                style={{ backgroundColor: enabled ? 'var(--color-primary-transparent)' : 'transparent' }}
                            >
                                <label
                                    className="text-base sm:text-lg font-light italic"
                                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                                >
                                    {label}
                                </label>
                                <button
                                    onClick={() => onToggle(feature)}
                                    className="px-6 py-2 rounded-full font-light transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        color: enabled ? 'var(--color-background)' : 'var(--color-primary)',
                                        backgroundColor: enabled ? 'var(--color-primary)' : 'transparent',
                                        border: enabled
                                            ? '3px solid var(--color-primary)'
                                            : '2px solid var(--color-primary-transparent)',
                                        boxShadow: enabled
                                            ? `0 0 12px var(--color-primary)`
                                            : 'none',
                                        transition: 'all 0.3s ease',
                                    }}
                                    aria-pressed={enabled}
                                    aria-label={`${label}: ${enabled ? 'ON' : 'OFF'}`}
                                >
                                    {enabled ? '✓ ON' : '○ OFF'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};