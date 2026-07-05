/**
 * Oddvi site worker.
 * - /api/like   (POST {id})        → increments and returns the like count for one message
 * - /api/likes  (GET ?ids=a,b,c)   → returns current counts for a batch of ids
 * - everything else                → served as-is from the static assets (unchanged site behaviour)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
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

    return env.ASSETS.fetch(request);
  }
};

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
