const CACHE_NAME = 'tariqa-jami3a-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './reader.html',
  './css/style.css',
  './js/app.js',
  './js/reader.js',
  './manifest.json',
  './data/books-list.json',
  './data/دلائل الخيرات.pdf',
  './data/فيض المنان.pdf'
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
