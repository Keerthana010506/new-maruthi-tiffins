const CACHE_NAME = "new-maruthi-tiffins-v2";

const urlsToCache = [
  "/",
  "/manifest.webmanifest",
  "/icons/customer/icon-192.png",
  "/icons/customer/icon-512.png",
  "/icons/customer/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});