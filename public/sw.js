// Basic service worker: makes the site installable (PWA) and loads faster.
// Pages are network-first (so new deploys show up); static assets are cache-first.
const CACHE = "kta-v1";
const PRECACHE = ["/", "/index.html", "/logo.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // only handle our own origin; never cache API or uploaded media
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/uploads")) return;

  // pages: network-first, fall back to cached shell when offline
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(() => caches.match("/index.html").then((c) => c || caches.match("/")))
    );
    return;
  }

  // static assets: cache-first, then network (and cache it)
  e.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return res;
        })
    )
  );
});
