import type { Mobility, Shelter, Requirement, Trip, Segment, Level, Category } from './types';
import { resolveDefaultTemplate } from './storage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const req = (
    id: string,
    label: string,
    category: Requirement['category'],
    reason?: string
): Requirement => ({ id, label, category, reason });

const deriveShelter = (mobility: Mobility): Shelter =>
    mobility === 'vehicle' ? 'vehicle' : 'bivouac';

// ─── Requirement pools ────────────────────────────────────────────────────────

const ALWAYS: Requirement[] = [
    // Sleep
    req('sleeping-bag', 'Sleeping bag', 'sleep'),

    // Health
    req('first-aid', 'First aid kit', 'health'),
    req('medication', 'Personal medication', 'health'),
    req('sunscreen', 'Sunscreen', 'health'),
    req('lip-balm', 'Lip balm', 'health'),

    // Hygiene
    req('toothbrush', 'Toothbrush', 'hygiene'),
    req('toothpaste', 'Toothpaste', 'hygiene'),
    req('soap', 'Soap', 'hygiene'),
    req('towel', 'Towel', 'hygiene'),
    req('toilet-paper', 'Toilet paper', 'hygiene'),
    req('hand-sanitiser', 'Hand sanitiser', 'hygiene'),
    req('wet-wipes', 'Wet wipes', 'hygiene'),

    // Kitchen
    req('water-bottle', 'Water bottle', 'kitchen'),
    req('food', 'Food & snacks', 'kitchen'),
    req('water-purification', 'Water purification tablets', 'kitchen', 'access to water sources may vary'),

    // Electronics
    req('headlamp', 'Headlamp', 'electronics'),
    req('power-bank', 'Power bank', 'electronics'),
    req('cables', 'Charging cables', 'electronics'),

    // Extras
    req('documents', 'ID & documents', 'extras'),
    req('cash', 'Cash', 'extras'),
    req('emergency-contacts', 'Emergency contact list', 'extras'),
    req('whistle', 'Whistle', 'extras', 'emergency signalling'),
];

const BIVOUAC: Requirement[] = [
    // Sleep
    req('tent', 'Tent', 'sleep', 'sleeping outside'),
    req('mattress', 'Inflatable mattress', 'sleep', 'sleeping outside'),
    req('sleeping-bag-liner', 'Sleeping bag liner', 'sleep', 'extra warmth and hygiene'),

    // Clothing
    req('hiking-boots', 'Hiking boots', 'clothing'),
    req('rain-jacket', 'Rain jacket', 'clothing', 'exposed to elements'),
    req('warm-layer', 'Warm layer', 'clothing', 'exposed to elements'),
    req('base-layer', 'Moisture-wicking base layer', 'clothing', 'exposed to elements'),
    req('sun-hat', 'Sun hat', 'clothing'),
    req('gloves', 'Gloves', 'clothing', 'cold nights outside'),
    req('buff', 'Buff / neck gaiter', 'clothing', 'wind and cold protection'),

    // Kitchen
    req('stove', 'Camp stove', 'kitchen', 'no kitchen access'),
    req('lighter', 'Lighter', 'kitchen', 'no kitchen access'),
    req('pot', 'Pot', 'kitchen', 'no kitchen access'),
    req('cutlery', 'Cutlery', 'kitchen', 'no kitchen access'),
    req('dry-bags', 'Dry bags', 'kitchen', 'keep food and gear dry'),

    // Extras
    req('tarp', 'Tarp', 'extras', 'emergency shelter backup'),
];

const FOOT: Requirement[] = [
    req('hiking-socks', 'Hiking socks (×3)', 'clothing'),
    req('blister-kit', 'Blister kit', 'health', 'high friction on long walks'),
    req('anti-chafe', 'Anti-chafe stick', 'health', 'high friction on long walks'),
    req('trekking-poles', 'Trekking poles', 'extras', 'optional — reduces knee strain'),
];

const BIKE: Requirement[] = [
    req('cycling-gloves', 'Cycling gloves', 'clothing'),
    req('padded-shorts', 'Padded shorts', 'clothing'),
    req('puncture-kit', 'Puncture kit', 'repair'),
    req('spare-inner-tube', 'Spare inner tube', 'repair'),
    req('spoke-key', 'Spoke key', 'repair'),
    req('tyre-levers', 'Tyre levers', 'repair'),
    req('chain-lube', 'Chain lube', 'repair'),
    req('multi-tool', 'Multi-tool', 'repair'),
    req('bike-lights', 'Bike lights (front + rear)', 'electronics'),
    req('bike-computer', 'Bike computer', 'electronics'),
];

const MOTORCYCLE: Requirement[] = [
    req('helmet', 'Helmet', 'clothing'),
    req('riding-gloves', 'Riding gloves', 'clothing'),
    req('riding-jacket', 'Riding jacket', 'clothing'),
    req('moto-toolkit', 'Basic toolkit', 'repair'),
    req('moto-chain-lube', 'Chain lube', 'repair'),
    req('moto-puncture-kit', 'Puncture kit', 'repair'),
    req('moto-fuses', 'Spare fuses', 'repair'),
    req('moto-duct-tape', 'Duct tape', 'repair'),
    req('moto-zip-ties', 'Zip ties', 'repair'),
    req('high-vis-vest', 'High-vis vest', 'extras', 'legal requirement in some countries'),
    req('road-maps', 'Road maps', 'extras', 'backup if GPS fails'),
];

const VEHICLE: Requirement[] = [
    // Sleep
    req('sleeping-mat', 'Sleeping mat / mattress topper', 'sleep'),

    // Clothing
    req('camp-shoes', 'Camp shoes / sandals', 'clothing'),

    // Kitchen
    req('portable-stove', 'Portable gas stove', 'kitchen'),
    req('washup-kit', 'Washing-up kit', 'kitchen'),
    req('cooler-box', 'Cooler box', 'kitchen'),

    // Repair
    req('jumper-cables', 'Jumper cables', 'repair'),
    req('vehicle-toolkit', 'Basic toolkit', 'repair'),
    req('warning-triangle', 'Warning triangle', 'repair', 'legally required in many countries'),
    req('vehicle-high-vis', 'Hi-vis vest', 'repair', 'legally required in many countries'),
    req('tow-rope', 'Tow rope', 'repair'),

    // Extras
    req('parking-docs', 'Parking / road documents', 'extras'),
    req('toll-coins', 'Road toll coins / card', 'extras'),
];

const MORE_THAN_ONE_DAY: Requirement[] = [
    req('spare-batteries', 'Spare headtorch batteries', 'electronics', 'multi-day trip'),
];

const MORE_THAN_THREE_DAYS: Requirement[] = [
    req('camp-towel', 'Camp towel', 'hygiene', 'multi-day trip'),
    req('blister-prevention', 'Blister prevention tape', 'health', 'multi-day trip'),
];

const LONG_TRIP: Requirement[] = [
    req('extra-toiletries', 'Extra toiletries', 'hygiene'),
    req('laundry-soap', 'Laundry soap', 'hygiene'),
    req('spare-towel', 'Spare microfibre towel', 'hygiene'),
    req('extra-clothes', 'Extra change of clothes', 'clothing'),
    req('solar-charger', 'Solar charger', 'electronics', 'extended time off-grid'),
    req('sewing-kit', 'Sewing kit', 'repair'),
    req('duct-tape', 'Duct tape', 'repair'),
    req('book', 'Book', 'leisure'),
    req('cards', 'Deck of cards', 'leisure'),
    req('journal', 'Journal', 'leisure'),
    req('downloaded-maps', 'Downloaded maps & music', 'leisure', 'no guarantee of connectivity'),
];

const VERY_LONG_TRIP: Requirement[] = [
    req('extra-medication', 'Extra medication supply', 'health', 'trip longer than 10 days'),
    req('spare-glasses', 'Spare glasses / contacts', 'health', 'trip longer than 10 days'),
];

// ─── Segment resolution ───────────────────────────────────────────────────────

const resolveSegmentRequirements = (segment: Segment): Requirement[] => {
    const requirements: Requirement[] = [];
    const shelter = deriveShelter(segment.mobility);

    // Autonomous segments away from base need full bivouac kit
    if (segment.autonomous && shelter === 'bivouac') {
        requirements.push(...BIVOUAC);
    }

    // Always add mobility-specific gear for the segment
    if (segment.mobility === 'foot') requirements.push(...FOOT);
    if (segment.mobility === 'bike') requirements.push(...BIKE);
    if (segment.mobility === 'motorcycle') requirements.push(...MOTORCYCLE);
    if (segment.mobility === 'vehicle') requirements.push(...VEHICLE);

    // Duration pools for autonomous segments
    if (segment.autonomous && segment.duration !== null) {
        if (segment.duration > 1) requirements.push(...MORE_THAN_ONE_DAY);
        if (segment.duration > 3) requirements.push(...MORE_THAN_THREE_DAYS);
        if (segment.duration > 5) requirements.push(...LONG_TRIP);
        if (segment.duration > 10) requirements.push(...VERY_LONG_TRIP);
    }

    return requirements;
};

// ─── Engine ───────────────────────────────────────────────────────────────────

export const resolveRequirements = (trip: Trip): Requirement[] => {
    const shelter = deriveShelter(trip.mobility);
    const seen = new Set<string>();
    const requirements: Requirement[] = [];

    const add = (reqs: Requirement[]) => {
        for (const r of reqs) {
            if (!seen.has(r.id)) {
                seen.add(r.id);
                requirements.push(r);
            }
        }
    };

    // Base trip
    add(ALWAYS);
    if (shelter === 'bivouac') add(BIVOUAC);
    if (trip.mobility === 'foot') add(FOOT);
    if (trip.mobility === 'bike') add(BIKE);
    if (trip.mobility === 'motorcycle') add(MOTORCYCLE);
    if (trip.mobility === 'vehicle') add(VEHICLE);

    if (trip.duration !== null) {
        if (trip.duration > 1) add(MORE_THAN_ONE_DAY);
        if (trip.duration > 3) add(MORE_THAN_THREE_DAYS);
        if (trip.duration > 5) add(LONG_TRIP);
        if (trip.duration > 10) add(VERY_LONG_TRIP);
    }

    // Segments
    for (const segment of trip.segments) {
        add(resolveSegmentRequirements(segment));
    }

    return requirements;
};

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<Requirement['category'], string> = {
    sleep: 'Sleep',
    clothing: 'Clothing',
    health: 'Health',
    hygiene: 'Hygiene',
    kitchen: 'Kitchen',
    repair: 'Repair',
    electronics: 'Electronics',
    leisure: 'Leisure',
    extras: 'Extras',
};

// ─── Item bank ────────────────────────────────────────────────────────────────

// All engine items exposed as suggestions for template creation.
// Keyed by category for fast lookup.
export const ITEM_BANK: Record<Category, { id: string; label: string }[]> = {
    sleep: [
        { id: 'sleeping-bag', label: 'Sleeping bag' },
        { id: 'tent', label: 'Tent' },
        { id: 'mattress', label: 'Inflatable mattress' },
        { id: 'sleeping-bag-liner', label: 'Sleeping bag liner' },
        { id: 'sleeping-mat', label: 'Sleeping mat' },
        { id: 'tarp', label: 'Tarp' },
    ],
    clothing: [
        { id: 'hiking-boots', label: 'Hiking boots' },
        { id: 'rain-jacket', label: 'Rain jacket' },
        { id: 'warm-layer', label: 'Warm layer' },
        { id: 'base-layer', label: 'Moisture-wicking base layer' },
        { id: 'sun-hat', label: 'Sun hat' },
        { id: 'gloves', label: 'Gloves' },
        { id: 'buff', label: 'Buff / neck gaiter' },
        { id: 'hiking-socks', label: 'Hiking socks (×3)' },
        { id: 'cycling-gloves', label: 'Cycling gloves' },
        { id: 'padded-shorts', label: 'Padded shorts' },
        { id: 'helmet', label: 'Helmet' },
        { id: 'riding-gloves', label: 'Riding gloves' },
        { id: 'riding-jacket', label: 'Riding jacket' },
        { id: 'camp-shoes', label: 'Camp shoes / sandals' },
        { id: 'extra-clothes', label: 'Extra change of clothes' },
    ],
    health: [
        { id: 'first-aid', label: 'First aid kit' },
        { id: 'medication', label: 'Personal medication' },
        { id: 'sunscreen', label: 'Sunscreen' },
        { id: 'lip-balm', label: 'Lip balm' },
        { id: 'blister-kit', label: 'Blister kit' },
        { id: 'anti-chafe', label: 'Anti-chafe stick' },
        { id: 'blister-prev', label: 'Blister prevention tape' },
        { id: 'extra-medication', label: 'Extra medication supply' },
        { id: 'spare-glasses', label: 'Spare glasses / contacts' },
    ],
    hygiene: [
        { id: 'toothbrush', label: 'Toothbrush' },
        { id: 'toothpaste', label: 'Toothpaste' },
        { id: 'soap', label: 'Soap' },
        { id: 'towel', label: 'Towel' },
        { id: 'toilet-paper', label: 'Toilet paper' },
        { id: 'hand-sanitiser', label: 'Hand sanitiser' },
        { id: 'wet-wipes', label: 'Wet wipes' },
        { id: 'camp-towel', label: 'Camp towel' },
        { id: 'laundry-soap', label: 'Laundry soap' },
        { id: 'spare-towel', label: 'Spare microfibre towel' },
        { id: 'extra-toiletries', label: 'Extra toiletries' },
    ],
    kitchen: [
        { id: 'water-bottle', label: 'Water bottle' },
        { id: 'food', label: 'Food & snacks' },
        { id: 'water-purification', label: 'Water purification tablets' },
        { id: 'stove', label: 'Camp stove' },
        { id: 'lighter', label: 'Lighter' },
        { id: 'pot', label: 'Pot' },
        { id: 'cutlery', label: 'Cutlery' },
        { id: 'dry-bags', label: 'Dry bags' },
        { id: 'portable-stove', label: 'Portable gas stove' },
        { id: 'washup-kit', label: 'Washing-up kit' },
        { id: 'cooler-box', label: 'Cooler box' },
    ],
    repair: [
        { id: 'puncture-kit', label: 'Puncture kit' },
        { id: 'spare-inner-tube', label: 'Spare inner tube' },
        { id: 'spoke-key', label: 'Spoke key' },
        { id: 'tyre-levers', label: 'Tyre levers' },
        { id: 'chain-lube', label: 'Chain lube' },
        { id: 'multi-tool', label: 'Multi-tool' },
        { id: 'moto-toolkit', label: 'Basic toolkit' },
        { id: 'moto-fuses', label: 'Spare fuses' },
        { id: 'moto-zip-ties', label: 'Zip ties' },
        { id: 'jumper-cables', label: 'Jumper cables' },
        { id: 'warning-triangle', label: 'Warning triangle' },
        { id: 'vehicle-high-vis', label: 'Hi-vis vest' },
        { id: 'tow-rope', label: 'Tow rope' },
        { id: 'duct-tape', label: 'Duct tape' },
        { id: 'sewing-kit', label: 'Sewing kit' },
    ],
    electronics: [
        { id: 'headlamp', label: 'Headlamp' },
        { id: 'power-bank', label: 'Power bank' },
        { id: 'cables', label: 'Charging cables' },
        { id: 'spare-batteries', label: 'Spare headtorch batteries' },
        { id: 'bike-lights', label: 'Bike lights (front + rear)' },
        { id: 'bike-computer', label: 'Bike computer' },
        { id: 'solar-charger', label: 'Solar charger' },
    ],
    leisure: [
        { id: 'book', label: 'Book' },
        { id: 'cards', label: 'Deck of cards' },
        { id: 'journal', label: 'Journal' },
        { id: 'downloaded-maps', label: 'Downloaded maps & music' },
    ],
    extras: [
        { id: 'documents', label: 'ID & documents' },
        { id: 'cash', label: 'Cash' },
        { id: 'emergency-contacts', label: 'Emergency contact list' },
        { id: 'whistle', label: 'Whistle' },
        { id: 'trekking-poles', label: 'Trekking poles' },
        { id: 'high-vis-vest', label: 'High-vis vest' },
        { id: 'road-maps', label: 'Road maps' },
        { id: 'parking-docs', label: 'Parking / road documents' },
        { id: 'toll-coins', label: 'Road toll coins / card' },
    ],
};

// ─── Level resolution ─────────────────────────────────────────────────────────

// Returns all levels up to and including the given level.
export const levelsUpTo = (level: Level): Level[] => {
    const all: Level[] = ['survival', 'comfort', 'luxury'];
    return all.slice(0, all.indexOf(level) + 1);
};

// ─── Template-aware requirement resolution ────────────────────────────────────

export const resolveRequirementsWithTemplates = (
    trip: Trip,
    level: Level = 'comfort',
): Requirement[] => {
    const engineRequirements = resolveRequirements(trip);
    const categories = Object.keys(CATEGORY_LABELS) as Category[];
    const activeLevels = levelsUpTo(level);

    const result: Requirement[] = [];

    for (const category of categories) {
        const template = resolveDefaultTemplate(category, trip.mobility);

        if (template) {
            // Template replaces engine requirements for this category
            const templateItems = template.items
                .filter(item => {
                    // Filter by level
                    if (!activeLevels.includes(item.level)) return false;
                    // Filter by mobility
                    if (item.mobility === 'all') return true;
                    if (item.mobility === trip.mobility) return true;
                    // Also check segment mobilities
                    return trip.segments.some(s => s.mobility === item.mobility);
                })
                .map(item => ({
                    id: `tpl-${template.id}-${item.id}`,
                    label: item.label,
                    category,
                    reason: `from template: ${template.name}`,
                }));

            result.push(...templateItems);
        } else {
            // Fall back to engine requirements for this category
            result.push(
                ...engineRequirements.filter(r => r.category === category)
            );
        }
    }

    return result;
};