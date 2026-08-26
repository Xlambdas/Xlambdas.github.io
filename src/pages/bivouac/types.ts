// ─── Mobility ─────────────────────────────────────────────────────────────────

export type Mobility = 'foot' | 'bike' | 'motorcycle' | 'vehicle';

// ─── Shelter ──────────────────────────────────────────────────────────────────

export type Shelter = 'bivouac' | 'vehicle';

// ─── Segment ──────────────────────────────────────────────────────────────────

export interface Segment {
    id: string;
    mobility: Mobility;
    duration: number | null;
    autonomous: boolean;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export type Category =
    | 'sleep'
    | 'clothing'
    | 'health'
    | 'hygiene'
    | 'kitchen'
    | 'repair'
    | 'electronics'
    | 'leisure'
    | 'extras';

// ─── Requirement ──────────────────────────────────────────────────────────────

export interface Requirement {
    id: string;
    label: string;
    category: Category;
    reason?: string;
}

// ─── Trip ─────────────────────────────────────────────────────────────────────

export interface Trip {
    mobility: Mobility;
    duration: number | null;
    segments: Segment[];
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export interface ChecklistItem {
    id: string;
    requirementId: string;
    label: string;
    category: Category;
    checked: boolean;
    reason?: string;
}

// ─── Levels ───────────────────────────────────────────────────────────────────

export type Level = 'survival' | 'comfort' | 'luxury';

// ─── Template ─────────────────────────────────────────────────────────────────

export type TemplateMobility = Mobility | 'all';

export interface TemplateItem {
    id: string;
    label: string;
    level: Level;
    mobility: TemplateMobility;
}

export interface UserTemplate {
    id: string;
    name: string;
    category: Category;
    items: TemplateItem[];
    // Which mobility this template is the default for.
    // 'all' means all mobilities not covered by a more specific default.
    defaultFor: TemplateMobility | null;
    builtIn: boolean;
    createdAt: string;
    updatedAt: string;
}