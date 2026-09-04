import { useCallback, useRef } from 'react'
import { runPlanner } from '../engine/scheduler'
import { db } from '../storage/db'
import { useCalendarEvents } from './useCalendarEvents'
import { useSessions } from './useSessions'
import { usePreferences } from './usePreferences'
import { useRunConfigs } from './useRunConfigs'
import { useSessionFeedbacks } from './useSessionFeedbacks'
import type { SessionLog } from '../types/sessionLog'

function toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function usePlanner() {
    const { clearFuturePlannerEvents, bulkAddEvents } = useCalendarEvents()
    const { sessions } = useSessions()
    const { prefs } = usePreferences()
    const { runConfigs } = useRunConfigs()
    const { feedbacks } = useSessionFeedbacks()
    const isRunning = useRef(false)

    const replan = useCallback(async (sessionLogs: SessionLog[] = []) => {
        if (isRunning.current) return
        isRunning.current = true
        try {
            const today = new Date()
            const todayStr = toDateStr(today)

            // Step 1: clear future planned events
            await clearFuturePlannerEvents(todayStr)

            // Step 2: read FRESH events directly from DB — avoids stale closure
            const freshEvents = await db.calendarEvents.getAll()

            // Step 3: run planner with fresh state
            const planned = runPlanner(
                prefs,
                freshEvents,
                sessions,
                sessionLogs,
                runConfigs,
                feedbacks,
            )

            // Step 4: bulk write
            if (planned.length > 0) {
                await bulkAddEvents(planned.map(p => ({
                    date: p.date,
                    type: p.type,
                    refId: p.refId,
                    source: p.source,
                    status: p.status,
                    plannedKm: p.plannedKm,
                })))
            }
        } finally {
            isRunning.current = false
        }
    }, [sessions, prefs, runConfigs, feedbacks, clearFuturePlannerEvents, bulkAddEvents])

    return { replan }
}