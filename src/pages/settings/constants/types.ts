import { type AppTheme } from '../../../theme';
import type { TabId } from './constants';
import { Palette, Type, Ruler, Globe, Wind } from 'lucide-react';


export interface LivePreviewProps {
    theme: AppTheme;
    t: {
        livePreview: string;
        previewText: string;
    };
}

export const TAB_CONFIG: Record<TabId, React.ElementType> = {
    colors: Palette,
    typography: Type,
    sizes: Ruler,
    language: Globe,
    motion: Wind,
};

// ---------------------------
// --- Panel and Tab types ---
// ---------------------------

// --- Colors panel ---
export interface ColorPreset {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
    };
}

export interface ColorsPanelProps {
    theme: AppTheme;
    onColorChange: (colorKey: 'primary' | 'secondary' | 'background', value: string) => void;
    t: {
        primary: string;
        secondary: string;
        background: string;
        colorPresetsTitle: string;
        customColorsTitle: string;
        presetPurpleNight: string;
        presetOceanBlue: string;
        presetSunset: string;
        presetForestGreen: string;
        presetLightMode: string;
    };
}

// --- Language panel ---
export interface LanguagePanelProps {
    theme: AppTheme;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    t: {
        label: string;
    };
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it';


// --- Motion panel ---
export interface MotionPanelProps {
    theme: AppTheme;
    onToggle: (feature: 'reducedMotion' | 'highContrast') => void;
    t: {
        reduceMotion: string;
        highContrast: string;
    };
}

export interface ToggleFeature {
    feature: 'reducedMotion' | 'highContrast';
    label: string;
}

// --- scale panels ---
export interface SizesPanelProps {
    theme: AppTheme;
    onScaleChange: (scale: number, type: 'font' | 'button') => void;
    t: {
        textSize: string;
        buttonSize: string;
    };
}

export interface ScaleSection {
    type: 'font' | 'button';
    label: string;
    options: readonly { label: string; value: number }[];
}

// --- typo panel ---
export interface TypographyPanelProps {
    theme: AppTheme;
    onFontChange: (fontFamily: string, type: 'primary' | 'secondary') => void;
    t: {
        primaryFont: string;
        secondaryFont: string;
    };
}
export interface FontSection {
    fonts: string[];
    type: 'primary' | 'secondary';
    label: string;
}
