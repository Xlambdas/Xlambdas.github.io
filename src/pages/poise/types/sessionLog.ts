export interface SetLog {
    setNumber: number
    completedAt: string   // ISO
    reps?: number         // actual reps done
    duration?: number     // actual seconds
}

export interface ExerciseLog {
    exerciseId: string
    setLogs: SetLog[]
    skipped: boolean
}

export interface SessionLog {
    id: string
    sessionId: string
    startedAt: string
    completedAt?: string
    status: 'in-progress' | 'completed' | 'abandoned'
    exerciseLogs: ExerciseLog[]
}