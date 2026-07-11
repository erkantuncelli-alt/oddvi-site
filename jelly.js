/* ============================================================
   ODDVI · Jelly click feedback
   Adds a playful squash-and-stretch "jelly" wobble to buttons
   and button-like links whenever they're clicked. Works site-wide
   via event delegation — no per-page wiring needed beyond the
   script tag. Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  var SELECTOR = [
    '.btn', '.nav-cta', '.poll-opt', '.lang-btn', '.like-btn',
    '.card-share', '.backlink', '.loadmore', '.float-back',
    '#oddStreakBtn', '#pollShareBtn', '#pollDownloadBtn', '.os-share',
    'button', 'input[type="submit"]'
  ].join(',');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var css =
    '@keyframes oddvi-jelly-pop{' +
      '0%{transform:scale(1,1)}' +
      '28%{transform:scale(.82,1.18)}' +
      '52%{transform:scale(1.16,.86)}' +
      '72%{transform:scale(.94,1.06)}' +
      '88%{transform:scale(1.03,.98)}' +
      '100%{transform:scale(1,1)}' +
    '}' +
    '.oddvi-jelly-pop{animation:oddvi-jelly-pop .5s cubic-bezier(.36,1.4,.4,1) both !important;transform-origin:center center}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  document.addEventListener('click', function (e) {
    var el = e.target.closest(SELECTOR);
    if (!el) return;
    el.classList.remove('oddvi-jelly-pop');
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth; // restart animation even on rapid repeat clicks
    el.classList.add('oddvi-jelly-pop');
  });

  document.addEventListener('animationend', function (e) {
    if (e.animationName === 'oddvi-jelly-pop') {
      e.target.classList.remove('oddvi-jelly-pop');
    }
  });
})();
