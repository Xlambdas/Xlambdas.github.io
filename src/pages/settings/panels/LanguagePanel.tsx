// src/pages/accessibility/panels/LanguagePanel.tsx
import { type LanguagePanelProps, LANGUAGE_NAMES, LANGUAGES } from '../constants';

export const LanguagePanel: React.FC<LanguagePanelProps> = ({ language, onLanguageChange, t }) => {
    return (
        <div role="tabpanel" id="language-panel" className="mb-12">
            <div
                className="p-6 sm:p-8 rounded-xl border-2 transition-all"
                style={{ borderColor: 'var(--color-primary)' }}
            >
                <h3
                    className="text-xl sm:text-2xl font-light italic mb-6"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                >
                    {t.label}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {LANGUAGES.map((lang) => {
                        const isActive = language === lang;
                        return (
                            <button
                                key={lang}
                                onClick={() => onLanguageChange(lang)}
                                className="p-4 rounded-lg font-light transition-all hover:scale-105 active:scale-95 relative"
                                style={{
                                    color: 'var(--color-primary)',
                                    backgroundColor: 'var(--color-background)',
                                    border: isActive
                                        ? '3px solid var(--color-primary)'
                                        : '2px solid var(--color-primary-transparent)',
                                    boxShadow: isActive
                                        ? `0 0 12px var(--color-primary)`
                                        : 'none',
                                    opacity: isActive ? 1 : 0.6,
                                    transition: 'all 0.3s ease',
                                }}
                                aria-current={isActive ? 'true' : undefined}
                                aria-label={`${LANGUAGE_NAMES[lang]}${isActive ? ' (currently selected)' : ''}`}
                            >
                                {isActive && (
                                    <div
                                        className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-background)',
                                            fontSize: '10px'
                                        }}
                                    >
                                        ✓
                                    </div>
                                )}
                                {LANGUAGE_NAMES[lang]}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};