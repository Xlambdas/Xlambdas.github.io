// src/components/Home/components/ScrollContainer.tsx
import { type ScrollContainerProps } from '../constants';
import React from 'react';

export const ScrollContainer: React.FC<ScrollContainerProps> = ({
    section,
    animationsEnabled,
    dragOffset = 0,
    children,
}) => {

    const totalSections = React.Children.count(children);

    return (
        <div className="fixed h-screen w-full overflow-hidden pointer-events-none z-1">
            <div
                style={{
                    width: '100%',
                    height: `${totalSections * 100}vh`,
                    transform: `translateY(calc(-${section * 100}vh - ${(dragOffset / window.innerHeight) * 100}%))`,                    transition: dragOffset === 0 && animationsEnabled
                        ? "transform 0.65s cubic-bezier(0.22,1,0.36,1)"
                        : "none",
                }}
            >
                {React.Children.map(children, (child, index) =>
                    React.cloneElement(child as React.ReactElement, {
                        active: index === section,
                    } as any)
                )}
            </div>
        </div>
    );
};