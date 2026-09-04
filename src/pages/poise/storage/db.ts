import type { Exercise } from '../types/exercise'
import type { Session } from '../types/session'
import type { SessionLog } from '../types/sessionLog'
import type { Routine } from '../types/routine'
import type { CalendarEvent } from '../types/calendarEvent'
import type { UserPreferences } from '../types/preferences'
import type { DailyRoutineConfig } from '../types/dailyRoutine'
import type { RunConfig } from '../types/runConfig'
import type { SessionFeedback } from '../types/sessionFeedback'

const DB_NAME = 'poise'
const DB_VERSION = 9
const STORES = {
    exercises: 'exercises',
    sessions: 'sessions',
    sessionLogs: 'session_logs',
    routines: 'routines',
    calendarEvents: 'calendar_events',
    userPreferences: 'user_preferences',
    dailyRoutineConfigs: 'daily_routine_configs',
    runConfigs: 'run_configs',
    sessionFeedbacks: 'session_feedback',
}

let _db: IDBDatabase | null = null

if (typeof window !== 'undefined') {
    (window as any).poise_resetDB = () => {
        indexedDB.deleteDatabase('poise')
        window.location.reload()
    }
}

function openDB(): Promise<IDBDatabase> {
    if (_db) return Promise.resolve(_db)
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            Object.values(STORES).forEach(name => {
                if (!db.objectStoreNames.contains(name)) {
                    if (name === STORES.userPreferences) {
                        db.createObjectStore(name)
                    } else {
                        db.createObjectStore(name, { keyPath: 'id' })
                    }
                }
            })
        }
        request.onsuccess = (event) => {
            _db = (event.target as IDBOpenDBRequest).result
            resolve(_db)
        }
        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error)
        }
    })
}

function tx(
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest
): Promise<unknown> {
    return openDB().then(
        db => new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, mode)
            const store = transaction.objectStore(storeName)
            const request = fn(store)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    )
}

function txAll<T>(storeName: string): Promise<T[]> {
    return openDB().then(
        db => new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly')
            const store = transaction.objectStore(storeName)
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result as T[])
            request.onerror = () => reject(request.error)
        })
    )
}

function crud<T extends { id: string }>(storeName: string) {
    return {
        getAll: (): Promise<T[]> => txAll<T>(storeName),
        getById: (id: string): Promise<T | undefined> =>
            tx(storeName, 'readonly', s => s.get(id)) as Promise<T | undefined>,
        save: (e: T): Promise<void> =>
            tx(storeName, 'readwrite', s => s.put(e)) as Promise<void>,
        delete: (id: string): Promise<void> =>
            tx(storeName, 'readwrite', s => s.delete(id)) as Promise<void>,
    }
}

const PREFS_KEY = 'prefs'

export const db = {
    exercises: crud<Exercise>(STORES.exercises),
    sessions: crud<Session>(STORES.sessions),
    sessionLogs: crud<SessionLog>(STORES.sessionLogs),
    routines: crud<Routine>(STORES.routines),
    calendarEvents: crud<CalendarEvent>(STORES.calendarEvents),
    dailyRoutineConfigs: crud<DailyRoutineConfig>(STORES.dailyRoutineConfigs),
    runConfigs: crud<RunConfig>(STORES.runConfigs),
    sessionFeedbacks: crud<SessionFeedback>(STORES.sessionFeedbacks),
    preferences: {
        get: (): Promise<UserPreferences | undefined> =>
            tx(STORES.userPreferences, 'readonly', s => s.get(PREFS_KEY)) as Promise<UserPreferences | undefined>,
        save: (prefs: UserPreferences): Promise<void> =>
            tx(STORES.userPreferences, 'readwrite', s => s.put(prefs, PREFS_KEY)) as Promise<void>,
    },
}