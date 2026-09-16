// ── Quick add ──────────────────────────────────────────────

async function quickAdd() {
    const input = document.getElementById("addInput");
    const title = input.value.trim();
    if (!title) return;

    const n = now();
    const task = {
        id: shortId(),
        displayId: "",
        title,
        projectIds: [],
        subtaskIds: [],
        conditionIds: [],
        status: "todo",
        createdAt: n,
        updatedAt: n,
    };

    if (state.currentTab === "today") {
        state.data.todayTasks.push(task);
    } else {
        state.data.tasks.push(task);
    }

    input.value = "";
    await saveLocal();
    render();
    showToast("✓ Added");
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
    document.getElementById("addBar").style.display = tab === "settings" ? "none" : "flex";

    if (tab === "settings") {
        if (state.cfg) {
            document.getElementById("cfg-token").value = state.cfg.token ?? "";
            document.getElementById("cfg-owner").value = state.cfg.owner ?? "";
            document.getElementById("cfg-repo").value = state.cfg.repo ?? "";
            document.getElementById("cfg-branch").value = state.cfg.branch ?? "main";
        }
        loadNotifSettingsIntoUI();
    }
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
    const { task } = state.modal;
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
    const { task } = state.modal;
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