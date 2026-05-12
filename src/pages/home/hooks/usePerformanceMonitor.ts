import { useRef, useCallback } from 'react';
import { HOME_CONFIG } from '../../../constants/home.config.ts';

export const usePerformanceMonitor = () => {
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const frameIdRef = useRef<number | null>(null);

    const monitorPerformance = useCallback(() => {
        // Check performance only every N intervals, not every frame
        frameCount.current++;
        const now = performance.now();
        const delta = now - lastTime.current;

        if (delta >= HOME_CONFIG.performanceCheckInterval) {
            const fps = (frameCount.current * 1000) / delta;
            if (fps < HOME_CONFIG.fpsWarningThreshold) {
                console.warn('Low FPS detected:', fps);
            }
            frameCount.current = 0;
            lastTime.current = now;
        }

        // Schedule next check instead of calling RAF directly
        frameIdRef.current = setTimeout(() => {
            frameIdRef.current = null;
            monitorPerformance();
        }, HOME_CONFIG.performanceCheckInterval);
    }, []);

    const stopMonitoring = useCallback(() => {
        if (frameIdRef.current !== null) {
            clearTimeout(frameIdRef.current);
            frameIdRef.current = null;
        }
    }, []);

    return { monitorPerformance, stopMonitoring };
};