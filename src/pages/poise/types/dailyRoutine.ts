export interface DailyRoutineConfig {
    id: string
    slot: 'morning' | 'evening' | 'midday'
    routineId: string
    variantId: string
    activeDays: number[]   // 0=Mon … 6=Sun, empty = every day
    active: boolean
    createdAt: string
}