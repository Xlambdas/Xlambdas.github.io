import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BivouacHeader, MountainBackground } from './components';
import { CATEGORY_LABELS } from './engine';
import {
    getTemplatesByCategory,
    deleteTemplate,
    duplicateTemplate,
    setTemplateDefault,
    createTemplate,
} from './storage';
import { type Category, type UserTemplate, type TemplateMobility } from './types';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
    danger: '#8b4a3a',
} as const;

const MOBILITY_LABELS: Record<string, string> = {
    all: 'All mobilities',
    foot: 'Foot',
    bike: 'Bike',
    motorcycle: 'Motorcycle',
    vehicle: 'Car / Van',
};

const LEVEL_COLORS: Record<string, string> = {
    survival: '#8a9a82',
    comfort: '#c8a96e',
    luxury: '#a88fc0',
};

export const CategoryTemplatePage: React.FC = () => {
    const navigate = useNavigate();
    const { category } = useParams<{ category: string }>();
    const cat = category as Category;

    const [templates, setTemplates] = useState<UserTemplate[]>(() =>
        getTemplatesByCategory(cat)
    );
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const refresh = () => setTemplates(getTemplatesByCategory(cat));

    const handleDelete = (id: string) => setDeleteId(id);

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteTemplate(deleteId);
        refresh();
        setDeleteId(null);
    };

    const handleDuplicate = (id: string) => {
        duplicateTemplate(id);
        refresh();
    };

    const handleSetDefault = (id: string, mobility: TemplateMobility | null) => {
        setTemplateDefault(id, mobility);
        refresh();
    };

    const handleNewTemplate = () => {
        const tpl = createTemplate({
            name: 'New template',
            category: cat,
            items: [],
        });
        navigate(`/sandbox/bivouac/templates/${cat}/${tpl.id}`);
    };

    if (!CATEGORY_LABELS[cat]) {
        return null;
    }

    return (
        <div style={{ backgroundColor: B.bg, minHeight: '100vh', color: B.text, position: 'relative' }}>
            <BivouacHeader onBack={() => navigate('/sandbox/bivouac/templates')} backLabel="← templates" />
            <MountainBackground />

            <main style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '700px',
                margin: '0 auto',
                padding: 'clamp(80px, 12vh, 120px) clamp(24px, 6vw, 48px) 80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(32px, 6vh, 56px)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
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
                            Templates
                        </p>
                        <h1 style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'clamp(36px, 7vw, 72px)',
                            fontStyle: 'italic',
                            fontWeight: 500,
                            lineHeight: '0.95',
                            color: B.text,
                            margin: 0,
                        }}>
                            {CATEGORY_LABELS[cat]}
                        </h1>
                    </div>

                    <button
                        onClick={handleNewTemplate}
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
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        + New template
                    </button>
                </div>

                {/* Template list */}
                {templates.length === 0 ? (
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '14px',
                        color: B.muted,
                        fontStyle: 'italic',
                    }}>
                        No templates yet. Create one or use engine defaults.
                    </p>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(12px, 2vw, 20px)',
                    }}>
                        {templates.map(tpl => (
                            <TemplateCard
                                key={tpl.id}
                                template={tpl}
                                onEdit={() => navigate(`/sandbox/bivouac/templates/${cat}/${tpl.id}`)}
                                onDuplicate={() => handleDuplicate(tpl.id)}
                                onDelete={() => handleDelete(tpl.id)}
                                onSetDefault={mobility => handleSetDefault(tpl.id, mobility)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Delete confirmation */}
            {deleteId && (
                <DeleteModal
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </div>
    );
};

// ─── Template card ────────────────────────────────────────────────────────────

const TemplateCard: React.FC<{
    template: UserTemplate;
    onEdit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onSetDefault: (mobility: TemplateMobility | null) => void;
}> = ({ template, onEdit, onDuplicate, onDelete, onSetDefault }) => {
    const [showDefaultMenu, setShowDefaultMenu] = useState(false);

    const levelCounts = {
        survival: template.items.filter(i => i.level === 'survival').length,
        comfort: template.items.filter(i => i.level === 'comfort').length,
        luxury: template.items.filter(i => i.level === 'luxury').length,
    };

    const mobilityOptions: { value: TemplateMobility | null; label: string }[] = [
        { value: 'all', label: 'All mobilities' },
        { value: 'foot', label: 'Foot' },
        { value: 'bike', label: 'Bike' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'vehicle', label: 'Car / Van' },
        { value: null, label: 'Remove default' },
    ];

    return (
        <div style={{
            backgroundColor: B.surface,
            border: `1px solid ${template.defaultFor !== null ? B.accent : B.border}`,
            borderRadius: '8px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
        }}>
            {/* Title + default badge */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
            }}>
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-primary)',
                        fontStyle: 'italic',
                        fontSize: '22px',
                        fontWeight: 500,
                        color: B.text,
                        margin: '0 0 4px',
                        lineHeight: 1,
                    }}>
                        {template.name}
                    </h3>
                    {template.defaultFor !== null && (
                        <p style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '11px',
                            color: B.accent,
                            margin: 0,
                            letterSpacing: '0.05em',
                        }}>
                            ✦ Default for {MOBILITY_LABELS[template.defaultFor]}
                        </p>
                    )}
                </div>

                <span style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    color: B.muted,
                    whiteSpace: 'nowrap',
                    marginTop: '4px',
                }}>
                    {template.items.length} item{template.items.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Level breakdown */}
            {template.items.length > 0 && (
                <div style={{ display: 'flex', gap: '12px' }}>
                    {(['survival', 'comfort', 'luxury'] as const).map(level => (
                        levelCounts[level] > 0 && (
                            <span key={level} style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '10px',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: LEVEL_COLORS[level],
                            }}>
                                {levelCounts[level]} {level}
                            </span>
                        )
                    ))}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative' }}>
                <button
                    onClick={onEdit}
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
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                    Edit
                </button>

                {/* Default button */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowDefaultMenu(v => !v)}
                        style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '11px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: template.defaultFor !== null ? B.accent : B.muted,
                            background: 'none',
                            border: `1px solid ${template.defaultFor !== null ? B.accent : B.border}`,
                            borderRadius: '3px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                            if (template.defaultFor === null)
                                e.currentTarget.style.borderColor = B.muted;
                        }}
                        onMouseLeave={e => {
                            if (template.defaultFor === null)
                                e.currentTarget.style.borderColor = B.border;
                        }}
                    >
                        {template.defaultFor !== null ? '✦ Default' : 'Set default'}
                    </button>

                    {showDefaultMenu && (
                        <>
                            <div
                                onClick={() => setShowDefaultMenu(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 300,
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: 0,
                                zIndex: 301,
                                backgroundColor: B.surface,
                                border: `1px solid ${B.border}`,
                                borderRadius: '6px',
                                overflow: 'hidden',
                                minWidth: '180px',
                            }}>
                                {mobilityOptions.map(opt => (
                                    <button
                                        key={String(opt.value)}
                                        onClick={() => {
                                            onSetDefault(opt.value);
                                            setShowDefaultMenu(false);
                                        }}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            textAlign: 'left',
                                            fontFamily: 'var(--font-secondary)',
                                            fontSize: '11px',
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            color: opt.value === null ? B.danger : B.text,
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: `1px solid ${B.border}`,
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            transition: 'background 0.1s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = B.bg)}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        {opt.value === template.defaultFor ? '✦ ' : ''}{opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={onDuplicate}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        background: 'none',
                        border: `1px solid ${B.border}`,
                        borderRadius: '3px',
                        padding: '8px 16px',
                        cursor: 'pointer',
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
                    Duplicate
                </button>

                <button
                    onClick={onDelete}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        background: 'none',
                        border: `1px solid ${B.border}`,
                        borderRadius: '3px',
                        padding: '8px 16px',
                        cursor: 'pointer',
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
                    Delete
                </button>
            </div>
        </div>
    );
};

// ─── Delete modal ─────────────────────────────────────────────────────────────

const DeleteModal: React.FC<{
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
    <>
        <div
            onClick={onCancel}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(10,13,10,0.7)',
                zIndex: 200,
                backdropFilter: 'blur(4px)',
            }}
        />
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 201,
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '8px',
            padding: '32px',
            width: 'min(400px,90vw)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        }}>
            <div>
                <h2 style={{
                    fontFamily: 'var(--font-primary)',
                    fontStyle: 'italic',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: B.text,
                    margin: '0 0 8px',
                }}>
                    Delete this template?
                </h2>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '13px',
                    color: B.muted,
                    margin: 0,
                }}>
                    This action cannot be undone.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                    onClick={onCancel}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        background: 'none',
                        border: `1px solid ${B.border}`,
                        borderRadius: '3px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.text,
                        background: B.danger,
                        border: 'none',
                        borderRadius: '3px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    </>
);