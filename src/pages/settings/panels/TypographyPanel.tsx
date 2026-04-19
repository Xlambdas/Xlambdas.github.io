// src/pages/accessibility/panels/TypographyPanel.tsx
import { type TypographyPanelProps, FONT_SECTIONS } from '../constants';

export const TypographyPanel: React.FC<TypographyPanelProps> = ({ theme, onFontChange, t }) => {
    const isSelected = (font: string, type: 'primary' | 'secondary') => {
        return (
            (type === 'primary' && theme.typography.primaryFontFamily === font) ||
            (type === 'secondary' && theme.typography.secondaryFontFamily === font)
        );
    };

    return (
        <div role="tabpanel" id="typography-panel" className="space-y-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {FONT_SECTIONS(t).map(({ fonts, type, label }) => (
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
                            {fonts.map((font) => {
                                const selected = isSelected(font, type);
                                return (
                                    <button
                                        key={font}
                                        onClick={() => onFontChange(font, type)}
                                        className="w-full p-4 sm:p-5 text-left rounded-lg transition-all hover:scale-105 active:scale-95"
                                        style={{
                                            fontFamily: font,
                                            fontSize: 'calc(16px * var(--font-scale))',
                                            color: 'var(--color-primary)',
                                            backgroundColor: 'var(--color-background)',
                                            border: selected
                                                ? '3px solid var(--color-primary)'
                                                : '2px solid var(--color-primary-transparent)',
                                            boxShadow: selected
                                                ? `0 0 12px var(--color-primary)`
                                                : 'none',
                                            opacity: selected ? 1 : 0.6,
                                            transition: 'all 0.3s ease',
                                        }}
                                        aria-current={selected ? 'true' : undefined}
                                        aria-label={`${font}${selected ? ' (currently selected)' : ''}`}
                                    >
                                        {font}
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
