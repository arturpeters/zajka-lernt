/**
 * sw.js – Service Worker für „Zajka lernt“ (iPhone, Home-Bildschirm-Web-App).
 *
 * Gleiche Bauweise wie Zeitstempel:
 *  1. Bei JEDER Änderung an der App CACHE_NAME hochzählen – nur so erkennt
 *     der Browser ein Update.
 *  2. Die neue Fassung wartet, bis die App sie anfordert (SKIP_WAITING).
 *     pwa.js zeigt dafür „Neue Version – tippen zum Aktualisieren“.
 *  3. Alles kommt aus dem Cache der aktiven Version, damit HTML, Skripte und
 *     CSS immer zusammenpassen. Anders als bei Zeitstempel gibt es mehrere
 *     Seiten (Übungsblätter, Probeklausuren) – Seitenaufrufe werden deshalb
 *     über ihren Pfad im Cache gesucht.
 *
 * Lokal (localhost/file) baut sich der Service Worker ab.
 */
const CACHE_NAME = 'zajka-lernt-v6';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/sheet.css',
  './js/storage.js',
  './assets/anleitung/1-installieren.jpg',
  './assets/anleitung/2-termin.jpg',
  './assets/anleitung/3-start.jpg',
  './assets/anleitung/4-ueben.jpg',
  './assets/anleitung/5-tippen.jpg',
  './assets/anleitung/6-lernkarten.jpg',
  './assets/anleitung/7-lernen.jpg',
  './assets/anleitung/8-klausur.jpg',
  './js/subjects/lf1-fragen.js',
  './js/subjects/lf1.js',
  './js/app.js',
  './js/sheet.js',
  './js/pwa.js',
  './blaetter/uebung1.html',
  './blaetter/uebung1-loesung.html',
  './blaetter/uebung2.html',
  './blaetter/uebung2-loesung.html',
  './blaetter/ergaenzung.html',
  './blaetter/ergaenzung-loesung.html',
  './blaetter/probetest.html',
  './blaetter/probetest-loesung.html',
  './blaetter/klausur-a.html',
  './blaetter/klausur-a-loesung.html',
  './blaetter/klausur-b.html',
  './blaetter/klausur-b-loesung.html',
  './blaetter/klausur-c.html',
  './blaetter/klausur-c-loesung.html',
  './blaetter/klausur-d.html',
  './blaetter/klausur-d-loesung.html',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
];

const IS_LOCAL_APP =
  self.location.protocol === 'file:' ||
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '';

self.addEventListener('install', (event) => {
  if (IS_LOCAL_APP) {
    self.skipWaiting();
    return;
  }
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
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
      } catch (e) { /* beim nächsten Start */ }
    })());
    return;
  }
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
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
    // Seite der AKTIVEN Version (Suchparameter wie ?run=1 ignorieren).
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
