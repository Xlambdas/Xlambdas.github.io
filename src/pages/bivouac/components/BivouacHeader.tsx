import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, BookOpen, User } from 'lucide-react';

const B = {
    bg: '#1a1f1a',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
} as const;

interface BivouacHeaderProps {
    onBack: () => void;
    backLabel?: string;
}

export const BivouacHeader: React.FC<BivouacHeaderProps> = ({
    onBack,
    backLabel = '← back',
}) => {
    const navigate = useNavigate();

    return (
        <header style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            height: '60px',
            backgroundColor: B.bg,
            borderBottom: `1px solid ${B.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(16px, 4vw, 40px)',
            zIndex: 100,
        }}>
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 20px)' }}>
                <button
                    onClick={onBack}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = B.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = B.muted)}
                >
                    {backLabel}
                </button>

                <span style={{
                    fontFamily: 'var(--font-primary)',
                    fontStyle: 'italic',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: B.text,
                }}>
                    Bivouac
                </span>
            </div>

            {/* Right */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[
                    { icon: Map, label: 'My trips', action: () => navigate('/sandbox/bivouac/trips') },
                    { icon: BookOpen, label: 'Templates', action: () => navigate('/sandbox/bivouac/templates') },
                    { icon: User, label: 'Profile', action: null },
                ].map(({ icon: Icon, label, action }) => (
                    <button
                        key={label}
                        title={label}
                        aria-label={label}
                        disabled={!action}
                        onClick={() => action?.()}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: B.muted,
                            cursor: action ? 'pointer' : 'not-allowed',
                            padding: '8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: action ? 1 : 0.3,
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { if (action) e.currentTarget.style.color = B.text; }}
                        onMouseLeave={e => { if (action) e.currentTarget.style.color = B.muted; }}
                    >
                        <Icon size={18} strokeWidth={1.5} />
                    </button>
                ))}
            </nav>
        </header>
    );
};