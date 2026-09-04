import { useState, useEffect, useCallback } from 'react'
import { db } from '../storage/db'
import { DEFAULT_PREFERENCES } from '../types/preferences'
import type { UserPreferences } from '../types/preferences'

interface UsePreferencesReturn {
    prefs: UserPreferences
    loading: boolean
    savePrefs: (next: UserPreferences) => Promise<void>
}

export function usePreferences(): UsePreferencesReturn {
    const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        db.preferences
            .get()
            .then(stored => { if (stored) setPrefs(stored) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const savePrefs = useCallback(async (next: UserPreferences) => {
        setPrefs(next)
        await db.preferences.save(next)
    }, [])

    return { prefs, loading, savePrefs }
}