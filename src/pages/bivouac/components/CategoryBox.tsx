import React from 'react';
import { type Category, type ChecklistItem } from '../types';
import { CATEGORY_LABELS } from '../engine';
import { type Mode } from './ModeToggle';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

interface CategoryBoxProps {
    category: Category;
    items: ChecklistItem[];
    mode: Mode;
    onClick: () => void;
}

export const CategoryBox: React.FC<CategoryBoxProps> = ({ category, items, mode, onClick }) => {
    const total = items.length;
    const checked = items.filter(i => i.checked).length;
    const progress = total === 0 ? 0 : checked / total;

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
            {/* Category name + count */}
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
                    letterSpacing: '0.1em',
                    color: B.muted,
                    marginTop: '4px',
                }}>
                    {mode === 'pack' ? `${checked}/${total}` : `${total} item${total !== 1 ? 's' : ''}`}
                </span>
            </div>

            {/* Progress bar — pack mode only */}
            {mode === 'pack' && (
                <div style={{
                    height: '2px',
                    backgroundColor: B.border,
                    borderRadius: '1px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress * 100}%`,
                        backgroundColor: progress === 1 ? B.accent : B.muted,
                        borderRadius: '1px',
                        transition: 'width 0.3s ease',
                    }} />
                </div>
            )}
        </button>
    );
};