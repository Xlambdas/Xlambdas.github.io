import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/themeContext';
import { Header } from '../../components';
import { PORTFOLIO_TRANSLATIONS } from '../../locales';
import {
    PortfolioHero,
    AboutMe,
    Skills,
    Timeline,
    Interests,
    Values,
    Contact,
} from './section';
import { SideNavigation } from './components/SideNavigator';
import { useNavigate } from 'react-router-dom';

type SectionId = 'hero' | 'about' | 'skills' | 'timeline' | 'interests' | 'values' | 'contact';

interface SectionRefs {
    [key: string]: HTMLElement | null;
}

export const PortfolioPage: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    // State
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    // Track viewport width for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Refs
    const sectionRefs = useRef<SectionRefs>({});
    const t = PORTFOLIO_TRANSLATIONS[theme.language];

    // Effect: Handle reduced motion preference
    useEffect(() => {
        if (theme.reducedMotion) {
            setAnimationsEnabled(false);
        }
    }, [theme.reducedMotion]);

    // Effect: Load sidebar preferences
    useEffect(() => {
        const loadSidebarPreferences = () => {
            const saved = localStorage.getItem('portfolio-sidebar');
            if (saved) {
                const { width, collapsed } = JSON.parse(saved);
                setSidebarWidth(width);
                setSidebarCollapsed(collapsed);
            }
        };

        loadSidebarPreferences();
        window.addEventListener('storage', loadSidebarPreferences);

        return () => window.removeEventListener('storage', loadSidebarPreferences);
    }, []);

    // Effect: Handle scroll detection for active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = Object.entries(sectionRefs.current);

            for (const [sectionId, ref] of sections) {
                if (!ref) continue;

                const rect = ref.getBoundingClientRect();
                const isInViewport =
                    rect.top <= window.innerHeight / 2 &&
                    rect.bottom >= window.innerHeight / 2;

                if (isInViewport) {
                    setActiveSection(sectionId as SectionId);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handlers
    const handleNavigate = (sectionId: string) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(sectionId as SectionId);
        }
    };

    const handleBackButton = () => navigate(-1);

    return (
        <div style={{ backgroundColor: 'var(--color-background)' }}>
            <Header
                type="main"
                animationsEnabled={animationsEnabled}
                setAnimationsEnabled={setAnimationsEnabled}
            />

            {/* Mobile Back Button */}
            {sidebarCollapsed && (
                <MobileBackButton onClick={handleBackButton} label={t.navigation.back} />
            )}

            {/* Desktop Back Button */}
            {sidebarCollapsed && (
                <DesktopBackButton onClick={handleBackButton} label={t.navigation.back} />
            )}

            {/* Side Navigation */}
            {viewportWidth >= 1024 && (
                <SideNavigation
                    t={t}
                    activeSection={activeSection}
                    onNavigate={handleNavigate}
                    onWidthChange={setSidebarWidth}
                    onCollapseChange={setSidebarCollapsed}
                />
            )}

            {/* Main Content */}
            <MainContent
                sidebarCollapsed={viewportWidth < 1024 ? true : sidebarCollapsed}
                sidebarWidth={viewportWidth < 1024 ? 0 : Math.min(sidebarWidth, viewportWidth * 0.3)}
                sectionRefs={sectionRefs}
                t={t}
            />
        </div>
    );
};

// Sub-components for clarity
interface BackButtonProps {
    onClick: () => void;
    label: string;
}

const MobileBackButton: React.FC<BackButtonProps> = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="fixed left-4 sm:left-6 top-17 sm:top-24 lg:hidden z-50 font-light italic transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
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
        {label}
    </button>
);

const DesktopBackButton: React.FC<BackButtonProps> = ({ onClick, label }) => (
    <button
        onClick={onClick}
        className="hidden lg:block fixed left-8 top-17 z-50 font-light italic transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
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
        {label}
    </button>
);

interface MainContentProps {
    sidebarCollapsed: boolean;
    sidebarWidth: number;
    sectionRefs: React.MutableRefObject<SectionRefs>;
    t: any;
}

interface SectionProps {
    id: string;
    sectionRefs: React.MutableRefObject<SectionRefs>;
    component: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, sectionRefs, component }) => (
    <section
        ref={(el) => {
            if (el) sectionRefs.current[id] = el;
        }}
        id={id}
    >
        {component}
    </section>
);
// ============================================================================
// PLACEHOLDER COMPONENT (Use this for sections under development)
// ============================================================================
interface PlaceholderSectionProps {
    title: string;
    description?: string;
}

export const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({
    title,
    description = 'This section is currently under development. Coming soon.'
}) => {
    return (
        <section
            className="min-h-screen py-20 px-4 flex items-center"
            role="region"
            aria-label={`${title} section (placeholder)`}
        >
            <div className="max-w-3xl mx-auto w-full text-center">
                <h2
                    className="text-4xl sm:text-5xl font-light italic mb-6"
                    style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-primary)',
                    }}
                >
                    {title}
                </h2>

                <div
                    className="bg-opacity-10 border-2 border-dashed rounded p-8"
                    style={{
                        borderColor: 'var(--color-primary)',
                    }}
                >
                    <p
                        className="text-lg opacity-70"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-secondary)',
                        }}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
};

const MainContent: React.FC<MainContentProps> = ({
    sidebarCollapsed,
    sidebarWidth,
    sectionRefs,
    t,
}) => {
    const [, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const effectiveMargin = sidebarCollapsed ? 0 : sidebarWidth;

    return (
        <main
            className="w-screen"
            style={{
                marginLeft: `${effectiveMargin}px`,
                width: `calc(100vw - ${effectiveMargin}px)`,
                transition: 'margin-left 0.3s ease, width 0.3s ease',
                overflow: 'hidden',
            }}
        >
            <Section
                id="hero"
                sectionRefs={sectionRefs}
                component={<PortfolioHero t={t} />}
            />
            <Section
                id="about"
                sectionRefs={sectionRefs}
                component={<AboutMe t={t} />}
            />
            <Section
                id="skills"
                sectionRefs={sectionRefs}
                component={<Skills t={t} />}
            />
            <Section
                id="timeline"
                sectionRefs={sectionRefs}
                component={<Timeline t={t} />}
            />
            <Section
                id="interests"
                sectionRefs={sectionRefs}
                component={<Interests t={t} />}
            />
            <Section
                id="values"
                sectionRefs={sectionRefs}
                component={<Values t={t} />}
            />
            <Section
                id="contact"
                sectionRefs={sectionRefs}
                component={<Contact t={t} />}
            />
        </main>
    );
};
