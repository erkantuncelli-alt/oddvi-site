/* ============================================================
   ODDVI · Odd Streak
   Günlük giriş serisini localStorage ile takip eder.
   Her sayfada <script src="/streak.js"></script> ile yüklenir.
   ============================================================ */
window.OddStreak = (function () {
  var KEY = 'oddvi_streak';

  function todayStr(offsetDays) {
    var d = new Date();
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var s = raw ? JSON.parse(raw) : null;
      return (s && typeof s.count === 'number') ? s : { count: 0, last: null, best: 0 };
    } catch (e) { return { count: 0, last: null, best: 0 }; }
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* Bugünkü ziyareti sayar; art arda gelirse artırır, araya gün girerse sıfırlar. */
  function bump() {
    var s = load();
    var t = todayStr(0);
    if (s.last === t) return s;
    if (s.last === todayStr(-1)) s.count = (s.count || 0) + 1;
    else s.count = 1;
    s.last = t;
    s.best = Math.max(s.best || 0, s.count);
    save(s);
    return s;
  }

  var MILESTONES = [
    { n: 3,   emoji: '🌱', tr: 'Tuhaflık filizleniyor.',        en: 'The odd is sprouting.' },
    { n: 7,   emoji: '🔥', tr: 'Bir hafta boyunca tuhaf kaldın.', en: 'A full week of staying odd.' },
    { n: 14,  emoji: '⚡', tr: 'İki hafta — artık bir alışkanlık.', en: 'Two weeks — it\u2019s a habit now.' },
    { n: 30,  emoji: '👑', tr: 'Bir ay boyunca hiç normal olmadın.', en: 'A whole month without going normal.' },
    { n: 60,  emoji: '🌀', tr: 'Bu seviyeye "efsane" denir.',    en: 'This tier is called legendary.' },
    { n: 100, emoji: '🏆', tr: '100 gün. Sen artık Oddvi\u2019nin akrabasısın.', en: '100 days. You\u2019re basically family now.' }
  ];

  function milestoneFor(count) {
    var best = null;
    for (var i = 0; i < MILESTONES.length; i++) {
      if (count >= MILESTONES[i].n) best = MILESTONES[i];
    }
    return best;
  }

  function badgeEmoji(count) {
    var m = milestoneFor(count);
    return m ? m.emoji : '🥚';
  }

  return { bump: bump, load: load, milestoneFor: milestoneFor, badgeEmoji: badgeEmoji, MILESTONES: MILESTONES };
})();

/* ---- UI: yüzen streak rozeti (her sayfada otomatik monte edilir) ---- */
(function () {
  function lang() { return document.documentElement.lang || localStorage.getItem('oddvi_lang') || 'en'; }
  function isTr() { return lang() === 'tr'; }

  function mount() {
    var s = window.OddStreak.bump();
    var emoji = window.OddStreak.badgeEmoji(s.count);

    var wrap = document.createElement('div');
    wrap.id = 'oddStreakWrap';
    wrap.innerHTML =
      '<button id="oddStreakBtn" aria-label="Odd Streak">' +
        '<span class="os-emoji">' + emoji + '</span>' +
        '<span class="os-count">' + s.count + '</span>' +
      '</button>' +
      '<div id="oddStreakPop" role="dialog" aria-hidden="true">' +
        '<button id="oddStreakClose" aria-label="Close">&times;</button>' +
        '<div class="os-emoji-big">' + emoji + '</div>' +
        '<div class="os-title"></div>' +
        '<div class="os-sub"></div>' +
        '<button id="oddStreakShare" class="os-share">' + (isTr() ? 'Serimi paylaş' : 'Share my streak') + '</button>' +
      '</div>';
    document.body.appendChild(wrap);

    var titleEl = wrap.querySelector('.os-title');
    var subEl = wrap.querySelector('.os-sub');
    var m = window.OddStreak.milestoneFor(s.count);

    if (isTr()) {
      titleEl.textContent = s.count + ' gündür tuhafsın.';
      subEl.textContent = m ? m.tr : 'Yarın da gel, seriyi bozma.';
    } else {
      titleEl.textContent = s.count + ' day streak of staying odd.';
      subEl.textContent = m ? m.en : 'Come back tomorrow — don\u2019t break the streak.';
    }

    var btn = document.getElementById('oddStreakBtn');
    var pop = document.getElementById('oddStreakPop');
    var close = document.getElementById('oddStreakClose');
    btn.addEventListener('click', function () {
      var open = pop.classList.toggle('open');
      pop.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    close.addEventListener('click', function () {
      pop.classList.remove('open');
      pop.setAttribute('aria-hidden', 'true');
    });

    document.getElementById('oddStreakShare').addEventListener('click', function () {
      var text = isTr()
        ? (s.count + ' gündür Oddvi\u2019yle tuhaflığımı sürdürüyorum 🔥 Sen kaç gündür tuhafsın?\nhttps://theoddvi.com')
        : (s.count + ' days of staying odd with Oddvi 🔥 How odd are you?\nhttps://theoddvi.com');
      if (navigator.share) {
        navigator.share({ title: 'Oddvi', text: text }).catch(function () {});
      } else {
        var wa = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(wa, '_blank');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
