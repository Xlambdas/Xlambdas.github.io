export interface CalendarEvent {
    id: string
    date: string
    type: 'session' | 'routine' | 'activity'
    refId: string
    variantId?: string
    status: 'planned' | 'completed' | 'skipped'
    source: 'manual' | 'planner' | 'daily'
    plannedKm?: number       // for run activity slots
    createdAt: string
}