/**
 * Oddvi site worker.
 * - /api/like   (POST {id})        → increments and returns the like count for one message
 * - /api/likes  (GET ?ids=a,b,c)   → returns current counts for a batch of ids
 * - /api/stat, /api/stats          → generic named counters (e.g. odd-test completions)
 * - everything else                → served as-is from the static assets, with the visitor's
 *                                     Cloudflare-detected country injected so the page can
 *                                     open in the matching language automatically
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
  async fetch(request, env) {
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

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const country = request.cf && request.cf.country;
    const lang = COUNTRY_LANG[country] || 'en';
    return new HTMLRewriter().on('head', new GeoLangInjector(lang)).transform(response);
  }
};

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
