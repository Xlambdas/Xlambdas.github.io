import React from 'react';
import type { PortfolioTranslations } from '../../../locales/portfolio';

interface InterestsProps {
    t: PortfolioTranslations;
}

export const Interests: React.FC<InterestsProps> = ({ t }) => {
    const interestItems = t.interests?.entries
        ? Object.values(t.interests.entries)
        : [];

    return (
        <section
            className="min-h-screen py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center"
            role="region"
            aria-label={t.interests?.ariaLabel || 'Interests section'}
        >
            <div className="max-w-5xl mx-auto w-full">
                {/* Section Header */}
                <div className="mb-8 sm:mb-12 lg:mb-16">
                    <h2
                        className="text-3xl sm:text-4xl lg:text-5xl font-light italic mb-4 sm:mb-6"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-primary)',
                        }}
                    >
                        {t.interests?.title || 'Interests'}
                    </h2>

                    <p
                        className="text-sm sm:text-base lg:text-lg leading-relaxed opacity-80"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-secondary)',
                        }}
                    >
                        {t.interests?.description ||
                            'Areas I actively explore and continuously learn about'}
                    </p>
                </div>

                {/* Interest Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {interestItems.map((interest, index) => (
                        <article
                            key={interest.name}
                            className="p-4 sm:p-6 lg:p-8 border rounded transition-all duration-300 hover:shadow-sm"
                            style={{
                                borderColor: 'var(--color-primary-transparent)',
                                backgroundColor: 'transparent',
                            }}
                        >
                            {/* Interest Number */}
                            <div
                                className="text-xs sm:text-sm font-light mb-3 sm:mb-4 opacity-50"
                                style={{
                                    color: 'var(--color-primary)',
                                    fontFamily: 'var(--font-secondary)',
                                }}
                            >
                                0{index + 1}
                            </div>

                            {/* Interest Title */}
                            <h3
                                className="text-base sm:text-lg lg:text-xl font-light italic mb-2 sm:mb-3"
                                style={{
                                    color: 'var(--color-primary)',
                                    fontFamily: 'var(--font-primary)',
                                }}
                            >
                                {interest.name}
                            </h3>

                            {/* Interest Description */}
                            <p
                                className="text-xs sm:text-sm lg:text-base leading-relaxed"
                                style={{
                                    color: 'var(--color-primary)',
                                    fontFamily: 'var(--font-secondary)',
                                    opacity: 0.7,
                                }}
                            >
                                {interest.description}
                            </p>
                        </article>
                    ))}
                </div>

                {/* Bottom Note */}
                <div
                    className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t"
                    style={{
                        borderColor: 'var(--color-primary-transparent)',
                    }}
                >
                    {t.interests?.note && (
                        <p
                            className="text-xs sm:text-sm lg:text-base leading-relaxed opacity-60 max-w-2xl"
                            style={{
                                color: 'var(--color-primary)',
                                fontFamily: 'var(--font-secondary)',
                            }}
                        >
                            {t.interests.note}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};