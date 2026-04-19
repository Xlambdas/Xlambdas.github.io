import { useRef, useCallback } from 'react';
import { HOME_CONFIG } from '../../../constants/home.config.ts';
import { type UseTouchNavigationProps } from '../constants';


export const useTouchNavigation = ({
    onSwipe,
    tolerance = HOME_CONFIG.swipeThreshold,
    preventScrollOnSwipe = false
}: UseTouchNavigationProps) => {
    const touchStartY = useRef(0);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            const delta = touchStartY.current - e.changedTouches[0].clientY;

            if (Math.abs(delta) > tolerance) {
                if (!preventScrollOnSwipe) {
                    e.preventDefault(); // Block scroll only if explicitly enabled
                }
                onSwipe(delta > 0 ? 1 : -1);
            }
        },
        [onSwipe, tolerance, preventScrollOnSwipe]
    );

    return { handleTouchStart, handleTouchEnd };
};
