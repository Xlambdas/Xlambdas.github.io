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
    // Union deleted IDs from both sides
    const deletedIds = Array.from(
        new Set([...(local.deletedIds ?? []), ...(remote.deletedIds ?? [])])
    );
    const deletedSet = new Set(deletedIds);

    // Filter deleted tasks out before merging
    const localClean  = { ...local,  tasks: local.tasks.filter((t)  => !deletedSet.has(t.id)) };
    const remoteClean = { ...remote, tasks: remote.tasks.filter((t) => !deletedSet.has(t.id)) };

    const tasks    = mergeEntities(localClean.tasks,           remoteClean.tasks);
    const projects = mergeEntities(local.projects,             remote.projects);
    const archT    = mergeEntities(local.archivedTasks,        remote.archivedTasks);
    const archP    = mergeEntities(local.archivedProjects,     remote.archivedProjects);

    const mergedTaskIds = new Set(tasks.items.map((t) => t.id));
    // Use local todayIds as the source of truth — clear is a local decision
    // Only add remote ids that don't exist locally at all (added on another device)
    const localTodaySet  = new Set(local.todayIds ?? []);
    const remoteTodayIds = (remote.todayIds ?? []).filter(
    (id) => !mergedTaskIds.has(id) || localTodaySet.has(id)
        ? localTodaySet.has(id)
        : true
    );
    const todayIds = Array.from(
    new Set([...(local.todayIds ?? []), ...remoteTodayIds])
    ).filter((id) => mergedTaskIds.has(id) && !deletedSet.has(id));

    return {
        merged: {
        ...local,
        tasks:            tasks.items,
        todayIds,
        deletedIds,
        projects:         projects.items,
        archivedTasks:    archT.items,
        archivedProjects: archP.items,
        syncMeta: { ...local.syncMeta, lastSyncAt: new Date().toISOString() },
        },
        added:   tasks.added   + projects.added,
        updated: tasks.updated + projects.updated,
    };
}