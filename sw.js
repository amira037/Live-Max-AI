const CACHE = 'live-max-ai-v2';
const ASSETS = [
  '/live-max-ai/',
  '/live-max-ai/index.html',
  '/live-max-ai/manifest.json',
  '/live-max-ai/icons/icon-72x72.png',
  '/live-max-ai/icons/icon-192x192.png',
  '/live-max-ai/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only cache same-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('/live-max-ai/index.html'));
    })
  );
});
