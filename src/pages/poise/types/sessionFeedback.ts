export type PerceivedExertion = 1 | 2 | 3 | 4 | 5

export interface SessionFeedback {
    id: string
    eventId: string
    date: string
    perceivedExertion: PerceivedExertion
    windowId?: string     // which activity window this came from
    notes?: string
    createdAt: string
}