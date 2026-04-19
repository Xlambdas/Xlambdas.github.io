// src/pages/projects/ProjectsPage.tsx
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import React, { useEffect, useState } from 'react';
import { projects } from './data/projectsData';
import { Header, Carousel } from '../../components';
import { ProjectCard } from './components';
import { PROJECTS_TRANSLATIONS } from '../../locales';


export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const t = PROJECTS_TRANSLATIONS[theme.language];
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    useEffect(() => {
        if (theme.reducedMotion) setAnimationsEnabled(false);
    }, [theme.reducedMotion]);

    return (
        <div
            className="h-screen w-full"
            style={{ backgroundColor: 'var(--color-background)' }}
            // role="main"
            aria-label={t.ariaLabel}
        >
            <Header type="main" animationsEnabled={animationsEnabled} setAnimationsEnabled={setAnimationsEnabled} />

            <button
                onClick={() => navigate("/")}
                className="fixed left-4 sm:left-6 lg:left-8 top-17 sm:top-17 z-50 text-lg sm:text-xl font-light italic transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                style={{
                    color: 'var(--color-primary)',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(11, 14, 22, 0.7)',
                    padding: 'clamp(0.4rem, 1.5vw, 0.8rem) clamp(0.6rem, 2vw, 1.2rem)',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.85rem, 2vw, 1.25rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                }}
                aria-label={t.backAriaLabel}
            >
                {t.backButton}
            </button>

            <div className="flex flex-col h-screen mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                {/* Title */}
                <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-center mb-8"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                        letterSpacing: "-0.02em",
                    }}
                >
                    {t.title}
                </h1>

                {/* Carousel */}
                <div
                    className="flex-1 min-h-0"
                    role="region"
                    aria-label={t.carouselAriaLabel}
                    aria-live="polite"
                    aria-atomic="false"
                >
                    <Carousel>
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
};



