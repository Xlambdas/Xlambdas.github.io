import { useState, useEffect, useCallback, useMemo } from 'react'
import { db } from '../storage/db'
import { SEED_ROUTINES } from '../data/routines'
import type { Routine } from '../types/routine'

interface UseRoutinesReturn {
    routines: Routine[]
    loading: boolean
    error: string | null
    saveRoutine: (routine: Routine) => Promise<void>
    deleteRoutine: (id: string) => Promise<void>
    getById: (id: string) => Routine | undefined
}

export function useRoutines(): UseRoutinesReturn {
    const [customRoutines, setCustomRoutines] = useState<Routine[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        db.routines
            .getAll()
            .then(setCustomRoutines)
            .catch(err => setError(err.message ?? 'Failed to load routines'))
            .finally(() => setLoading(false))
    }, [])

    const routines = useMemo<Routine[]>(
        () => [
            ...SEED_ROUTINES.filter(s => !customRoutines.some(c => c.id === s.id)),
            ...customRoutines,
        ].sort((a, b) => a.name.localeCompare(b.name)),
        [customRoutines]
    )

    const saveRoutine = useCallback(async (routine: Routine) => {
        await db.routines.save(routine)
        setCustomRoutines(prev => [...prev.filter(r => r.id !== routine.id), routine])
    }, [])

    const deleteRoutine = useCallback(async (id: string) => {
        await db.routines.delete(id)
        setCustomRoutines(prev => prev.filter(r => r.id !== id))
    }, [])

    const getById = useCallback(
        (id: string) => routines.find(r => r.id === id),
        [routines]
    )

    return { routines, loading, error, saveRoutine, deleteRoutine, getById }
}