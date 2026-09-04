export type ExerciseCategory =
    | 'strength'
    | 'skill'
    | 'mobility'
    | 'endurance'
    | 'recovery'
    | 'warmup'

export type ExerciseType =
    | 'reps'
    | 'timed'
    | 'duration'

export type Equipment =
    | 'none'
    | 'pull-up-bar'
    | 'rings'
    | 'parallettes'
    | 'resistance-band'
    | 'bike'
    | 'rope'

export type BodyArea =
    | 'full-body'
    | 'upper-body'
    | 'lower-body'
    | 'core'
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'arms'
    | 'wrists'
    | 'hips'
    | 'legs'
    | 'ankles'
    | 'spine'

export interface Exercise {
    id: string
    name: string
    category: ExerciseCategory
    type: ExerciseType
    difficulty: 1 | 2 | 3 | 4 | 5
    targetAreas: BodyArea[]
    equipment: Equipment[]
    duration?: number       // seconds — for timed / duration exercises
    defaultReps?: number
    defaultSets?: number
    instructions: string[]
    cues: string[]
    tags: string[]
    contraindications?: string[]
    progressions?: string[] // ids of harder variants
    regressions?: string[]  // ids of easier variants
    isCustom: boolean
    notes?: string
}