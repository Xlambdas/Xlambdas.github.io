// src/theme/theme.defaults.ts
import { type AppTheme } from './theme.types';
// import { lightenColor } from '../styles';


const PURPLE_NIGHT = {
    primary: '#9C88D9',
    secondary: '#18112D',
    background: '#0B0E16',
};

export const DEFAULT_THEME: AppTheme = {
    colors: {
        ...PURPLE_NIGHT,
        darkButton: '#0B0E16',
        primaryTransparent: 'rgba(156, 136, 217, 0.2)',
        primaryGlow: 'rgba(156, 136, 217, 0.4)',
        darkButtonTransparent: 'rgba(24, 17, 45, 0.8)',
        splineColor: '#0B0E16',
        // splineColor: lightenColor('#0B0E16', 5),
        splineFresnel: '#18112D',
        splineLighting: '#0B0E16',
    },
    typography: {
        fontScale: 1,
        primaryFontFamily: 'Montserrat',
        secondaryFontFamily: 'JetBrains Mono',
    },
    buttonScale: 1,
    reducedMotion: false,
    highContrast: false,
    language: 'en',
};