/* ============================================================
   ODDVI · Normal Mode / Odd Mode toggle
   "Normal Mode" drains the site of color and motion (boring,
   corporate) as a joke on conformity. "Odd Mode" (default) is
   the site as designed. Persisted in localStorage, works
   site-wide via a single script include.
   ============================================================ */
(function () {
  var STORAGE_KEY = 'oddvi-mode';

  var css =
    /* toggle switch UI */
    '.mode-toggle{position:relative;display:inline-flex;align-items:center;width:112px;height:32px;border-radius:999px;border:2.5px solid var(--ink,#141414);background:var(--yellow,#ffc93c);cursor:pointer;padding:0;box-shadow:2px 2px 0 var(--ink,#141414);flex:none;font-family:var(--font-disp,inherit)}' +
    '.mode-toggle-thumb{position:absolute;top:2px;left:2px;width:52px;height:24px;border-radius:999px;background:var(--ink,#141414);transition:transform .28s cubic-bezier(.4,0,.2,1);z-index:1}' +
    '.mode-toggle[aria-pressed="true"] .mode-toggle-thumb{transform:translateX(54px)}' +
    '.mode-toggle-label{position:relative;z-index:2;flex:1;text-align:center;font-weight:800;font-size:9.5px;letter-spacing:.03em;color:var(--ink,#141414);pointer-events:none}' +
    '.mode-toggle[aria-pressed="true"] .mode-toggle-label.lbl-odd,.mode-toggle:not([aria-pressed="true"]) .mode-toggle-label.lbl-normal{color:var(--ink,#141414);opacity:.4}' +
    '.mode-toggle[aria-pressed="true"] .mode-toggle-label.lbl-normal,.mode-toggle:not([aria-pressed="true"]) .mode-toggle-label.lbl-odd{color:#fff}' +

    /* Normal Mode transformation */
    'html.normal-mode{filter:grayscale(1) contrast(.92)}' +
    'body.normal-mode *,body.normal-mode *::before,body.normal-mode *::after{' +
      'animation-duration:.01ms!important;animation-iteration-count:1!important;' +
      'transition-duration:.01ms!important;scroll-behavior:auto!important' +
    '}' +
    'body.normal-mode{--font-disp:Arial,Helvetica,sans-serif;--font-body:Arial,Helvetica,sans-serif}' +
    'body.normal-mode .logo,body.normal-mode .kicker,body.normal-mode .eyebrow,' +
    'body.normal-mode .hl,body.normal-mode .marquee,body.normal-mode .backlink,' +
    'body.normal-mode .float-back,body.normal-mode .poll-mascot,body.normal-mode .pullquote,' +
    'body.normal-mode .meet-img,body.normal-mode .story-img,body.normal-mode .pop,' +
    'body.normal-mode .wall-rank{transform:none!important}' +
    /* keep the toggle itself unaffected so it's always usable/legible */
    'html.normal-mode .mode-toggle{filter:none}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function save(mode) {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* ignore */ }
  }

  function apply(mode, btn) {
    var isNormal = mode === 'normal';
    document.documentElement.classList.toggle('normal-mode', isNormal);
    document.body.classList.toggle('normal-mode', isNormal);
    if (btn) btn.setAttribute('aria-pressed', isNormal ? 'true' : 'false');
  }

  function buildToggle() {
    var host = document.getElementById('langSwitch');
    if (!host || !host.parentNode) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mode-toggle';
    btn.setAttribute('aria-pressed', 'false');
    btn.title = 'Normal Mode / Odd Mode';
    btn.innerHTML =
      '<span class="mode-toggle-thumb"></span>' +
      '<span class="mode-toggle-label lbl-odd">ODD</span>' +
      '<span class="mode-toggle-label lbl-normal">NORMAL</span>';

    host.parentNode.insertBefore(btn, host.nextSibling);

    var saved = getSaved() === 'normal' ? 'normal' : 'odd';
    apply(saved, btn);

    btn.addEventListener('click', function () {
      var next = document.body.classList.contains('normal-mode') ? 'odd' : 'normal';
      apply(next, btn);
      save(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToggle);
  } else {
    buildToggle();
  }
})();
