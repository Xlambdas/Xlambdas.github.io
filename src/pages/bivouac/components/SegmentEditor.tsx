import React, { useState } from 'react';
import { type Mobility, type Segment } from '../types';

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

const MOBILITY_OPTIONS: { value: Mobility; label: string }[] = [
    { value: 'foot', label: 'Foot' },
    { value: 'bike', label: 'Bike' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'vehicle', label: 'Car / Van' },
];

const generateId = () =>
    `seg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

interface SegmentEditorProps {
    segments: Segment[];
    onChange: (segments: Segment[]) => void;
}

export const SegmentEditor: React.FC<SegmentEditorProps> = ({
    segments,
    onChange,
}) => {
    const addSegment = () => {
        onChange([
            ...segments,
            {
                id: generateId(),
                mobility: 'foot',
                duration: null,
                autonomous: true,
            },
        ]);
    };

    const updateSegment = (id: string, patch: Partial<Segment>) => {
        onChange(segments.map(s => s.id === id ? { ...s, ...patch } : s));
    };

    const removeSegment = (id: string) => {
        onChange(segments.filter(s => s.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {segments.map((seg, index) => (
                <SegmentCard
                    key={seg.id}
                    segment={seg}
                    index={index}
                    onUpdate={patch => updateSegment(seg.id, patch)}
                    onRemove={() => removeSegment(seg.id)}
                />
            ))}

            <button
                onClick={addSegment}
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
                    alignSelf: 'flex-start',
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
                + Add a segment
            </button>
        </div>
    );
};

// ─── Segment card ─────────────────────────────────────────────────────────────

interface SegmentCardProps {
    segment: Segment;
    index: number;
    onUpdate: (patch: Partial<Segment>) => void;
    onRemove: () => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({
    segment,
    index,
    onUpdate,
    onRemove,
}) => {
    const [editingDuration, setEditingDuration] = useState(false);
    const [rawDuration, setRawDuration] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const startEdit = () => {
        setRawDuration(segment.duration !== null ? String(segment.duration) : '');
        setEditingDuration(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const commitEdit = () => {
        const parsed = parseInt(rawDuration);
        if (!isNaN(parsed) && parsed >= 1) {
            onUpdate({ duration: parsed });
        } else {
            onUpdate({ duration: null });
        }
        setEditingDuration(false);
    };

    return (
        <div style={{
            backgroundColor: B.surface,
            border: `1px solid ${B.border}`,
            borderRadius: '6px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        }}>
            {/* Segment header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: B.muted,
                    margin: 0,
                }}>
                    Segment {index + 1}
                </p>

                <button
                    onClick={onRemove}
                    style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = B.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = B.muted)}
                >
                    remove
                </button>
            </div>

            {/* Mobility */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: B.muted,
                    margin: 0,
                }}>
                    Activity
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {MOBILITY_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => onUpdate({ mobility: opt.value })}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '11px',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: segment.mobility === opt.value ? B.bg : B.muted,
                                backgroundColor: segment.mobility === opt.value ? B.accent : 'transparent',
                                border: `1px solid ${segment.mobility === opt.value ? B.accent : B.border}`,
                                borderRadius: '3px',
                                padding: '8px 14px',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                                if (segment.mobility !== opt.value)
                                    e.currentTarget.style.borderColor = B.muted;
                            }}
                            onMouseLeave={e => {
                                if (segment.mobility !== opt.value)
                                    e.currentTarget.style.borderColor = B.border;
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: B.muted,
                    margin: 0,
                }}>
                    Duration
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => {
                            if (segment.duration === null) return;
                            onUpdate({ duration: segment.duration === 1 ? null : segment.duration - 1 });
                        }}
                        disabled={segment.duration === null}
                        style={{
                            fontSize: '18px',
                            color: segment.duration === null ? B.border : B.muted,
                            background: 'none',
                            border: `1px solid ${segment.duration === null ? B.border : B.muted}`,
                            borderRadius: '3px',
                            width: '30px',
                            height: '30px',
                            cursor: segment.duration === null ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                            opacity: segment.duration === null ? 0.3 : 1,
                        }}
                    >
                        −
                    </button>

                    {editingDuration ? (
                        <input
                            ref={inputRef}
                            type="text"
                            inputMode="numeric"
                            value={rawDuration}
                            onChange={e => setRawDuration(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => {
                                if (e.key === 'Enter') commitEdit();
                                if (e.key === 'Escape') setEditingDuration(false);
                            }}
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontStyle: 'italic',
                                fontSize: '28px',
                                fontWeight: 500,
                                width: '60px',
                                textAlign: 'center',
                                background: 'none',
                                border: 'none',
                                borderBottom: `1px solid ${B.accent}`,
                                color: B.text,
                                outline: 'none',
                                padding: '2px 0',
                            }}
                        />
                    ) : (
                        <span
                            onClick={startEdit}
                            title="Click to type a value"
                            style={{
                                fontFamily: 'var(--font-primary)',
                                fontStyle: 'italic',
                                fontSize: '28px',
                                fontWeight: 500,
                                width: '60px',
                                textAlign: 'center',
                                color: segment.duration === null ? B.border : B.text,
                                cursor: 'text',
                                lineHeight: 1,
                            }}
                        >
                            {segment.duration ?? '—'}
                        </span>
                    )}

                    <button
                        onClick={() => onUpdate({ duration: (segment.duration ?? 0) + 1 })}
                        style={{
                            fontSize: '18px',
                            color: B.muted,
                            background: 'none',
                            border: `1px solid ${B.muted}`,
                            borderRadius: '3px',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s',
                            flexShrink: 0,
                        }}
                    >
                        +
                    </button>

                    <span style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: segment.duration === null ? B.border : B.muted,
                        transition: 'color 0.2s',
                    }}>
                        {segment.duration === 1 ? 'day' : 'days'}
                    </span>
                </div>
            </div>

            {/* Autonomy toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: B.muted,
                    margin: 0,
                }}>
                    Base access
                </p>
                <div style={{
                    display: 'inline-flex',
                    backgroundColor: B.bg,
                    border: `1px solid ${B.border}`,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    alignSelf: 'flex-start',
                }}>
                    {[
                        { value: false, label: 'Back to base each night' },
                        { value: true, label: 'Away from base' },
                    ].map(opt => (
                        <button
                            key={String(opt.value)}
                            onClick={() => onUpdate({ autonomous: opt.value })}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '10px',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: segment.autonomous === opt.value ? B.bg : B.muted,
                                backgroundColor: segment.autonomous === opt.value ? B.accent : 'transparent',
                                border: 'none',
                                height: '30px',
                                padding: '0 12px',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};