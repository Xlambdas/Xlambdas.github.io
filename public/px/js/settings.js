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
        showToast(result !== null
            ? "✓ Connected!"
            : "✓ Connected (repo empty, sync to push)");
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