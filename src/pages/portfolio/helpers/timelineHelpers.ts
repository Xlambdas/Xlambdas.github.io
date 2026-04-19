import { TYPE_COLORS } from '../constants';
import type { EntryType } from '../../../locales/portfolio';

export function parseDate(s: string): number {
    const parts = s.split('-').map(Number);
    const y = parts[0];
    const m = parts[1] ?? 6;
    const d = parts[2];
    // If day is provided, snap to start / middle / end of month
    let dayOffset = 0.5; // default: mid-month
    if (d !== undefined) {
        const daysInMonth = new Date(y, m, 0).getDate();
        if (d <= 10) dayOffset = 0;    // start
        else if (d >= daysInMonth - 5) dayOffset = 1;    // end
        else dayOffset = 0.5;  // middle
    }
    return y + ((m - 1) + dayOffset) / 12;
}

export function fmtDecimal(d: number): string {
    const ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const y = Math.floor(d);
    const m = Math.round((d - y) * 12);
    return `${ABBR[m % 12]} ${y}`;
}

export const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function entryColor(type?: EntryType): string {
    return type ? (TYPE_COLORS[type] ?? '#888') : '#888';
}