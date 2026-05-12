// src/components/Home/hooks/useSplineSetup.ts
import { useRef, useCallback, useEffect } from 'react';
import { initializeSpline, setDPRForDevice, updateCanvasResolution } from '../utils';
import { HOME_CONFIG } from '../../../constants/home.config';

export const useSplineSetup = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    animationsEnabled: boolean,
    isTouchDevice: boolean,
    onLoadComplete: () => void
) => {
    const appRef = useRef<any>(null);
    const dprRef = useRef(1.2);
    const animationFrameRef = useRef<number | null>(null);

    const initSpline = useCallback(async () => {
        if (!canvasRef.current) {
            console.error('Canvas ref not available');
            onLoadComplete();
            return;
        }

        try {
            setDPRForDevice(isTouchDevice, dprRef);
            updateCanvasResolution(canvasRef, dprRef.current, animationsEnabled);

            const app = await initializeSpline(
                canvasRef.current,
                import.meta.env.BASE_URL
            );

            appRef.current = app;
            (window as any).__app = app;
            app.setVariable('section', 0);

            // Sync colors immediately after Spline loads
            const { updateSplineColors } = await import('../utils/splineColors');
            // Get current theme from window (hacky but necessary)
            const storedTheme = localStorage.getItem('app-theme');
            if (storedTheme) {
                const theme = JSON.parse(storedTheme);
                const { computeSplineColors } = await import('../../../styles');
                const colors = { ...theme.colors };
                const splineColors = computeSplineColors(colors, theme.highContrast);
                updateSplineColors(app, {
                    color: splineColors.splineColor,
                    fresnel: splineColors.splineFresnel,
                    lighting: splineColors.splineLighting,
                });
            }

            setTimeout(onLoadComplete, HOME_CONFIG.loadingDelay);
        } catch (error) {
            console.error('Error loading Spline:', error);
            onLoadComplete();
        }
    }, [canvasRef, animationsEnabled, isTouchDevice, onLoadComplete]);

    // Cleanup animation frame on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, []);

    return { appRef, dprRef, initSpline };
};