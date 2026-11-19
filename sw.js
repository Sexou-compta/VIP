const V = "vip-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "img/icon-192.png", "img/icon-512.png", "img/apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname.endsWith("workers.dev")) return; // le serveur des codes: jamais en cache
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(V).then((c) => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
