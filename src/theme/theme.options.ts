// src/theme/theme.options.ts
import { type AppTheme } from './theme.types';

/** All font families available in the accessibility panel */
export const AVAILABLE_PRIMARY_FONTS: AppTheme['typography']['primaryFontFamily'][] = [
    'Montserrat',
    'Inter',
    'Arial',
];

export const AVAILABLE_SECONDARY_FONTS: AppTheme['typography']['secondaryFontFamily'][] = [
    'JetBrains Mono',
    'Inter',
    'Arial',
];

/** Labelled font-scale steps shown as S / M / L / XL */
export const FONT_SCALE_OPTIONS = [
    { label: 'S', value: 0.85 },
    { label: 'M', value: 1 },
    { label: 'L', value: 1.2 },
    { label: 'XL', value: 1.5 },
] as const;

/** Labelled button-scale steps */
export const BUTTON_SCALE_OPTIONS = [
    { label: 'Small', value: 0.85 },
    { label: 'Normal', value: 1 },
    { label: 'Large', value: 1.3 },
] as const;