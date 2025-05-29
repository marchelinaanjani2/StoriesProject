self.addEventListener('push', event => {
  const data = event.data.json();
  const { title, options } = data;

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


const CACHE_NAME = 'achel-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/index.js',
  'images/images1.png',
  'images/semangat1.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});


