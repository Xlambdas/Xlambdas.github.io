import type { AppData } from '../types';

interface MergeResult {
    merged: AppData;
    added: number;
    updated: number;
}

function mergeEntities<T extends { id: string; updatedAt: string }>(
    local: T[],
    remote: T[]
): { items: T[]; added: number; updated: number } {
    const map = new Map<string, T>();
    for (const item of local) map.set(item.id, item);
    let added = 0, updated = 0;
    for (const r of remote) {
        const l = map.get(r.id);
        if (!l) { map.set(r.id, r); added++; continue; }
        if (new Date(r.updatedAt) > new Date(l.updatedAt)) {
            map.set(r.id, r); updated++;
        }
    }
    return { items: Array.from(map.values()), added, updated };
}

export function mergeData(local: AppData, remote: AppData): MergeResult {
    const tasks = mergeEntities(local.tasks, remote.tasks);
    const today = mergeEntities(local.todayTasks, remote.todayTasks);
    const projects = mergeEntities(local.projects, remote.projects);
    const archT = mergeEntities(local.archivedTasks, remote.archivedTasks);
    const archP = mergeEntities(local.archivedProjects, remote.archivedProjects);
    return {
        merged: {
            ...local,
            tasks: tasks.items,
            todayTasks: today.items,
            projects: projects.items,
            archivedTasks: archT.items,
            archivedProjects: archP.items,
            syncMeta: { ...local.syncMeta, lastSyncAt: new Date().toISOString() },
        },
        added: tasks.added + today.added + projects.added,
        updated: tasks.updated + today.updated + projects.updated,
    };
}