var staticCacheName = 'restaurant-reviews-v48';
var contentImgsCache = 'restaurant-reviews-content-imgs';
var allCaches = [staticCacheName, contentImgsCache];
var urlsToCache = [
  '/resources/homepage.html',
  '/resources/restaurant.html',
  '/resources/manifest.json',
  '/styles/styles.css',
  '/styles/restaurant-listing.css',
  '/styles/restaurant.css',
  '/js/idb/lib/idb.js',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/resources/homepage.html.gz',
  '/resources/restaurant.html.gz',
  '/resources/manifest.json.gz',
  '/styles/styles.css.gz',
  '/styles/restaurant-listing.css.gz',
  '/styles/restaurant.css.gz',
  '/js/idb/lib/idb.js.gz',
  '/js/dbhelper.js.gz',
  '/js/main.js.gz',
  '/js/restaurant_info.js.gz',
  'https://cdn.jsdelivr.net/npm/blazy@1.8.2/blazy.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(staticCacheName)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-reviews-') && !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/resources/homepage.html'));
      return;
    }

    if (requestUrl.pathname === '/restaurant') {
      event.respondWith(caches.match('/resources/restaurant.html'));
      return;
    }

    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }));
});

function servePhoto(request) {
  var storageUrl = request.url;

  return caches.open(contentImgsCache).then(function (cache) {
    return cache.match(storageUrl).then(function (response) {
      if (response) return response;

      return fetch(request).then(function (networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
