import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Mobility, Trip, Segment } from './types';
import { BivouacHeader, MountainBackground, SegmentEditor } from './components';

// ─── Constants ────────────────────────────────────────────────────────────────

const MOBILITY_OPTIONS: { value: Mobility; label: string }[] = [
    { value: 'foot', label: 'Foot' },
    { value: 'bike', label: 'Bike' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'vehicle', label: 'Car / Van' },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export const BivouacPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Pre-fill if coming back from TripPage to edit
    const editState = location.state as {
        trip?: Trip;
        savedTripId?: string;
    } | null;

    const [form, setForm] = useState<{
        mobility: Mobility | null;
        duration: number | null;
        segments: Segment[];
    }>({
        mobility: editState?.trip?.mobility ?? null,
        duration: editState?.trip?.duration ?? null,
        segments: editState?.trip?.segments ?? [],
    });

    const setMobility = (m: Mobility) => setForm(f => ({ ...f, mobility: m }));
    const setDuration = (d: number | null) => setForm(f => ({ ...f, duration: d }));
    const setSegments = (segments: Segment[]) => setForm(f => ({ ...f, segments }));

    const canGenerate = form.mobility !== null;

    const handleGenerate = () => {
        navigate('/sandbox/bivouac/trip', {
            state: {
                trip: form as Trip,
                savedTripId: editState?.savedTripId ?? null,
            },
        });
    };

    return (
        <div style={{ backgroundColor: B.bg, minHeight: '100vh', color: B.text, position: 'relative' }}>
            <BivouacHeader onBack={() => navigate(-1)} />
            <MountainBackground />

            <main style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '640px',
                margin: '0 auto',
                padding: 'clamp(100px, 15vh, 140px) clamp(24px, 6vw, 48px) 80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(48px, 8vh, 80px)',
            }}>

                {/* Header */}
                {/* <div>
                    <p style={{
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '11px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: B.muted,
                        marginBottom: '16px',
                    }}>
                        {editState?.savedTripId ? 'Edit trip' : 'Trip planner'}
                    </p>
                    <h1 style={{
                        fontFamily: 'var(--font-primary)',
                        fontSize: 'clamp(48px, 10vw, 96px)',
                        fontStyle: 'italic',
                        fontWeight: 500,
                        lineHeight: '0.95',
                        color: B.text,
                        margin: 0,
                    }}>
                        {editState?.savedTripId ? 'Edit trip' : 'Plan a trip'}
                    </h1>
                </div> */}

                {/* Mobility */}
                <Field label="How are you moving?">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {MOBILITY_OPTIONS.map(opt => (
                            <MobilityButton
                                key={opt.value}
                                label={opt.label}
                                selected={form.mobility === opt.value}
                                onClick={() => setMobility(opt.value)}
                            />
                        ))}
                    </div>
                </Field>

                {/* Duration */}
                <Field label="How many days?" hint="Leave blank if unknown">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => {
                                if (form.duration === null) return;
                                setDuration(form.duration === 1 ? null : form.duration - 1);
                            }}
                            disabled={form.duration === null}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '20px',
                                color: form.duration === null ? B.border : B.muted,
                                background: 'none',
                                border: `1px solid ${form.duration === null ? B.border : B.muted}`,
                                borderRadius: '3px',
                                width: '36px',
                                height: '36px',
                                cursor: form.duration === null ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s',
                                flexShrink: 0,
                                opacity: form.duration === null ? 0.3 : 1,
                            }}
                            onMouseEnter={e => {
                                if (form.duration !== null) e.currentTarget.style.borderColor = B.text;
                            }}
                            onMouseLeave={e => {
                                if (form.duration !== null) e.currentTarget.style.borderColor = B.muted;
                            }}
                        >
                            −
                        </button>

                        <DurationDisplay
                            value={form.duration}
                            onChange={setDuration}
                        />

                        <button
                            onClick={() => setDuration((form.duration ?? 0) + 1)}
                            style={{
                                fontFamily: 'var(--font-secondary)',
                                fontSize: '20px',
                                color: B.muted,
                                background: 'none',
                                border: `1px solid ${B.muted}`,
                                borderRadius: '3px',
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = B.text)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = B.muted)}
                        >
                            +
                        </button>

                        <span style={{
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: form.duration === null ? B.border : B.muted,
                            transition: 'color 0.2s',
                        }}>
                            {form.duration === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                </Field>

                {/* Segments */}
                <Field label="Add segments" hint="Optional — add activities within your trip">
                    <SegmentEditor
                        segments={form.segments}
                        onChange={setSegments}
                    />
                </Field>

                {/* Generate */}
                <button
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                    style={{
                        alignSelf: 'flex-start',
                        fontFamily: 'var(--font-secondary)',
                        fontSize: '12px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: canGenerate ? B.bg : B.muted,
                        backgroundColor: canGenerate ? B.accent : B.border,
                        border: 'none',
                        borderRadius: '4px',
                        padding: '14px 28px',
                        cursor: canGenerate ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s, color 0.2s',
                    }}
                >
                    {editState?.savedTripId ? 'Update trip →' : 'Plan my trip →'}
                </button>

            </main>
        </div>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field: React.FC<{
    label: string;
    hint?: string;
    children: React.ReactNode;
}> = ({ label, hint, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
            <p style={{
                fontFamily: 'var(--font-secondary)',
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: B.muted,
                margin: 0,
            }}>
                {label}
            </p>
            {hint && (
                <p style={{
                    fontFamily: 'var(--font-secondary)',
                    fontSize: '11px',
                    color: B.muted,
                    opacity: 0.6,
                    margin: '4px 0 0',
                }}>
                    {hint}
                </p>
            )}
        </div>
        {children}
    </div>
);

const MobilityButton: React.FC<{
    label: string;
    selected: boolean;
    onClick: () => void;
}> = ({ label, selected, onClick }) => (
    <button
        onClick={onClick}
        style={{
            fontFamily: 'var(--font-secondary)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: selected ? B.bg : B.muted,
            backgroundColor: selected ? B.accent : 'transparent',
            border: `1px solid ${selected ? B.accent : B.border}`,
            borderRadius: '3px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
            if (!selected) e.currentTarget.style.borderColor = B.muted;
        }}
        onMouseLeave={e => {
            if (!selected) e.currentTarget.style.borderColor = B.border;
        }}
    >
        {label}
    </button>
);

const DurationDisplay: React.FC<{
    value: number | null;
    onChange: (v: number | null) => void;
}> = ({ value, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [raw, setRaw] = useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const startEdit = () => {
        setRaw(value !== null ? String(value) : '');
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const commitEdit = () => {
        const parsed = parseInt(raw);
        if (!isNaN(parsed) && parsed >= 1) {
            onChange(parsed);
        } else if (raw === '' || raw === '0') {
            onChange(null);
        }
        setEditing(false);
    };

    const sharedStyle: React.CSSProperties = {
        fontFamily: 'var(--font-primary)',
        fontStyle: 'italic',
        fontSize: 'clamp(32px, 6vw, 56px)',
        fontWeight: 500,
        lineHeight: 1,
        width: '80px',
        textAlign: 'center',
    };

    if (editing) {
        return (
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={raw}
                onChange={e => setRaw(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => {
                    if (e.key === 'Enter') commitEdit();
                    if (e.key === 'Escape') setEditing(false);
                }}
                style={{
                    ...sharedStyle,
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid ${B.accent}`,
                    color: B.text,
                    outline: 'none',
                    padding: '4px 0',
                }}
            />
        );
    }

    return (
        <span
            onClick={startEdit}
            title="Click to type a value"
            style={{
                ...sharedStyle,
                color: value === null ? B.border : B.text,
                cursor: 'text',
                transition: 'color 0.2s',
            }}
        >
            {value ?? '—'}
        </span>
    );
};