/**
 * Oddvi site worker.
 * - /api/like         (POST {id})        → increments and returns the like count for one message
 * - /api/likes        (GET ?ids=a,b,c)   → returns current counts for a batch of ids
 * - /api/stat, /api/stats                → generic named counters (e.g. odd-test completions)
 * - /api/admin-stats   (GET ?key=SECRET) → private visit analytics, requires env.ADMIN_KEY
 * - everything else                      → served as-is from the static assets, with the visitor's
 *                                           Cloudflare-detected country injected so the page can
 *                                           open in the matching language automatically, and a
 *                                           lightweight anonymous visit counter recorded in KV
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Country -> one of our 5 supported site languages. Anything not listed falls back to English.
const COUNTRY_LANG = {
  TR: 'tr',
  DE: 'de', AT: 'de', CH: 'de',
  FR: 'fr', BE: 'fr',
  HU: 'hu'
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

class GeoLangInjector {
  constructor(lang) { this.lang = lang; }
  element(el) {
    el.append(`<script>window.__ODDVI_GEO_LANG__=${JSON.stringify(this.lang)};</script>`, { html: true });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/like' && request.method === 'POST') {
      return handleLike(request, env);
    }

    if (url.pathname === '/api/likes' && request.method === 'GET') {
      return handleGetLikes(url, env);
    }

    if (url.pathname === '/api/stat' && request.method === 'POST') {
      return handleStat(request, env);
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      return handleGetStats(url, env);
    }

    if (url.pathname === '/api/admin-stats' && request.method === 'GET') {
      return handleAdminStats(url, env);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const country = request.cf && request.cf.country;
    const lang = COUNTRY_LANG[country] || 'en';

    // Fire-and-forget visit tracking; never blocks or breaks the page response.
    ctx.waitUntil(trackVisit(request, env, url, country).catch(() => {}));

    const transformed = new HTMLRewriter().on('head', new GeoLangInjector(lang)).transform(response);
    // Force every visit to hit the worker (no browser-cache shortcuts) so pageview counts and
    // client-side scroll-depth beacons never fall out of sync with each other.
    const headers = new Headers(transformed.headers);
    headers.set('Cache-Control', 'no-store');
    return new Response(transformed.body, { status: transformed.status, statusText: transformed.statusText, headers });
  }
};

// ---------- visit tracking (anonymous, aggregate-only) ----------

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function referrerBucket(request) {
  const ref = request.headers.get('Referer');
  if (!ref) return '(direct)';
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    return host.slice(0, 60) || '(direct)';
  } catch (e) {
    return '(direct)';
  }
}

async function bump(env, key, by = 1) {
  const current = parseInt((await env.LIKES.get(key)) || '0', 10) || 0;
  await env.LIKES.put(key, String(current + by));
}

async function trackVisit(request, env, url, country) {
  const ua = request.headers.get('User-Agent') || '';
  // Skip obvious bots/crawlers so numbers reflect real people.
  if (/bot|crawl|spider|slurp|facebookexternalhit|preview|monitor/i.test(ua)) return;

  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const country2 = (country || 'XX').toUpperCase().slice(0, 2);
  const ref = referrerBucket(request);

  const ip = request.headers.get('CF-Connecting-IP') || '';
  const visitorHash = (await sha256Hex(ip + '|' + ua + '|' + day)).slice(0, 24);
  const seenKey = 'visit:seen:' + day + ':' + visitorHash;

  // One key per day holds everything (total, unique, countries, pages, referrers) as a single
  // JSON blob. This keeps KV writes to ~1-2 per visit instead of 5-9, which matters a lot on
  // Cloudflare's free-tier daily put() quota.
  const dailyKey = 'visit:daily:' + day;
  const [alreadySeenToday, rawDaily] = await Promise.all([
    env.LIKES.get(seenKey),
    env.LIKES.get(dailyKey)
  ]);

  let data;
  try { data = rawDaily ? JSON.parse(rawDaily) : null; } catch (e) { data = null; }
  if (!data) data = { total: 0, uniq: 0, countries: {}, pages: {}, refs: {} };

  data.total += 1;
  data.countries[country2] = (data.countries[country2] || 0) + 1;
  data.pages[path] = (data.pages[path] || 0) + 1;
  data.refs[ref] = (data.refs[ref] || 0) + 1;
  if (!alreadySeenToday) data.uniq += 1;

  const writes = [env.LIKES.put(dailyKey, JSON.stringify(data))];
  if (!alreadySeenToday) {
    writes.push(env.LIKES.put(seenKey, '1', { expirationTtl: 60 * 60 * 30 }));
  }
  await Promise.all(writes);
}

async function listDailyBlobs(env, prefix) {
  const names = [];
  let cursor;
  for (;;) {
    const opts = { prefix, limit: 1000 };
    if (cursor) opts.cursor = cursor;
    const page = await env.LIKES.list(opts);
    for (const k of page.keys) names.push(k.name);
    if (page.list_complete) break;
    if (!page.cursor) break;
    cursor = page.cursor;
  }
  const entries = await Promise.all(names.map(async (name) => {
    const raw = await env.LIKES.get(name);
    let data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = null; }
    return { day: name.slice(prefix.length), data };
  }));
  return entries.filter(e => e.data);
}

async function listCounts(env, prefix, limit = 1000) {
  const out = [];
  let cursor;
  for (;;) {
    const opts = { prefix, limit: 1000 };
    if (cursor) opts.cursor = cursor;
    const page = await env.LIKES.list(opts);
    for (const k of page.keys) out.push(k.name);
    if (out.length >= limit) break;
    if (page.list_complete) break;
    if (!page.cursor) break;
    cursor = page.cursor;
  }

  const entries = await Promise.all(out.map(async (name) => {
    const v = parseInt((await env.LIKES.get(name)) || '0', 10) || 0;
    return [name.slice(prefix.length), v];
  }));
  entries.sort((a, b) => b[1] - a[1]);
  return entries;
}

const STATS_CACHE_KEY = 'visit:summary_cache';
const STATS_CACHE_TTL_SECONDS = 600; // 10 minutes — keeps KV list() calls far under the free-tier daily cap

async function handleAdminStats(url, env) {
  const key = url.searchParams.get('key') || '';
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return json({ error: 'unauthorized' }, 403);
  }

  const forceRefresh = url.searchParams.get('refresh') === '1';

  try {
    if (!forceRefresh) {
      const cached = await env.LIKES.get(STATS_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        data.cached = true;
        return json(data);
      }
    }

    const [dailyBlobs, scrollRaw, downloadsRaw, submitsRaw] = await Promise.all([
      listDailyBlobs(env, 'visit:daily:'),
      listCounts(env, 'stat:scroll:'),
      listCounts(env, 'stat:download:'),
      listCounts(env, 'stat:submit:')
    ]);

    let totalPageviews = 0, totalUniq = 0;
    const countryTotals = {}, pageTotals = {}, refTotals = {};
    const lastDays = [];
    for (const { day, data: d } of dailyBlobs) {
      totalPageviews += d.total || 0;
      totalUniq += d.uniq || 0;
      lastDays.push([day, d.total || 0]);
      for (const [k, v] of Object.entries(d.countries || {})) countryTotals[k] = (countryTotals[k] || 0) + v;
      for (const [k, v] of Object.entries(d.pages || {})) pageTotals[k] = (pageTotals[k] || 0) + v;
      for (const [k, v] of Object.entries(d.refs || {})) refTotals[k] = (refTotals[k] || 0) + v;
    }
    lastDays.sort((a, b) => a[0] < b[0] ? 1 : -1);
    const toSortedEntries = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

    downloadsRaw.sort((a, b) => b[1] - a[1]);
    submitsRaw.sort((a, b) => b[1] - a[1]);

    // scrollRaw entries look like ["/some-page:75", 12] — regroup by page.
    const scrollByPage = {};
    for (const [k, v] of scrollRaw) {
      const idx = k.lastIndexOf(':');
      if (idx === -1) continue;
      const page = k.slice(0, idx);
      const milestone = k.slice(idx + 1);
      if (!scrollByPage[page]) scrollByPage[page] = {};
      scrollByPage[page][milestone] = v;
    }

    const downloadsTotal = downloadsRaw.reduce((sum, [, v]) => sum + v, 0);
    const submitsTotal = submitsRaw.reduce((sum, [, v]) => sum + v, 0);

    const data = {
      total_pageviews: totalPageviews,
      unique_visitors: totalUniq,
      by_country: toSortedEntries(countryTotals),
      top_pages: toSortedEntries(pageTotals).slice(0, 20),
      top_referrers: toSortedEntries(refTotals).slice(0, 20),
      last_days: lastDays.slice(0, 30),
      scroll_by_page: scrollByPage,
      downloads_total: downloadsTotal,
      downloads_by_item: downloadsRaw.slice(0, 30),
      submits_total: submitsTotal,
      submits_by_type: submitsRaw.slice(0, 10),
      generated_at: new Date().toISOString()
    };

    await env.LIKES.put(STATS_CACHE_KEY, JSON.stringify(data), { expirationTtl: STATS_CACHE_TTL_SECONDS });

    data.cached = false;
    return json(data);
  } catch (err) {
    return json({ error: 'internal', message: String(err && err.stack || err) }, 500);
  }
}

// ---------- existing named counters & like system (unchanged) ----------

async function handleStat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'bad json' }, 400);
  }
  const name = body && body.name ? String(body.name).slice(0, 60) : null;
  if (!name) return json({ error: 'missing name' }, 400);

  const key = 'stat:' + name;
  const current = parseInt((await env.LIKES.get(key)) || '0', 10) || 0;
  const next = current + 1;
  await env.LIKES.put(key, String(next));
  return json({ name, count: next });
}

async function handleGetStats(url, env) {
  const namesParam = url.searchParams.get('names') || '';
  const names = namesParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50);
  const result = {};
  await Promise.all(names.map(async (name) => {
    const v = await env.LIKES.get('stat:' + name);
    result[name] = parseInt(v || '0', 10) || 0;
  }));
  return json(result);
}

async function handleLike(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'bad json' }, 400);
  }
  const id = body && body.id ? String(body.id).slice(0, 80) : null;
  if (!id) return json({ error: 'missing id' }, 400);

  const key = 'like:' + id;
  const current = parseInt((await env.LIKES.get(key)) || '0', 10) || 0;
  const next = current + 1;
  await env.LIKES.put(key, String(next));
  return json({ id, likes: next });
}

async function handleGetLikes(url, env) {
  const idsParam = url.searchParams.get('ids') || '';
  const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50);
  const result = {};
  await Promise.all(ids.map(async (id) => {
    const v = await env.LIKES.get('like:' + id);
    result[id] = parseInt(v || '0', 10) || 0;
  }));
  return json(result);
}

// Named exports (harmless for the Workers runtime; used by local tests).
export { listCounts, listDailyBlobs, handleAdminStats, trackVisit, referrerBucket, sha256Hex, bump, handleStat };
