const NOTIF_SETTINGS_KEY = "px-notif-settings";

function defaultNotifSettings() {
    return {
        enabled: false,
        morningTime: "09:00",
        eveningTime: "19:00",
        deadlineWarning: true,
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

async function requestNotifPermission() {
    if (!("Notification" in window)) {
        showToast("Notifications not supported on this browser");
        return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") {
        showToast("Notifications blocked — enable in phone Settings");
        return false;
    }
    const result = await Notification.requestPermission();
    return result === "granted";
}

async function scheduleNotif({ title, body, delayMs, tag }) {
    if (Notification.permission !== "granted") return;
    setTimeout(async () => {
        try {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(title, {
                body,
                tag,
                renotify: false,
                icon: "/px/icon.svg",
                vibrate: [200, 100, 200],
                data: { url: "/px/" },
            });
        } catch {
            try { new Notification(title, { body, tag }); } catch { }
        }
    }, delayMs);
}

async function scheduleAt(timeStr, title, body, tag) {
    const [h, m] = timeStr.split(":").map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= new Date()) target.setDate(target.getDate() + 1);
    await scheduleNotif({ title, body, delayMs: target - new Date(), tag });
}

async function scheduleDeadlineNotifs() {
    const today = new Date().toISOString().slice(0, 10);
    const due = state.data.tasks.filter(
        (t) => t.status === "todo" && t.deadline === today
    );
    if (!due.length) return;
    const names = due.slice(0, 3).map((t) => t.title).join(", ");
    const extra = due.length > 3 ? ` +${due.length - 3} more` : "";
    await scheduleNotif({
        title: `PX — ${due.length} task${due.length > 1 ? "s" : ""} due today`,
        body: names + extra,
        delayMs: 5000,
        tag: "px-deadline",
    });
}

async function setupNotifications() {
    const settings = loadNotifSettings();
    if (!settings.enabled) return;
    if (Notification.permission !== "granted") return;

    const focusCount = state.data.tasks.filter(
        (t) => t.projectIds.some((pid) => state.data.focus.includes(pid)) &&
            t.status === "todo"
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

    if (settings.deadlineWarning) await scheduleDeadlineNotifs();
}

async function showOpeningNotif() {
    if (Notification.permission !== "granted") return;
    const d = state.data;
    const today = new Date().toISOString().slice(0, 10);

    const todayDue = d.tasks.filter((t) => t.status === "todo" && t.deadline === today).length;
    const focusCount = d.tasks.filter(
        (t) => t.projectIds.some((pid) => d.focus.includes(pid)) &&
            t.status === "todo" && !t.parentId
    ).length;
    const todayCount = d.todayTasks.filter((t) => t.status === "todo").length;

    const lines = [];
    if (focusCount > 0) lines.push(`${focusCount} focus task${focusCount > 1 ? "s" : ""}`);
    if (todayCount > 0) lines.push(`${todayCount} today task${todayCount > 1 ? "s" : ""}`);
    if (todayDue > 0) lines.push(`⚠ ${todayDue} due today`);
    if (!lines.length) return;

    await scheduleNotif({
        title: "PX — " + new Date().toLocaleDateString("en", { weekday: "long" }),
        body: lines.join("  ·  "),
        delayMs: 1500,
        tag: "px-open",
    });
}

async function testNotif() {
    if (Notification.permission === "denied") {
        showToast("Blocked — enable in phone Settings → Notifications");
        return;
    }
    if (Notification.permission !== "granted") {
        const granted = await requestNotifPermission();
        if (!granted) { showToast("Permission denied"); return; }
    }
    showToast("Notification in 3 seconds…");
    await scheduleNotif({
        title: "PX test ✓",
        body: "Notifications are working",
        delayMs: 3000,
        tag: "px-test",
    });
}

async function onNotifToggle() {
    const enabled = document.getElementById("notif-enabled").checked;
    document.getElementById("notif-settings").style.display = enabled ? "block" : "none";
    if (!enabled) return;
    const granted = await requestNotifPermission();
    if (!granted) {
        document.getElementById("notif-enabled").checked = false;
        document.getElementById("notif-settings").style.display = "none";
        return;
    }
    showToast("✓ Notifications enabled");
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