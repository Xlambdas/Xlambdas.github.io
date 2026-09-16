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

    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/px/sw.js");
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

boot();