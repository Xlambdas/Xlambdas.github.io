// src/pages/accessibility/AcessibilityPage.tsx
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import { useState } from 'react';
import { DEFAULT_THEME } from '../../theme/theme.defaults';
import { ColorsPanel, LanguagePanel, MotionPanel, SizesPanel, TypographyPanel } from './panels';
import { LivePreview } from './components';

import { RotateCcw } from 'lucide-react';

import { SETTINGS_TRANSLATIONS } from '../../locales';
import { useSettingsHandlers } from './hooks/useSettingsHandlers';
import { createTabs } from './utils';



export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, updateTheme, updateLanguage } = useTheme();
    const [activeTab, setActiveTab] = useState('colors');
    const [isResetHovering, setIsResetHovering] = useState(false);

    const language = theme.language;
    const t = SETTINGS_TRANSLATIONS[language];
    const tabs = createTabs(t);

    const { handleColorChange, handleFontChange, handleScaleChange, handleToggle } = useSettingsHandlers();

    return (
        <div
            className="min-h-screen w-full pb-16"
            style={{ backgroundColor: 'var(--color-background)' }}
        >
            {/* Mobile Header */}
            <div
                className="fixed top-0 left-0 right-0 lg:hidden z-50 px-4 sm:px-6 py-3 sm:py-4"
                style={{
                    backgroundColor: 'var(--color-background)',
                    borderBottomWidth: '2px',
                    borderColor: 'var(--color-primary)',
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="text-lg font-light italic transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-primary)' }}
                >
                    {t.back}
                </button>
            </div>

            {/* Desktop Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="hidden lg:block fixed left-8 top-4 z-50 text-xl font-light italic transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
            >
                {t.back}
            </button>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-20">
                {/* Desktop Title */}
                <div
                    className="hidden lg:flex lg:sticky lg:top-0 lg:z-39 items-center justify-center mb-8 lg:py-8"
                    style={{ backgroundColor: 'var(--color-background)' }}
                >
                    <h1
                        className="text-5xl font-light italic"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-primary)',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {t.title}
                    </h1>
                </div>

                {/* Mobile Title */}
                <h1
                    className="lg:hidden text-2xl sm:text-3xl font-light italic mb-4 sm:mb-8 text-center pt-0"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {t.title}
                </h1>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Settings Column */}
                    <div className="lg:col-span-2">
                        {/* Tab Navigation */}
                        <div
                            role="tablist"
                            className="sticky top-12 lg:top-24 z-40 flex gap-2 pb-0 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto"
                            style={{
                                borderBottomWidth: '2px',
                                borderColor: 'var(--color-primary)',
                                backgroundColor: 'var(--color-background)',
                            }}
                        >
                            {tabs.map(({ id, label, icon: Icon, panel }) => (
                                <button
                                    key={id}
                                    role="tab"
                                    aria-selected={activeTab === id}
                                    aria-controls={panel}
                                    id={`tab-${id}`}
                                    tabIndex={activeTab === id ? 0 : -1}
                                    onClick={() => setActiveTab(id)}
                                    className="flex items-center gap-2 whitespace-nowrap px-4 py-4 font-light italic text-sm sm:text-base transition-all"
                                    style={{
                                        color: activeTab === id ? 'var(--color-primary)' : '#999',
                                        borderBottom: activeTab === id ? `4px solid var(--color-primary)` : '4px solid transparent',
                                        marginBottom: '0px',
                                    }}
                                >
                                    <Icon size={20} />
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Panels */}
                        {activeTab === 'colors' && (
                            <ColorsPanel
                                theme={theme}
                                onColorChange={handleColorChange}
                                t={{
                                    primary: t.primary,
                                    secondary: t.secondary,
                                    background: t.background,
                                    colorPresetsTitle: t.colorPresetsTitle,
                                    customColorsTitle: t.customColorsTitle,
                                    presetPurpleNight: t.presetPurpleNight,
                                    presetOceanBlue: t.presetOceanBlue,
                                    presetSunset: t.presetSunset,
                                    presetForestGreen: t.presetForestGreen,
                                    presetLightMode: t.presetLightMode,
                                }}
                            />
                        )}
                        {activeTab === 'typography' && (
                            <TypographyPanel
                                theme={theme}
                                onFontChange={handleFontChange}
                                t={{ primaryFont: t.primaryFont, secondaryFont: t.secondaryFont }}
                            />
                        )}
                        {activeTab === 'sizes' && (
                            <SizesPanel
                                theme={theme}
                                onScaleChange={handleScaleChange}
                                t={{ textSize: t.textSize, buttonSize: t.buttonSize }}
                            />
                        )}
                        {activeTab === 'language' && (
                            <LanguagePanel
                                theme={theme}
                                language={language}
                                onLanguageChange={updateLanguage}
                                t={{ label: t.language }}
                            />
                        )}
                        {activeTab === 'motion' && (
                            <MotionPanel
                                theme={theme}
                                onToggle={handleToggle}
                                t={{ reduceMotion: t.reduceMotion, highContrast: t.highContrast }}
                            />
                        )}
                    </div>

                    {/* Live Preview Column */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <LivePreview
                            theme={theme}
                            t={{ livePreview: t.livePreview, previewText: t.previewText }}
                        />

                        <button
                            onClick={() => updateTheme(DEFAULT_THEME)}
                            onMouseEnter={() => setIsResetHovering(true)}
                            onMouseLeave={() => setIsResetHovering(false)}
                            className="mt-8 w-full px-8 py-4 rounded-lg font-light italic text-lg transition-all active:scale-95 flex items-center justify-center gap-2 hover:scale-105"
                            style={{
                                color: 'var(--color-primary)',
                                border: '2px solid var(--color-primary)',
                                fontFamily: 'var(--font-primary)',
                            }}
                        >
                            <RotateCcw
                                size={20}
                                style={{
                                    transform: !theme.reducedMotion && isResetHovering ? 'rotate(-360deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.6s ease-in-out',
                                }}
                            />
                            {t.reset}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};