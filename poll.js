/* ============================================================
   ODDVI · Daily Odd Poll widget
   Fetches today's 2-choice poll, renders in the active site
   language, submits a vote once per visitor/day, then offers a
   generated result card for Instagram Story / download sharing.
   ============================================================ */
(function () {
  var API_TODAY = '/api/poll/today';
  var API_VOTE = '/api/poll/vote';

  var UI = {
    en: { hint: "Tap one. See what everyone picked.", voted: "Thanks for voting!", share: "Share your pick", download: "Download image", newTomorrow: "New question tomorrow", loading: "Loading today's odd question…" },
    tr: { hint: "Birine dokun. Herkes ne seçmiş gör.", voted: "Oyun için teşekkürler!", share: "Seçimini paylaş", download: "Görseli indir", newTomorrow: "Yarın yeni soru", loading: "Bugünün garip sorusu yükleniyor…" },
    de: { hint: "Tipp eins an. Sieh, was alle gewählt haben.", voted: "Danke fürs Abstimmen!", share: "Teile deine Wahl", download: "Bild herunterladen", newTomorrow: "Morgen neue Frage", loading: "Die heutige Frage wird geladen…" },
    fr: { hint: "Touche une option. Regarde ce que tout le monde a choisi.", voted: "Merci d'avoir voté !", share: "Partage ton choix", download: "Télécharger l'image", newTomorrow: "Nouvelle question demain", loading: "Chargement de la question du jour…" },
    hu: { hint: "Koppints egyre. Nézd meg, mit választottak mások.", voted: "Köszönjük a szavazatot!", share: "Oszd meg a választásod", download: "Kép letöltése", newTomorrow: "Holnap új kérdés", loading: "A mai kérdés betöltése…" }
  };

  function currentLang() {
    return (document.documentElement.lang && UI[document.documentElement.lang]) ? document.documentElement.lang : 'en';
  }

  var state = { poll: null, voted: false, choice: null };

  var els = {};

  function q(id) { return document.getElementById(id); }

  function renderStatic() {
    var l = currentLang();
    var t = UI[l];
    if (els.hint) els.hint.textContent = state.voted ? t.voted : t.hint;
    if (els.shareBtn) els.shareBtn.textContent = t.share;
    if (els.downloadBtn) els.downloadBtn.textContent = t.download;
  }

  function pct(a, b) {
    var total = a + b;
    if (total <= 0) return [50, 50];
    var pa = Math.round((a / total) * 100);
    return [pa, 100 - pa];
  }

  function renderPoll() {
    if (!state.poll) return;
    var l = currentLang();
    var p = state.poll;

    if (els.series) els.series.textContent = p.series[l] || p.series.en;
    if (els.question) els.question.textContent = p.question[l] || p.question.en;
    if (els.optA) els.optA.textContent = p.option_a[l] || p.option_a.en;
    if (els.optB) els.optB.textContent = p.option_b[l] || p.option_b.en;

    var votes = p.votes || { a: 0, b: 0 };
    var percentages = pct(votes.a || 0, votes.b || 0);

    if (state.voted) {
      els.card.classList.add('voted');
      if (els.fillA) els.fillA.style.width = percentages[0] + '%';
      if (els.fillB) els.fillB.style.width = percentages[1] + '%';
      if (els.pctA) els.pctA.textContent = percentages[0] + '%';
      if (els.pctB) els.pctB.textContent = percentages[1] + '%';
      if (els.btnA) els.btnA.classList.toggle('picked', state.choice === 'a');
      if (els.btnB) els.btnB.classList.toggle('picked', state.choice === 'b');
      if (els.share) els.share.style.display = '';
    } else {
      els.card.classList.remove('voted');
      if (els.share) els.share.style.display = 'none';
    }
    renderStatic();
  }

  async function vote(choice) {
    if (state.voted) return;
    state.voted = true;
    state.choice = choice;
    // optimistic bump so it feels instant
    state.poll.votes = state.poll.votes || { a: 0, b: 0 };
    state.poll.votes[choice] = (state.poll.votes[choice] || 0) + 1;
    renderPoll();
    try {
      var res = await fetch(API_VOTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: choice })
      });
      var data = await res.json();
      if (data && data.votes) {
        state.poll.votes = data.votes;
        state.choice = data.yourVote || choice;
      }
      renderPoll();
    } catch (e) { /* optimistic state already applied; fine to stay silent */ }
  }

  async function load() {
    try {
      var res = await fetch(API_TODAY);
      var data = await res.json();
      state.poll = data;
      state.voted = !!data.yourVote;
      state.choice = data.yourVote || null;
      renderPoll();
    } catch (e) {
      if (els.hint) els.hint.textContent = UI[currentLang()].loading;
    }
  }

  // ---------- result card (canvas) ----------
  function buildResultCardBlob() {
    return new Promise(function (resolve) {
      var l = currentLang();
      var p = state.poll;
      var votes = p.votes || { a: 0, b: 0 };
      var percentages = pct(votes.a || 0, votes.b || 0);
      var pickedLabel = state.choice === 'a' ? (p.option_a[l] || p.option_a.en) : (p.option_b[l] || p.option_b.en);
      var pickedPct = state.choice === 'a' ? percentages[0] : percentages[1];

      var W = 1080, H = 1920;
      var canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');

      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, W, H);

      var grad = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.4, 900);
      grad.addColorStop(0, 'rgba(255,51,102,0.18)');
      grad.addColorStop(1, 'rgba(20,20,20,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#fff8f0';
      ctx.font = '700 34px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PARDON MY ODD', W / 2, 130);

      ctx.fillStyle = '#ff3366';
      ctx.font = '700 26px Arial';
      ctx.fillText((p.series[l] || p.series.en).toUpperCase(), W / 2, 260);

      ctx.fillStyle = '#fff8f0';
      ctx.font = '800 64px Arial';
      wrapText(ctx, p.question[l] || p.question.en, W / 2, 360, 880, 74);

      function drawImageAndContinue(img) {
        var iw = 520, ih = 520;
        if (img) ctx.drawImage(img, (W - iw) / 2, 540, iw, ih);

        ctx.fillStyle = '#ffc93c';
        ctx.font = '800 46px Arial';
        ctx.fillText('I chose:', W / 2, 1190);

        ctx.fillStyle = '#fff8f0';
        ctx.font = '800 72px Arial';
        wrapText(ctx, pickedLabel, W / 2, 1270, 900, 82);

        ctx.fillStyle = '#ff3366';
        ctx.font = '800 90px Arial';
        ctx.fillText(pickedPct + '%', W / 2, 1480);

        ctx.fillStyle = 'rgba(255,248,240,0.6)';
        ctx.font = '500 30px Arial';
        ctx.fillText('of odds agreed', W / 2, 1530);

        ctx.strokeStyle = '#fff8f0';
        ctx.lineWidth = 3;
        roundRect(ctx, W / 2 - 220, 1650, 440, 90, 45);
        ctx.stroke();
        ctx.fillStyle = '#fff8f0';
        ctx.font = '700 32px Arial';
        ctx.fillText('theoddvi.com', W / 2, 1705);

        ctx.fillStyle = 'rgba(255,248,240,0.5)';
        ctx.font = '500 26px Arial';
        ctx.fillText('@theoddvi', W / 2, 1800);

        canvas.toBlob(function (blob) { resolve(blob); }, 'image/png');
      }

      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () { drawImageAndContinue(img); };
      img.onerror = function () { drawImageAndContinue(null); };
      img.src = '/uploads/oddvi-hero-thumbsup2.png';
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var lines = [];
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    var startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i].trim(), x, startY + i * lineHeight);
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function shareResult() {
    if (!state.voted) return;
    var blob = await buildResultCardBlob();
    var file = new File([blob], 'oddvi-poll.png', { type: 'image/png' });
    var deepUrl = 'https://theoddvi.com/#poll';

    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: 'My Odd pick — theoddvi.com', url: deepUrl });
        return;
      }
    } catch (e) { /* user cancelled — fall through silently, don't force a download on cancel */ return; }

    // desktop / unsupported fallback: download
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'oddvi-poll-result.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function init() {
    els.card = q('pollCard');
    if (!els.card) return; // widget not on this page
    els.series = q('pollSeries');
    els.question = q('pollQuestion');
    els.optA = q('pollOptA');
    els.optB = q('pollOptB');
    els.btnA = q('pollBtnA');
    els.btnB = q('pollBtnB');
    els.fillA = q('pollFillA');
    els.fillB = q('pollFillB');
    els.pctA = q('pollPctA');
    els.pctB = q('pollPctB');
    els.hint = q('pollHint');
    els.share = q('pollShare');
    els.shareBtn = q('pollShareBtn');
    els.downloadBtn = q('pollDownloadBtn');

    if (els.btnA) els.btnA.addEventListener('click', function () { vote('a'); });
    if (els.btnB) els.btnB.addEventListener('click', function () { vote('b'); });
    if (els.shareBtn) els.shareBtn.addEventListener('click', shareResult);

    window.addEventListener('oddvi:lang', renderPoll);

    load();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
