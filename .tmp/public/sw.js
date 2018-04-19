"use strict";var staticCacheName="restaurant-reviews-v48",contentImgsCache="restaurant-reviews-content-imgs",allCaches=[staticCacheName,contentImgsCache],urlsToCache=["/resources/homepage.html","/resources/restaurant.html","/resources/manifest.json","/styles/styles.css","/styles/restaurant-listing.css","/styles/restaurant.css","/js/idb/lib/idb.js","/js/dbhelper.js","/js/main.js","/js/restaurant_info.js","/resources/homepage.html.gz","/resources/restaurant.html.gz","/resources/manifest.json.gz","/styles/styles.css.gz","/styles/restaurant-listing.css.gz","/styles/restaurant.css.gz","/js/idb/lib/idb.js.gz","/js/dbhelper.js.gz","/js/main.js.gz","/js/restaurant_info.js.gz","https://cdn.jsdelivr.net/npm/blazy@1.8.2/blazy.min.js"];function servePhoto(s){var n=s.url;return caches.open(contentImgsCache).then(function(t){return t.match(n).then(function(e){return e||fetch(s).then(function(e){return t.put(n,e.clone()),e})})})}self.addEventListener("install",function(e){e.waitUntil(caches.open(staticCacheName).then(function(e){return console.log("Opened cache"),e.addAll(urlsToCache)}))}),self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(e){return Promise.all(e.filter(function(e){return e.startsWith("restaurant-reviews-")&&!allCaches.includes(e)}).map(function(e){return caches.delete(e)}))}))}),self.addEventListener("fetch",function(t){var e=new URL(t.request.url);if(e.origin===location.origin){if("/"===e.pathname)return void t.respondWith(caches.match("/resources/homepage.html"));if("/restaurant"===e.pathname)return void t.respondWith(caches.match("/resources/restaurant.html"));if(e.pathname.startsWith("/img/"))return void t.respondWith(servePhoto(t.request))}t.respondWith(caches.match(t.request).then(function(e){return e||fetch(t.request)}))});