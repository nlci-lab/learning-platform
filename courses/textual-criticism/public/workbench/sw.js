// Offline support for the TC workbench only (scope: workbench/).
// Serves from the cache first so the page opens with no signal, and refreshes the cache from the network.
// A new copy of the page replaces the cached one only after every script, style and font it needs
// is cached too, so an offline visit never gets a page whose files are missing.
const CACHE = 'tc-workbench-v3';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(caches.keys()
  .then((ks) => Promise.all(ks.filter((k) => k.startsWith('tc-workbench-') && k !== CACHE).map((k) => caches.delete(k))))
  .then(() => self.clients.claim())));

const same = (u) => new URL(u, location.href).origin === location.origin;

// Same-origin files a page or stylesheet refers to.
function refs(text, base) {
  const out = new Set();
  for (const m of text.matchAll(/(?:src|href)="([^"]+)"|url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const u = new URL(m[1] || m[2], base);
    if (same(u.href) && /\.(js|css|woff2?|ttf|svg|png|webp)$/.test(u.pathname)) out.add(u.href);
  }
  return [...out];
}

async function need(c, u) {
  const hit = await c.match(u, { ignoreVary: true });
  if (hit) return hit;
  const r = await fetch(u);
  if (!r.ok) throw new Error(u);
  return r;
}

// Cache a page with everything it needs, then the page itself. Any failure keeps the old copy.
async function storePage(c, req, res) {
  const files = refs(await res.clone().text(), req.url);
  const got = await Promise.all(files.map(async (u) => [u, await need(c, u)]));
  for (const [u, r] of got) {   // fonts are named inside the stylesheets
    if (u.endsWith('.css')) for (const f of refs(await r.clone().text(), u)) got.push([f, await need(c, f)]);
  }
  await Promise.all(got.map(([u, r]) => c.put(u, r)));
  await c.put(req, res);
}

async function refresh(c, req) {
  const res = await fetch(req);
  if (!res.ok) return { res, saving: Promise.resolve() };
  const isPage = req.mode === 'navigate' || (res.headers.get('content-type') || '').includes('text/html');
  const saving = (isPage ? storePage(c, req, res.clone()) : c.put(req, res.clone())).catch(() => {});
  return { res, saving };
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !same(req.url)) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const hit = await c.match(req, { ignoreSearch: true, ignoreVary: true });
    const net = refresh(c, req);
    // Keep the worker alive until the cache write finishes, whether we answer from the cache or not.
    e.waitUntil(net.then((x) => x.saving, () => {}));
    if (hit) return hit;
    return (await net).res;
  }));
});
