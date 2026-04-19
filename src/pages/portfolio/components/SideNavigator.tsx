// src/pages/portfolio/components/SideNavigator.tsx
import React, { useState, useRef, useEffect } from 'react';
import { type PortfolioTranslations } from '../../../locales/portfolio';
import { ChevronRight, ChevronLeft, Folder, FileText, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FileItem {
    name: string;
    type: 'file' | 'folder';
    id?: string;
    isLast?: boolean;
    depth: number;
    children?: FileItem[];
    comment?: string;
}

interface SideNavigationProps {
    t: PortfolioTranslations;
    activeSection: string;
    onNavigate: (sectionId: string) => void;
    onWidthChange: (width: number) => void;
    onCollapseChange: (collapsed: boolean) => void;
}


export const SideNavigation: React.FC<SideNavigationProps> = ({
    t,
    activeSection,
    onNavigate,
    onWidthChange,
    onCollapseChange,
}) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set([t.sidebar.folders.portfolio.name])
    );
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [width, setWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Load saved preferences
    // Load saved preferences (but force closed if small screen)
    useEffect(() => {
        const isSmallScreen = window.innerWidth < 1024;

        const saved = localStorage.getItem('portfolio-sidebar');
        if (saved) {
            const { width: savedWidth, collapsed } = JSON.parse(saved);
            setWidth(savedWidth);
            // Force closed on small screens, otherwise use saved state
            setIsCollapsed(isSmallScreen ? true : collapsed);
            onWidthChange(savedWidth);
            onCollapseChange(isSmallScreen ? true : collapsed);
        } else {
            // No saved preference: force closed on small screens
            setIsCollapsed(isSmallScreen ? true : false);
            onCollapseChange(isSmallScreen ? true : false);
        }
    }, [onWidthChange, onCollapseChange]);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('portfolio-sidebar', JSON.stringify({ width, collapsed: isCollapsed }));
    }, [width, isCollapsed]);

    // REMOVE the condition - always force closed on small screens
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);          // ← Always set
                onCollapseChange(true);        // ← No condition
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, [onCollapseChange]);

    // Build file structure from translations
    const fileStructure: FileItem[] = [
        {
            name: t.sidebar.folders.portfolio.name,
            type: 'folder',
            depth: 0,
            children: [
                {
                    name: t.sidebar.files.about.name,
                    type: 'file',
                    id: 'about',
                    depth: 1,
                    comment: t.sidebar.files.about.comment,
                },
                {
                    name: t.sidebar.files.skills.name,
                    type: 'file',
                    id: 'skills',
                    depth: 1,
                    comment: t.sidebar.files.skills.comment,
                },
                {
                    name: t.sidebar.files.timeline.name,
                    type: 'file',
                    id: 'timeline',
                    depth: 1,
                    comment: t.sidebar.files.timeline.comment,
                },
                {
                    name: `${t.sidebar.folders.aboutme.name}/`,
                    type: 'folder',
                    depth: 1,
                    comment: t.sidebar.folders.aboutme.comment,
                    children: [
                        {
                            name: t.sidebar.files.interests.name,
                            type: 'file',
                            id: 'interests',
                            depth: 1,
                            comment: t.sidebar.files.interests.comment,
                        },
                        {
                            name: t.sidebar.files.values.name,
                            type: 'file',
                            id: 'values',
                            depth: 2,
                            comment: t.sidebar.files.values.comment,
                        },
                    ],
                },
                {
                    name: t.sidebar.files.contact.name,
                    type: 'file',
                    id: 'contact',
                    depth: 2,
                    comment: t.sidebar.files.contact.comment,
                },
            ],
        },
    ];

    const toggleFolder = (folderName: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(folderName)) {
                newSet.delete(folderName);
            } else {
                newSet.add(folderName);
            }
            return newSet;
        });
    };

    // Resize handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const diff = e.clientX - startXRef.current;
            const newWidth = Math.max(250, Math.min(500, startWidthRef.current + diff));
            setWidth(newWidth);
            onWidthChange(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, onWidthChange]);

    const renderTree = (items: FileItem[], parentIsLast: boolean[] = []): React.ReactNode[] => {
        return items.flatMap((item, index, array) => {
            const isLast = index === array.length - 1;
            const isFolder = item.type === 'folder';
            const isExpanded = expandedFolders.has(item.name);
            const isActive = item.id === activeSection;

            const lines = parentIsLast.map((last) => (last ? '    ' : '│   ')).join('');
            const branch = isLast ? '└── ' : '├── ';
            const prefix = item.depth === 0 ? '' : lines + branch;

            const handleClick = () => {
                if (isFolder) {
                    toggleFolder(item.name);
                } else {
                    onNavigate(item.id || '');
                }
            };

            return [
                <div
                    key={`${item.name}-${item.depth}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'monospace',
                        fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                        lineHeight: '1.6',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--color-primary-transparent)',
                            flexShrink: 0,
                            whiteSpace: 'pre',
                        }}
                    >
                        {prefix}
                    </span>

                    <button
                        onClick={handleClick}
                        style={{
                            background: isActive ? 'var(--color-primary-transparent)' : 'transparent',
                            border: 'none',
                            borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                            padding: '0.2rem 0.3rem 0.2rem calc(0.3rem - 1px)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: 'inherit',
                            fontFamily: 'monospace',
                            transition: 'all 0.2s ease',
                            opacity: isActive ? 1 : 0.7,
                            fontWeight: isActive ? 500 : 400,
                            fontStyle: isActive && !isFolder ? 'italic' : 'normal',
                            flex: 1,
                            minWidth: 0,
                        }}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {isFolder && (
                            <ChevronRight
                                size={12}
                                style={{
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                    flexShrink: 0,
                                }}
                            />
                        )}

                        {isFolder ? (
                            <Folder size={12} style={{ flexShrink: 0, opacity: 0.8 }} />
                        ) : (
                            <FileText size={11} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                        )}

                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                        </span>
                    </button>

                    {!isCollapsed && item.comment && (
                        <span
                            style={{
                                color: 'var(--color-primary-transparent)',
                                marginLeft: '0.3rem',
                                fontSize: '0.75em',
                                whiteSpace: 'nowrap',
                                opacity: 0.3,
                                flexShrink: 0,
                            }}
                        >
                            {item.comment}
                        </span>
                    )}
                </div>,
                isFolder && isExpanded && item.children &&
                renderTree(item.children, [...parentIsLast, isLast]),
            ];
        });
    };

    return (
        <>
            {/* Sidebar */}
            <nav
                ref={navRef}
                className="fixed left-0 hidden lg:flex flex-col z-20"
                style={{
                    top: 'clamp(60px, 6vh, 70px)',
                    height: 'calc(100vh - clamp(60px, 6vh, 70px))',
                    width: isCollapsed ? '0px' : `${Math.min(width, window.innerWidth * 0.3)}px`,
                    backgroundColor: 'var(--color-background)',
                    borderRight: '1px solid var(--color-primary-transparent)',
                    fontFamily: 'monospace',
                    padding: isCollapsed ? '0.75rem 0.5rem' : `clamp(0.75rem, 2vh, 1.5rem) clamp(0.5rem, 1.5vw, 0.75rem)`,
                    transition: isResizing ? 'none' : 'width 0.3s ease, padding 0.3s ease',
                    overflow: 'hidden',
                    fontSize: 'clamp(0.65rem, 0.85vw, 0.8rem)',
                }}
                aria-label={t.ariaLabel}
            >
                {!isCollapsed && (
                    <>
                        {/* Back button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="transition-opacity hover:opacity-70"
                            style={{
                                color: 'var(--color-primary)',
                                fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                letterSpacing: '0.5px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.2rem 0',
                                fontFamily: 'var(--font-primary)',
                            }}
                        >
                            {t.navigation.back}
                        </button>

                        {/* File tree */}
                        <div
                            className="flex-1 overflow-y-auto"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {renderTree(fileStructure, [])}
                        </div>

                        {/* Footer with GitHub link */}
                        <div
                            style={{
                                padding: '0.75rem',
                                borderTop: '1px solid var(--color-primary-transparent)',
                                marginTop: 'auto',
                                fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-secondary)' }}>
                                {t.sidebar.footer.copyright} {new Date().getFullYear()}
                            </span>

                            <a
                                href="https://github.com/Xlambdas"
                                target="_blank"
                                rel="noopener noreferrer"
                                title={t.navigation.github}
                                style={{
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                            >
                                <Github size={12} />
                                <span style={{ fontFamily: 'var(--font-secondary)' }}>
                                    {t.sidebar.footer.githubLabel}
                                </span>
                            </a>
                        </div>
                    </>
                )}
            </nav>

            {/* Resize handle */}
            <div
                className='hidden lg:block group'
                style={{
                    position: 'fixed',
                    left: isCollapsed ? '-1px' : `calc(${Math.min(width, window.innerWidth * 0.3)}px - 2px)`,
                    top: 'clamp(60px, 6vh, 70px)',
                    height: 'calc(100vh - clamp(60px, 6vh, 70px))',
                    width: 'clamp(12px, 1.5vw, 16px)',
                    backgroundColor: 'transparent',
                    cursor: 'col-resize',
                    zIndex: 21,
                    transition: isResizing ? 'none' : 'left 0.3s ease',
                    opacity: isCollapsed ? 0 : 1,
                    pointerEvents: isCollapsed ? 'none' : 'auto',
                    borderLeft: '2px solid transparent',
                    borderRight: '2px solid transparent',
                }}
                onMouseDown={handleMouseDown}
                onMouseEnter={(e) => {
                    if (!isResizing) {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderLeft = '2px solid var(--color-primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isResizing) {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderLeft = '2px solid transparent';
                    }
                }}
            />

            {/* Toggle button */}
            <button
                onClick={() => {
                    setIsCollapsed(!isCollapsed);
                    onCollapseChange(!isCollapsed);
                }}
                className="fixed hidden lg:flex items-center justify-center z-30 hover:opacity-80 transition-opacity"
                style={{
                    left: isCollapsed ? 'clamp(12px, 1.5vw, 16px)' : `${Math.min(width, window.innerWidth * 0.3)}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'clamp(20px, 2vw, 24px)',
                    height: 'clamp(32px, 4vh, 40px)',
                    backgroundColor: 'var(--color-primary-transparent)',
                    border: '1px solid var(--color-primary-transparent)',
                    borderRadius: '0 8px 8px 0',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    padding: '0',
                    transition: isResizing ? 'none' : 'left 0.3s ease',
                }}
                aria-label={isCollapsed ? t.sidebar.labelExpand : t.sidebar.labelCollapse}
                aria-pressed={isCollapsed}
            >
                {isCollapsed ? (
                    <ChevronRight size={16} />
                ) : (
                    <ChevronLeft size={16} />
                )}
            </button>

            {/* Space for content */}
            <div
                style={{
                    marginLeft: isCollapsed ? 'clamp(12px, 1.5vw, 16px)' : `${Math.min(width, window.innerWidth * 0.3)}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            />
        </>
    );
};




export const SideNavigation_save: React.FC<SideNavigationProps> = ({
    t,
    activeSection,
    onNavigate,
    onWidthChange,
    onCollapseChange,
}) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(['portfolio'])
    );
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [width, setWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Load saved preferences
    useEffect(() => {
        const saved = localStorage.getItem('portfolio-sidebar');
        if (saved) {
            const { width: savedWidth, collapsed } = JSON.parse(saved);
            setWidth(savedWidth);
            setIsCollapsed(collapsed);
            onWidthChange(savedWidth);
            onCollapseChange(collapsed);
        }
    }, []);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('portfolio-sidebar', JSON.stringify({ width, collapsed: isCollapsed }));
    }, [width, isCollapsed]);

    const fileStructure: FileItem[] = [
        {
            name: 'portfolio',
            type: 'folder',
            depth: 0,
            children: [
                {
                    name: 'AboutMe',
                    type: 'file',
                    id: 'about',
                    depth: 1,
                    comment: '# About section',
                },
                {
                    name: 'Skills',
                    type: 'file',
                    id: 'skills',
                    depth: 1,
                    comment: '# Skills & expertise',
                },
                {
                    name: 'Timeline',
                    type: 'file',
                    id: 'timeline',
                    depth: 1,
                    comment: '# My Timeline',
                },
                {
                    name: 'Interests',
                    type: 'file',
                    id: 'interests',
                    depth: 1,
                    comment: '# My Interests',
                },
                {
                    name: 'About_me/',
                    type: 'folder',
                    depth: 1,
                    children: [
                        {
                            name: 'Values',
                            type: 'file',
                            id: 'values',
                            depth: 2,
                            comment: '# Personal values',
                        },
                        {
                            name: 'Contact',
                            type: 'file',
                            id: 'contact',
                            depth: 1,
                            comment: '# Contact section',
                        },
                    ],
                },
            ],
        },
    ];

    const toggleFolder = (folderName: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(folderName)) {
                newSet.delete(folderName);
            } else {
                newSet.add(folderName);
            }
            return newSet;
        });
    };

    // Resize handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const diff = e.clientX - startXRef.current;
            const newWidth = Math.max(250, Math.min(500, startWidthRef.current + diff));
            setWidth(newWidth);
            onWidthChange(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, onWidthChange]);

    const renderTree = (items: FileItem[], parentIsLast: boolean[] = []): React.ReactNode[] => {
        return items.flatMap((item, index, array) => {
            const isLast = index === array.length - 1;
            const isFolder = item.type === 'folder';
            const isExpanded = expandedFolders.has(item.name);
            const isActive = item.id === activeSection;

            const lines = parentIsLast.map((last) => (last ? '    ' : '│   ')).join('');
            const branch = isLast ? '└── ' : '├── ';
            const prefix = item.depth === 0 ? '' : lines + branch;

            const handleClick = () => {
                if (isFolder) {
                    toggleFolder(item.name);
                } else {
                    onNavigate(item.id || '');
                }
            };

            return [
                <div
                    key={`${item.name}-${item.depth}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'monospace',
                        fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                        lineHeight: '1.6',
                    }}
                >
                    <span
                        style={{
                            color: 'var(--color-primary-transparent)',
                            flexShrink: 0,
                            whiteSpace: 'pre',
                        }}
                    >
                        {prefix}
                    </span>

                    <button
                        onClick={handleClick}
                        style={{
                            background: isActive ? 'var(--color-primary-transparent)' : 'transparent',
                            border: 'none',
                            borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                            padding: '0.2rem 0.3rem 0.2rem calc(0.3rem - 1px)',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: 'inherit',
                            fontFamily: 'monospace',
                            transition: 'all 0.2s ease',
                            opacity: isActive ? 1 : 0.7,
                            fontWeight: isActive ? 500 : 400,
                            fontStyle: isActive && !isFolder ? 'italic' : 'normal',
                            flex: 1,
                            minWidth: 0,
                        }}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {isFolder && (
                            <ChevronRight
                                size={12}
                                style={{
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                    flexShrink: 0,
                                }}
                            />
                        )}

                        {isFolder ? (
                            <Folder size={12} style={{ flexShrink: 0, opacity: 0.8 }} />
                        ) : (
                            <FileText size={11} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
                        )}

                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                        </span>
                    </button>

                    {!isCollapsed && item.comment && (
                        <span
                            style={{
                                color: 'var(--color-primary-transparent)',
                                marginLeft: '0.3rem',
                                fontSize: '0.75em',
                                whiteSpace: 'nowrap',
                                opacity: 0.3,
                                flexShrink: 0,
                            }}
                        >
                            {item.comment}
                        </span>
                    )}
                </div>,
                isFolder && isExpanded && item.children &&
                renderTree(item.children, [...parentIsLast, isLast]),
            ];
        });
    };

    return (
        <>
            {/* Sidebar */}
            <nav
                ref={navRef}
                className="fixed left-0 hidden lg:flex flex-col z-20"
                style={{
                    top: 'clamp(60px, 6vh, 70px)',
                    height: 'calc(100vh - clamp(60px, 6vh, 70px))',
                    width: isCollapsed ? '0px' : `${width}px`,
                    backgroundColor: 'var(--color-background)',
                    borderRight: '1px solid var(--color-primary-transparent)',
                    fontFamily: 'monospace',
                    padding: isCollapsed ? '1rem 0.5rem' : 'clamp(1rem, 2vh, 1.5rem) 0.75rem',
                    transition: isResizing ? 'none' : 'width 0.3s ease, padding 0.3s ease',
                    overflow: 'hidden',
                }}
                aria-label="Portfolio file tree navigation"
            >
                {!isCollapsed && (
                    <>
                        {/* Back button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="transition-opacity hover:opacity-70"
                            style={{
                                color: 'var(--color-primary)',
                                fontSize: 'clamp(0.8rem, 1vw, 0.9rem)',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                                letterSpacing: '0.5px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.2rem 0',
                                fontFamily: 'var(--font-primary)',
                            }}
                        >
                            {t.navigation.back}
                        </button>

                        {/* File tree */}
                        <div
                            className="flex-1 overflow-y-auto"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {renderTree(fileStructure, [])}
                        </div>

                        {/* Footer with GitHub link */}
                        <div
                            style={{
                                padding: '0.75rem',
                                borderTop: '1px solid var(--color-primary-transparent)',
                                marginTop: 'auto',
                                fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-secondary)' }}>
                                © {new Date().getFullYear()}
                            </span>

                            <a
                                href="https://github.com/Xlambdas"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Visit my GitHub"
                                style={{
                                    color: 'var(--color-primary)',
                                    textDecoration: 'none',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
                            >
                                <Github size={12} />
                                <span style={{ fontFamily: 'var(--font-secondary)' }}>{t.navigation.github}</span>
                            </a>
                        </div>
                    </>
                )}
            </nav>

            {/* Resize handle */}
            <div
                className='hidden lg:block group'
                style={{
                    position: 'fixed',
                    left: isCollapsed ? '-1px' : `calc(${width}px - 2px)`,
                    top: 'clamp(60px, 6vh, 70px)',
                    height: 'calc(100vh - clamp(60px, 6vh, 70px))',
                    width: '16px',
                    backgroundColor: 'transparent',
                    cursor: 'col-resize',
                    zIndex: 21,
                    transition: isResizing ? 'none' : 'left 0.3s ease',
                    opacity: isCollapsed ? 0 : 1,
                    pointerEvents: isCollapsed ? 'none' : 'auto',
                    borderLeft: '2px solid transparent',
                    borderRight: '2px solid transparent',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                }}
                onMouseDown={handleMouseDown}
                onMouseEnter={(e) => {
                    if (!isResizing) {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderLeft = '2px solid var(--color-primary)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isResizing) {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.borderLeft = '2px solid transparent';
                    }
                }}
            />

            {/* Toggle button */}
            <button
                onClick={() => {
                    setIsCollapsed(!isCollapsed);
                    onCollapseChange(!isCollapsed);
                }}
                className="fixed hidden lg:flex items-center justify-center z-30 hover:opacity-80 transition-opacity"
                style={{
                    left: isCollapsed ? '16px' : `${width}px`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '40px',
                    backgroundColor: 'var(--color-primary-transparent)',
                    border: '1px solid var(--color-primary-transparent)',
                    borderRadius: '0 8px 8px 0',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    padding: '0',
                    transition: isResizing ? 'none' : 'left 0.3s ease',
                }}
                aria-label={isCollapsed ? t.sidebar.labelExpand : t.sidebar.labelCollapse}
                aria-pressed={isCollapsed}
            >
                {isCollapsed ? (
                    <ChevronRight size={16} />
                ) : (
                    <ChevronLeft size={16} />
                )}
            </button>

            {/* Space for content */}
            <div
                style={{
                    marginLeft: isCollapsed ? '16px' : `${width}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            />
        </>
    );
};