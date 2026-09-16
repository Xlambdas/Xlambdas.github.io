import type { AppData } from './types';

export function shortId(): string {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 8);
}

export function nowISO(): string {
    return new Date().toISOString();
}

export function emptyData(): AppData {
    return {
        version: 2,
        tasks: [],
        todayIds: [],
        projects: [],
        focus: [],
        projectProfiles: {},
        archivedTasks: [],
        archivedProjects: [],
        syncMeta: {
            lastSyncAt: '',
            deviceId: 'pwa-' + Math.random().toString(36).slice(2, 8),
        },
    };
}

export function projectPct(data: AppData, pid: string): number {
    const tasks = data.tasks.filter(
        (t) => t.projectIds.includes(pid) && !t.parentId
    );
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => t.status === 'done').length;
    return Math.round((done / tasks.length) * 100);
}

export function isBlocked(data: AppData, task: AppData['tasks'][0]): boolean {
    if (!task.conditionIds?.length) return false;
    return task.conditionIds.some((cid) => {
        const dep = data.tasks.find((t) => t.id === cid);
        return dep && dep.status !== 'done';
    });
}

export function formatSyncLabel(lastSyncAt: string): string {
    if (!lastSyncAt) return 'never synced';
    const diff = Math.floor((Date.now() - new Date(lastSyncAt).getTime()) / 60000);
    if (diff < 1) return 'synced now';
    if (diff < 60) return `${diff}m ago`;
    return new Date(lastSyncAt).toLocaleDateString();
}