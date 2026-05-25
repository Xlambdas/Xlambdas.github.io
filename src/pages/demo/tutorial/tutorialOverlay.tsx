import React, { useState, useEffect, useRef } from 'react';

interface TutorialStep {
    title: string;
    description: string | null;
    targetSelector?: string;
    position: 'center' | 'top' | 'bottom' | 'left' | 'right';
    icon: 'graduation' | 'brain' | 'lightning' | 'target' | 'graph' | 'sparkles';
}

const TUTORIAL_STEPS: TutorialStep[] = [
    // === PART 1: Introduction ===
    {
        title: "Bienvenue !",
        description: "Ceci est ton espace d'apprentissage personnalisé. Découvre comment maîtriser la psychologie cognitive à ton rythme.",
        position: 'center',
        icon: 'graduation',
    },
    {
        title: "C'est quoi exactement ?",
        description: "Un parcours interactif basé sur les sciences cognitives. Chaque module est conçu pour maximiser ta rétention et ta compréhension.",
        position: 'center',
        icon: 'brain',
    },
    {
        title: "Comment ça marche ?",
        description: "Tu explores des modules connectés. Chaque leçon débloque de nouvelles connaissances. Un système de répétition espacée te fait réviser au bon moment.",
        position: 'center',
        icon: 'lightning',
    },
    {
        title: "Ton rythme, tes choix",
        description: "Sessions personnalisées selon ton humeur et ton temps. Pas de pression — juste de la progression constante.",
        position: 'center',
        icon: 'target',
    },

    // === PART 2: Tour ===
    {
        title: "Le Graphe de Connaissances",
        description: null,
        position: 'center',
        icon: 'graph',
    },
    {
        title: "C'est parti !",
        description: "Tu es prêt ! Commence par cliquer sur le module Psychologie Cognitive pour démarrer ton apprentissage.",
        position: 'center',
        icon: 'sparkles',
    },
];

// Icon components
const TutorialIcon: React.FC<{ icon: TutorialStep['icon'] }> = ({ icon }) => {
    const icons = {
        graduation: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
        brain: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
        ),
        lightning: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        target: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        graph: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        sparkles: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
            </svg>
        ),
    };

    return icons[icon];
};

interface TutorialOverlayProps {
    onComplete: () => void;
    onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const step = TUTORIAL_STEPS[currentStep];
    const isFirst = currentStep === 0;
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;

    // Update target element position
    useEffect(() => {
        if (step.targetSelector) {
            // Wait a bit for DOM to be ready
            setTimeout(() => {
                const element = document.querySelector(step.targetSelector!);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    setTargetRect(rect);
                } else {
                    console.warn(`Tutorial: Element not found for selector: ${step.targetSelector}`);
                    setTargetRect(null);
                }
            }, 100);
        } else {
            setTargetRect(null);
        }
    }, [currentStep, step.targetSelector]);

    const handleNext = () => {
        if (isLast) {
            onComplete();
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirst) {
            setCurrentStep(s => s - 1);
        }
    };

    // Calculate modal position based on target element
    const getModalPosition = (): React.CSSProperties => {
        if (!targetRect || step.position === 'center') {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const padding = 24;
        const modalWidth = 380;
        const style: React.CSSProperties = { position: 'fixed' };

        switch (step.position) {
            case 'right':
                // Check if there's enough space on the right
                if (targetRect.right + padding + modalWidth < window.innerWidth) {
                    style.left = targetRect.right + padding;
                    style.top = Math.max(100, Math.min(window.innerHeight - 400, targetRect.top + targetRect.height / 2));
                    style.transform = 'translateY(-50%)';
                } else {
                    // Fallback to center if not enough space
                    style.top = '50%';
                    style.left = '50%';
                    style.transform = 'translate(-50%, -50%)';
                }
                break;
            case 'left':
                // Check if there's enough space on the left
                if (targetRect.left - padding - modalWidth > 0) {
                    style.left = targetRect.left - padding - modalWidth;
                    style.top = Math.max(100, Math.min(window.innerHeight - 400, targetRect.top + targetRect.height / 2));
                    style.transform = 'translateY(-50%)';
                } else {
                    // Fallback to center
                    style.top = '50%';
                    style.left = '50%';
                    style.transform = 'translate(-50%, -50%)';
                }
                break;
            case 'top':
                style.left = '50%';
                style.bottom = window.innerHeight - targetRect.top + padding;
                style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                style.left = '50%';
                style.top = targetRect.bottom + padding;
                style.transform = 'translateX(-50%)';
                break;
        }

        return style;
    };

    return (
        <>
            {/* Dark overlay with spotlight cutout */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                pointerEvents: 'none',
            }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <defs>
                        <mask id="spotlight-mask">
                            <rect width="100%" height="100%" fill="white" />
                            {targetRect && (
                                <rect
                                    x={targetRect.left - 8}
                                    y={targetRect.top - 8}
                                    width={targetRect.width + 16}
                                    height={targetRect.height + 16}
                                    rx={12}
                                    fill="black"
                                />
                            )}
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.75)"
                        mask="url(#spotlight-mask)"
                    />
                </svg>

                {/* Highlight ring around target */}
                {targetRect && (
                    <div style={{
                        position: 'absolute',
                        left: targetRect.left - 8,
                        top: targetRect.top - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        border: '2px solid #a5b4fc',
                        borderRadius: 12,
                        boxShadow: '0 0 0 4px rgba(165,180,252,0.2), 0 0 20px rgba(165,180,252,0.4)',
                        animation: 'pulse 2s ease-in-out infinite',
                        pointerEvents: 'none',
                    }} />
                )}
            </div>

            {/* Tutorial modal */}
            <div
                ref={modalRef}
                style={{
                    ...getModalPosition(),
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: 16,
                    padding: '32px',
                    width: step.position === 'center' ? 'min(440px, calc(100vw - 32px))' : '380px',
                    maxWidth: '90vw',
                    zIndex: 10000,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
                    pointerEvents: 'auto',
                }}
            >
                {/* Icon for centered steps */}
                {step.position === 'center' && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                        <TutorialIcon icon={step.icon} />
                    </div>
                )}

                {/* Progress dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 8,
                    marginBottom: 24,
                }}>
                    {TUTORIAL_STEPS.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: i === currentStep ? '#a5b4fc' : '#30363d',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: 32,
                }}>
                    <h2 style={{
                        color: '#c9d1d9',
                        fontSize: 24,
                        fontWeight: 700,
                        margin: '0 0 12px 0',
                    }}>
                        {step.title}
                    </h2>

                    {/* Custom content for graph step */}
                    {currentStep === 4 ? (
                        <div>
                            <p style={{
                                color: '#8b949e',
                                fontSize: 15,
                                lineHeight: 1.6,
                                margin: '0 0 20px 0',
                            }}>
                                Chaque forme représente l'état d'un module :
                            </p>

                            {/* Visual legend */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                textAlign: 'left',
                            }}>
                                {/* Locked - Circle */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <svg width="32" height="32" viewBox="0 0 32 32">
                                        <circle cx="16" cy="16" r="10" fill="#1c2128" stroke="#30363d" strokeWidth="0.5" />
                                    </svg>
                                    <span style={{ color: '#8b949e', fontSize: 13 }}>
                                        <strong style={{ color: '#c9d1d9' }}>Cercle</strong> — Module verrouillé
                                    </span>
                                </div>

                                {/* Unlocked not started - Decagon */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <svg width="32" height="32" viewBox="0 0 32 32">
                                        <path
                                            d="M 16 6 L 22.9 8.8 L 26 15 L 22.9 21.2 L 16 24 L 9.1 21.2 L 6 15 L 9.1 8.8 Z"
                                            fill="#1c2128"
                                            stroke="#30363d"
                                            strokeWidth="0.5"
                                        />
                                    </svg>
                                    <span style={{ color: '#8b949e', fontSize: 13 }}>
                                        <strong style={{ color: '#c9d1d9' }}>Décagone gris</strong> — Débloqué, non commencé
                                    </span>
                                </div>

                                {/* Started - Hexagon */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <svg width="32" height="32" viewBox="0 0 32 32">
                                        <path
                                            d="M 16 6 L 24.66 11 L 24.66 21 L 16 26 L 7.34 21 L 7.34 11 Z"
                                            fill="#a5b4fcdd"
                                            stroke="#0b0f14"
                                            strokeWidth="1"
                                        />
                                    </svg>
                                    <span style={{ color: '#8b949e', fontSize: 13 }}>
                                        <strong style={{ color: '#c9d1d9' }}>Hexagone coloré</strong> — En cours
                                    </span>
                                </div>

                                {/* Completed - Diamond */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <svg width="32" height="32" viewBox="0 0 32 32">
                                        <defs>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <path
                                            d="M 16 6 L 26 16 L 16 26 L 6 16 Z"
                                            fill="#a5b4fc"
                                            stroke="#0b0f14"
                                            strokeWidth="1"
                                            filter="url(#glow)"
                                        />
                                    </svg>
                                    <span style={{ color: '#8b949e', fontSize: 13 }}>
                                        <strong style={{ color: '#c9d1d9' }}>Diamant brillant</strong> — Complété
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p style={{
                            color: '#8b949e',
                            fontSize: 15,
                            lineHeight: 1.6,
                            margin: 0,
                        }}>
                            {step.description}
                        </p>
                    )}
                </div>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'space-between',
                }}>
                    <button
                        onClick={onSkip}
                        style={{
                            padding: '10px 16px',
                            background: 'transparent',
                            border: '1px solid #30363d',
                            borderRadius: 8,
                            color: '#8b949e',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#8b949e';
                            e.currentTarget.style.color = '#c9d1d9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#30363d';
                            e.currentTarget.style.color = '#8b949e';
                        }}
                    >
                        Passer
                    </button>

                    <div style={{ display: 'flex', gap: 8 }}>
                        {!isFirst && (
                            <button
                                onClick={handlePrevious}
                                style={{
                                    padding: '10px 16px',
                                    background: '#21262d',
                                    border: '1px solid #30363d',
                                    borderRadius: 8,
                                    color: '#8b949e',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#30363d'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
                            >
                                ← Précédent
                            </button>
                        )}

<button
                            onClick={handleNext}
                            style={{
                                padding: '10px 20px',
                                background: isLast
                                    ? 'linear-gradient(135deg, #a5b4fc22 0%, #a5b4fc18 100%)'
                                    : 'linear-gradient(135deg, #a5b4fc22 0%, #a5b4fc18 100%)',
                                border: `1px solid ${isLast ? '#a5b4fc88' : '#a5b4fc55'}`,
                                borderRadius: 8,
                                color: '#a5b4fc',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #a5b4fc33 0%, #a5b4fc22 100%)';
                                e.currentTarget.style.borderColor = '#a5b4fc88';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(165,180,252,0.33)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = isLast
                                    ? 'linear-gradient(135deg, #a5b4fc22 0%, #a5b4fc18 100%)'
                                    : 'linear-gradient(135deg, #a5b4fc22 0%, #a5b4fc18 100%)';
                                e.currentTarget.style.borderColor = isLast ? '#a5b4fc88' : '#a5b4fc55';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {isLast ? "Commencer" : "Suivant →"}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </>
    );
};