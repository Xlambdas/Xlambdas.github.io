// src/theme/theme.types.ts
import { type Language } from '../pages/settings';
export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    darkButton: string;
    primaryTransparent: string;
    primaryGlow: string;
    darkButtonTransparent: string;
    splineColor: string;
    splineFresnel: string;
    splineLighting: string;
}

export interface ThemeTypography {
    /** Text scale multiplier. 0.85 | 1 | 1.2 | 1.5 */
    fontScale: number;
    /** Active font family. 'Arial' is the dyslexia-safe fallback */
    primaryFontFamily: 'Montserrat' | 'Inter' | 'Arial';
    secondaryFontFamily: 'JetBrains Mono' | 'Inter' | 'Arial';
}


export interface AppTheme {
    colors: ThemeColors;
    typography: ThemeTypography;
    buttonScale: number;
    reducedMotion: boolean;
    highContrast: boolean;
    language: Language;
}
