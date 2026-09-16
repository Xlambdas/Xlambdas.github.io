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
            await ghWrite(state.cfg, state.data, null, "px sync: initial push (pwa)");
            showToast("✓ Initial sync done");
        } else {
            const { merged, added, updated } = mergeData(state.data, remote.data);
            state.data = merged;
            await dbSet("data", state.data);
            await ghWrite(state.cfg, state.data, remote.sha, "px sync (pwa)");
            showToast(added + updated > 0
                ? `✓ ↓${added} received  ↑ pushed`
                : "✓ Up to date");
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
    const diff = Math.floor((new Date() - d) / 60000);
    if (diff < 1) el.textContent = "synced now";
    else if (diff < 60) el.textContent = `${diff}m ago`;
    else el.textContent = d.toLocaleDateString();
}