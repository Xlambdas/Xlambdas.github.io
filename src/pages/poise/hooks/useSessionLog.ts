import { useState, useCallback, useRef } from 'react'
import { db } from '../storage/db'
import type { SessionLog, SetLog } from '../types/sessionLog'
import type { Session } from '../types/session'

function generateLogId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function buildInitialLog(session: Session): SessionLog {
    return {
        id: generateLogId(),
        sessionId: session.id,
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        exerciseLogs: session.exercises
            .sort((a, b) => a.order - b.order)
            .map(ex => ({
                exerciseId: ex.exerciseId,
                setLogs: [],
                skipped: false,
            })),
    }
}

interface UseSessionLogReturn {
    log: SessionLog | null
    startLog: (session: Session) => SessionLog
    completeSet: (exerciseId: string, setNumber: number, data?: { reps?: number; duration?: number }) => void
    skipExercise: (exerciseId: string) => void
    finishSession: () => Promise<void>
    abandonSession: () => Promise<void>
    elapsedSeconds: number
}

export function useSessionLog(): UseSessionLogReturn {
    const [log, setLog] = useState<SessionLog | null>(null)
    const [startTime] = useState<number>(Date.now())
    const logRef = useRef<SessionLog | null>(null)

    // Keep ref in sync so callbacks always have latest log
    function updateLog(next: SessionLog) {
        logRef.current = next
        setLog(next)
        // Persist every change
        db.sessionLogs.save(next).catch(console.error)
    }

    const startLog = useCallback((session: Session): SessionLog => {
        const initial = buildInitialLog(session)
        updateLog(initial)
        return initial
    }, [])

    const completeSet = useCallback((
        exerciseId: string,
        setNumber: number,
        data?: { reps?: number; duration?: number }
    ) => {
        const current = logRef.current
        if (!current) return

        const setLog: SetLog = {
            setNumber,
            completedAt: new Date().toISOString(),
            ...data,
        }

        const next: SessionLog = {
            ...current,
            exerciseLogs: current.exerciseLogs.map(el =>
                el.exerciseId === exerciseId
                    ? { ...el, setLogs: [...el.setLogs, setLog] }
                    : el
            ),
        }
        updateLog(next)
    }, [])

    const skipExercise = useCallback((exerciseId: string) => {
        const current = logRef.current
        if (!current) return
        const next: SessionLog = {
            ...current,
            exerciseLogs: current.exerciseLogs.map(el =>
                el.exerciseId === exerciseId ? { ...el, skipped: true } : el
            ),
        }
        updateLog(next)
    }, [])

    const finishSession = useCallback(async () => {
        const current = logRef.current
        if (!current) return
        const next: SessionLog = {
            ...current,
            status: 'completed',
            completedAt: new Date().toISOString(),
        }
        updateLog(next)
    }, [])

    const abandonSession = useCallback(async () => {
        const current = logRef.current
        if (!current) return
        const next: SessionLog = {
            ...current,
            status: 'abandoned',
            completedAt: new Date().toISOString(),
        }
        updateLog(next)
    }, [])

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)

    return {
        log,
        startLog,
        completeSet,
        skipExercise,
        finishSession,
        abandonSession,
        elapsedSeconds,
    }
}