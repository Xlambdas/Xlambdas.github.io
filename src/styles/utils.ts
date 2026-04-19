// src/styles/utils.ts
import { type AppTheme } from '../theme/theme.types.ts';

export const KEYFRAMES = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
`;


/**
 * Returns resolved colors, applying high-contrast override when enabled.
 */
export function getColors(theme: AppTheme) {
    if (theme.highContrast) {
        return {
            primary: '#FFFFFF',
            secondary: '#000000',
            background: '#000000',
            darkButton: '#FFFFFF',
            primaryTransparent: 'rgba(255,255,255,0.15)',
            primaryGlow: 'rgba(255,255,255,0.35)',
            darkButtonTransparent: 'rgba(255,255,255,0.2)',
        };
    }
    return { ...theme.colors };
}

// Helper function for lightening colors
export const lightenColor = (hex: string, percent: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r = Math.min(255, Math.round(r + (255 - r) * percent / 100));
    g = Math.min(255, Math.round(g + (255 - g) * percent / 100));
    b = Math.min(255, Math.round(b + (255 - b) * percent / 100));

    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
};

export const DarkenColor = (hex: string, percent: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r = Math.max(0, Math.round(r - (r * percent / 100)));
    g = Math.max(0, Math.round(g - (g * percent / 100)));
    b = Math.max(0, Math.round(b - (b * percent / 100)));

    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
};

export const computeSplineColors = (colors: any, highContrast: boolean = false) => {
    const result = {
        splineColor: highContrast ? '#121212' : colors.background !== '#F5F6FA' ? colors.background : DarkenColor(colors.primary, 30),
        // splineColor: lightenColor(colors.background, 5),
        splineFresnel: highContrast ? '#000000' : colors.background !== '#F5F6FA' ? DarkenColor(colors.primary, 20) : DarkenColor(colors.secondary, 20),
        splineLighting: highContrast ? '#FFFFFF' : lightenColor(colors.secondary, 10),
    };

    console.log('computeSplineColors input:', {
        background: colors.background,
        primary: colors.primary,
        secondary: colors.secondary,
    });
    console.log('computeSplineColors output:', result);

    return result;
};