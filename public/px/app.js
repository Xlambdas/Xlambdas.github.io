// ============================================================
// PX PWA — app.js
// Local-first task manager synced via GitHub Contents API
// ============================================================

// ── IndexedDB ──────────────────────────────────────────────

const DB_NAME = "px-pwa";
const DB_VERSION = 1;
let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("store")) {
                db.createObjectStore("store");
            }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = () => reject(req.error);
    });
}

async function dbGet(key) {
    const tx = db.transaction("store", "readonly");
    return new Promise((resolve) => {
        const req = tx.objectStore("store").get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });
}

async function dbSet(key, value) {
    const tx = db.transaction("store", "readwrite");
    return new Promise((resolve) => {
        tx.objectStore("store").put(value, key);
        tx.oncomplete = resolve;
    });
}

// ── GitHub API ─────────────────────────────────────────────

async function ghRead(cfg) {
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}?ref=${cfg.branch}&t=${Date.now()}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${cfg.token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub read ${res.status}`);
    const file = await res.json();
    const text = atob(file.content.replace(/\n/g, ""));
    return { data: JSON.parse(text), sha: file.sha };
}

async function ghWrite(cfg, data, sha, message = "px sync (pwa)") {
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const body = { message, content, branch: cfg.branch };
    if (sha) body.sha = sha;
    const res = await fetch(
        `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${cfg.token}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );
    if (!res.ok) {
        const err = await res.json();
        throw new Error(`GitHub write ${res.status}: ${err.message}`);
    }
}

// ── Merge (mirrors syncService.ts) ─────────────────────────

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
    const added = tasks.added + today.added + projects.added;
    const updated = tasks.updated + today.updated + projects.updated;
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
        added,
        updated,
    };
}

// ── State ──────────────────────────────────────────────────

let state = {
    data: null,         // AppData
    cfg: null,          // GitHub config
    remoteSha: null,    // current SHA of remote file
    currentTab: "today",
    modal: null,        // { task, isToday }
};

// ── Notifications ──────────────────────────────────────────

const NOTIF_PERMISSION_KEY = "px-notif-permission";
const NOTIF_SETTINGS_KEY = "px-notif-settings";

function defaultNotifSettings() {
    return {
        enabled: false,
        morningTime: "09:00",    // daily focus reminder
        eveningTime: "19:00",    // daily sync reminder
        deadlineWarning: true,   // warn on tasks due today
    };
}

function loadNotifSettings() {
    try {
        const s = localStorage.getItem(NOTIF_SETTINGS_KEY);
        return s ? { ...defaultNotifSettings(), ...JSON.parse(s) } : defaultNotifSettings();
    } catch {
        return defaultNotifSettings();
    }
}

function saveNotifSettings(settings) {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
}

// Ask for notification permission
async function requestNotifPermission() {
    if (!("Notification" in window)) {
        showToast("Notifications not supported on this browser");
        return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") {
        showToast("Notifications blocked — enable in browser settings");
        return false;
    }
    const result = await Notification.requestPermission();
    return result === "granted";
}

// Send a message to the SW to schedule a notification
async function scheduleNotif({ title, body, delayMs, tag }) {
    if (Notification.permission !== "granted") return;

    try {
        const reg = await navigator.serviceWorker.ready;

        setTimeout(async () => {
            try {
                await reg.showNotification(title, {
                    body,
                    tag,
                    renotify: false,
                    icon: generateIconDataUrl(),
                    badge: generateIconDataUrl(),
                    vibrate: [200, 100, 200],
                    data: { url: "/px/" },
                });
            } catch (err) {
                console.warn("showNotification failed:", err);
                // Fallback: plain Notification API
                new Notification(title, { body, tag, icon: generateIconDataUrl() });
            }
        }, delayMs);
    } catch (err) {
        console.warn("SW not ready:", err);
        // Fallback if SW unavailable
        setTimeout(() => {
            try { new Notification(title, { body, tag }); } catch { }
        }, delayMs);
    }
}

// Schedule a notification at a specific time today (or tomorrow if past)
async function scheduleAt(timeStr, title, body, tag) {
    const [h, m] = timeStr.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const delayMs = target - now;
    await scheduleNotif({ title, body, delayMs, tag });
}

// Check for tasks due today and notify
async function scheduleDeadlineNotifs() {
    const today = new Date().toISOString().slice(0, 10);
    const due = state.data.tasks.filter(
        (t) => t.status === "todo" && t.deadline === today
    );
    if (!due.length) return;

    const names = due.slice(0, 3).map((t) => t.title).join(", ");
    const extra = due.length > 3 ? ` +${due.length - 3} more` : "";

    // Fire in 5 seconds so it doesn't feel instant on open
    await scheduleNotif({
        title: `PX — ${due.length} task${due.length > 1 ? "s" : ""} due today`,
        body: names + extra,
        delayMs: 5000,
        tag: "px-deadline",
    });
}

// Main entry point — call on boot and after settings save
async function setupNotifications() {
    const settings = loadNotifSettings();
    if (!settings.enabled) return;
    if (Notification.permission !== "granted") return;

    const focusCount = state.data.tasks.filter(
        (t) => t.projectIds.some((pid) => state.data.focus.includes(pid)) && t.status === "todo"
    ).length;

    await scheduleAt(
        settings.morningTime,
        "PX — Good morning",
        focusCount > 0
            ? `You have ${focusCount} focus task${focusCount > 1 ? "s" : ""} today`
            : "What are you focusing on today?",
        "px-morning"
    );

    await scheduleAt(
        settings.eveningTime,
        "PX — End of day",
        "Don't forget to sync your tasks",
        "px-evening"
    );

    if (settings.deadlineWarning) {
        await scheduleDeadlineNotifs();
    }
}

async function onNotifToggle() {
    const enabled = document.getElementById("notif-enabled").checked;
    document.getElementById("notif-settings").style.display = enabled ? "block" : "none";

    if (enabled) {
        const granted = await requestNotifPermission();
        if (!granted) {
            document.getElementById("notif-enabled").checked = false;
            document.getElementById("notif-settings").style.display = "none";
            return;
        }
        showToast("✓ Notifications enabled");
    }
}

async function saveNotifSettingsUI() {
    const settings = {
        enabled: document.getElementById("notif-enabled").checked,
        morningTime: document.getElementById("notif-morning").value || "09:00",
        eveningTime: document.getElementById("notif-evening").value || "19:00",
        deadlineWarning: document.getElementById("notif-deadline").checked,
    };
    saveNotifSettings(settings);
    await setupNotifications();
    showToast("✓ Notification settings saved");
}

function loadNotifSettingsIntoUI() {
    const s = loadNotifSettings();
    document.getElementById("notif-enabled").checked = s.enabled;
    document.getElementById("notif-settings").style.display = s.enabled ? "block" : "none";
    document.getElementById("notif-morning").value = s.morningTime;
    document.getElementById("notif-evening").value = s.eveningTime;
    document.getElementById("notif-deadline").checked = s.deadlineWarning;
}

async function showOpeningNotif() {
    if (Notification.permission !== "granted") return;

    const d = state.data;
    const today = new Date().toISOString().slice(0, 10);

    const todayDue = d.tasks.filter(
        (t) => t.status === "todo" && t.deadline === today
    ).length;

    const focusCount = d.tasks.filter(
        (t) => t.projectIds.some((pid) => d.focus.includes(pid)) &&
            t.status === "todo" && !t.parentId
    ).length;

    const todayCount = d.todayTasks.filter((t) => t.status === "todo").length;

    // Build message lines
    const lines = [];
    if (focusCount > 0) lines.push(`${focusCount} focus task${focusCount > 1 ? "s" : ""}`);
    if (todayCount > 0) lines.push(`${todayCount} today task${todayCount > 1 ? "s" : ""}`);
    if (todayDue > 0) lines.push(`⚠ ${todayDue} due today`);

    if (!lines.length) return; // nothing to report — no notif

    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({
        type: "SCHEDULE_NOTIF",
        title: "PX — " + new Date().toLocaleDateString("en", { weekday: "long" }),
        body: lines.join("  ·  "),
        delayMs: 1500,   // small delay so it feels like a push, not instant
        tag: "px-open",
    });
}

async function testNotif() {
    // Step 1: check/request permission
    if (Notification.permission === "denied") {
        showToast("Blocked — enable in phone Settings → Safari → Notifications");
        return;
    }

    if (Notification.permission !== "granted") {
        const granted = await requestNotifPermission();
        if (!granted) {
            showToast("Permission denied");
            return;
        }
    }

    showToast("Notification in 3 seconds…");

    // Step 2: try SW showNotification (most reliable)
    try {
        const reg = await navigator.serviceWorker.ready;
        setTimeout(async () => {
            try {
                await reg.showNotification("PX test ✓", {
                    body: "Notifications are working",
                    tag: "px-test",
                    icon: generateIconDataUrl(),
                    vibrate: [200, 100, 200],
                });
            } catch (e) {
                console.error("SW showNotification error:", e);
                // Step 3: plain fallback
                try { new Notification("PX test ✓", { body: "Notifications are working" }); }
                catch (e2) { console.error("Notification fallback error:", e2); showToast("✗ " + e2.message); }
            }
        }, 3000);
    } catch (e) {
        console.error("SW ready error:", e);
        showToast("✗ SW not available: " + e.message);
    }
}

function generateIconDataUrl() {
    return "/px/icon.svg";
}

// In showOpeningNotif():
reg.active?.postMessage({
    type: "SCHEDULE_NOTIF",
    title: "PX — " + new Date().toLocaleDateString("en", { weekday: "long" }),
    body: lines.join("  ·  "),
    delayMs: 1500,
    tag: "px-open",
    icon: generateIconDataUrl(),   // ← add this
});

// In scheduleNotif():
async function scheduleNotif({ title, body, delayMs, tag }) {
    if (Notification.permission !== "granted") return;
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({
        type: "SCHEDULE_NOTIF",
        title,
        body,
        delayMs,
        tag,
        icon: generateIconDataUrl(),   // ← add this
    });
}

// In testNotif():
reg.active?.postMessage({
    type: "SCHEDULE_NOTIF",
    title: "PX test",
    body: "Notifications are working ✓",
    delayMs: 2000,
    tag: "px-test",
    icon: generateIconDataUrl(),   // ← add this
});

// ── Boot ───────────────────────────────────────────────────

async function boot() {
    db = await openDB();

    try {
        const saved = localStorage.getItem("px-cfg");
        if (saved) state.cfg = JSON.parse(saved);
    } catch { }

    state.data = await dbGet("data");
    if (!state.data) state.data = emptyData();

    render();
    loadNotifSettingsIntoUI();
    updateSyncLabel();

    // Register SW first, THEN schedule notifications
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/px/sw.js");
            // Wait for SW to be active before sending messages
            const reg = await navigator.serviceWorker.ready;
            if (reg.active) {
                await showOpeningNotif();
                await setupNotifications();
            }
        } catch (e) {
            console.warn("SW registration failed:", e);
        }
    }
}

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
        syncMeta: { lastSyncAt: "", deviceId: "pwa-" + Math.random().toString(36).slice(2, 8) },
    };
}

// ── Sync ───────────────────────────────────────────────────

async function triggerSync() {
    if (!state.cfg?.token) {
        showToast("Configure GitHub in Settings first");
        showTab("settings");
        return;
    }

    const btn = document.getElementById("syncBtn");
    btn.textContent = "…";
    btn.disabled = true;

    try {
        const remote = await ghRead(state.cfg);

        if (!remote) {
            // First sync — push local
            await ghWrite(state.cfg, state.data, null, "px sync: initial push (pwa)");
            state.remoteSha = null;
            showToast("✓ Initial sync done");
        } else {
            const { merged, added, updated } = mergeData(state.data, remote.data);
            state.data = merged;
            await dbSet("data", state.data);

            await ghWrite(state.cfg, state.data, remote.sha, "px sync (pwa)");

            const msg = added + updated > 0
                ? `✓ ↓${added} received  ↑ pushed`
                : "✓ Up to date";
            showToast(msg);
        }

        render();
        updateSyncLabel();
    } catch (e) {
        showToast("✗ " + e.message);
    } finally {
        btn.textContent = "Sync";
        btn.disabled = false;
    }
}

function updateSyncLabel() {
    const el = document.getElementById("syncStatus");
    const last = state.data?.syncMeta?.lastSyncAt;
    if (!last) { el.textContent = "never synced"; return; }
    const d = new Date(last);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) el.textContent = "synced now";
    else if (diff < 60) el.textContent = `${diff}m ago`;
    else el.textContent = d.toLocaleDateString();
}

// ── Save local ─────────────────────────────────────────────

async function saveLocal() {
    await dbSet("data", state.data);
}

// ── Render ─────────────────────────────────────────────────

function render() {
    renderToday();
    renderInbox();
    renderFocus();
    renderProjects();
}

function renderToday() {
    const d = state.data;

    // todayTasks
    const todayList = document.getElementById("today-list");
    if (!d.todayTasks?.length) {
        todayList.innerHTML = '<div class="empty">No tasks for today.<br>Add one below.</div>';
    } else {
        todayList.innerHTML = d.todayTasks.map((t, i) => taskItemHTML(t, true)).join("");
    }

    // focus tasks
    const focusList = document.getElementById("focus-list");
    const focusTasks = d.tasks.filter(
        (t) => t.projectIds.some((pid) => d.focus.includes(pid)) &&
            t.status === "todo" &&
            !t.parentId
    );
    if (!focusTasks.length) {
        focusList.innerHTML = '<div class="empty" style="padding:16px">No focus tasks.</div>';
    } else {
        focusList.innerHTML = focusTasks.map((t) => taskItemHTML(t, false)).join("");
    }
}

function renderInbox() {
    const inbox = state.data.tasks.filter(
        (t) => t.projectIds.length === 0 && !t.parentId
    );
    const el = document.getElementById("inbox-list");
    el.innerHTML = inbox.length
        ? inbox.map((t) => taskItemHTML(t, false)).join("")
        : '<div class="empty">Inbox is empty.</div>';
}

function renderFocus() {
    const d = state.data;
    const focused = d.projects.filter((p) => d.focus.includes(p.id));
    const el = document.getElementById("focus-projects-list");
    if (!focused.length) {
        el.innerHTML = '<div class="empty">No focused projects.<br>Tap a project to focus it.</div>';
        return;
    }
    el.innerHTML = focused.map((p) => {
        const tasks = d.tasks.filter(
            (t) => t.projectIds.includes(p.id) && !t.parentId && t.status === "todo"
        );
        return `
      <div class="project-item" onclick="toggleFocus('${p.id}')">
        <div class="project-header">
          <span class="project-name">⭐ ${esc(p.title)}</span>
          <span class="project-pct">${projectPct(p.id)}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${projectPct(p.id)}%"></div></div>
      </div>
      ${tasks.map((t) => taskItemHTML(t, false)).join("")}
    `;
    }).join("");
}

function renderProjects() {
    const d = state.data;
    const active = d.projects.filter((p) => p.status === "active");
    const el = document.getElementById("projects-list");
    if (!active.length) {
        el.innerHTML = '<div class="empty">No projects yet.</div>';
        return;
    }
    el.innerHTML = active.map((p) => {
        const pct = projectPct(p.id);
        const isFocused = d.focus.includes(p.id);
        const taskCount = d.tasks.filter(
            (t) => t.projectIds.includes(p.id) && !t.parentId && t.status === "todo"
        ).length;
        return `
      <div class="project-item" onclick="toggleFocus('${p.id}')">
        <div class="project-header">
          <span class="project-name">${isFocused ? "⭐ " : ""}${esc(p.title)}</span>
          <span class="project-pct">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="project-meta">${taskCount} task${taskCount !== 1 ? "s" : ""} remaining</div>
      </div>
    `;
    }).join("");
}

function taskItemHTML(t, isToday) {
    const blocked = isBlocked(t);
    const doneClass = t.status === "done" ? "done" : "";
    const blockedClass = blocked ? "blocked" : "";
    const check = t.status === "done" ? "✓" : "";
    const dur = t.duration ? `<span class="tag">${t.duration}m</span>` : "";
    const dl = t.deadline ? `<span class="tag">📅 ${t.deadline}</span>` : "";
    const blk = blocked ? `<span class="tag blocked">blocked</span>` : "";
    const rec = t.recurrence ? `<span class="tag">🔁 ${t.recurrence}</span>` : "";
    const proj = !isToday && t.projectIds.length
        ? t.projectIds.map((pid) => {
            const p = state.data.projects.find((x) => x.id === pid);
            return p ? `<span class="tag focus">${esc(p.title)}</span>` : "";
        }).join("")
        : "";

    return `
    <div class="task-item ${doneClass} ${blockedClass}"
         onclick="openTask('${t.id}', ${isToday})">
      <div class="task-check">${check}</div>
      <div class="task-body">
        <div class="task-title">${esc(t.title)}</div>
        <div class="task-meta">${dur}${dl}${blk}${rec}${proj}</div>
      </div>
    </div>
  `;
}

// ── Helpers ────────────────────────────────────────────────

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

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function shortId() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

function now() { return new Date().toISOString(); }

// ── Quick add ──────────────────────────────────────────────

async function quickAdd() {
    const input = document.getElementById("addInput");
    const title = input.value.trim();
    if (!title) return;

    const tab = state.currentTab;
    const n = now();

    const task = {
        id: shortId(),
        displayId: "",
        title,
        projectIds: [],
        parentId: undefined,
        subtaskIds: [],
        conditionIds: [],
        status: "todo",
        createdAt: n,
        updatedAt: n,
    };

    if (tab === "today") {
        state.data.todayTasks.push(task);
    } else {
        state.data.tasks.push(task);
    }

    input.value = "";
    await saveLocal();
    render();
    showToast(`✓ Added`);
}

document.getElementById("addInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") quickAdd();
});

// ── Tab switching ──────────────────────────────────────────

function showTab(tab) {
    state.currentTab = tab;
    document.querySelectorAll(".tab").forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".view").forEach((el) => el.classList.remove("active"));
    const tabs = ["today", "inbox", "focus", "projects", "settings"];
    document.querySelectorAll(".tab")[tabs.indexOf(tab)]?.classList.add("active");
    document.getElementById(`view-${tab}`)?.classList.add("active");

    // Hide add bar on settings
    document.getElementById("addBar").style.display = tab === "settings" ? "none" : "flex";

    // Load settings values
    if (tab === "settings" && state.cfg) {
        document.getElementById("cfg-token").value = state.cfg.token ?? "";
        document.getElementById("cfg-owner").value = state.cfg.owner ?? "";
        document.getElementById("cfg-repo").value = state.cfg.repo ?? "";
        document.getElementById("cfg-branch").value = state.cfg.branch ?? "main";
    }
    loadNotifSettingsIntoUI();
}

// ── Task modal ─────────────────────────────────────────────

function openTask(id, isToday) {
    const arr = isToday ? state.data.todayTasks : state.data.tasks;
    const task = arr.find((t) => t.id === id);
    if (!task) return;

    state.modal = { task, isToday };

    document.getElementById("modalTitle").textContent = isToday ? "Today task" : "Task";
    document.getElementById("modalTitleInput").value = task.title;

    const proj = task.projectIds.length
        ? state.data.projects.find((p) => p.id === task.projectIds[0])?.title ?? ""
        : "";
    document.getElementById("modalProject").value = proj;

    const doneBtn = document.getElementById("modalDoneBtn");
    doneBtn.textContent = task.status === "done" ? "Mark as todo" : "Mark as done";
    doneBtn.className = `modal-btn ${task.status === "done" ? "cancel" : "danger"}`;

    document.getElementById("taskModal").classList.add("open");
    document.getElementById("modalTitleInput").focus();
}

function closeModal(e) {
    if (e.target.id === "taskModal") closeModalDirect();
}

function closeModalDirect() {
    document.getElementById("taskModal").classList.remove("open");
    state.modal = null;
}

async function saveModal() {
    if (!state.modal) return;
    const { task, isToday } = state.modal;
    const newTitle = document.getElementById("modalTitleInput").value.trim();
    if (!newTitle) return;

    task.title = newTitle;
    task.updatedAt = now();

    await saveLocal();
    render();
    closeModalDirect();
    showToast("✓ Saved");
}

async function modalToggleDone() {
    if (!state.modal) return;
    const { task, isToday } = state.modal;
    const n = now();

    if (task.status === "done") {
        task.status = "todo";
        task.completedAt = undefined;
    } else {
        task.status = "done";
        task.completedAt = n;
    }
    task.updatedAt = n;

    await saveLocal();
    render();
    closeModalDirect();
    showToast(task.status === "done" ? "✓ Done!" : "↩ Marked todo");
}

// ── Focus toggle ───────────────────────────────────────────

async function toggleFocus(pid) {
    const idx = state.data.focus.indexOf(pid);
    if (idx === -1) {
        state.data.focus.push(pid);
        showToast("⭐ Added to focus");
    } else {
        state.data.focus.splice(idx, 1);
        showToast("Removed from focus");
    }
    await saveLocal();
    render();
}

// ── Settings ───────────────────────────────────────────────

async function saveSettings() {
    const token = document.getElementById("cfg-token").value.trim();
    const owner = document.getElementById("cfg-owner").value.trim();
    const repo = document.getElementById("cfg-repo").value.trim();
    const branch = document.getElementById("cfg-branch").value.trim() || "main";

    if (!token || !owner || !repo) {
        showToast("Token, owner and repo are required");
        return;
    }

    state.cfg = { token, owner, repo, branch, path: "data.json" };
    localStorage.setItem("px-cfg", JSON.stringify(state.cfg));
    showToast("✓ Saved — testing connection…");

    try {
        const result = await ghRead(state.cfg);
        showToast(result !== null ? "✓ Connected!" : "✓ Connected (repo empty, sync to push)");
    } catch (e) {
        showToast("✗ " + e.message);
    }
}

function exportData() {
    const json = JSON.stringify(state.data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `px-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Exported");
}

// ── Toast ──────────────────────────────────────────────────

let toastTimer = null;
function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove("show");
        toastTimer = null;
    }, 2500);
}

// ── Boot ───────────────────────────────────────────────────
boot();