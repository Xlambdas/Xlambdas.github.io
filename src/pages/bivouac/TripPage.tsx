import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { type Trip, type ChecklistItem, type Category } from './types';
import { resolveRequirementsWithTemplates, CATEGORY_LABELS } from './engine';
import { BivouacHeader, CategoryBox, CategoryModal, ModeToggle, MountainBackground, type Mode } from './components';
import { createTrip, updateTrip, type SavedTrip, getTrip } from './storage';

// ─── Design tokens ────────────────────────────────────────────────────────────

const B = {
    bg: '#1a1f1a',
    surface: '#242b24',
    border: '#3d4a3d',
    text: '#e8e0d0',
    muted: '#8a9a82',
    accent: '#c8a96e',
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildChecklist = (trip: Trip): ChecklistItem[] =>
    resolveRequirementsWithTemplates(trip).map(req => ({
        id: req.id,
        requirementId: req.id,
        label: req.label,
        category: req.category,
        checked: false,
        reason: req.reason,
        excluded: false,
    }));

const MOBILITY_LABELS: Record<string, string> = {
    foot: 'Foot',
    bike: 'Bike',
    motorcycle: 'Motorcycle',
    vehicle: 'Car / Van',
};

// ─── Page ────────────────────────────────────────────────────────────────────

export const TripPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const trip = location.state?.trip as Trip | undefined;
    const savedTrip = location.state?.savedTrip as SavedTrip | undefined;
    const savedTripId = location.state?.savedTripId as string | undefined;

    // Guard — if no trip state, send back to form
    if (!trip && !savedTrip) {
        navigate('/sandbox/bivouac');
        return null;
    }

    const activeTripForm = savedTrip?.trip ?? trip!;

    const [items, setItems] = useState<(ChecklistItem & { excluded: boolean })[]>(
        () => savedTrip
            ? savedTrip.items
            : buildChecklist(trip!)
                .map(i => ({ ...i, excluded: false }))
    );

    const [globalMode, setGlobalMode] = useState<Mode>('edit');

    const [categoryModes, setCategoryModes] = useState<Partial<Record<Category, Mode>>>(
        () => savedTrip ? savedTrip.categoryModes as Partial<Record<Category, Mode>> : {}
    );
    const [openCategory, setOpenCategory] = useState<Category | null>(null);
    const savedTripRef = React.useRef<SavedTrip | null>(savedTrip ?? null);
    const getCategoryMode = (cat: Category): Mode => categoryModes[cat] ?? globalMode;

    const handleGlobalModeChange = (mode: Mode) => {
        setGlobalMode(mode);
        setCategoryModes({});
    };

    const handleCategoryModeChange = (cat: Category, mode: Mode) => {
        setCategoryModes(prev => ({ ...prev, [cat]: mode }));
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleToggleCheck = (id: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    const handleExclude = (id: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, excluded: true, checked: false } : i));
    };

    const handleInclude = (id: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, excluded: false } : i));
    };

    const handleAddCustom = (label: string, category: Category) => {
        const newItem: ChecklistItem & { excluded: boolean } = {
            id: `custom-${Date.now()}`,
            requirementId: `custom-${Date.now()}`,
            label,
            category,
            checked: false,
            excluded: false,
        };
        setItems(prev => [...prev, newItem]);
    };

    // ── Derived data ──────────────────────────────────────────────────────────

    const categories = Object.keys(CATEGORY_LABELS) as Category[];

    const categoriesWithItems = categories.filter(cat =>
        items.some(i => i.category === cat)
    );

    const getIncluded = (cat: Category) =>
        items.filter(i => i.category === cat && !i.excluded);

    const getExcluded = (cat: Category) =>
        items.filter(i => i.category === cat && i.excluded);

    const segmentSummary = activeTripForm.segments.length > 0
        ? ` + ${activeTripForm.segments.map(s => MOBILITY_LABELS[s.mobility]).join(', ')}`
        : '';

    const autoSummary = [
        MOBILITY_LABELS[activeTripForm.mobility],
        activeTripForm.duration
            ? `${activeTripForm.duration} ${activeTripForm.duration === 1 ? 'day' : 'days'}`
            : null,
    ].filter(Boolean).join(' · ') + segmentSummary;

    const tripSummary = savedTrip?.name?.trim() || autoSummary;

    React.useEffect(() => {
        if (!activeTripForm) return;

        if (!savedTripRef.current) {
            if (savedTripId) {
                // Resuming an existing trip by ID
                const existing = getTrip(savedTripId);
                if (existing) {
                    savedTripRef.current = existing;
                    return;
                }
            }
            // Brand new trip
            savedTripRef.current = createTrip(activeTripForm, items, categoryModes);
        } else {
            updateTrip(savedTripRef.current.id, items, categoryModes);
        }
    }, [items, categoryModes]);

    return (
        <div style={{ backgroundColor: B.bg, minHeight: '100vh', color: B.text }}>
            <BivouacHeader
                onBack={() => navigate('/sandbox/bivouac', {
                    state: {
                        trip: activeTripForm,
                        savedTripId: savedTripRef.current?.id,
                    },
                })}
                backLabel="← edit trip"
            />
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

                {/* Trip summary + global mode toggle */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
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
                            margin: '0 0 8px',
                        }}>
                            Your trip
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-primary)',
                            fontStyle: 'italic',
                            fontSize: 'clamp(28px, 5vw, 42px)',
                            fontWeight: 500,
                            color: B.text,
                            margin: 0,
                            lineHeight: 1,
                        }}>
                            {tripSummary}
                        </p>
                    </div>

                    <ModeToggle mode={globalMode} onChange={handleGlobalModeChange} />
                </div>

                {/* Category grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 'clamp(10px, 2vw, 20px)',
                }}>
                    {categoriesWithItems.map(cat => (
                        <CategoryBox
                            key={cat}
                            category={cat}
                            items={getIncluded(cat)}
                            mode={getCategoryMode(cat)}
                            onClick={() => setOpenCategory(cat)}
                    />
                    ))}
                </div>

            </main>

            {/* Modal */}
            {openCategory && (
                <CategoryModal
                    category={openCategory}
                    items={getIncluded(openCategory)}
                    excludedItems={getExcluded(openCategory)}
                    globalMode={getCategoryMode(openCategory)}
                    onClose={() => setOpenCategory(null)}
                    onToggleCheck={handleToggleCheck}
                    onInclude={handleInclude}
                    onExclude={handleExclude}
                    onAddCustom={handleAddCustom}
                    onModeChange={(mode) => handleCategoryModeChange(openCategory, mode)}
                />
            )}
        </div>
    );
};