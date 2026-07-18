/**
 * Oddvi site worker.
 * - /api/like         (POST {id})        → increments and returns the like count for one message
 * - /api/likes        (GET ?ids=a,b,c)   → returns current counts for a batch of ids
 * - /api/stat, /api/stats                → generic named counters (e.g. odd-test completions)
 * - /api/admin-stats   (GET ?key=SECRET) → private visit analytics, requires env.ADMIN_KEY
 * - /tr/ /de/ /fr/ /hu/ (index.html, wallpapers.html only) → fully server-rendered translated
 *                                           HTML (real crawlable pages, not JS-only switching),
 *                                           with hreflang + canonical tags for international SEO
 * - everything else                      → served as-is from the static assets, with the visitor's
 *                                           Cloudflare-detected country injected so the page can
 *                                           open in the matching language automatically, and a
 *                                           lightweight anonymous visit counter recorded in KV
 */

import { dict } from './i18n-dict.js';
import { pollPool } from './poll-dict.js';

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

const SITE_ORIGIN = 'https://theoddvi.com';
const LOCALIZABLE_LANGS = ['tr', 'de', 'fr', 'hu']; // en = default, lives at the un-prefixed URL
const ALL_LANGS = ['en', 'tr', 'de', 'fr', 'hu'];
// Pages we fully server-render translations for. Add more page keys here as this rolls out further.
const LOCALIZABLE_PAGES = ['index.html', 'wallpapers.html'];

// Per-page <title>/<meta description> translations. Everything else on the page is translated via
// the shared data-i18n dictionary (i18n-dict.js), same one the client-side switcher uses.
const PAGE_META = {
  'index.html': {
    en: { title: "Oddvi — What's your Odd?", description: "Meet Oddvi. Normal is everywhere, Odd is remembered. The mascot of Pardon My Odd — coming soon." },
    tr: { title: "Oddvi — Senin Odd'un Ne?", description: "Oddvi ile tanış. Normal her yerde, Odd akılda kalır. Pardon My Odd'un maskotu — yakında geliyor." },
    de: { title: "Oddvi — Was Ist Dein Odd?", description: "Lerne Oddvi kennen. Normal ist überall, Odd bleibt in Erinnerung. Das Maskottchen von Pardon My Odd — bald verfügbar." },
    fr: { title: "Oddvi — C'est Quoi Ton Odd ?", description: "Découvre Oddvi. Normal est partout, Odd on s'en souvient. La mascotte de Pardon My Odd — bientôt disponible." },
    hu: { title: "Oddvi — Mi A Te Oddod?", description: "Ismerd meg Oddvit. A normális mindenhol ott van, az Odd megmarad. A Pardon My Odd kabalája — hamarosan." }
  },
  'wallpapers.html': {
    en: { title: "Wallpaper Club — Oddvi", description: "Free Oddvi phone wallpapers. Stay odd, one lock screen at a time." },
    tr: { title: "Wallpaper Club — Oddvi", description: "Ücretsiz Oddvi telefon duvar kağıtları. Her kilit ekranında biraz Odd kal." },
    de: { title: "Wallpaper Club — Oddvi", description: "Kostenlose Oddvi-Handy-Wallpaper. Bleib odd, ein Sperrbildschirm nach dem anderen." },
    fr: { title: "Wallpaper Club — Oddvi", description: "Fonds d'écran Oddvi gratuits. Reste odd, un écran verrouillé à la fois." },
    hu: { title: "Wallpaper Club — Oddvi", description: "Ingyenes Oddvi háttérképek. Maradj odd minden zárolt képernyőn." }
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}

// pathname for a given page+lang, matching our /xx/ prefix scheme. English = no prefix.
function localizedUrl(page, lang) {
  const slug = page === 'index.html' ? '' : page;
  return lang === 'en' ? `${SITE_ORIGIN}/${slug}` : `${SITE_ORIGIN}/${lang}/${slug}`;
}

function buildHreflangHtml(page, lang) {
  const links = ALL_LANGS.map(l => `<link rel="alternate" hreflang="${l === 'en' ? 'en' : l}" href="${localizedUrl(page, l)}" />`).join('\n');
  const xdefault = `<link rel="alternate" hreflang="x-default" href="${localizedUrl(page, 'en')}" />`;
  const canonical = `<link rel="canonical" href="${localizedUrl(page, lang || 'en')}" />`;
  return `\n${canonical}\n${links}\n${xdefault}\n`;
}

function matchLocalizedPath(pathname) {
  for (const lang of LOCALIZABLE_LANGS) {
    if (pathname === '/' + lang || pathname === '/' + lang + '/') {
      return { lang, page: 'index.html' };
    }
    const prefix = '/' + lang + '/';
    if (pathname.startsWith(prefix)) {
      const rest = pathname.slice(prefix.length);
      if (rest === '' || rest === 'index.html') return { lang, page: 'index.html' };
      if (LOCALIZABLE_PAGES.includes(rest)) return { lang, page: rest };
    }
  }
  return null;
}

class GeoLangInjector {
  constructor(lang) { this.lang = lang; }
  element(el) {
    el.append(`<script>window.__ODDVI_GEO_LANG__=${JSON.stringify(this.lang)};</script>`, { html: true });
  }
}

class SeoHeadInjector {
  constructor(html) { this.html = html; }
  element(el) { el.append(this.html, { html: true }); }
}

class HtmlLangSetter {
  constructor(lang) { this.lang = lang; }
  element(el) { el.setAttribute('lang', this.lang); }
}

class TitleSetter {
  constructor(titleText) { this.titleText = titleText; }
  element(el) { if (this.titleText) el.setInnerContent(this.titleText, { html: false }); }
}

class MetaDescSetter {
  constructor(descText) { this.descText = descText; }
  element(el) { if (this.descText) el.setAttribute('content', this.descText); }
}

// Mirrors the client-side apply() in i18n.js, but runs server-side so crawlers see real
// translated HTML with zero JavaScript required.
class I18nAttrSetter {
  constructor(attr, langDict, fallbackDict, mode) {
    this.attr = attr; this.d = langDict; this.f = fallbackDict; this.mode = mode; // mode: 'text' | 'html' | 'placeholder'
  }
  element(el) {
    const key = el.getAttribute(this.attr);
    if (!key) return;
    const v = this.d[key] != null ? this.d[key] : this.f[key];
    if (v == null) return;
    if (this.mode === 'text') el.setInnerContent(v, { html: false });
    else if (this.mode === 'html') el.setInnerContent(v, { html: true });
    else if (this.mode === 'placeholder') el.setAttribute('placeholder', v);
  }
}

async function handleLocalizedPage(request, env, ctx, lang, page, url) {
  try {
    const assetUrl = new URL(request.url);
    assetUrl.pathname = '/' + page;
    const assetReq = new Request(assetUrl.toString(), { method: request.method, headers: request.headers });
    const response = await env.ASSETS.fetch(assetReq);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const country = request.cf && request.cf.country;
    ctx.waitUntil(trackVisit(request, env, url, country).catch(() => {}));

    const langDict = dict[lang] || dict.en;
    const fallback = dict.en;
    const meta = (PAGE_META[page] && PAGE_META[page][lang]) || (PAGE_META[page] && PAGE_META[page].en);

    let rewriter = new HTMLRewriter()
      .on('[data-i18n]', new I18nAttrSetter('data-i18n', langDict, fallback, 'text'))
      .on('[data-i18n-html]', new I18nAttrSetter('data-i18n-html', langDict, fallback, 'html'))
      .on('[data-i18n-ph]', new I18nAttrSetter('data-i18n-ph', langDict, fallback, 'placeholder'))
      .on('html', new HtmlLangSetter(lang))
      .on('head', new SeoHeadInjector(buildHreflangHtml(page, lang)))
      .on('head', new GeoLangInjector(lang));

    if (meta && meta.title) rewriter = rewriter.on('title', new TitleSetter(meta.title));
    if (meta && meta.description) rewriter = rewriter.on('meta[name="description"]', new MetaDescSetter(meta.description));

    const transformed = rewriter.transform(response);
    const headers = new Headers(transformed.headers);
    headers.set('Cache-Control', 'no-store');
    return new Response(transformed.body, { status: transformed.status, statusText: transformed.statusText, headers });
  } catch (err) {
    if (url.searchParams.get('debug') === '1') {
      return new Response('Localization error: ' + String(err && err.stack || err), { status: 500 });
    }
    // Never let a localization bug take the page down — fail loud but visible instead of a
    // generic Cloudflare error page, and fall back to serving the plain English page untouched.
    try {
      const fallbackReq = new Request(new URL('/' + page, request.url).toString(), { method: request.method, headers: request.headers });
      const fallbackResp = await env.ASSETS.fetch(fallbackReq);
      const headers = new Headers(fallbackResp.headers);
      headers.set('X-Oddvi-Localize-Error', String(err && err.message || err).slice(0, 200));
      headers.set('Cache-Control', 'no-store');
      return new Response(fallbackResp.body, { status: fallbackResp.status, statusText: fallbackResp.statusText, headers });
    } catch (err2) {
      return new Response('Localization error: ' + String(err && err.stack || err), { status: 500 });
    }
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

    if (url.pathname === '/api/poll/history' && request.method === 'GET') {
      return handlePollHistory(url, env);
    }

    if (url.pathname === '/api/poll/controversial' && request.method === 'GET') {
      return handlePollControversial(url, env);
    }

    if (url.pathname === '/api/poll/today' && request.method === 'GET') {
      return handlePollToday(request, env);
    }

    if (url.pathname === '/api/poll/vote' && request.method === 'POST') {
      return handlePollVote(request, env);
    }

    if (url.pathname === '/api/admin-stats' && request.method === 'GET') {
      return handleAdminStats(url, env);
    }

    // Real, crawlable translated URLs: /tr/, /de/, /fr/, /hu/ (index + wallpapers for now).
    const localized = matchLocalizedPath(url.pathname);
    if (localized) {
      return handleLocalizedPage(request, env, ctx, localized.lang, localized.page, url);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const country = request.cf && request.cf.country;
    const lang = COUNTRY_LANG[country] || 'en';

    // Fire-and-forget visit tracking; never blocks or breaks the page response.
    ctx.waitUntil(trackVisit(request, env, url, country).catch(() => {}));

    // The default (un-prefixed, English) URL for a localized page needs hreflang links back to
    // its /tr/ /de/ /fr/ /hu/ siblings too — hreflang has to be reciprocal on every page in the set.
    const cleanPath = url.pathname.replace(/^\/+/, '');
    const defaultPage = cleanPath === '' ? 'index.html' : cleanPath;
    const isLocalizableDefault = LOCALIZABLE_PAGES.includes(defaultPage);

    let rewriter = new HTMLRewriter().on('head', new GeoLangInjector(lang));
    if (isLocalizableDefault) {
      rewriter = rewriter.on('head', new SeoHeadInjector(buildHreflangHtml(defaultPage, 'en')));
    } else if (contentType.includes('text/html')) {
      // No translated siblings for this page, but it still needs a canonical tag pointing at
      // itself so Google doesn't treat query-param/trailing-slash variants as duplicate content.
      const selfUrl = `https://theoddvi.com/${defaultPage === 'index.html' ? '' : defaultPage}`;
      rewriter = rewriter.on('head', new SeoHeadInjector(`\n<link rel="canonical" href="${selfUrl}" />\n`));
    }

    const transformed = rewriter.transform(response);
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
const STATS_CACHE_TTL_SECONDS = 3600; // 60 minutes — manual "force refresh" covers on-demand freshness, so auto-recompute can be rare

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

    const [dailyBlobs, scrollRaw, downloadsRaw, submitsRaw, pollBlobs] = await Promise.all([
      listDailyBlobs(env, 'visit:daily:'),
      listCounts(env, 'stat:scroll:'),
      listCounts(env, 'stat:download:'),
      listCounts(env, 'stat:submit:'),
      listDailyBlobs(env, 'poll:votes:')
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

    // ---- daily odd poll summary (all 3 slots per day) ----
    const pollByDay = {};
    for (const { day, data: v } of pollBlobs) pollByDay[day] = v;

    function slotsForDay(day) {
      const record = normalizeVotesRecord(pollByDay[day] ? JSON.stringify(pollByDay[day]) : null);
      return record.slots.map((votes, slot) => {
        const idx = pollIndexForSlot(day, slot, pollPool.length);
        const p = pollPool[idx];
        const total = (votes.a || 0) + (votes.b || 0);
        return {
          day,
          slot,
          series: p.series.en,
          question: p.question.en,
          option_a: p.option_a.en,
          option_b: p.option_b.en,
          votes_a: votes.a || 0,
          votes_b: votes.b || 0,
          total
        };
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const pollToday = slotsForDay(todayStr);

    const pollHistoryDays = Object.keys(pollByDay).sort().reverse().slice(0, 14);
    // Always include today even if it has zero votes yet (not in pollByDay until first vote).
    if (!pollHistoryDays.includes(todayStr)) pollHistoryDays.unshift(todayStr);
    const pollHistory = pollHistoryDays.flatMap(slotsForDay).filter(p => p.total > 0 || p.day === todayStr);
    const pollVotesAllTime = Object.values(pollByDay).reduce((sum, v) => {
      const rec = normalizeVotesRecord(JSON.stringify(v));
      return sum + rec.slots.reduce((s2, sl) => s2 + (sl.a || 0) + (sl.b || 0), 0);
    }, 0);

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
      poll_today: pollToday,
      poll_history: pollHistory,
      poll_votes_total: pollVotesAllTime,
      generated_at: new Date().toISOString()
    };

    await env.LIKES.put(STATS_CACHE_KEY, JSON.stringify(data), { expirationTtl: STATS_CACHE_TTL_SECONDS });

    data.cached = false;
    return json(data);
  } catch (err) {
    return json({ error: 'internal', message: String(err && err.stack || err) }, 500);
  }
}

// ---------- odd poll (2-choice, 3 slots/day, deterministic no-repeat rotation) ----------

const POLL_SLOTS = 3;

// Deterministic seeded shuffle (mulberry32) so each day+slot pick is reproducible across requests
// without needing to store/read a shuffle order from KV. Cycles through the whole pool with no
// repeats (now 3x faster since 3 slots consume 3 pool entries per day), then reshuffles for the next cycle.
function pollIndexForSlot(dayStr, slot, poolLen) {
  const epochDay = Math.floor(Date.parse(dayStr + 'T00:00:00Z') / 86400000);
  const virtualIndex = epochDay * POLL_SLOTS + slot;
  const cycle = Math.floor(virtualIndex / poolLen);
  const posInCycle = ((virtualIndex % poolLen) + poolLen) % poolLen;

  let seed = (cycle * 2654435761) >>> 0;
  function rng() {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const arr = Array.from({ length: poolLen }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr[posInCycle];
}

// Normalizes a votes KV record to the current { slots: [{a,b},{a,b},{a,b}] } shape.
// Handles legacy pre-multi-slot records that were a bare {a,b} for a single daily poll.
function normalizeVotesRecord(raw) {
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = null; }
  if (data && Array.isArray(data.slots)) {
    const slots = [];
    for (let i = 0; i < POLL_SLOTS; i++) slots.push(data.slots[i] || { a: 0, b: 0 });
    return { slots };
  }
  if (data && (typeof data.a === 'number' || typeof data.b === 'number')) {
    // legacy single-poll-per-day record — becomes slot 0, other slots start fresh
    return { slots: [{ a: data.a || 0, b: data.b || 0 }, { a: 0, b: 0 }, { a: 0, b: 0 }] };
  }
  return { slots: [{ a: 0, b: 0 }, { a: 0, b: 0 }, { a: 0, b: 0 }] };
}

async function pollVisitorHash(request, day, slot) {
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const ua = request.headers.get('User-Agent') || '';
  return (await sha256Hex('poll:' + ip + '|' + ua + '|' + day + '|' + slot)).slice(0, 24);
}

async function handlePollHistory(url, env) {
  const daysParam = parseInt(url.searchParams.get('days') || '30', 10);
  const days = Math.max(1, Math.min(isNaN(daysParam) ? 30 : daysParam, 120));

  const today = new Date();
  const dayList = [];
  for (let i = 1; i <= days; i++) {
    dayList.push(new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10));
  }

  const rawVotes = await Promise.all(dayList.map(d => env.LIKES.get('poll:votes:' + d)));

  const results = [];
  dayList.forEach((dayStr, i) => {
    const record = normalizeVotesRecord(rawVotes[i]);
    for (let slot = 0; slot < POLL_SLOTS; slot++) {
      const votes = record.slots[slot] || { a: 0, b: 0 };
      const total = (votes.a || 0) + (votes.b || 0);
      if (total === 0) continue; // nobody voted this slot that day — skip, not a real result

      const idx = pollIndexForSlot(dayStr, slot, pollPool.length);
      const p = pollPool[idx];
      results.push({
        day: dayStr,
        slot,
        series: p.series,
        question: p.question,
        option_a: p.option_a,
        option_b: p.option_b,
        votes,
        total
      });
    }
  });

  return json({ days: results });
}

// Ranks past polls (min. MIN_VOTES turnout) by closeness to a 50/50 split — the ones
// that split the room hardest. Requires at least MIN_VOTES so a 1-vs-1 tie doesn't rank #1.
async function handlePollControversial(url, env) {
  const daysParam = parseInt(url.searchParams.get('days') || '60', 10);
  const days = Math.max(1, Math.min(isNaN(daysParam) ? 60 : daysParam, 180));
  const limitParam = parseInt(url.searchParams.get('limit') || '12', 10);
  const limit = Math.max(1, Math.min(isNaN(limitParam) ? 12 : limitParam, 50));
  const MIN_VOTES = 8;

  const today = new Date();
  const dayList = [];
  for (let i = 1; i <= days; i++) {
    dayList.push(new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10));
  }

  const rawVotes = await Promise.all(dayList.map(d => env.LIKES.get('poll:votes:' + d)));

  const candidates = [];
  dayList.forEach((dayStr, i) => {
    const record = normalizeVotesRecord(rawVotes[i]);
    for (let slot = 0; slot < POLL_SLOTS; slot++) {
      const votes = record.slots[slot] || { a: 0, b: 0 };
      const total = (votes.a || 0) + (votes.b || 0);
      if (total < MIN_VOTES) continue;

      const idx = pollIndexForSlot(dayStr, slot, pollPool.length);
      const p = pollPool[idx];
      const pctA = (votes.a || 0) / total;
      const splitScore = 1 - Math.abs(pctA - 0.5) * 2; // 1 = perfect 50/50, 0 = unanimous

      candidates.push({
        day: dayStr,
        slot,
        series: p.series,
        question: p.question,
        option_a: p.option_a,
        option_b: p.option_b,
        votes,
        total,
        splitScore
      });
    }
  });

  candidates.sort((a, b) => b.splitScore - a.splitScore || b.total - a.total);

  return json({ polls: candidates.slice(0, limit) });
}

async function handlePollToday(request, env) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const votesKey = 'poll:votes:' + day;
    const rawVotes = await env.LIKES.get(votesKey);
    const record = normalizeVotesRecord(rawVotes);

    const polls = await Promise.all(Array.from({ length: POLL_SLOTS }, async (_, slot) => {
      const idx = pollIndexForSlot(day, slot, pollPool.length);
      const poll = pollPool[idx];
      const visitorHash = await pollVisitorHash(request, day, slot);
      const seenKey = 'poll:seen:' + day + ':' + slot + ':' + visitorHash;
      const yourVote = await env.LIKES.get(seenKey);
      return {
        slot,
        series: poll.series,
        question: poll.question,
        option_a: poll.option_a,
        option_b: poll.option_b,
        votes: record.slots[slot] || { a: 0, b: 0 },
        yourVote: yourVote || null
      };
    }));

    return json({ date: day, polls });
  } catch (err) {
    return json({ error: 'internal', message: String(err && err.stack || err) }, 500);
  }
}

async function handlePollVote(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'bad json' }, 400);
  }
  const choice = body && body.choice;
  const slot = Number.isInteger(body && body.slot) ? body.slot : 0;
  if (choice !== 'a' && choice !== 'b') return json({ error: 'invalid choice' }, 400);
  if (slot < 0 || slot >= POLL_SLOTS) return json({ error: 'invalid slot' }, 400);

  const day = new Date().toISOString().slice(0, 10);
  const votesKey = 'poll:votes:' + day;
  const visitorHash = await pollVisitorHash(request, day, slot);
  const seenKey = 'poll:seen:' + day + ':' + slot + ':' + visitorHash;

  const existing = await env.LIKES.get(seenKey);
  const rawVotes = await env.LIKES.get(votesKey);
  const record = normalizeVotesRecord(rawVotes);

  if (existing) {
    // Already voted this slot today — return current tallies untouched, idempotent.
    return json({ votes: record.slots[slot], yourVote: existing });
  }

  record.slots[slot][choice] = (record.slots[slot][choice] || 0) + 1;
  await Promise.all([
    env.LIKES.put(votesKey, JSON.stringify(record)),
    env.LIKES.put(seenKey, choice, { expirationTtl: 60 * 60 * 30 })
  ]);

  return json({ votes: record.slots[slot], yourVote: choice });
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
export { listCounts, listDailyBlobs, handleAdminStats, trackVisit, referrerBucket, sha256Hex, bump, handleStat, matchLocalizedPath, buildHreflangHtml, localizedUrl, handleLocalizedPage, pollIndexForSlot, handlePollToday, handlePollVote, handlePollHistory, handlePollControversial };
// deploy webhook test 2026-07-18T16:32:47Z
