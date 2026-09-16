function mergeEntities(localArr, remoteArr) {
    const result = new Map();
    for (const item of localArr) result.set(item.id, item);
    let added = 0, updated = 0;
    for (const remote of remoteArr) {
        const local = result.get(remote.id);
        if (!local) { result.set(remote.id, remote); added++; continue; }
        if (new Date(remote.updatedAt) > new Date(local.updatedAt)) {
            result.set(remote.id, remote); updated++;
        }
    }
    return { items: Array.from(result.values()), added, updated };
}

function mergeData(local, remote) {
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