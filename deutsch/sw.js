/**
 * sw.js – Service Worker der Deutsch-App (Ordner deutsch/).
 * Gleiche Bauweise wie die LF1-App im Hauptordner:
 *  1. Bei JEDER Änderung CACHE_NAME hochzählen – nur so erkennt der Browser ein Update.
 *  2. Die neue Fassung wartet, bis die App sie anfordert (SKIP_WAITING) → Hinweis „Neue Version da“.
 *  3. Alles kommt aus dem Cache der aktiven Version → funktioniert offline.
 * Der Scope ist nur dieser Ordner; die LF1-App und ihr Service Worker bleiben unberührt.
 * Lokal (localhost/file) baut sich der Service Worker ab.
 */
const CACHE_NAME = 'zajka-deutsch-v1';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

const IS_LOCAL_APP =
  self.location.protocol === 'file:' ||
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '';

self.addEventListener('install', (event) => {
  if (IS_LOCAL_APP) { self.skipWaiting(); return; }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  if (IS_LOCAL_APP) {
    event.waitUntil((async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.indexOf('zajka-deutsch-') === 0).map((k) => caches.delete(k)));
        await self.registration.unregister();
      } catch (e) { /* beim nächsten Start */ }
    })());
    return;
  }
  // Nur EIGENE alte Caches löschen – die Caches der LF1-App (zajka-lernt-…) bleiben.
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.indexOf('zajka-deutsch-') === 0 && k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (IS_LOCAL_APP) return;
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req, { ignoreSearch: true }).then((hit) =>
          hit || fetch(req).catch(() => cache.match('./index.html'))
        )
      )
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req))
    )
  );
});
