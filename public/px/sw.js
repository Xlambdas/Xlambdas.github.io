const CACHE = "px-v1";
const ASSETS = [
    "/px/",
    "/px/index.html",
    "/px/manifest.json",
    "/px/js/db.js",
    "/px/js/github.js",
    "/px/js/merge.js",
    "/px/js/state.js",
    "/px/js/notifications.js",
    "/px/js/render.js",
    "/px/js/ui.js",
    "/px/js/sync.js",
    "/px/js/settings.js",
    "/px/js/app.js",
];

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
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
    if (e.request.url.includes("api.github.com")) {
        e.respondWith(fetch(e.request));
        return;
    }
    e.respondWith(
        caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
});

// Handle notification click — open the PWA
self.addEventListener("notificationclick", (e) => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
            // If PWA already open, focus it
            for (const client of list) {
                if (client.url.includes("/px/") && "focus" in client) {
                    return client.focus();
                }
            }
            // Otherwise open it
            return clients.openWindow("/px/");
        })
    );
});

// Handle background sync message from the page
self.addEventListener("message", (e) => {
    if (e.data?.type === "SCHEDULE_NOTIF") {
        const { title, body, delayMs, tag, icon } = e.data;
        setTimeout(() => {
            self.registration.showNotification(title, {
                body,
                tag,
                renotify: false,
                icon: icon || "./px/icon.svg",   // ← use passed icon, fallback to SVG
                badge: icon || "./px/icon.svg",
                vibrate: [200, 100, 200],
                data: { url: "/px/" },
            });
        }, delayMs);
    }
});