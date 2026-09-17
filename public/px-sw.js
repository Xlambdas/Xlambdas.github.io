// public/px-sw.js
// Minimal service worker for PX notifications only
// Scope is limited to /sandbox/px/ so it doesn't affect the rest of the site

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const client of list) {
                if (client.url.includes('/sandbox/px') && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow('/sandbox/px');
        })
    );
});