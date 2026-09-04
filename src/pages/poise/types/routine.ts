export type RoutineCategory =
    | 'morning'
    | 'evening'
    | 'pre-run'
    | 'pre-hike'
    | 'pre-climb'
    | 'post-workout'
    | 'recovery'
    | 'custom'

export interface RoutineExercise {
    exerciseId: string
    order: number
    type: 'timed' | 'reps'
    durationSeconds?: number   // if timed
    reps?: number              // if reps
    restSeconds?: number       // optional rest after this exercise
    notes?: string
}

export interface RoutineVariant {
    id: string                 // 'micro' | 'short' | 'normal'
    label: string              // 'Micro' | 'Short' | 'Normal'
    durationMinutes: number
    exercises: RoutineExercise[]
}

export interface Routine {
    id: string
    name: string
    category: RoutineCategory
    description?: string
    variants: RoutineVariant[]
    tags: string[]
    isCustom: boolean
    createdAt: string
    updatedAt: string
}