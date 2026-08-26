import type { Trip, ChecklistItem, Category, UserTemplate, TemplateMobility, Mobility } from './types';


// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedTrip {
    id: string;
    createdAt: string;
    name?: string;
    trip: Trip;
    items: (ChecklistItem & { excluded: boolean })[];
    categoryModes: Partial<Record<Category, string>>;
    archived: boolean;
}

interface BivouacStorage {
    version: 1;
    trips: SavedTrip[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'bivouac-v1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getStorage = (): BivouacStorage => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { version: 1, trips: [] };
        return JSON.parse(raw) as BivouacStorage;
    } catch {
        return { version: 1, trips: [] };
    }
};

const setStorage = (data: BivouacStorage): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Bivouac: failed to save to localStorage', e);
    }
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const createTrip = (
    trip: Trip,
    items: (ChecklistItem & { excluded: boolean })[],
    categoryModes: Partial<Record<Category, string>>,
): SavedTrip => {
    const saved: SavedTrip = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        trip,
        items,
        categoryModes,
        archived: false,
    };

    const storage = getStorage();
    storage.trips.unshift(saved);
    setStorage(storage);

    return saved;
};

export const updateTrip = (
    id: string,
    items: (ChecklistItem & { excluded: boolean })[],
    categoryModes: Partial<Record<Category, string>>,
): void => {
    const storage = getStorage();
    const index = storage.trips.findIndex(t => t.id === id);
    if (index === -1) return;
    storage.trips[index] = { ...storage.trips[index], items, categoryModes };
    setStorage(storage);
};

export const renameTrip = (id: string, name: string): void => {
    const storage = getStorage();
    const index = storage.trips.findIndex(t => t.id === id);
    if (index === -1) return;
    storage.trips[index] = { ...storage.trips[index], name: name.trim() || undefined };
    setStorage(storage);
};

export const getTrip = (id: string): SavedTrip | undefined => {
    return getStorage().trips.find(t => t.id === id);
};

export const getAllTrips = (): SavedTrip[] => {
    return getStorage().trips;
};

export const deleteTrip = (id: string): void => {
    const storage = getStorage();
    storage.trips = storage.trips.filter(t => t.id !== id);
    setStorage(storage);
};

export const exportTrips = (): void => {
    const storage = getStorage();
    const blob = new Blob([JSON.stringify(storage, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bivouac-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const importTrips = (
    file: File,
    mode: 'merge' | 'replace',
): Promise<{ count: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string) as BivouacStorage;

                if (!parsed.trips || !Array.isArray(parsed.trips)) {
                    reject(new Error('Invalid backup file.'));
                    return;
                }

                const current = getStorage();

                if (mode === 'replace') {
                    setStorage({ version: 1, trips: parsed.trips });
                } else {
                    // Merge — avoid duplicates by id
                    const existingIds = new Set(current.trips.map(t => t.id));
                    const newTrips = parsed.trips.filter(t => !existingIds.has(t.id));
                    setStorage({
                        version: 1,
                        trips: [...current.trips, ...newTrips],
                    });
                }

                resolve({ count: parsed.trips.length });
            } catch {
                reject(new Error('Failed to parse backup file.'));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
};

export const archiveTrip = (id: string): void => {
    const storage = getStorage();
    const index = storage.trips.findIndex(t => t.id === id);
    if (index === -1) return;
    storage.trips[index] = { ...storage.trips[index], archived: true };
    setStorage(storage);
};


// ─── Template storage key ─────────────────────────────────────────────────────

const TEMPLATE_STORAGE_KEY = 'bivouac-templates-v1';

// ─── Template storage helpers ─────────────────────────────────────────────────

const getTemplateStorage = (): UserTemplate[] => {
    try {
        const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as UserTemplate[];
    } catch {
        return [];
    }
};

const setTemplateStorage = (templates: UserTemplate[]): void => {
    try {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
        console.error('Bivouac: failed to save templates', e);
    }
};

const generateTemplateId = (): string =>
    `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const generateItemId = (): string =>
    `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ─── Template API ─────────────────────────────────────────────────────────────

export const getAllTemplates = (): UserTemplate[] =>
    getTemplateStorage();

export const getTemplatesByCategory = (category: Category): UserTemplate[] =>
    getTemplateStorage().filter(t => t.category === category);

export const getTemplate = (id: string): UserTemplate | undefined =>
    getTemplateStorage().find(t => t.id === id);

export const saveTemplate = (template: UserTemplate): void => {
    const templates = getTemplateStorage();
    const index = templates.findIndex(t => t.id === template.id);
    if (index === -1) {
        templates.push(template);
    } else {
        templates[index] = template;
    }
    setTemplateStorage(templates);
};

export const createTemplate = (
    partial: Pick<UserTemplate, 'name' | 'category' | 'items'>
): UserTemplate => {
    const now = new Date().toISOString();
    const template: UserTemplate = {
        id: generateTemplateId(),
        name: partial.name,
        category: partial.category,
        items: partial.items,
        defaultFor: null,
        builtIn: false,
        createdAt: now,
        updatedAt: now,
    };
    const templates = getTemplateStorage();
    templates.push(template);
    setTemplateStorage(templates);
    return template;
};

export const deleteTemplate = (id: string): void => {
    const templates = getTemplateStorage().filter(t => t.id !== id);
    setTemplateStorage(templates);
};

export const duplicateTemplate = (id: string): UserTemplate | null => {
    const original = getTemplate(id);
    if (!original) return null;
    const now = new Date().toISOString();
    const copy: UserTemplate = {
        ...original,
        id: generateTemplateId(),
        name: `${original.name} (copy)`,
        defaultFor: null,
        builtIn: false,
        createdAt: now,
        updatedAt: now,
        items: original.items.map(item => ({
            ...item,
            id: generateItemId(),
        })),
    };
    const templates = getTemplateStorage();
    templates.push(copy);
    setTemplateStorage(templates);
    return copy;
};

// ─── Default template resolution ──────────────────────────────────────────────

// Returns the best matching default template for a given category + mobility.
// Priority: exact mobility match > 'all' match > null (use engine)
export const resolveDefaultTemplate = (
    category: Category,
    mobility: Mobility,
): UserTemplate | null => {
    const templates = getTemplatesByCategory(category).filter(
        t => t.defaultFor !== null
    );

    // 1. Exact mobility match
    const exact = templates.find(t => t.defaultFor === mobility);
    if (exact) return exact;

    // 2. 'all' match
    const all = templates.find(t => t.defaultFor === 'all');
    if (all) return all;

    return null;
};

// Sets a template as default for a mobility.
// Clears any existing default for the same (category, mobility) pair.
// If setting 'all', removes 'all' from any other template in the category,
// but leaves specific mobility defaults intact.
export const setTemplateDefault = (
    id: string,
    mobility: TemplateMobility | null,
): void => {
    const templates = getTemplateStorage();
    const target = templates.find(t => t.id === id);
    if (!target) return;

    // Clear conflicting defaults in the same category
    for (const t of templates) {
        if (t.id === id) continue;
        if (t.category !== target.category) continue;
        if (mobility === null) continue;

        if (mobility === 'all') {
            // Only clear other 'all' defaults — specific ones stay
            if (t.defaultFor === 'all') t.defaultFor = null;
        } else {
            // Clear exact same mobility match
            if (t.defaultFor === mobility) t.defaultFor = null;
        }
    }

    // Set the new default
    target.defaultFor = mobility;
    target.updatedAt = new Date().toISOString();

    setTemplateStorage(templates);
};

export { generateItemId };