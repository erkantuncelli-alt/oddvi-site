(function () {
  var listEl, emptyEl, loadMoreWrap, loadMoreBtn;
  var entries = [];
  var currentDays = 30;
  var MAX_DAYS = 120;
  var STEP = 30;

  var VOTES_LABEL = { en: 'votes', tr: 'oy', de: 'Stimmen', fr: 'votes', hu: 'szavazat' };

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && ['en','tr','de','fr','hu'].indexOf(l) !== -1) ? l : 'en';
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
    if (!entries.length) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      loadMoreWrap.hidden = true;
      return;
    }
    emptyEl.hidden = true;

    listEl.innerHTML = entries.map(function (p) {
      var percentages = pct(p.votes.a || 0, p.votes.b || 0);
      var aWins = (p.votes.a || 0) > (p.votes.b || 0);
      var bWins = (p.votes.b || 0) > (p.votes.a || 0);
      var series = p.series[lang] || p.series.en;
      var question = p.question[lang] || p.question.en;
      var optA = p.option_a[lang] || p.option_a.en;
      var optB = p.option_b[lang] || p.option_b.en;

      return (
        '<div class="poll-entry">' +
          '<div class="top-row"><span class="series">' + series + '</span><span class="date">' + formatDate(p.day, lang) + '</span></div>' +
          '<div class="question">' + question + '</div>' +
          '<div class="opt-row' + (aWins ? ' winner' : '') + '"><div class="top"><span>' + optA + '</span><span>' + percentages[0] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + percentages[0] + '%"></div></div></div>' +
          '<div class="opt-row' + (bWins ? ' winner' : '') + '"><div class="top"><span>' + optB + '</span><span>' + percentages[1] + '%</span></div><div class="bar-bg"><div class="bar-fill" style="width:' + percentages[1] + '%"></div></div></div>' +
          '<div class="total">' + p.total.toLocaleString(lang === 'tr' ? 'tr-TR' : lang) + ' ' + (VOTES_LABEL[lang] || VOTES_LABEL.en) + '</div>' +
        '</div>'
      );
    }).join('');

    loadMoreWrap.hidden = currentDays >= MAX_DAYS;
  }

  async function load(days) {
    try {
      var res = await fetch('/api/poll/history?days=' + days);
      var data = await res.json();
      entries = data.days || [];
      render();
    } catch (e) {
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
      currentDays = Math.min(currentDays + STEP, MAX_DAYS);
      load(currentDays);
    });

    window.addEventListener('oddvi:lang', render);

    load(currentDays);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
