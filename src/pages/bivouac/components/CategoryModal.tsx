import React, { useState } from 'react';
import { X } from 'lucide-react';
import { type ChecklistItem, type Category } from '../types';
import { ModeToggle, type Mode } from './ModeToggle';
import { CATEGORY_LABELS } from '../engine';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

interface CategoryModalProps {
    category: Category;
    items: ChecklistItem[];
    excludedItems: ChecklistItem[];
    globalMode: Mode;
    onClose: () => void;
    onToggleCheck: (id: string) => void;
    onInclude: (id: string) => void;
    onExclude: (id: string) => void;
    onAddCustom: (label: string, category: Category) => void;
    onModeChange: (mode: Mode) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    category,
    items,
    excludedItems,
    globalMode,
    onClose,
    onToggleCheck,
    onInclude,
    onExclude,
    onAddCustom,
    onModeChange,
}) => {
    const [localMode, setLocalMode] = useState<Mode>(globalMode);
    const [customInput, setCustomInput] = useState('');

    const handleModeChange = (mode: Mode) => {
        setLocalMode(mode);
        onModeChange(mode);
    };

    const handleAddCustom = () => {
        const trimmed = customInput.trim();
        if (!trimmed) return;
        onAddCustom(trimmed, category);
        setCustomInput('');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(10, 13, 10, 0.7)',
                    zIndex: 200,
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 201,
                backgroundColor: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: '8px',
                width: 'min(560px, 92vw)',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
            }}>

                {/* Modal header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: `1px solid ${B.border}`,
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-primary)',
                            fontStyle: 'italic',
                            fontSize: '24px',
                            fontWeight: 500,
                            color: B.text,
                            margin: 0,
                        }}>
                            {CATEGORY_LABELS[category]}
                        </h2>
                        <ModeToggle mode={localMode} onChange={handleModeChange} small />
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: B.muted,
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = B.text)}
                        onMouseLeave={e => (e.currentTarget.style.color = B.muted)}
                    >
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Modal body */}
                <div style={{
                    overflowY: 'auto',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                }}>

                    {/* Included items */}
                    <div>
                        <p style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: B.muted,
                            margin: '0 0 12px',
                        }}>
                            To pack — {items.length} item{items.length !== 1 ? 's' : ''}
                        </p>

                        {items.length === 0 && (
                            <p style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '13px',
                                color: B.muted,
                                opacity: 0.5,
                                fontStyle: 'italic',
                            }}>
                                No items yet.
                            </p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {items.map(item => (
                                <ItemRow
                                    key={item.id}
                                    item={item}
                                    mode={localMode}
                                    onToggleCheck={() => onToggleCheck(item.id)}
                                    onExclude={() => onExclude(item.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Custom item input — edit mode only */}
                    {localMode === 'edit' && (
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                        }}>
                            <input
                                type="text"
                                placeholder="Add a custom item..."
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: `1px solid ${B.border}`,
                                    color: B.text,
                                    fontFamily: 'var(--font-secondary)',
                                    fontSize: '13px',
                                    padding: '6px 0',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleAddCustom}
                                style={{
                                    fontFamily: 'var(--font-secondary)',
                                    fontSize: '11px',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: B.bg,
                                    backgroundColor: B.accent,
                                    border: 'none',
                                    borderRadius: '3px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {/* Excluded items */}
                    {excludedItems.length > 0 && (
                        <div>
                            <p style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '10px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: B.muted,
                                opacity: 0.5,
                                margin: '0 0 12px',
                            }}>
                                Not bringing — {excludedItems.length} item{excludedItems.length !== 1 ? 's' : ''}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {excludedItems.map(item => (
                                    <ExcludedItemRow
                                        key={item.id}
                                        item={item}
                                        onInclude={() => onInclude(item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

// ─── Item row (included) ──────────────────────────────────────────────────────

interface ItemRowProps {
    item: ChecklistItem;
    mode: Mode;
    onToggleCheck: () => void;
    onExclude: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, mode, onToggleCheck, onExclude }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: `1px solid ${B.border}`,
        gap: '12px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {/* Pack mode checkbox */}
            {mode === 'pack' && (
                <button
                    onClick={onToggleCheck}
                    style={{
                        width: '18px',
                        height: '18px',
                        flexShrink: 0,
                        border: `1px solid ${item.checked ? B.accent : B.border}`,
                        borderRadius: '3px',
                        backgroundColor: item.checked ? B.accent : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s',
                    }}
                >
                    {item.checked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#1a1f1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            )}

            <div>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '14px',
                    color: item.checked && mode === 'pack' ? B.muted : B.text,
                    margin: 0,
                    textDecoration: item.checked && mode === 'pack' ? 'line-through' : 'none',
                    transition: 'all 0.15s',
                }}>
                    {item.label}
                </p>
                {item.reason && (
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        color: B.muted,
                        opacity: 0.6,
                        margin: '2px 0 0',
                    }}>
                        {item.reason}
                    </p>
                )}
            </div>
        </div>

        {/* Edit mode exclude button */}
        {mode === 'edit' && (
            <button
                onClick={onExclude}
                style={{
                    background: 'none',
                    border: `1px solid ${B.border}`,
                    borderRadius: '3px',
                    color: B.muted,
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = B.muted;
                    e.currentTarget.style.color = B.text;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = B.border;
                    e.currentTarget.style.color = B.muted;
                }}
            >
                −
            </button>
        )}
    </div>
);

// ─── Item row (excluded) ──────────────────────────────────────────────────────

interface ExcludedItemRowProps {
    item: ChecklistItem;
    onInclude: () => void;
}

const ExcludedItemRow: React.FC<ExcludedItemRowProps> = ({ item, onInclude }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: `1px solid ${B.border}`,
        gap: '12px',
        opacity: 0.5,
    }}>
        <p style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '14px',
            color: B.muted,
            margin: 0,
        }}>
            {item.label}
        </p>

        <button
            onClick={onInclude}
            style={{
                background: 'none',
                border: `1px solid ${B.border}`,
                borderRadius: '3px',
                color: B.muted,
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
                transition: 'all 0.15s',
                opacity: 1,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = B.accent;
                e.currentTarget.style.color = B.accent;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = B.border;
                e.currentTarget.style.color = B.muted;
            }}
        >
            +
        </button>
    </div>
);