const CACHE_NAME = 'invoice-app-v1';

// Use relative paths so the SW works in installed/relative contexts (GitHub Pages or installed PWA)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './20251121_220136.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Navigation requests (SPA-style) -> serve index.html from cache fallback
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request).then(res => {
        // Put a copy in cache (if successful)
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return res;
      }).catch(() => {
        return caches.match('./index.html');
      })
    );
    return;
  }

  // For other assets: cache-first then network
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).then((res) => {
        // store in cache for future
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          try { cache.put(request, clone); } catch (e) { /* ignore cross-origin put errors */ }
        });
        return res;
      }).catch(() => {
        // fallback for images to bundled asset
        if (request.destination === 'image') {
          return caches.match('./20251121_220136.jpg');
        }
      });
    })
  );
});