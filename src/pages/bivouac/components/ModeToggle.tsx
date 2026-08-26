import React from 'react';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

export type Mode = 'edit' | 'pack';

interface ModeToggleProps {
    mode: Mode;
    onChange: (mode: Mode) => void;
    small?: boolean;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange, small = false }) => {
    const height = small ? '28px' : '34px';
    const fontSize = small ? '10px' : '11px';
    const padding = small ? '0 12px' : '0 16px';

    return (
        <div style={{
            display: 'inline-flex',
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '4px',
            overflow: 'hidden',
        }}>
            {(['edit', 'pack'] as Mode[]).map(m => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: mode === m ? B.bg : B.muted,
                        backgroundColor: mode === m ? B.accent : 'transparent',
                        border: 'none',
                        height,
                        padding,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    {m}
                </button>
            ))}
        </div>
    );
};