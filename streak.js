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
    { n: 3,   emoji: '🌱', tr: 'Tuhaflık filizleniyor.',        en: 'The odd is sprouting.',
      de: 'Das Seltsame keimt.', fr: 'La bizarrerie germe.', hu: 'A furaság csírázik.' },
    { n: 7,   emoji: '🔥', tr: 'Bir hafta boyunca tuhaf kaldın.', en: 'A full week of staying odd.',
      de: 'Eine ganze Woche seltsam geblieben.', fr: 'Une semaine entière à rester bizarre.', hu: 'Egy egész hét furaságban.' },
    { n: 14,  emoji: '⚡', tr: 'İki hafta — artık bir alışkanlık.', en: 'Two weeks — it\u2019s a habit now.',
      de: 'Zwei Wochen — jetzt ist es Gewohnheit.', fr: 'Deux semaines — c\u2019est une habitude maintenant.', hu: 'Két hét — most már szokás.' },
    { n: 30,  emoji: '👑', tr: 'Bir ay boyunca hiç normal olmadın.', en: 'A whole month without going normal.',
      de: 'Ein ganzer Monat ohne normal zu werden.', fr: 'Un mois entier sans jamais devenir normal.', hu: 'Egy egész hónap normálisság nélkül.' },
    { n: 60,  emoji: '🌀', tr: 'Bu seviyeye "efsane" denir.',    en: 'This tier is called legendary.',
      de: 'Diese Stufe nennt man legendär.', fr: 'Ce niveau, on l\u2019appelle légendaire.', hu: 'Ezt a szintet legendásnak hívják.' },
    { n: 100, emoji: '🏆', tr: '100 gün. Sen artık Oddvi\u2019nin akrabasısın.', en: '100 days. You\u2019re basically family now.',
      de: '100 Tage. Du gehörst jetzt praktisch zur Familie.', fr: '100 jours. Tu fais quasiment partie de la famille maintenant.', hu: '100 nap. Gyakorlatilag már a családhoz tartozol.' }
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
  function lang() {
    var l = document.documentElement.lang || localStorage.getItem('oddvi_lang') || 'en';
    return ['en','tr','de','fr','hu'].indexOf(l) > -1 ? l : 'en';
  }

  var STR = {
    en: { title: function(n){ return n + ' day streak of staying odd.'; }, sub: 'Come back tomorrow \u2014 don\u2019t break the streak.', share: 'Share my streak',
          shareText: function(n){ return n + ' days of staying odd with Oddvi \uD83D\uDD25 How odd are you?\nhttps://theoddvi.com'; } },
    tr: { title: function(n){ return n + ' g\u00fcnd\u00fcr tuhafs\u0131n.'; }, sub: 'Yar\u0131n da gel, seriyi bozma.', share: 'Serimi payla\u015f',
          shareText: function(n){ return n + ' g\u00fcnd\u00fcr Oddvi\u2019yle tuhafl\u0131\u011f\u0131m\u0131 s\u00fcrd\u00fcr\u00fcyorum \uD83D\uDD25 Sen ka\u00e7 g\u00fcnd\u00fcr tuhafs\u0131n?\nhttps://theoddvi.com'; } },
    de: { title: function(n){ return n + ' Tage in Folge seltsam.'; }, sub: 'Komm morgen wieder \u2014 brich die Serie nicht.', share: 'Meine Serie teilen',
          shareText: function(n){ return n + ' Tage seltsam mit Oddvi \uD83D\uDD25 Wie seltsam bist du?\nhttps://theoddvi.com'; } },
    fr: { title: function(n){ return n + ' jours d\u2019affil\u00e9e \u00e0 rester bizarre.'; }, sub: 'Reviens demain \u2014 ne casse pas la s\u00e9rie.', share: 'Partager ma s\u00e9rie',
          shareText: function(n){ return n + ' jours \u00e0 rester bizarre avec Oddvi \uD83D\uDD25 Et toi, \u00e0 quel point es-tu bizarre ?\nhttps://theoddvi.com'; } },
    hu: { title: function(n){ return n + ' napja vagy furcsa, egyfolytában.'; }, sub: 'Gyere vissza holnap is \u2014 ne t\u00f6rd meg a sorozatot.', share: 'Sorozatom megoszt\u00e1sa',
          shareText: function(n){ return n + ' napja vagyok fura Oddvival \uD83D\uDD25 Te mennyire vagy fura?\nhttps://theoddvi.com'; } }
  };

  var mounted = false;

  function render() {
    var s = window.OddStreak.load();
    var l = lang();
    var t = STR[l];
    var emoji = window.OddStreak.badgeEmoji(s.count);
    var m = window.OddStreak.milestoneFor(s.count);

    document.getElementById('oddStreakBtn').querySelector('.os-emoji').textContent = emoji;
    document.getElementById('oddStreakBtn').querySelector('.os-count').textContent = s.count;
    document.querySelector('#oddStreakPop .os-emoji-big').textContent = emoji;
    document.querySelector('#oddStreakPop .os-title').textContent = t.title(s.count);
    document.querySelector('#oddStreakPop .os-sub').textContent = m ? (m[l] || m.en) : t.sub;
    document.getElementById('oddStreakShare').textContent = t.share;
  }

  function mount() {
    if (mounted) { render(); return; }
    mounted = true;
    window.OddStreak.bump();

    var wrap = document.createElement('div');
    wrap.id = 'oddStreakWrap';
    wrap.innerHTML =
      '<button id="oddStreakBtn" aria-label="Odd Streak">' +
        '<span class="os-emoji"></span>' +
        '<span class="os-count"></span>' +
      '</button>' +
      '<div id="oddStreakPop" role="dialog" aria-hidden="true">' +
        '<button id="oddStreakClose" aria-label="Close">&times;</button>' +
        '<div class="os-emoji-big"></div>' +
        '<div class="os-title"></div>' +
        '<div class="os-sub"></div>' +
        '<button id="oddStreakShare" class="os-share"></button>' +
      '</div>';
    document.body.appendChild(wrap);

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
      var s = window.OddStreak.load();
      var text = STR[lang()].shareText(s.count);
      if (navigator.share) {
        navigator.share({ title: 'Oddvi', text: text }).catch(function () {});
      } else {
        var wa = 'https://wa.me/?text=' + encodeURIComponent(text);
        window.open(wa, '_blank');
      }
    });

    render();
    window.addEventListener('oddvi:lang', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
