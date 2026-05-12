// /constant/types.ts
import React, { type RefObject } from 'react';

export type SplineApplication = {
    load(path: string): Promise<void>;
    setVariable(name: string, value: any): void | Promise<void>;
}

export interface UseScrollNavigationOptions {
    maxSection: number;
    onSectionChange: (section: number) => void;
    onSplineUpdate: (section: number) => void;
}

export interface UseTouchNavigationOptions {
    onSwipe: (direction: 1 | -1) => void;
}

export interface SectionProps {
    children: React.ReactNode;
    /** Optional aria-label for landmark navigation */
    ariaLabel?: string;
    active: boolean;
    className?: string;
}

// Added for scroll navigation
export interface ScrollContainerProps {
    children: React.ReactNode;
    section: number;
    animationsEnabled: boolean;
    dragOffset?: number;
    className?: string;
}

export interface UseScrollNavigationProps {
    maxSection: number;
    scrollRef?: RefObject<HTMLDivElement | null>;
    onSectionChange: (section: number) => void;
    onSplineUpdate: (section: number) => void;
}

// Added for snap scroll
export interface UseSnapScrollProps {
    maxSection: number;
    onSectionChange: (section: number) => void;
    onSplineUpdate: (section: number) => void;
}

export interface TouchState {
    startY: number;
    startTime: number;
    isDragging: boolean;
}


// Added for touch navigation
export interface UseTouchNavigationProps {
    onSwipe: (direction: number) => void;
    tolerance?: number; //added
    preventScrollOnSwipe?: boolean; // added
}