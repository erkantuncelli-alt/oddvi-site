/* ============================================================
   ODDVI · Blob Buddy
   A small, calm (no idle motion) Oddvi badge docked bottom-left.
   Tap/click it: it bounces, "boops" (synthesized sound, no file),
   and pops a random one-word reaction. Mobile-first — everything
   is tap-triggered, nothing depends on a mouse cursor.
   To remove: delete this file and its <script> tag from pages.
   ============================================================ */
(function () {
  var PHRASES = ['Hi!', 'Boop!', 'Odd?', 'Hey!', 'Yo!', 'Hm?', 'Eek!', ':)'];
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css =
    '#oddviBuddyWrap{position:fixed;left:14px;bottom:14px;z-index:59;-webkit-tap-highlight-color:transparent}' +
    '#oddviBuddyWrap.dragging{transition:none!important}' +
    '@media(max-width:680px){#oddviBuddyWrap{left:10px;bottom:10px}}' +
    '#oddviBuddy{width:52px;height:52px;border-radius:999px;background:var(--card,#fff);border:2.5px solid var(--ink,#141414);box-shadow:3px 3px 0 var(--ink,#141414);cursor:grab;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0;touch-action:none}' +
    '#oddviBuddy:active{cursor:grabbing}' +
    '#oddviBuddy img{width:76%;height:76%;object-fit:contain;pointer-events:none;user-select:none}' +
    '#oddviBuddy:active{transform:translate(1px,1px);box-shadow:2px 2px 0 var(--ink,#141414)}' +
    '@keyframes oddvi-buddy-pop{' +
      '0%{transform:scale(1) rotate(0deg)}' +
      '25%{transform:scale(.8,1.2) rotate(-6deg)}' +
      '50%{transform:scale(1.22,.82) rotate(5deg)}' +
      '72%{transform:scale(.94,1.06) rotate(-2deg)}' +
      '100%{transform:scale(1) rotate(0deg)}' +
    '}' +
    '#oddviBuddy.buddy-pop{animation:oddvi-buddy-pop .55s cubic-bezier(.36,1.4,.4,1) both}' +
    '#oddviBuddyBubble{position:absolute;bottom:64px;left:0;background:var(--ink,#141414);color:#fff;font-family:var(--font-disp,inherit);font-weight:800;font-size:13px;padding:6px 12px;border-radius:10px;white-space:nowrap;opacity:0;transform:translateY(6px) scale(.9);transition:opacity .18s,transform .18s;pointer-events:none}' +
    '#oddviBuddyBubble::after{content:"";position:absolute;left:16px;bottom:-6px;border:6px solid transparent;border-top-color:var(--ink,#141414)}' +
    '#oddviBuddyBubble.show{opacity:1;transform:translateY(0) scale(1)}' +
    '.oddvi-buddy-spark{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--yellow,#ffc93c);pointer-events:none;opacity:0}' +
    '@keyframes oddvi-buddy-spark{' +
      '0%{opacity:1;transform:translate(0,0) scale(1)}' +
      '100%{opacity:0;transform:var(--sparkT) scale(.3)}' +
    '}' +
    '.oddvi-buddy-spark.fly{animation:oddvi-buddy-spark .55s ease-out both}';

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // --- tiny synthesized "boop" sound, no audio file needed ---
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var actx = null;
  function playBoop() {
    if (!AudioCtx) return;
    try {
      if (!actx) actx = new AudioCtx();
      if (actx.state === 'suspended') actx.resume();
      var t0 = actx.currentTime;
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.type = 'sine';
      var startFreq = 320 + Math.random() * 120;
      osc.frequency.setValueAtTime(startFreq, t0);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 1.9, t0 + 0.09);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.7, t0 + 0.22);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.26);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.28);
    } catch (e) { /* audio not available — silently skip */ }
  }

  function spawnSparks(host) {
    for (var i = 0; i < 5; i++) {
      var s = document.createElement('span');
      s.className = 'oddvi-buddy-spark';
      var angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.6;
      var dist = 26 + Math.random() * 14;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist - 10;
      s.style.setProperty('--sparkT', 'translate(' + tx + 'px,' + ty + 'px)');
      s.style.left = '50%';
      s.style.top = '50%';
      host.appendChild(s);
      requestAnimationFrame(function (el) {
        return function () { el.classList.add('fly'); };
      }(s));
      s.addEventListener('animationend', function () { this.remove(); });
      setTimeout(function (el) { if (el.parentNode) el.remove(); }, 900, s);
    }
  }

  var POS_KEY = 'oddvi-buddy-pos';
  var DRAG_THRESHOLD = 6; // px of movement before a press counts as a drag, not a tap

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function applySavedPosition(wrap) {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (e) { saved = null; }
    if (!saved || typeof saved.left !== 'number' || typeof saved.top !== 'number') return;

    var rect = wrap.getBoundingClientRect();
    var maxLeft = window.innerWidth - rect.width - 4;
    var maxTop = window.innerHeight - rect.height - 4;
    var left = clamp(saved.left, 4, Math.max(4, maxLeft));
    var top = clamp(saved.top, 4, Math.max(4, maxTop));

    wrap.style.left = left + 'px';
    wrap.style.top = top + 'px';
    wrap.style.bottom = 'auto';
  }

  function savePosition(wrap) {
    var rect = wrap.getBoundingClientRect();
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
    } catch (e) { /* ignore */ }
  }

  function makeDraggable(wrap, btn, onTap) {
    var dragging = false;
    var moved = false;
    var startX, startY, startLeft, startTop;

    btn.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return; // left click / primary touch only
      var rect = wrap.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      moved = false;
      dragging = true;
      wrap.style.left = startLeft + 'px';
      wrap.style.top = startTop + 'px';
      wrap.style.bottom = 'auto';
      try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });

    btn.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        moved = true;
        wrap.classList.add('dragging');
      }
      if (moved) {
        var rect = wrap.getBoundingClientRect();
        var newLeft = clamp(startLeft + dx, 4, window.innerWidth - rect.width - 4);
        var newTop = clamp(startTop + dy, 4, window.innerHeight - rect.height - 4);
        wrap.style.left = newLeft + 'px';
        wrap.style.top = newTop + 'px';
      }
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('dragging');
      if (moved) {
        savePosition(wrap);
      } else {
        onTap();
      }
      moved = false;
    }

    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);

    window.addEventListener('resize', function () {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (err) { saved = null; }
      if (!saved) return;
      applySavedPosition(wrap);
    });
  }

  function build() {
    if (document.getElementById('oddviBuddyWrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'oddviBuddyWrap';

    var bubble = document.createElement('div');
    bubble.id = 'oddviBuddyBubble';

    var btn = document.createElement('button');
    btn.id = 'oddviBuddy';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Say hi to Oddvi — drag to move');
    btn.innerHTML = '<img src="/uploads/oddvi-logo-icon.png" alt="" />';

    wrap.appendChild(bubble);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    applySavedPosition(wrap);

    var bubbleTimer = null;

    function react() {
      playBoop();

      if (!reduceMotion) {
        btn.classList.remove('buddy-pop');
        void btn.offsetWidth;
        btn.classList.add('buddy-pop');
        spawnSparks(wrap);
      }

      var phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      bubble.textContent = phrase;
      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(function () { bubble.classList.remove('show'); }, 1200);
    }

    makeDraggable(wrap, btn, react);

    btn.addEventListener('animationend', function (e) {
      if (e.animationName === 'oddvi-buddy-pop') btn.classList.remove('buddy-pop');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
