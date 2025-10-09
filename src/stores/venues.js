// src/store/venues.js
// Store read-only: prende i venues dal tuo backend Express (che legge da Sanity)

let API_BASE = 'http://localhost:8787'
try {
  if (import.meta?.env?.VITE_API_BASE) API_BASE = import.meta.env.VITE_API_BASE
} catch(e) {
  console.log(e)
} // import.meta non sempre esiste (SSR/test)
if (typeof process !== 'undefined' && process.env?.API_BASE) {
  API_BASE = process.env.API_BASE
}

function normalizeLocale(input = 'it') {
  const cleaned = String(input).trim().replace('_', '-')
  const [langRaw, regionRaw] = cleaned.split('-')
  const lang = (langRaw || '').toLowerCase()
  const region = regionRaw ? regionRaw.toUpperCase() : ''
  if (!region) {
    if (lang === 'it') return 'it-IT'
    if (lang === 'en') return 'en-US'
  }
  return region ? `${lang}-${region}` : cleaned
}

async function http(path, { signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`)
  return res.json()
}

// Cache very simple (per locale e per id)
const cache = {
  list: new Map(), // key: locale → items[]
  item: new Map(), // key: `${locale}:${id}` → venue
}

/** Ritorna TUTTI i venues (array), già nello shape “store-ready” dal backend */
export async function fetchVenues(locale = 'it', { signal } = {}) {
  const loc = normalizeLocale(locale)
  if (cache.list.has(loc)) return cache.list.get(loc)
  const data = await http(`/venues/${encodeURIComponent(loc)}`, { signal })
  const items = Array.isArray(data?.items) ? data.items : []
  cache.list.set(loc, items)
  // popola anche la cache per singolo id
  for (const v of items) cache.item.set(`${loc}:${v.id}`, v)
  return items
}

/** Ritorna un singolo venue per id */
export async function fetchVenueById(id, locale = 'it', { signal } = {}) {
  const loc = normalizeLocale(locale)
  const key = `${loc}:${id}`
  if (cache.item.has(key)) return cache.item.get(key)
  const item = await http(`/venues/${encodeURIComponent(loc)}/${encodeURIComponent(id)}`, { signal })
  cache.item.set(key, item)
  // opzionale: se abbiamo già lista cache, aggiorniamola
  if (cache.list.has(loc)) {
    const list = cache.list.get(loc) || []
    const idx = list.findIndex(v => v.id === id)
    if (idx >= 0) list[idx] = item
    else list.push(item)
    cache.list.set(loc, list)
  }
  return item
}

/** Invalida manualmente la cache (se vuoi ricaricare) */
export function clearVenuesCache(locale) {
  if (!locale) {
    cache.list.clear()
    cache.item.clear()
  } else {
    const loc = normalizeLocale(locale)
    cache.list.delete(loc)
    // pulisci anche i singoli item di quel locale
    for (const k of Array.from(cache.item.keys())) {
      if (k.startsWith(`${loc}:`)) cache.item.delete(k)
    }
  }
}
