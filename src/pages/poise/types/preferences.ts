import type { SessionCategory } from './session'
import type { BodyArea } from './exercise'

export type PreferredTime = 'morning' | 'midday' | 'afternoon' | 'evening'
export type Intensity = 'light' | 'medium' | 'hard'

export interface DayAvailability {
    available: boolean
    maxMinutes?: number
    preferredTime?: PreferredTime
    note?: string
}

export interface RecoveryRule {
    id: string
    label: string
    tags: string[]
    minHoursBetween: number
}

export interface MuscleLoad {
    areas: BodyArea[]
    defaultIntensity: Intensity
    recoveryHours: {
        light: number
        medium: number
        hard: number
    }
}

export interface ActivityWindow {
    id: string
    name: string
    category: SessionCategory
    allowedDays: number[]
    preferredDuration?: number
    targetAreas?: BodyArea[]
    muscleLoad?: MuscleLoad
    active: boolean
}

export interface UserConstraints {
    sensitivities: string[]
    preferredRestDay: number
}

export type WeekAvailability = Record<number, DayAvailability>

export interface UserPreferences {
    availability: WeekAvailability
    recoveryRules: never[]        // kept for DB compat, unused
    activityWindows: ActivityWindow[]
    constraints: UserConstraints
}

export const DEFAULT_PREFERENCES: UserPreferences = {
    availability: {
        0: { available: true, maxMinutes: 45 },
        1: { available: true, maxMinutes: 60 },
        2: { available: true, maxMinutes: 60 },
        3: { available: true, maxMinutes: 30 },
        4: { available: true, maxMinutes: 45 },
        5: { available: true, maxMinutes: 180 },
        6: { available: false },
    },
    recoveryRules: [],
    activityWindows: [],
    constraints: {
        sensitivities: [],
        preferredRestDay: 6,
    },
}