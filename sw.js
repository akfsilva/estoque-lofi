const CACHE_NAME = "vault-v2.5";
const ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "manifest.json",
  "https://raw.githubusercontent.com/Fortis-Solutions/Vault-Stock/main/icon-192.png"
];

// Instalação do cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Estratégia: Tenta Rede, se falhar, vai no Cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
