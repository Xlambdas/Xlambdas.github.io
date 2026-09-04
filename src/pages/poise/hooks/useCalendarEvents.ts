import { useState, useEffect, useCallback, useMemo } from 'react'
import { db } from '../storage/db'
import type { CalendarEvent } from '../types/calendarEvent'

function generateId(): string {
    return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface UseCalendarEventsReturn {
    events: CalendarEvent[]
    loading: boolean
    eventsForDate: (date: string) => CalendarEvent[]
    eventsForMonth: (year: number, month: number) => CalendarEvent[]
    addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<CalendarEvent>
    updateStatus: (id: string, status: CalendarEvent['status']) => Promise<void>
    removeEvent: (id: string) => Promise<void>
    // Planner operations
    clearFuturePlannerEvents: (fromDate: string) => Promise<void>
    bulkAddEvents: (events: Omit<CalendarEvent, 'id' | 'createdAt'>[]) => Promise<void>
}

export function useCalendarEvents(): UseCalendarEventsReturn {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        db.calendarEvents
            .getAll()
            .then(setEvents)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const byDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>()
        for (const evt of events) {
            const list = map.get(evt.date) ?? []
            list.push(evt)
            map.set(evt.date, list)
        }
        return map
    }, [events])

    const eventsForDate = useCallback(
        (date: string) => byDate.get(date) ?? [],
        [byDate]
    )

    const eventsForMonth = useCallback(
        (year: number, month: number) => {
            const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
            return events.filter(e => e.date.startsWith(prefix))
        },
        [events]
    )

    const addEvent = useCallback(
        async (event: Omit<CalendarEvent, 'id' | 'createdAt'>): Promise<CalendarEvent> => {
            const full: CalendarEvent = {
                ...event,
                id: generateId(),
                createdAt: new Date().toISOString(),
            }
            await db.calendarEvents.save(full)
            setEvents(prev => [...prev, full])
            return full
        },
        []
    )

    const updateStatus = useCallback(
        async (id: string, status: CalendarEvent['status']) => {
            setEvents(prev =>
                prev.map(e => {
                    if (e.id !== id) return e
                    const updated = { ...e, status }
                    db.calendarEvents.save(updated).catch(console.error)
                    return updated
                })
            )
        },
        []
    )

    const removeEvent = useCallback(async (id: string) => {
        await db.calendarEvents.delete(id)
        setEvents(prev => prev.filter(e => e.id !== id))
    }, [])

    // Remove all future planner events (planned only — keep completed/skipped as history)
    const clearFuturePlannerEvents = useCallback(async (fromDate: string) => {
        const toRemove = events.filter(
            e => e.source === 'planner' && e.date >= fromDate && e.status === 'planned'
        )
        await Promise.all(toRemove.map(e => db.calendarEvents.delete(e.id)))
        setEvents(prev => prev.filter(e => !toRemove.some(r => r.id === e.id)))
    }, [events])

    // Save a batch of planner-generated events at once
    const bulkAddEvents = useCallback(
        async (newEvents: Omit<CalendarEvent, 'id' | 'createdAt'>[]) => {
            const full: CalendarEvent[] = newEvents.map(e => ({
                ...e,
                id: generateId(),
                createdAt: new Date().toISOString(),
            }))
            await Promise.all(full.map(e => db.calendarEvents.save(e)))
            setEvents(prev => [...prev, ...full])
        },
        []
    )

    return {
        events, loading, eventsForDate, eventsForMonth,
        addEvent, updateStatus, removeEvent,
        clearFuturePlannerEvents, bulkAddEvents,
    }
}