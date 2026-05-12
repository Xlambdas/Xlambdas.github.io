// src/components/Home/components/Section.tsx
import React from 'react';
import { type SectionProps } from '../constants';

export const Section: React.FC<SectionProps> = ({
    children,
    ariaLabel,
    active,
}) => {

    return (
        <section
            inert={!active ? true : undefined}
            aria-label={ariaLabel}
            className="w-full h-screen flex"
            style={{
                paddingTop: 'var(--vertical-section-padding)',
                paddingBottom: 'var(--vertical-section-padding)',
                boxSizing: 'border-box'
            }}
        >
            {children}
        </section>
    );
};