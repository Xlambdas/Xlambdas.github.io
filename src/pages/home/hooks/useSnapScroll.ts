import { useRef, useCallback } from 'react';
import { type UseSnapScrollProps, type TouchState } from '../constants';

export const useSnapScroll = ({
    maxSection,
    onSectionChange,
    onSplineUpdate,
}: UseSnapScrollProps) => {
    const touchState = useRef<TouchState>({
        startY: 0,
        startTime: 0,
        isDragging: false,
    });

    const currentSectionRef = useRef<number>(0);
    const dragOffsetRef = useRef<number>(0);

    const calculateVelocity = useCallback(
        (deltaY: number, deltaTime: number): number => {
            if (deltaTime === 0) return 0;
            return deltaY / deltaTime;
        },
        []
    );

    const getSnapSection = useCallback(
        (dragDistance: number, velocity: number, currentSection: number): number => {
            const screenHeight = window.innerHeight;
            const dragThreshold = screenHeight * 0.15;
            const velocityThreshold = 0.5;

            const dragDirection = dragDistance > 0 ? 1 : -1;
            const absDragDistance = Math.abs(dragDistance);

            let nextSection = currentSection;

            if (Math.abs(velocity) > velocityThreshold) {
                nextSection = velocity > 0 ? currentSection + 1 : currentSection - 1;
            } else if (absDragDistance > dragThreshold) {
                nextSection = currentSection + dragDirection;
            } else {
                nextSection = currentSection;
            }

            return Math.max(0, Math.min(nextSection, maxSection));
        },
        [maxSection]
    );

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        touchState.current = {
            startY: touch.clientY,
            startTime: Date.now(),
            isDragging: true,
        };
        dragOffsetRef.current = 0;
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length !== 1 || !touchState.current.isDragging) return;

        const touch = e.touches[0];
        const dragDistance = touchState.current.startY - touch.clientY;
        dragOffsetRef.current = dragDistance;

        e.preventDefault();
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!touchState.current.isDragging) return;

        const endTime = Date.now();
        const deltaTime = Math.max(endTime - touchState.current.startTime, 1);
        const dragDistance = dragOffsetRef.current;
        const velocity = calculateVelocity(dragDistance, deltaTime);

        const nextSection = getSnapSection(
            dragDistance,
            velocity,
            currentSectionRef.current
        );

        if (nextSection !== currentSectionRef.current) {
            currentSectionRef.current = nextSection;
            onSectionChange(nextSection);
            onSplineUpdate(nextSection);
        }

        touchState.current.isDragging = false;
        dragOffsetRef.current = 0;
    }, [calculateVelocity, getSnapSection, onSectionChange, onSplineUpdate]);

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        dragOffsetRef,
        setCurrentSection: (section: number) => {
            currentSectionRef.current = section;
        },
    };
};