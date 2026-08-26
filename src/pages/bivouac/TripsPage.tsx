import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, X } from 'lucide-react';
import {
    getAllTrips,
    deleteTrip,
    archiveTrip,
    renameTrip,
    exportTrips,
    importTrips,
    type SavedTrip,
} from './storage';
import { CATEGORY_LABELS } from './engine';
import { type Category } from './types';
import { BivouacHeader, MountainBackground } from './components';

// ─── Design tokens ────────────────────────────────────────────────────────────

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
    danger: '#8b4a3a',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOBILITY_LABELS: Record<string, string> = {
    foot: 'Foot',
    bike: 'Bike',
    motorcycle: 'Motorcycle',
    vehicle: 'Car / Van',
};

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const tripSummary = (saved: SavedTrip): string =>
    saved.name?.trim()
        ? saved.name
        : [
            MOBILITY_LABELS[saved.trip.mobility],
            saved.trip.duration
                ? `${saved.trip.duration} ${saved.trip.duration === 1 ? 'day' : 'days'}`
                : null,
        ].filter(Boolean).join(' · ');

const packingProgress = (saved: SavedTrip): { checked: number; total: number } => {
    const included = saved.items.filter(i => !i.excluded);
    return {
        checked: included.filter(i => i.checked).length,
        total: included.length,
    };
};

// ─── Delete confirmation modal ────────────────────────────────────────────────

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
                backgroundColor: 'rgba(10, 13, 10, 0.7)',
                zIndex: 200,
                backdropFilter: 'blur(4px)',
            }}
        />
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 201,
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '8px',
            padding: '32px',
            width: 'min(400px, 90vw)',
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
                    Delete this trip?
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

// ─── Import modal ─────────────────────────────────────────────────────────────

const ImportModal: React.FC<{
    file: File;
    onConfirm: (mode: 'merge' | 'replace') => void;
    onCancel: () => void;
}> = ({ file, onConfirm, onCancel }) => (
    <>
        <div
            onClick={onCancel}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(10, 13, 10, 0.7)',
                zIndex: 200,
                backdropFilter: 'blur(4px)',
            }}
        />
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 201,
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '8px',
            padding: '32px',
            width: 'min(400px, 90vw)',
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
                    Import trips
                </h2>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '13px',
                    color: B.muted,
                    margin: 0,
                }}>
                    <strong style={{ color: B.text }}>{file.name}</strong>
                    <br />
                    How do you want to import these trips?
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    onClick={() => onConfirm('merge')}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.bg,
                        backgroundColor: B.accent,
                        border: 'none',
                        borderRadius: '3px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >
                    Merge — keep existing trips
                </button>
                <button
                    onClick={() => onConfirm('replace')}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: B.text,
                        backgroundColor: B.danger,
                        border: 'none',
                        borderRadius: '3px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                    }}
                >
                    Replace — overwrite all existing trips
                </button>
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
                        padding: '12px 20px',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    </>
);

const ArchivedTripModal: React.FC<{
    saved: SavedTrip;
    onClose: () => void;
}> = ({ saved, onClose }) => {
    const categories = Object.keys(CATEGORY_LABELS) as Category[];
    const categoriesWithItems = categories.filter(cat =>
        saved.items.some(i => i.category === cat && !i.excluded)
    );

    return (
        <>
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
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 201,
                backgroundColor: B.surface,
                border: `1px solid ${B.border}`,
                borderRadius: '8px',
                width: 'min(560px, 90vw)',
                maxHeight: '80vh',
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
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-primary)',
                            fontStyle: 'italic',
                            fontSize: '22px',
                            fontWeight: 500,
                            color: B.text,
                            margin: '0 0 4px',
                        }}>
                            {tripSummary(saved)}
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '11px',
                            color: B.muted,
                            margin: 0,
                        }}>
                            {formatDate(saved.createdAt)}
                        </p>
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
                    gap: '24px',
                }}>
                    {categoriesWithItems.map(cat => {
                        const included = saved.items.filter(i => i.category === cat && !i.excluded);
                        const checked = included.filter(i => i.checked);
                        const unchecked = included.filter(i => !i.checked);

                        return (
                            <div key={cat}>
                                <p style={{
                                    fontFamily: 'var(--font-secondary)',
                                    fontSize: '10px',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: B.muted,
                                    margin: '0 0 8px',
                                }}>
                                    {CATEGORY_LABELS[cat]}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {checked.map(item => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '6px 0',
                                            borderBottom: `1px solid ${B.border}`,
                                        }}>
                                            <div style={{
                                                width: '14px',
                                                height: '14px',
                                                flexShrink: 0,
                                                border: `1px solid ${B.accent}`,
                                                borderRadius: '2px',
                                                backgroundColor: B.accent,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                    <path d="M1 3L3 5.5L7 1" stroke="#1a1f1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <p style={{
                                                fontFamily: 'var(--font-secondary)',
                                                fontSize: '13px',
                                                color: B.muted,
                                                margin: 0,
                                                textDecoration: 'line-through',
                                            }}>
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                    {unchecked.map(item => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '6px 0',
                                            borderBottom: `1px solid ${B.border}`,
                                        }}>
                                            <div style={{
                                                width: '14px',
                                                height: '14px',
                                                flexShrink: 0,
                                                border: `1px solid ${B.border}`,
                                                borderRadius: '2px',
                                            }} />
                                            <p style={{
                                                fontFamily: 'var(--font-secondary)',
                                                fontSize: '13px',
                                                color: B.text,
                                                margin: 0,
                                                opacity: 0.5,
                                            }}>
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const InlineNameEditor: React.FC<{
    saved: SavedTrip;
    onRename: (id: string, name: string) => void;
}> = ({ saved, onRename }) => {
    const [editing, setEditing] = useState(false);
    const [raw, setRaw] = useState(saved.name ?? '');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const autoSummary = [
        MOBILITY_LABELS[saved.trip.mobility],
        saved.trip.duration
            ? `${saved.trip.duration} ${saved.trip.duration === 1 ? 'day' : 'days'}`
            : null,
    ].filter(Boolean).join(' · ');

    const startEdit = () => {
        setRaw(saved.name ?? '');
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const commit = () => {
        onRename(saved.id, raw);
        setEditing(false);
    };

    const sharedStyle: React.CSSProperties = {
        fontFamily: 'var(--font-primary)',
        fontStyle: 'italic',
        fontSize: '22px',
        fontWeight: 500,
        lineHeight: 1,
        color: B.text,
    };

    if (editing) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={raw}
                    placeholder={autoSummary}
                    onChange={e => setRaw(e.target.value)}
                    onBlur={commit}
                    onKeyDown={e => {
                        if (e.key === 'Enter') commit();
                        if (e.key === 'Escape') setEditing(false);
                    }}
                    style={{
                        ...sharedStyle,
                        background: 'none',
                        border: 'none',
                        borderBottom: `1px solid ${B.accent}`,
                        outline: 'none',
                        padding: '2px 0',
                        width: '100%',
                    }}
                />
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    color: B.muted,
                    opacity: 0.6,
                    margin: 0,
                }}>
                    Leave blank to use auto-summary
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h3
                onClick={startEdit}
                title="Click to rename"
                style={{
                    ...sharedStyle,
                    margin: 0,
                    cursor: 'text',
                }}
            >
                {tripSummary(saved)}
            </h3>
            {saved.name && (
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    color: B.muted,
                    opacity: 0.5,
                    margin: 0,
                }}>
                    {autoSummary}
                </p>
            )}
        </div>
    );
};

// ─── Trip card ────────────────────────────────────────────────────────────────

const TripCard: React.FC<{
    saved: SavedTrip;
    onResume: () => void;
    onDelete: () => void;
    onArchive: () => void;
    onRename: (id: string, name: string) => void;
}> = ({ saved, onResume, onDelete, onArchive, onRename }) => {
    const { checked, total } = packingProgress(saved);
    const progress = total === 0 ? 0 : checked / total;

    return (
        <div style={{
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '8px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '12px',
            }}>
                <div>
                    <InlineNameEditor saved={saved} onRename={onRename} />
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        color: B.muted,
                        margin: 0,
                    }}>
                        {formatDate(saved.createdAt)}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: B.muted,
                    margin: 0,
                }}>
                    {checked}/{total} packed
                </p>
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
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                    onClick={onResume}
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
                    Resume
                </button>

                <button
                    onClick={onArchive}
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
                    Archive
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
                        padding: '10px 20px',
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

// ─── Page ────────────────────────────────────────────────────────────────────

export const TripsPage: React.FC = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<SavedTrip[]>(() => getAllTrips());
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [viewingArchived, setViewingArchived] = useState<SavedTrip | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const active = trips.filter(t => !t.archived);
    const archived = trips.filter(t => t.archived);

    const showFeedback = (msg: string) => {
        setFeedback(msg);
        setTimeout(() => setFeedback(null), 3000);
    };

    const handleDelete = (id: string) => setDeleteId(id);

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteTrip(deleteId);
        setTrips(getAllTrips());
        setDeleteId(null);
    };

    const handleArchive = (id: string) => {
        archiveTrip(id);
        setTrips(getAllTrips());
    };

    const handleRename = (id: string, name: string) => {
        renameTrip(id, name);
        setTrips(getAllTrips());
    };

    const handleResume = (saved: SavedTrip) => {
        navigate('/sandbox/bivouac/trip', { state: { savedTrip: saved } });
    };

    const handleExport = () => {
        exportTrips();
        showFeedback('Backup downloaded.');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImportFile(file);
        e.target.value = '';
    };

    const confirmImport = async (mode: 'merge' | 'replace') => {
        if (!importFile) return;
        try {
            const { count } = await importTrips(importFile, mode);
            setTrips(getAllTrips());
            setImportFile(null);
            showFeedback(`${count} trip${count !== 1 ? 's' : ''} imported.`);
        } catch {
            setImportFile(null);
            showFeedback('Import failed — invalid file.');
        }
    };

    return (
        <div style={{ backgroundColor: B.bg, minHeight: '100vh', color: B.text }}>
            <BivouacHeader onBack={() => navigate('/sandbox/bivouac')} />
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

                {/* Page header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <h1 style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(42px, 8vw, 80px)',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        lineHeight: '0.95',
                        color: B.text,
                        margin: 0,
                    }}>
                        My trips
                    </h1>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {/* New trip */}
                        <button
                            onClick={() => navigate('/sandbox/bivouac')}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: B.bg,
                                backgroundColor: B.accent,
                                border: 'none',
                                borderRadius: '3px',
                                padding: '8px 14px',
                                cursor: 'pointer',
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        >
                            + New trip
                        </button>

                        {/* Export */}
                        <button
                            onClick={handleExport}
                            title="Export all trips"
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: B.muted,
                                background: 'none',
                                border: `1px solid ${B.border}`,
                                borderRadius: '3px',
                                padding: '8px 14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
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
                            <Download size={14} strokeWidth={1.5} />
                            Export
                        </button>

                        {/* Import */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Import trips"
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: B.muted,
                                background: 'none',
                                border: `1px solid ${B.border}`,
                                borderRadius: '3px',
                                padding: '8px 14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
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
                            <Upload size={14} strokeWidth={1.5} />
                            Import
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {/* Feedback */}
                {feedback && (
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '12px',
                        letterSpacing: '0.1em',
                        color: B.accent,
                        margin: 0,
                    }}>
                        {feedback}
                    </p>
                )}

                {/* Active trips */}
                {active.length === 0 ? (
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '14px',
                        color: B.muted,
                        fontStyle: 'italic',
                    }}>
                        No trips yet. Plan your first one.
                    </p>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(12px, 2vw, 20px)',
                    }}>
                        {active.map(saved => (
                            <TripCard
                                key={saved.id}
                                saved={saved}
                                onResume={() => handleResume(saved)}
                                onDelete={() => handleDelete(saved.id)}
                                onArchive={() => handleArchive(saved.id)}
                                onRename={handleRename}
                            />
                        ))}
                    </div>
                )}

                {/* Archived trips */}
                {archived.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(12px, 2vw, 20px)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}>
                            <p style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: B.muted,
                                margin: 0,
                                opacity: 0.6,
                            }}>
                                Archived
                            </p>
                            <div style={{
                                flex: 1,
                                height: '1px',
                                backgroundColor: B.border,
                                opacity: 0.5,
                            }} />
                        </div>

                        {archived.map(saved => (
                            <div
                                key={saved.id}
                                style={{
                                    backgroundColor: B.surface,
                                    border: `1px solid ${B.border}`,
                                    borderRadius: '8px',
                                    padding: '20px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                    opacity: 0.6,
                                }}
                            >
                                <div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-primary)',
                                        fontStyle: 'italic',
                                        fontSize: '20px',
                                        fontWeight: 500,
                                        color: B.text,
                                        margin: '0 0 4px',
                                        lineHeight: 1,
                                    }}>
                                        {tripSummary(saved)}
                                    </h3>
                                    <p style={{
                                        fontFamily: 'var(--font-secondary)',
                                        fontSize: '11px',
                                        color: B.muted,
                                        margin: 0,
                                    }}>
                                        {formatDate(saved.createdAt)}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => setViewingArchived(saved)}
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
                                            opacity: 1,
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
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleDelete(saved.id)}
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
                                            opacity: 1,
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
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            {deleteId && (
                <DeleteModal
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            {importFile && (
                <ImportModal
                    file={importFile}
                    onConfirm={confirmImport}
                    onCancel={() => setImportFile(null)}
                />
            )}

            {viewingArchived && (
                <ArchivedTripModal
                    saved={viewingArchived}
                    onClose={() => setViewingArchived(null)}
                />
            )}
        </div>
    );
};