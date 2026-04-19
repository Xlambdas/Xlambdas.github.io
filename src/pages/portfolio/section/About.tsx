import React from 'react';
import type { AboutMeProps } from '../constants';

export const AboutMe: React.FC<AboutMeProps> = ({ t }) => {
    return (
        <section
            className="min-h-screen py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center"
            role="region"
            aria-label={t.about.ariaLabel}
        >
            <div className="max-w-3xl mx-auto w-full">
                <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-light italic mb-6 sm:mb-8"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                    }}
                >
                    {t.about.title}
                </h2>

                <p
                    className="text-sm sm:text-base lg:text-lg leading-relaxed"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {t.about.description}
                </p>
            </div>
        </section>
    );
};