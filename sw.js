/* Service worker de la Calculadora de desarrollos.
   Estrategia: precarga del "shell" al instalar; la página se pide primero a la red (siempre la versión desplegada) y el resto de archivos van caché primero con actualización en segundo plano.
   Al publicar cambios, sube la versión de CACHE para que los usuarios reciban los archivos nuevos. */
// Prefijo propio: en usuario.github.io todas las apps comparten el espacio de cachés.
// El workflow sustituye el sufijo por el hash del commit.
const PREFIX = "desarrollos-";
const CACHE = "desarrollos-dev";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/fonts.css",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "fonts/barlow-semi-condensed-latin-500-normal.woff2",
  "fonts/barlow-semi-condensed-latin-600-normal.woff2",
  "fonts/barlow-semi-condensed-latin-700-normal.woff2",
  "fonts/ibm-plex-mono-latin-400-normal.woff2",
  "fonts/ibm-plex-mono-latin-500-normal.woff2",
  "fonts/ibm-plex-mono-latin-600-normal.woff2",
  "fonts/ibm-plex-sans-latin-400-normal.woff2",
  "fonts/ibm-plex-sans-latin-500-normal.woff2",
  "fonts/ibm-plex-sans-latin-600-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  // Páginas (navegación): red primero, para ver siempre la versión desplegada; la caché solo sirve sin conexión.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("index.html", copy)); }
          return res;
        })
        .catch(() => caches.open(CACHE).then((c) => c.match("index.html")))
    );
    return;
  }
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) { event.waitUntil(network); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === "navigate") return cache.match("index.html");
      return new Response("", { status: 504, statusText: "Sin conexión" });
    })
  );
});
