import { useState, useEffect, useCallback } from 'react'
import { db } from '../storage/db'
import type { DailyRoutineConfig } from '../types/dailyRoutine'
import type { CalendarEvent } from '../types/calendarEvent'

function generateId(): string {
    return `drc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

// 0=Mon … 6=Sun
function dayIndexFromStr(dateStr: string): number {
    const [y, m, d] = dateStr.split('-').map(Number)
    const day = new Date(y, m - 1, d).getDay()   // 0=Sun
    return day === 0 ? 6 : day - 1
}

// Derive a virtual CalendarEvent from a DailyRoutineConfig + date
export function configToVirtualEvent(cfg: DailyRoutineConfig, date: string): CalendarEvent {
    return {
        id: `daily-${cfg.id}-${date}`,
        date,
        type: 'routine',
        refId: cfg.routineId,
        variantId: cfg.variantId,
        status: 'planned',
        source: 'daily',
        createdAt: cfg.createdAt,
    }
}

interface UseDailyRoutinesReturn {
    configs: DailyRoutineConfig[]
    loading: boolean
    saveConfig: (cfg: DailyRoutineConfig) => Promise<void>
    deleteConfig: (id: string) => Promise<void>
    toggleConfig: (id: string) => Promise<void>
    virtualEventsForDate: (date: string) => CalendarEvent[]
    createConfig: (partial: Omit<DailyRoutineConfig, 'id' | 'createdAt'>) => Promise<void>
}

export function useDailyRoutines(): UseDailyRoutinesReturn {
    const [configs, setConfigs] = useState<DailyRoutineConfig[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        db.dailyRoutineConfigs
            .getAll()
            .then(setConfigs)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const saveConfig = useCallback(async (cfg: DailyRoutineConfig) => {
        await db.dailyRoutineConfigs.save(cfg)
        setConfigs(prev => [...prev.filter(c => c.id !== cfg.id), cfg])
    }, [])

    const deleteConfig = useCallback(async (id: string) => {
        await db.dailyRoutineConfigs.delete(id)
        setConfigs(prev => prev.filter(c => c.id !== id))
    }, [])

    const toggleConfig = useCallback(async (id: string) => {
        setConfigs(prev => {
            const next = prev.map(c => {
                if (c.id !== id) return c
                const updated = { ...c, active: !c.active }
                db.dailyRoutineConfigs.save(updated).catch(console.error)
                return updated
            })
            return next
        })
    }, [])

    const createConfig = useCallback(
        async (partial: Omit<DailyRoutineConfig, 'id' | 'createdAt'>) => {
            const cfg: DailyRoutineConfig = {
                ...partial,
                id: generateId(),
                createdAt: new Date().toISOString(),
            }
            await db.dailyRoutineConfigs.save(cfg)
            setConfigs(prev => [...prev, cfg])
        },
        []
    )

    // Derive virtual events for a given date from active configs
    const virtualEventsForDate = useCallback(
        (date: string): CalendarEvent[] => {
            const dayIdx = dayIndexFromStr(date)
            return configs
                .filter(cfg => {
                    if (!cfg.active) return false
                    // activeDays empty = every day
                    if (cfg.activeDays.length === 0) return true
                    return cfg.activeDays.includes(dayIdx)
                })
                .sort((a, b) => {
                    // morning first, then midday, then evening
                    const order = { morning: 0, midday: 1, evening: 2 }
                    return (order[a.slot] ?? 1) - (order[b.slot] ?? 1)
                })
                .map(cfg => configToVirtualEvent(cfg, date))
        },
        [configs]
    )

    return {
        configs,
        loading,
        saveConfig,
        deleteConfig,
        toggleConfig,
        virtualEventsForDate,
        createConfig,
    }
}