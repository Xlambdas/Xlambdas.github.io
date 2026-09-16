export interface Task {
    id: string;
    displayId: string;
    title: string;
    description?: string;
    projectIds: string[];
    parentId?: string;
    subtaskIds: string[];
    conditionIds: string[];
    status: 'todo' | 'done';
    duration?: number;
    deadline?: string;
    recurrence?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

export interface Project {
    id: string;
    displayId: string;
    title: string;
    description?: string;
    status: 'active' | 'done';
    deadline?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SyncMeta {
    lastSyncAt: string;
    deviceId: string;
}

export interface AppData {
    version: 2;
    tasks: Task[];
    todayTasks: Task[];
    projects: Project[];
    focus: string[];
    projectProfiles: Record<string, unknown>;
    archivedTasks: Task[];
    archivedProjects: Project[];
    syncMeta: SyncMeta;
}

export interface GitHubConfig {
    token: string;
    owner: string;
    repo: string;
    branch: string;
    path: string;
}

export type TabId = 'today' | 'inbox' | 'focus' | 'projects' | 'settings';