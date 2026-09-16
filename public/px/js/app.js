async function boot() {
    db = await openDB();

    const savedTheme = localStorage.getItem('px-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyTheme(savedTheme);

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


function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
        root.style.setProperty('--bg', '#ffffff');
        root.style.setProperty('--surface', '#f5f5f5');
        root.style.setProperty('--border', '#e0e0e0');
        root.style.setProperty('--text', '#111111');
        root.style.setProperty('--muted', '#999999');
        root.style.setProperty('--accent', '#000000');
        root.style.setProperty('--accent-dim', '#f0f0f0');
        root.style.setProperty('--red', '#cc3333');
    } else {
        root.style.setProperty('--bg', '#0f0f0f');
        root.style.setProperty('--surface', '#1a1a1a');
        root.style.setProperty('--border', '#2a2a2a');
        root.style.setProperty('--text', '#e8e8e8');
        root.style.setProperty('--muted', '#666666');
        root.style.setProperty('--accent', '#ffffff');
        root.style.setProperty('--accent-dim', '#2a2a2a');
        root.style.setProperty('--red', '#e05555');
    }
}

boot();