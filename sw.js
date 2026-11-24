const CACHE = "murmelband-v11";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./baloo2-latin.woff2", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

function speichern(req, res) {
  if (res && res.ok && new URL(req.url).origin === self.location.origin) {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
  }
  return res;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Seite selbst: zuerst aus dem Netz (damit Updates sofort ankommen), offline aus dem Cache
  if (req.mode === "navigate" || new URL(req.url).pathname.endsWith("/index.html")) {
    e.respondWith(fetch(req).then(res => speichern(req, res))
      .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html"))));
    return;
  }
  // Icons, Schrift, Manifest: zuerst aus dem Cache
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => speichern(req, res))
    .catch(() => caches.match("./index.html"))));
});
