const state = {
    data: null,
    cfg: null,
    remoteSha: null,
    currentTab: "today",
    modal: null,
};

function emptyData() {
    return {
        version: 2,
        tasks: [],
        todayTasks: [],
        projects: [],
        focus: [],
        projectProfiles: {},
        archivedTasks: [],
        archivedProjects: [],
        syncMeta: {
            lastSyncAt: "",
            deviceId: "pwa-" + Math.random().toString(36).slice(2, 8),
        },
    };
}

function shortId() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

function now() {
    return new Date().toISOString();
}

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function projectPct(pid) {
    const tasks = state.data.tasks.filter(
        (t) => t.projectIds.includes(pid) && !t.parentId
    );
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => t.status === "done").length;
    return Math.round((done / tasks.length) * 100);
}

function isBlocked(task) {
    if (!task.conditionIds?.length) return false;
    return task.conditionIds.some((cid) => {
        const dep = state.data.tasks.find((t) => t.id === cid);
        return dep && dep.status !== "done";
    });
}