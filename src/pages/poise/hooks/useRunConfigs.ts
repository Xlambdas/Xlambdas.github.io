import { useState, useEffect, useCallback, useMemo } from 'react'
import { db } from '../storage/db'
import type { RunConfig, RunEntry } from '../types/runConfig'

function generateId(): string {
    return `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function computeNextTarget(config: RunConfig, entry: RunEntry): number {
    if (!entry.counted) return config.currentTargetKm
    const base = entry.actualKm
    const next = config.progressionType === 'fixed'
        ? base + config.progressionValue
        : base * (1 + config.progressionValue / 100)
    const rounded = Math.round(next * 10) / 10
    return config.maxKm ? Math.min(rounded, config.maxKm) : rounded
}

interface UseRunConfigsReturn {
    runConfigs: RunConfig[]
    loading: boolean
    saveRunConfig: (cfg: RunConfig) => Promise<void>
    deleteRunConfig: (id: string) => Promise<void>
    logRun: (configId: string, entry: RunEntry) => Promise<void>
    createRunConfig: (partial: Omit<RunConfig, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Promise<RunConfig>
    getById: (id: string) => RunConfig | undefined
}

export function useRunConfigs(): UseRunConfigsReturn {
    const [runConfigs, setRunConfigs] = useState<RunConfig[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        db.runConfigs
            .getAll()
            .then(setRunConfigs)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const saveRunConfig = useCallback(async (cfg: RunConfig) => {
        await db.runConfigs.save(cfg)
        setRunConfigs(prev => [...prev.filter(c => c.id !== cfg.id), cfg])
    }, [])

    const deleteRunConfig = useCallback(async (id: string) => {
        await db.runConfigs.delete(id)
        setRunConfigs(prev => prev.filter(c => c.id !== id))
    }, [])

    const logRun = useCallback(async (configId: string, entry: RunEntry) => {
        setRunConfigs(prev => {
            const next = prev.map(cfg => {
                if (cfg.id !== configId) return cfg
                const nextTarget = computeNextTarget(cfg, entry)
                const updated: RunConfig = {
                    ...cfg,
                    currentTargetKm: nextTarget,
                    history: [...cfg.history, entry],
                    updatedAt: new Date().toISOString(),
                }
                db.runConfigs.save(updated).catch(console.error)
                return updated
            })
            return next
        })
    }, [])

    const createRunConfig = useCallback(
        async (partial: Omit<RunConfig, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Promise<RunConfig> => {
            const cfg: RunConfig = {
                ...partial,
                id: generateId(),
                history: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
            await db.runConfigs.save(cfg)
            setRunConfigs(prev => [...prev, cfg])
            return cfg
        },
        []
    )

    const getById = useCallback(
        (id: string) => runConfigs.find(c => c.id === id),
        [runConfigs]
    )

    return { runConfigs, loading, saveRunConfig, deleteRunConfig, logRun, createRunConfig, getById }
}