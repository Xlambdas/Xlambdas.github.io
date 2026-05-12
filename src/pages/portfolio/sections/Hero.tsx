import React from 'react';
import { type PortfolioTranslations } from '../../../locales';

interface PortfolioHeroProps {
    t: PortfolioTranslations;
}

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({ t }) => {
    return (
        <section
            className="min-h-screen py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
            role="region"
            aria-label={t.hero.ariaLabel}
        >
            <div className="max-w-3xl w-full text-center space-y-4 sm:space-y-6 lg:space-y-8">
                <h1
                    className="text-3xl sm:text-5xl lg:text-7xl font-light italic leading-tight"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                    }}
                >
                    {t.hero.title}
                </h1>

                <p
                    className="text-sm sm:text-base lg:text-xl xl:text-2xl font-light leading-relaxed"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {t.hero.subtitle}
                </p>
            </div>
        </section>
    );
};