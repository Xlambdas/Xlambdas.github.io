// src/pages/accessibility/hooks/useAccessibilityHandlers.ts
import { useCallback } from 'react';
import { useTheme } from '../../../context/themeContext';
import { updateSplineColors } from '../../../components';
import { computeSplineColors } from '../../../styles';

export const useSettingsHandlers = () => {
    const { theme, updateTheme, updateColor, updateFontScale, updateButtonScale, updateMotion } = useTheme();

    const handleColorChange = useCallback((colorKey: 'primary' | 'secondary' | 'background', value: string) => {
        // Compute new spline colors immediately
        const updatedColors = { ...theme.colors, [colorKey]: value };
        const splineColors = computeSplineColors(updatedColors);

        // Update theme
        updateColor(colorKey, value);

        // Update Spline immediately with computed colors
        const app = (window as any).__app;
        if (app) {
            updateSplineColors(app, {
                color: splineColors.splineColor,
                fresnel: splineColors.splineFresnel,
                lighting: splineColors.splineLighting,
            });
        }
    }, [updateColor, theme.colors]);

    const handleFontChange = useCallback(
        (fontFamily: string, type: 'primary' | 'secondary') => {
            const fontUpdate = fontFamily === 'Arial'
                ? { primaryFontFamily: 'Arial' as const, secondaryFontFamily: 'Arial' as const }
                : { [type === 'primary' ? 'primaryFontFamily' : 'secondaryFontFamily']: fontFamily as any };

            updateTheme({ typography: { ...theme.typography, ...fontUpdate } });
        },
        [theme, updateTheme]
    );

    const handleScaleChange = useCallback(
        (scale: number, type: 'font' | 'button') => {
            if (type === 'font') {
                updateFontScale(scale);
            } else {
                updateButtonScale(scale);
            }
        },
        [updateFontScale, updateButtonScale]
    );

    const handleToggle = useCallback(
        (feature: 'reducedMotion' | 'highContrast') => {
            if (feature === 'reducedMotion') {
                updateMotion(!theme.reducedMotion);
            } else {
                updateTheme({ highContrast: !theme.highContrast });
            }
        },
        [theme, updateTheme, updateMotion]
    );

    return { handleColorChange, handleFontChange, handleScaleChange, handleToggle };
};