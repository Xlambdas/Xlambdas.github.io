import { type PortfolioTranslations } from '../../../locales';
import type { EntryType } from '../../../locales/portfolio';

// --- About section props ---
export interface AboutMeProps {
    t: PortfolioTranslations;
}

// --- Skills section props ---
export interface SkillsProps {
    t: PortfolioTranslations;
    // Skill data can be passed as prop or defined internally
    skillData?: {
        [key: string]: {
            subcategories: {
                [key: string]: string[];
            };
        };
    };
}

export interface SkillCategory {
    key: string;
    title: string;
    description: string;
    subcategories: Array<{
        name: string;
        skills: string[];
    }>;
}

// --- Timeline section props ---
export interface TimelineProps {
    t: PortfolioTranslations;
}

export interface RawEntry {
    key: number;
    startDate?: string;
    endDate: string;
    title: string;
    description: string;
    type: EntryType;
}

export interface ParsedEntry extends RawEntry {
    startDecimal: number;
    endDecimal: number;
    isEvent: boolean;
}

export interface LanedEntry extends ParsedEntry {
    lane: number;
    side: 'above' | 'below';
}