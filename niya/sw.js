// Service worker : l'app reste ouvrable hors connexion (dernière version chargée).
const C = 'niya-v9'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())))
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET') return
  const u = new URL(r.url)
  if (u.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) return
  e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(C).then((c) => c.put(r, cp)); return res }).catch(() => caches.match(r).then((m) => m || caches.match('./index.html'))))
})
