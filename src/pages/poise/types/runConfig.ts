export type ProgressionType = 'fixed' | 'percentage'

export interface RunEntry {
    date: string
    plannedKm: number
    actualKm: number
    counted: boolean      // if false, next target ignores this run
}

export interface RunConfig {
    id: string
    name: string
    currentTargetKm: number
    progressionType: ProgressionType
    progressionValue: number   // km if fixed, % if percentage
    maxKm?: number
    history: RunEntry[]
    createdAt: string
    updatedAt: string
}