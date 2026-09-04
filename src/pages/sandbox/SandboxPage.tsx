import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import { Header } from '../../components';

interface SandboxProject {
    id: string;
    title: string;
    description: string;
    path: string;
    status: 'active' | 'wip';
}

const SANDBOX_PROJECTS: SandboxProject[] = [
    {
        id: 'bivouac',
        title: 'Bivouac',
        description: 'Frictionless gear planning for outdoor trips.',
        path: '/sandbox/bivouac',
        status: 'wip',
    },
    {
        id: 'poise',
        title: 'Poise',
        description: 'Personal fitness and wellness management.',
        path: '/sandbox/poise',
        status: 'wip',
    },
];

export const SandboxPage: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [animationsEnabled, setAnimationsEnabled] = useState(true);

    useEffect(() => {
        if (theme.reducedMotion) setAnimationsEnabled(false);
    }, [theme.reducedMotion]);

    return (
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
            <Header
                type="main"
                animationsEnabled={animationsEnabled}
                setAnimationsEnabled={setAnimationsEnabled}
            />

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
                aria-label="Go back"
            >
                ← back
            </button>

            <main
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: 'clamp(120px, 15vh, 180px) clamp(10px, 6vw, 80px) clamp(60px, 10vh, 120px)',
                }}
            >
                {/* Title */}
                <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-center mb-8"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                        letterSpacing: "-0.02em",
                    }}
                >
                {/* <h1
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(42px, 8vw, 96px)',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        lineHeight: '1',
                        color: 'var(--color-primary)',
                        marginBottom: 'clamp(40px, 8vh, 100px)',
                    }}
                > */}
                    Sandbox
                </h1>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'clamp(16px, 3vw, 32px)',
                    }}
                >
                    {SANDBOX_PROJECTS.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => navigate(project.path)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

interface ProjectCardProps {
    project: SandboxProject;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="text-left transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            style={{
                backgroundColor: 'var(--color-secondary)',
                border: '1px solid var(--color-primary-transparent)',
                borderRadius: '12px',
                padding: 'clamp(20px, 3vw, 32px)',
                cursor: 'pointer',
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                }}
            >
                <h2
                    style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(24px, 4vw, 40px)',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        color: 'var(--color-primary)',
                        lineHeight: '1',
                    }}
                >
                    {project.title}
                </h2>

                <span
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--color-primary)',
                        opacity: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '4px',
                    }}
                >
                    {project.status === 'wip' ? 'WIP' : 'Active'}
                </span>
            </div>

            <p
                style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: 'clamp(14px, 1.5vw, 18px)',
                    color: 'var(--color-primary)',
                    opacity: 0.7,
                    lineHeight: '1.5',
                }}
            >
                {project.description}
            </p>
        </button>
    );
};