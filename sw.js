const CACHE_NAME = 'fitforge-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/js/exercises.js',
  '/js/foods.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if found
        if (response) {
          return response;
        }
        // Otherwise try to fetch from network
        return fetch(event.request).then((networkResponse) => {
          // If we want to dynamically cache new resources, we could do it here
          return networkResponse;
        }).catch(() => {
          // If network fails and it's not in cache, we could return a fallback
        });
      })
  );
});
