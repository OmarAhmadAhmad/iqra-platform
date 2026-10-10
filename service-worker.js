// service-worker.js - التخزين المؤقت للعمل أوفلاين كتطبيق
const CACHE_NAME = 'islamic-library-v3';
const assetsToCache = [
  'index.html',
  'reader.html',
  'css/style.css',
  'js/app.js',
  'js/reader.js',
  'data/books-list.json',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
