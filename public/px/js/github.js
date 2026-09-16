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