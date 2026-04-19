import React, { useState } from 'react';
import { type PortfolioTranslations } from '../../../locales';

interface ValuesProps {
    t: PortfolioTranslations;
}

interface ValueEntry {
    key: number;
    title: string;
    quote: string;
    description: string;
}

export const Values: React.FC<ValuesProps> = ({ t }) => {
    const tv = t.values;
    if (!tv) return null;

    const [openKey, setOpenKey] = useState<number | null>(null);

    const entries: ValueEntry[] = tv.entries
        ? Object.entries(tv.entries).map(([k, v]) => ({
            key: Number(k),
            ...(v as { title: string; quote: string; description: string }),
        }))
        : [];

    const toggle = (key: number) =>
        setOpenKey((prev) => (prev === key ? null : key));

    return (
        <section
            className="min-h-screen py-10 sm:py-16 lg:py-20 px-3 sm:px-6 flex items-center"
            role="region"
            aria-label={tv.ariaLabel}
            onClick={() => setOpenKey(null)}
        >
            <div className="max-w-5xl mx-auto w-full min-w-0">

                {/* Title */}
                <h2
                    className="text-3xl sm:text-5xl lg:text-6xl font-light italic mb-4 sm:mb-6"
                    style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-primary)' }}
                >
                    {tv.title}
                </h2>

                {/* Optional description */}
                {tv.description && (
                    <p
                        className="text-sm sm:text-base lg:text-lg mb-10 sm:mb-14 opacity-70"
                        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-secondary)' }}
                    >
                        {tv.description}
                    </p>
                )}

                {/* Card grid */}
                <div
                    className="grid gap-3 sm:gap-4 lg:gap-5"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                    }}
                >
                    {entries.map((entry) => {
                        const isOpen = openKey === entry.key;

                        return (
                            <div
                                key={entry.key}
                                role="button"
                                tabIndex={0}
                                aria-expanded={isOpen}
                                aria-label={`${entry.title}: ${entry.quote}`}
                                onClick={(e) => { e.stopPropagation(); toggle(entry.key); }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggle(entry.key);
                                    }
                                    if (e.key === 'Escape') setOpenKey(null);
                                }}
                                className="relative border rounded-lg overflow-hidden transition-all duration-300"
                                style={{
                                    borderColor: isOpen
                                        ? 'var(--color-primary)'
                                        : 'var(--color-primary-transparent)',
                                    cursor: 'pointer',
                                    minHeight: isOpen ? '0' : '180px',
                                    backgroundColor: isOpen
                                        ? 'transparent'
                                        : 'transparent',
                                    outline: 'none',
                                }}
                            >
                                {/* ── Collapsed: quote face ── */}
                                <div
                                    className="transition-all duration-300 overflow-hidden"
                                    style={{
                                        maxHeight: isOpen ? '0px' : '400px',
                                        opacity: isOpen ? 0 : 1,
                                        pointerEvents: isOpen ? 'none' : 'auto',
                                    }}
                                >
                                    <div className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-45">
                                        {/* Large opening mark */}
                                        <span
                                            className="block text-5xl sm:text-6xl font-light leading-none mb-2 select-none"
                                            style={{
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-primary)',
                                                opacity: 0.18,
                                                lineHeight: 1,
                                            }}
                                            aria-hidden="true"
                                        >
                                            "
                                        </span>

                                        {/* Quote text */}
                                        <p
                                            className="text-base sm:text-lg font-light italic leading-snug flex-1"
                                            style={{
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-primary)',
                                                opacity: 0.85,
                                            }}
                                        >
                                            {entry.quote}
                                        </p>

                                        {/* Footer: title + expand hint */}
                                        <div className="flex items-end justify-between mt-4 gap-2">
                                            <span
                                                className="text-xs font-light tracking-widest uppercase opacity-40"
                                                style={{
                                                    color: 'var(--color-primary)',
                                                    fontFamily: 'var(--font-secondary)',
                                                    letterSpacing: '0.12em',
                                                }}
                                            >
                                                {entry.title}
                                            </span>
                                            <span
                                                className="text-xs opacity-30 shrink-0"
                                                style={{
                                                    color: 'var(--color-primary)',
                                                    fontFamily: 'var(--font-secondary)',
                                                }}
                                                aria-hidden="true"
                                            >
                                                ↓
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Expanded: title + description ── */}
                                <div
                                    className="transition-all duration-300 overflow-hidden"
                                    style={{
                                        maxHeight: isOpen ? '600px' : '0px',
                                        opacity: isOpen ? 1 : 0,
                                        pointerEvents: isOpen ? 'auto' : 'none',
                                    }}
                                >
                                    <div className="p-5 sm:p-6">
                                        {/* Title */}
                                        <h3
                                            className="text-xl sm:text-2xl font-light italic mb-3"
                                            style={{
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-primary)',
                                            }}
                                        >
                                            {entry.title}
                                        </h3>

                                        {/* Thin divider */}
                                        <div
                                            className="mb-4"
                                            style={{
                                                height: '1px',
                                                width: '2rem',
                                                backgroundColor: 'var(--color-primary)',
                                                opacity: 0.3,
                                            }}
                                        />

                                        {/* Description */}
                                        <p
                                            className="text-sm sm:text-base font-light leading-relaxed opacity-75"
                                            style={{
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-secondary)',
                                            }}
                                        >
                                            {entry.description}
                                        </p>

                                        {/* Collapse hint */}
                                        <span
                                            className="block text-xs opacity-30 mt-5"
                                            style={{
                                                color: 'var(--color-primary)',
                                                fontFamily: 'var(--font-secondary)',
                                            }}
                                            aria-hidden="true"
                                        >
                                            ↑ close
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};