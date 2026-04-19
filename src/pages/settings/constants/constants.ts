// src/pages/accessibility/constants.ts
import type { ColorPreset, FontSection, Language, MotionPanelProps, ScaleSection, SizesPanelProps, ToggleFeature, TypographyPanelProps } from './types';
import { AVAILABLE_PRIMARY_FONTS, AVAILABLE_SECONDARY_FONTS, BUTTON_SCALE_OPTIONS, FONT_SCALE_OPTIONS } from '../../../theme/theme.options';

export type TabId = 'colors' | 'typography' | 'sizes' | 'language' | 'motion';

export interface TabItem {
    id: TabId;
    label: string;
    icon: React.ElementType;
    panel: string;
}

// --------------------------------
// --- Panel-specific constants ---
// --------------------------------

// --- Colors panel ---
export const COLOR_PRESETS: ColorPreset[] = [
    {
        name: 'Purple Night',
        colors: {
            primary: '#9C88D9',
            secondary: '#18112D',
            background: '#0B0E16',
        },
    },
    {
        name: 'Ocean Blue',
        colors: {
            primary: '#00D4FF',
            secondary: '#0A3A47',
            background: '#0F1419',
        },
    },
    {
        name: 'Sunset',
        colors: {
            primary: '#FF6B35',
            secondary: '#8B3A1F',
            background: '#1A0F08',
        },
    },
    {
        name: 'Forest Green',
        colors: {
            primary: '#2ECC71',
            secondary: '#1B5E3F',
            background: '#0D2818',
        },
    },
    {
        name: 'Light Mode',
        colors: {
            primary: '#2D3436',
            secondary: '#6C5CE7',
            background: '#F5F6FA',
        },
    },
];

// --- Language panel ---
export const LANGUAGES: Language[] = ['en', 'es', 'fr', 'de', 'it'];
export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
};

// --- Motion panel ---
export const TOGGLE_FEATURES = (t: MotionPanelProps['t']): ToggleFeature[] => [
    { feature: 'reducedMotion', label: t.reduceMotion },
    { feature: 'highContrast', label: t.highContrast },
];

// --- scale panel ---
export const SCALE_SECTIONS = (t: SizesPanelProps['t']): ScaleSection[] => [
    { type: 'font', label: t.textSize, options: FONT_SCALE_OPTIONS },
    { type: 'button', label: t.buttonSize, options: BUTTON_SCALE_OPTIONS },
];

// --- typo panel ---
export const FONT_SECTIONS: (t: TypographyPanelProps['t']) => FontSection[] = (t) => [
    { fonts: AVAILABLE_PRIMARY_FONTS, type: 'primary', label: t.primaryFont },
    { fonts: AVAILABLE_SECONDARY_FONTS, type: 'secondary', label: t.secondaryFont },
];