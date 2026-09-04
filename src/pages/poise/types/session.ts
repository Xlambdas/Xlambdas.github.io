export type SessionCategory =
    | 'calisthenics'
    | 'strength'
    | 'mobility'
    | 'endurance'
    | 'hiit'
    | 'recovery'
    | 'hiking'
    | 'cycling'
    | 'swimming'
    | 'climbing'
    | 'morning-routine'
    | 'evening-routine'
    | 'running'
    | 'custom'

export type SessionBlock =
    | 'warm-up'
    | 'skill'
    | 'strength'
    | 'pull'
    | 'push'
    | 'legs'
    | 'core'
    | 'cooldown'
    | 'cardio'
    | 'free'

export interface SessionExercise {
    exerciseId: string
    order: number
    block: SessionBlock
    sets?: number
    reps?: number
    duration?: number   // seconds
    rest?: number       // seconds between sets
    notes?: string
}

export interface Session {
    id: string
    name: string
    category: SessionCategory
    estimatedDuration: number   // minutes
    difficulty: 1 | 2 | 3 | 4 | 5
    exercises: SessionExercise[]
    tags: string[]
    notes?: string
    isCustom: boolean
    createdAt: string           // ISO
    updatedAt: string           // ISO
}