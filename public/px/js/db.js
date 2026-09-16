const DB_NAME = "px-pwa";
const DB_VERSION = 1;
let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains("store")) {
                d.createObjectStore("store");
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

async function saveLocal() {
    await dbSet("data", state.data);
}