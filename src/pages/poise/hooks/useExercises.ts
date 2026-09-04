import { useState, useEffect, useCallback, useMemo } from 'react'
import { db } from '../storage/db'
import { SEED_EXERCISES } from '../data/exercises'
import type { Exercise } from '../types/exercise'

interface UseExercisesReturn {
    exercises: Exercise[]        // seed + custom merged, sorted by name
    loading: boolean
    error: string | null
    saveExercise: (exercise: Exercise) => Promise<void>
    deleteExercise: (id: string) => Promise<void>
    getById: (id: string) => Exercise | undefined
}

export function useExercises(): UseExercisesReturn {
    const [customExercises, setCustomExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load custom exercises from IndexedDB on mount
    useEffect(() => {
        db.exercises
            .getAll()
            .then(setCustomExercises)
            .catch(err => setError(err.message ?? 'Failed to load exercises'))
            .finally(() => setLoading(false))
    }, [])

    // Merge seed + custom. Custom exercises override seed if same id (shouldn't happen, but safe).
    const exercises = useMemo<Exercise[]>(
        () => [
            ...SEED_EXERCISES.filter(s => !customExercises.some(c => c.id === s.id)),
            ...customExercises,
        ].sort((a, b) => a.name.localeCompare(b.name)),
        [customExercises]
    )

    const saveExercise = useCallback(async (exercise: Exercise) => {
        await db.exercises.save(exercise)
        setCustomExercises(prev => {
            const filtered = prev.filter(e => e.id !== exercise.id)
            return [...filtered, exercise]
        })
    }, [])

    const deleteExercise = useCallback(async (id: string) => {
        await db.exercises.delete(id)
        setCustomExercises(prev => prev.filter(e => e.id !== id))
    }, [])

    const getById = useCallback(
        (id: string) => exercises.find(e => e.id === id),
        [exercises]
    )

    return { exercises, loading, error, saveExercise, deleteExercise, getById }
}