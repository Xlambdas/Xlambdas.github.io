import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BivouacHeader, MountainBackground } from './components';
import { CATEGORY_LABELS, ITEM_BANK } from './engine';
import { getTemplate, saveTemplate, generateItemId } from './storage';
import {
    type Category,
    type UserTemplate,
    type TemplateItem,
    type Level,
    type TemplateMobility,
} from './types';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
    danger: '#8b4a3a',
} as const;

const LEVELS: Level[] = ['survival', 'comfort', 'luxury'];

const LEVEL_COLORS: Record<Level, string> = {
    survival: '#8a9a82',
    comfort: '#c8a96e',
    luxury: '#a88fc0',
};

const LEVEL_LABELS: Record<Level, string> = {
    survival: 'Survival',
    comfort: 'Comfort',
    luxury: 'Luxury',
};

const MOBILITY_OPTIONS: { value: TemplateMobility; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'foot', label: 'Foot' },
    { value: 'bike', label: 'Bike' },
    { value: 'motorcycle', label: 'Moto' },
    { value: 'vehicle', label: 'Car / Van' },
];

// Levels up to and including the selected level
const levelsUpTo = (level: Level): Level[] =>
    LEVELS.slice(0, LEVELS.indexOf(level) + 1);

export const TemplateEditorPage: React.FC = () => {
    const navigate = useNavigate();
    const { category, templateId } = useParams<{
        category: string;
        templateId: string;
    }>();
    const cat = category as Category;

    const [template, setTemplate] = useState<UserTemplate | null>(() =>
        templateId ? getTemplate(templateId) ?? null : null
    );
    const [activeLevel, setActiveLevel] = useState<Level>('comfort');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [nameDraft, setNameDraft] = useState('');
    const nameInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingName) {
            setTimeout(() => nameInputRef.current?.focus(), 0);
        }
    }, [editingName]);

    if (!template) return null;

    const visibleLevels = levelsUpTo(activeLevel);

    const visibleItems = template.items.filter(i =>
        visibleLevels.includes(i.level)
    );

    // ── Name editing ──────────────────────────────────────────────────────────

    const startEditName = () => {
        setNameDraft(template.name);
        setEditingName(true);
    };

    const commitName = () => {
        const trimmed = nameDraft.trim();
        if (trimmed) {
            const updated = {
                ...template,
                name: trimmed,
                updatedAt: new Date().toISOString(),
            };
            setTemplate(updated);
            saveTemplate(updated);
        }
        setEditingName(false);
    };

    // ── Item management ───────────────────────────────────────────────────────

    const updateItem = (id: string, patch: Partial<TemplateItem>) => {
        const updated = {
            ...template,
            items: template.items.map(i => i.id === id ? { ...i, ...patch } : i),
            updatedAt: new Date().toISOString(),
        };
        setTemplate(updated);
        saveTemplate(updated);
    };

    const removeItem = (id: string) => {
        const updated = {
            ...template,
            items: template.items.filter(i => i.id !== id),
            updatedAt: new Date().toISOString(),
        };
        setTemplate(updated);
        saveTemplate(updated);
    };

    const addItem = (label: string, level: Level = 'comfort') => {
        const trimmed = label.trim();
        if (!trimmed) return;
        // Avoid duplicates
        if (template.items.some(i =>
            i.label.toLowerCase() === trimmed.toLowerCase()
        )) return;

        const newItem: TemplateItem = {
            id: generateItemId(),
            label: trimmed,
            level,
            mobility: 'all',
        };
        const updated = {
            ...template,
            items: [...template.items, newItem],
            updatedAt: new Date().toISOString(),
        };
        setTemplate(updated);
        saveTemplate(updated);
        setSearchQuery('');
    };

    // ── Suggestions ───────────────────────────────────────────────────────────

    const bankItems = ITEM_BANK[cat] ?? [];
    const existingLabels = new Set(
        template.items.map(i => i.label.toLowerCase())
    );

    const suggestions = bankItems.filter(b => {
        if (existingLabels.has(b.label.toLowerCase())) return false;
        if (!searchQuery) return true;
        return b.label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const showCustomAdd =
        searchQuery.trim().length > 0 &&
        !bankItems.some(b =>
            b.label.toLowerCase() === searchQuery.trim().toLowerCase()
        ) &&
        !existingLabels.has(searchQuery.trim().toLowerCase());

    return (
        <div style={{
            backgroundColor: B.bg,
            minHeight: '100vh',
            color: B.text,
            position: 'relative',
        }}>
            <BivouacHeader
                onBack={() => navigate(`/sandbox/bivouac/templates/${cat}`)}
                backLabel={`← ${CATEGORY_LABELS[cat]}`}
            />
            <MountainBackground />

            <main style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '700px',
                margin: '0 auto',
                padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 48px) 80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(32px, 5vh, 48px)',
            }}>

                {/* Template name */}
                <div>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        margin: '0 0 12px',
                    }}>
                        {CATEGORY_LABELS[cat]}
                    </p>

                    {editingName ? (
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={nameDraft}
                            onChange={e => setNameDraft(e.target.value)}
                            onBlur={commitName}
                            onKeyDown={e => {
                                if (e.key === 'Enter') commitName();
                                if (e.key === 'Escape') setEditingName(false);
                            }}
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontStyle: 'italic',
                                fontSize: 'clamp(32px, 6vw, 56px)',
                                fontWeight: 500,
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${B.accent}`,
                                color: B.text,
                                outline: 'none',
                                padding: '4px 0',
                                width: '100%',
                            }}
                        />
                    ) : (
                        <h1
                            onClick={startEditName}
                            title="Click to rename"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontSize: 'clamp(32px, 6vw, 56px)',
                                fontStyle: 'italic',
                                fontWeight: 500,
                                lineHeight: '0.95',
                                color: B.text,
                                margin: 0,
                                cursor: 'text',
                            }}
                        >
                            {template.name}
                        </h1>
                    )}
                </div>

                {/* Level tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        margin: 0,
                    }}>
                        Showing items up to
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        backgroundColor: B.surface,
                        border: `1px solid ${B.border}`,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        alignSelf: 'flex-start',
                    }}>
                        {LEVELS.map(level => (
                            <button
                                key={level}
                                onClick={() => setActiveLevel(level)}
                                style={{
                                    fontFamily: 'var(--font-secondary)',
                                    fontSize: '11px',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: activeLevel === level ? B.bg : B.muted,
                                    backgroundColor: activeLevel === level
                                        ? LEVEL_COLORS[level]
                                        : 'transparent',
                                    border: 'none',
                                    height: '34px',
                                    padding: '0 16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {LEVEL_LABELS[level]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Item list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        margin: '0 0 4px',
                    }}>
                        Items — {visibleItems.length} shown
                    </p>

                    {visibleItems.length === 0 && (
                        <p style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '13px',
                            color: B.muted,
                            fontStyle: 'italic',
                            opacity: 0.6,
                        }}>
                            No items at this level yet. Add some below.
                        </p>
                    )}

                    {visibleItems.map(item => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            onUpdateLevel={level => updateItem(item.id, { level })}
                            onUpdateMobility={mobility => updateItem(item.id, { mobility })}
                            onRemove={() => removeItem(item.id)}
                        />
                    ))}
                </div>

                {/* Add item */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        margin: 0,
                    }}>
                        Add items
                    </p>

                    {/* Search */}
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search or type a custom item..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                                addItem(searchQuery.trim(), activeLevel);
                            }
                        }}
                        style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '13px',
                            background: 'none',
                            border: 'none',
                            borderBottom: `1px solid ${B.border}`,
                            color: B.text,
                            outline: 'none',
                            padding: '8px 0',
                            width: '100%',
                            transition: 'border-color 0.15s',
                        }}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = B.accent)}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = B.border)}
                    />

                    {/* Custom add */}
                    {showCustomAdd && (
                        <button
                            onClick={() => addItem(searchQuery.trim(), activeLevel)}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: B.bg,
                                backgroundColor: B.accent,
                                border: 'none',
                                borderRadius: '3px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                alignSelf: 'flex-start',
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            + Add "{searchQuery.trim()}" as {activeLevel}
                        </button>
                    )}

                    {/* Suggestions */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}>
                        {suggestions.map(suggestion => (
                            <SuggestionRow
                                key={suggestion.id}
                                label={suggestion.label}
                                activeLevel={activeLevel}
                                onAdd={() => addItem(suggestion.label, activeLevel)}
                            />
                        ))}
                        {suggestions.length === 0 && searchQuery && !showCustomAdd && (
                            <p style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '12px',
                                color: B.muted,
                                opacity: 0.5,
                                fontStyle: 'italic',
                                margin: 0,
                            }}>
                                No suggestions match. Press Enter to add as custom item.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// ─── Item row ─────────────────────────────────────────────────────────────────

const ItemRow: React.FC<{
    item: TemplateItem;
    onUpdateLevel: (level: Level) => void;
    onUpdateMobility: (mobility: TemplateMobility) => void;
    onRemove: () => void;
}> = ({ item, onUpdateLevel, onUpdateMobility, onRemove }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 0',
        borderBottom: `1px solid ${B.border}`,
    }}>
        {/* Label */}
        <p style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '14px',
            color: B.text,
            margin: 0,
            flex: 1,
        }}>
            {item.label}
        </p>

        {/* Level selector */}
        <div style={{
            display: 'inline-flex',
            border: `1px solid ${B.border}`,
            borderRadius: '3px',
            overflow: 'hidden',
        }}>
            {LEVELS.map(level => (
                <button
                    key={level}
                    onClick={() => onUpdateLevel(level)}
                    title={level}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: item.level === level ? B.bg : B.muted,
                        backgroundColor: item.level === level
                            ? LEVEL_COLORS[level]
                            : 'transparent',
                        border: 'none',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                    }}
                >
                    {level.slice(0, 1).toUpperCase()}
                </button>
            ))}
        </div>

        {/* Mobility selector */}
        <div style={{
            display: 'inline-flex',
            border: `1px solid ${B.border}`,
            borderRadius: '3px',
            overflow: 'hidden',
        }}>
            {MOBILITY_OPTIONS.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onUpdateMobility(opt.value)}
                    title={opt.label}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: item.mobility === opt.value ? B.bg : B.muted,
                        backgroundColor: item.mobility === opt.value
                            ? B.accent
                            : 'transparent',
                        border: 'none',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        transition: 'all 0.1s',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {opt.label.slice(0, opt.value === 'all' ? 3 : opt.value === 'motorcycle' ? 4 : 3)}
                </button>
            ))}
        </div>

        {/* Remove */}
        <button
            onClick={onRemove}
            style={{
                background: 'none',
                border: `1px solid ${B.border}`,
                borderRadius: '3px',
                color: B.muted,
                width: '26px',
                height: '26px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
                transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = B.danger;
                e.currentTarget.style.color = B.danger;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = B.border;
                e.currentTarget.style.color = B.muted;
            }}
        >
            −
        </button>
    </div>
);

// ─── Suggestion row ───────────────────────────────────────────────────────────

const SuggestionRow: React.FC<{
    label: string;
    activeLevel: Level;
    onAdd: () => void;
}> = ({ label, activeLevel, onAdd }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: `1px solid ${B.border}`,
        gap: '12px',
    }}>
        <p style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '13px',
            color: B.muted,
            margin: 0,
        }}>
            {label}
        </p>

        <button
            onClick={onAdd}
            title={`Add as ${activeLevel}`}
            style={{
                background: 'none',
                border: `1px solid ${B.border}`,
                borderRadius: '3px',
                color: B.muted,
                width: '26px',
                height: '26px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                flexShrink: 0,
                transition: 'all 0.15s',
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