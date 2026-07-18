(function () {
  var listEl, emptyEl, loadMoreWrap, loadMoreBtn;
  var entries = [];
  var currentLimit = 12;
  var MAX_LIMIT = 60;
  var STEP = 12;

  var TEXT = {
    en: { kicker: "Most Controversial", title: "The polls that split<br>the room in half.", sub: "Ranked by how close the vote was to 50/50 — the ones nobody could agree on.", back: "← Back to today's poll", backShort: "← Today's poll", more: "Load more", empty: "Not enough votes yet to crown a winner-splitter. Check back soon.", split: "{n}% split" },
    tr: { kicker: "En Tartışmalı", title: "Herkesi ikiye bölen<br>anketler.", sub: "Oyların %50/50'ye ne kadar yakın olduğuna göre sıralandı — üzerinde kimsenin uzlaşamadığı sorular.", back: "← Bugünün anketine dön", backShort: "← Bugünün anketi", more: "Daha fazla göster", empty: "Henüz kazananı belirsiz bırakacak kadar oy yok. Yakında tekrar bak.", split: "%{n} bölünme" },
    de: { kicker: "Am Umstrittensten", title: "Die Umfragen, die den<br>Raum spalten.", sub: "Sortiert danach, wie nah die Abstimmung bei 50/50 lag — worüber sich niemand einig war.", back: "← Zurück zur heutigen Umfrage", backShort: "← Heutige Umfrage", more: "Mehr laden", empty: "Noch nicht genug Stimmen. Schau bald wieder vorbei.", split: "{n}% gespalten" },
    fr: { kicker: "Les Plus Controversés", title: "Les sondages qui divisent<br>tout le monde.", sub: "Classés selon la proximité du vote avec 50/50 — ceux sur lesquels personne n'était d'accord.", back: "← Retour au sondage du jour", backShort: "← Sondage du jour", more: "Charger plus", empty: "Pas encore assez de votes. Reviens bientôt.", split: "{n}% de partage" },
    hu: { kicker: "Legvitatottabb", title: "A szavazások, amik<br>kettéosztják a termet.", sub: "Aszerint rangsorolva, mennyire állt közel a szavazás az 50/50-hez — amiben senki sem értett egyet.", back: "← Vissza a mai szavazáshoz", backShort: "← Mai szavazás", more: "Több betöltése", empty: "Még nincs elég szavazat. Nézz vissza hamarosan.", split: "{n}% megosztottság" }
  };

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && TEXT[l]) ? l : 'en';
  }

  function applyText() {
    var t = TEXT[currentLang()];
    var kicker = document.getElementById('t-kicker');
    var title = document.getElementById('t-title');
    var sub = document.getElementById('t-sub');
    var back = document.getElementById('t-backToPoll');
    var floatBack = document.getElementById('floatBack');
    var loadMore = document.getElementById('loadMoreBtn');
    if (kicker) kicker.textContent = t.kicker;
    if (title) title.innerHTML = t.title;
    if (sub) sub.textContent = t.sub;
    if (back) back.textContent = t.back;
    if (floatBack) floatBack.textContent = t.backShort;
    if (loadMore) loadMore.textContent = t.more;
    render();
  }

  function pct(a, b) {
    var total = a + b;
    if (total <= 0) return [50, 50];
    var pa = Math.round((a / total) * 100);
    return [pa, 100 - pa];
  }

  function formatDate(dayStr, lang) {
    try {
      var d = new Date(dayStr + 'T00:00:00Z');
      var locale = { en: 'en-US', tr: 'tr-TR', de: 'de-DE', fr: 'fr-FR', hu: 'hu-HU' }[lang] || 'en-US';
      return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    } catch (e) { return dayStr; }
  }

  function render() {
    var lang = currentLang();
    var t = TEXT[lang];
    if (!entries.length) {
      listEl.innerHTML = '';
      emptyEl.textContent = t.empty;
      emptyEl.hidden = false;
      loadMoreWrap.hidden = true;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = entries.map(function (p) {
      var percentages = pct(p.votes.a || 0, p.votes.b || 0);
      var closeness = Math.round((1 - Math.abs(percentages[0] - 50) / 50) * 100);
      var aWins = (p.votes.a || 0) > (p.votes.b || 0);
      var bWins = (p.votes.b || 0) > (p.votes.a || 0);
      var series = p.series[lang] || p.series.en;
      var question = p.question[lang] || p.question.en;
      var optA = p.option_a[lang] || p.option_a.en;
      var optB = p.option_b[lang] || p.option_b.en;

      return (
        '<div class="poll-entry">' +
          '<span class="split-badge">' + t.split.replace('{n}', closeness) + '</span>' +
          '<div class="top-row"><span class="series">' + series + '</span><span class="date">' + formatDate(p.day, lang) + (typeof p.slot === 'number' ? ' · ' + (p.slot + 1) + '/3' : '') + '</span></div>' +
          '<div class="question">' + question + '</div>' +
          '<div class="opt-row' + (aWins ? ' winner' : '') + '"><div class="top"><span>' + optA + '</span><span>' + percentages[0] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + percentages[0] + '%"></div></div></div>' +
          '<div class="opt-row' + (bWins ? ' winner' : '') + '"><div class="top"><span>' + optB + '</span><span>' + percentages[1] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + percentages[1] + '%"></div></div></div>' +
        '</div>'
      );
    }).join('');

    loadMoreWrap.hidden = currentLimit >= MAX_LIMIT;
  }

  async function load(limit) {
    try {
      var res = await fetch('/api/poll/controversial?days=90&limit=' + limit);
      var data = await res.json();
      entries = data.polls || [];
      render();
    } catch (e) {
      emptyEl.textContent = TEXT[currentLang()].empty;
      emptyEl.hidden = false;
      loadMoreWrap.hidden = true;
    }
  }

  function init() {
    listEl = document.getElementById('pollList');
    emptyEl = document.getElementById('emptyMsg');
    loadMoreWrap = document.getElementById('loadMoreWrap');
    loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!listEl) return;

    loadMoreBtn.addEventListener('click', function () {
      currentLimit = Math.min(currentLimit + STEP, MAX_LIMIT);
      load(currentLimit);
    });

    window.addEventListener('oddvi:lang', applyText);

    var mascotEl = document.getElementById('histMascot');
    if (mascotEl && window.OddviPollMascot) mascotEl.src = window.OddviPollMascot.get();

    applyText();
    load(currentLimit);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
