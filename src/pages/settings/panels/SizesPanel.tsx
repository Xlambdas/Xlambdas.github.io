// src/pages/accessibility/panels/SizesPanel.tsx
import { type SizesPanelProps, SCALE_SECTIONS } from '../constants';

export const SizesPanel: React.FC<SizesPanelProps> = ({ theme, onScaleChange, t }) => {
    const isSelected = (value: number, type: 'font' | 'button') => {
        return type === 'font' ? theme.typography.fontScale === value : theme.buttonScale === value;
    };

    return (
        <div role="tabpanel" id="sizes-panel" className="space-y-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {SCALE_SECTIONS(t).map(({ type, label, options }) => (
                    <div
                        key={type}
                        className="p-6 sm:p-8 rounded-xl border-2 transition-all"
                        style={{ borderColor: 'var(--color-primary)' }}
                    >
                        <h3
                            className="text-xl sm:text-2xl font-light italic mb-6"
                            style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                        >
                            {label}
                        </h3>
                        <div className="space-y-3">
                            {options.map(({ label: optionLabel, value }) => {
                                const selected = isSelected(value, type);
                                return (
                                    <button
                                        key={optionLabel}
                                        onClick={() => onScaleChange(value, type)}
                                        className="w-full p-4 sm:p-5 text-left rounded-lg transition-all hover:scale-105 active:scale-95"
                                        style={{
                                            fontSize: `${16 * value}px`,
                                            color: 'var(--color-primary)',
                                            border: selected
                                                ? '3px solid var(--color-primary)'
                                                : '2px solid var(--color-primary-transparent)',
                                            backgroundColor: 'var(--color-background)',
                                            boxShadow: selected
                                                ? `0 0 12px var(--color-primary)`
                                                : 'none',
                                            opacity: selected ? 1 : 0.6,
                                            transition: 'all 0.3s ease',
                                        }}
                                        aria-current={selected ? 'true' : undefined}
                                        aria-label={`${optionLabel} ${value}x${selected ? ' (currently selected)' : ''}`}
                                    >
                                        {optionLabel} • {value}x
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};