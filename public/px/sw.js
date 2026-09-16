const CACHE = "px-v1";
const ASSETS = [
    "/px/",
    "/px/index.html",
    "/px/app.js",
    "/px/manifest.json"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE).then((c) => c.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    // GitHub API calls — network only, never cache
    if (e.request.url.includes("api.github.com")) {
        e.respondWith(fetch(e.request));
        return;
    }
    // App shell — cache first, fall back to network
    e.respondWith(
        caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
});