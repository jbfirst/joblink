// Service Worker minimal — nécessaire pour l'installabilité PWA
// (Chrome/Android exige un fetch handler enregistré, même basique).
// Ne met rien en cache de façon agressive : laisse toujours passer
// les requêtes réseau normalement, pour ne jamais servir de données
// périmées (offres, candidatures, etc. doivent toujours être à jour).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple passthrough réseau — pas de mise en cache pour l'instant.
  event.respondWith(fetch(event.request));
});
