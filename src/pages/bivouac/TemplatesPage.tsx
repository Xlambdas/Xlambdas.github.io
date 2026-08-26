import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BivouacHeader, MountainBackground } from './components';
import { CATEGORY_LABELS } from './engine';
import { getTemplatesByCategory } from './storage';
import { type Category } from './types';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

export const TemplatesPage: React.FC = () => {
    const navigate = useNavigate();
    const categories = Object.keys(CATEGORY_LABELS) as Category[];

    return (
        <div style={{ backgroundColor: B.bg, minHeight: '100vh', color: B.text, position: 'relative' }}>
            <BivouacHeader onBack={() => navigate(-1)} />
            <MountainBackground />

            <main style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '900px',
                margin: '0 auto',
                padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 48px) 80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(32px, 6vh, 56px)',
            }}>
                <div>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        margin: '0 0 12px',
                    }}>
                        Packing templates
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(42px, 8vw, 80px)',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        lineHeight: '0.95',
                        color: B.text,
                        margin: 0,
                    }}>
                        Templates
                    </h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'clamp(10px, 2vw, 20px)',
                }}>
                    {categories.map(cat => (
                        <CategoryBox
                            key={cat}
                            category={cat}
                            onClick={() => navigate(`/sandbox/bivouac/templates/${cat}`)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

const CategoryBox: React.FC<{
    category: Category;
    onClick: () => void;
}> = ({ category, onClick }) => {
    const templates = getTemplatesByCategory(category);
    const defaultTemplate = templates.find(t => t.defaultFor !== null);
    const count = templates.length;

    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = B.muted)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = B.border)}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }}>
                <h3 style={{
                    fontFamily: 'var(--font-primary)',
                    fontStyle: 'italic',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: B.text,
                    margin: 0,
                    lineHeight: 1,
                }}>
                    {CATEGORY_LABELS[category]}
                </h3>
                <span style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    color: B.muted,
                    marginTop: '4px',
                }}>
                    {count} template{count !== 1 ? 's' : ''}
                </span>
            </div>

            {defaultTemplate && (
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    color: B.accent,
                    margin: 0,
                    letterSpacing: '0.05em',
                }}>
                    ✦ {defaultTemplate.name}
                </p>
            )}

            {!defaultTemplate && (
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    color: B.muted,
                    opacity: 0.5,
                    margin: 0,
                    fontStyle: 'italic',
                }}>
                    Using engine defaults
                </p>
            )}
        </button>
    );
};