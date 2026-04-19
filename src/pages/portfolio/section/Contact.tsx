import React from 'react';
import { type PortfolioTranslations } from '../../../locales';

interface ContactProps {
    t: PortfolioTranslations;
}

export const Contact: React.FC<ContactProps> = ({ t }) => {
    const contactLinks = [
        { label: 'Email', href: 'mailto:cogassien@hotmail.com' },
        { label: 'LinkedIn', href: 'https://fr.linkedin.com/in/corentin-gassien-1b7289261' },
        { label: 'GitHub', href: 'https://github.com/Xlambdas' },
    ];

    return (
        <section
            className="min-h-screen py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center"
            role="region"
            aria-label="Contact section"
        >
            <div className="max-w-3xl mx-auto w-full text-center">
                <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-light italic mb-6 sm:mb-8"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                    }}
                >
                    {t.contact?.getInTouch || 'Get in Touch'}
                </h2>

                <p
                    className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 leading-relaxed"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-secondary)',
                    }}
                >
                    {t.contact?.description || 'Let\'s connect and explore opportunities together.'}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 flex-wrap">
                    {contactLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 sm:px-6 py-2 sm:py-3 border border-current rounded hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                            style={{
                                color: 'var(--color-primary)',
                                fontFamily: 'var(--font-secondary)',
                                fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                                fontWeight: 300,
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};