import type { EntryType } from '../../../locales/portfolio';


export type PeriodKey = '1y' | '3y' | '5y' | 'all';
export const ABOVE_TYPES = new Set<EntryType>(['education', 'work']);


export const TYPE_COLORS: Record<EntryType, string> = {
    studies: '#3b82f6', // blue
    work: '#22c55e', // green
    personal: '#a78bfa', // purple
    project: '#facc15', // yellow
    event: '#f87171', // red
    education: '#3b82f6', // blue
    other: '#888', // gray
};

export const TYPE_LABELS: Record<EntryType, string> = {
    studies: 'Studies',
    work: 'Work',
    personal: 'Personal',
    project: 'Project',
    event: 'Event',
    education: 'Education',
    other: 'Other',
};