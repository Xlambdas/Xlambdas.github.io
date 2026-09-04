import { useState, useEffect, useCallback, useMemo } from 'react'
import { db } from '../storage/db'
import { SEED_SESSIONS } from '../data/sessions'
import type { Session } from '../types/session'

interface UseSessionsReturn {
    sessions: Session[]
    loading: boolean
    error: string | null
    saveSession: (session: Session) => Promise<void>
    deleteSession: (id: string) => Promise<void>
    getById: (id: string) => Session | undefined
}

export function useSessions(): UseSessionsReturn {
    const [customSessions, setCustomSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        db.sessions
            .getAll()
            .then(setCustomSessions)
            .catch(err => setError(err.message ?? 'Failed to load sessions'))
            .finally(() => setLoading(false))
    }, [])

    // Merge seed + custom. Custom overrides seed if same id.
    const sessions = useMemo<Session[]>(
        () => [
            ...SEED_SESSIONS.filter(s => !customSessions.some(c => c.id === s.id)),
            ...customSessions,
        ].sort((a, b) => a.name.localeCompare(b.name)),
        [customSessions]
    )

    const saveSession = useCallback(async (session: Session) => {
        await db.sessions.save(session)
        setCustomSessions(prev => {
            const filtered = prev.filter(s => s.id !== session.id)
            return [...filtered, session]
        })
    }, [])

    const deleteSession = useCallback(async (id: string) => {
        await db.sessions.delete(id)
        setCustomSessions(prev => prev.filter(s => s.id !== id))
    }, [])

    const getById = useCallback(
        (id: string) => sessions.find(s => s.id === id),
        [sessions]
    )

    return { sessions, loading, error, saveSession, deleteSession, getById }
}