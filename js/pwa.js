/**
 * pwa.js – registriert den Service Worker und meldet neue Versionen.
 * Bauweise wie bei Zeitstempel: Liegt eine neue Fassung bereit, feuert
 * "zajka:update"; die App zeigt oben "Neue Version – tippen zum Aktualisieren".
 * Daten (localStorage) bleiben beim Update erhalten.
 */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;

  const host = location.hostname;
  const isLocalApp = location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '';

  if (isLocalApp) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
    if (window.caches && caches.keys) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
    }
    return;
  }

  let waitingWorker = null;
  let reloading = false;

  function announce(worker) {
    waitingWorker = worker;
    window.dispatchEvent(new Event('zajka:update'));
  }

  window.__zajkaApplyUpdate = function () {
    if (waitingWorker) waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    else location.reload();
  };

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });

  window.addEventListener('load', () => {
    // Der Service Worker liegt im App-Ordner; Blätter-Seiten liegen eine Ebene tiefer.
    const swUrl = location.pathname.indexOf('/blaetter/') !== -1 ? '../sw.js' : 'sw.js';
    const scope = location.pathname.indexOf('/blaetter/') !== -1 ? '../' : './';
    navigator.serviceWorker.register(swUrl, { scope }).then((reg) => {
      if (reg.waiting && navigator.serviceWorker.controller) announce(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) announce(worker);
        });
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    }).catch((err) => {
      console.warn('Zajka lernt: Service Worker konnte nicht registriert werden.', err);
    });
  });
})();
