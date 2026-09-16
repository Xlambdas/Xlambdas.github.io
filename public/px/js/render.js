function render() {
    renderToday();
    renderInbox();
    renderFocus();
    renderProjects();
}

function renderToday() {
    const d = state.data;
    const todayList = document.getElementById("today-list");
    todayList.innerHTML = d.todayTasks?.length
        ? d.todayTasks.map((t) => taskItemHTML(t, true)).join("")
        : '<div class="empty">No tasks for today.<br>Add one below.</div>';

    const focusTasks = d.tasks.filter(
        (t) => t.projectIds.some((pid) => d.focus.includes(pid)) &&
            t.status === "todo" && !t.parentId
    );
    document.getElementById("focus-list").innerHTML = focusTasks.length
        ? focusTasks.map((t) => taskItemHTML(t, false)).join("")
        : '<div class="empty" style="padding:16px">No focus tasks.</div>';
}

function renderInbox() {
    const inbox = state.data.tasks.filter(
        (t) => t.projectIds.length === 0 && !t.parentId
    );
    document.getElementById("inbox-list").innerHTML = inbox.length
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
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${projectPct(p.id)}%"></div>
                </div>
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
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${pct}%"></div>
                </div>
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