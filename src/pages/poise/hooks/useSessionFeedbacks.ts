import { useState, useEffect, useCallback } from 'react'
import { db } from '../storage/db'
import type { SessionFeedback, PerceivedExertion } from '../types/sessionFeedback'

function generateId(): string {
    return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

interface UseSessionFeedbacksReturn {
    feedbacks: SessionFeedback[]
    loading: boolean
    addFeedback: (
        eventId: string,
        date: string,
        perceivedExertion: PerceivedExertion,
        windowId?: string,
        notes?: string
    ) => Promise<SessionFeedback>
    getFeedbackForEvent: (eventId: string) => SessionFeedback | undefined
}

export function useSessionFeedbacks(): UseSessionFeedbacksReturn {
    const [feedbacks, setFeedbacks] = useState<SessionFeedback[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        db.sessionFeedbacks
            .getAll()
            .then(setFeedbacks)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const addFeedback = useCallback(async (
        eventId: string,
        date: string,
        perceivedExertion: PerceivedExertion,
        windowId?: string,
        notes?: string
    ): Promise<SessionFeedback> => {
        const fb: SessionFeedback = {
            id: generateId(),
            eventId,
            date,
            perceivedExertion,
            windowId,
            notes,
            createdAt: new Date().toISOString(),
        }
        await db.sessionFeedbacks.save(fb)
        setFeedbacks(prev => [...prev, fb])
        return fb
    }, [])

    const getFeedbackForEvent = useCallback(
        (eventId: string) => feedbacks.find(f => f.eventId === eventId),
        [feedbacks]
    )

    return { feedbacks, loading, addFeedback, getFeedbackForEvent }
}