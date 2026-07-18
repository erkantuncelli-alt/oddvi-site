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
    en: { hint: "Tap one. See what everyone picked.", voted: "Thanks for voting!", share: "Share your pick", download: "Download image", newTomorrow: "New question tomorrow", loading: "Loading today's odd question…", counter: "{n} odds have voted" },
    tr: { hint: "Birine dokun. Herkes ne seçmiş gör.", voted: "Oyun için teşekkürler!", share: "Seçimini paylaş", download: "Görseli indir", newTomorrow: "Yarın yeni soru", loading: "Bugünün garip sorusu yükleniyor…", counter: "{n} kişi oy verdi" },
    de: { hint: "Tipp eins an. Sieh, was alle gewählt haben.", voted: "Danke fürs Abstimmen!", share: "Teile deine Wahl", download: "Bild herunterladen", newTomorrow: "Morgen neue Frage", loading: "Die heutige Frage wird geladen…", counter: "{n} Leute haben abgestimmt" },
    fr: { hint: "Touche une option. Regarde ce que tout le monde a choisi.", voted: "Merci d'avoir voté !", share: "Partage ton choix", download: "Télécharger l'image", newTomorrow: "Nouvelle question demain", loading: "Chargement de la question du jour…", counter: "{n} personnes ont voté" },
    hu: { hint: "Koppints egyre. Nézd meg, mit választottak mások.", voted: "Köszönjük a szavazatot!", share: "Oszd meg a választásod", download: "Kép letöltése", newTomorrow: "Holnap új kérdés", loading: "A mai kérdés betöltése…", counter: "{n} ember szavazott" }
  };

  var ODDVI_COMMENTS = {
    en: {
      majority: ["Went with the crowd? Bold… ly normal.", "You're in the majority. Oddvi respects it, doesn't get it.", "Same pick as everyone else. Safe choice.", "Winning side. Predictable, but fine."],
      minority: ["Everyone else picked the other one. You or them — who's odd here?", "You're in the minority. Oddvi's favorite kind of people.", "Didn't follow the crowd. Very on-brand.", "Standing alone, but at least you're interesting."]
    },
    tr: {
      majority: ["Sürüyle mi gittin? Cesurca... normal.", "Çoğunluktasın. Oddvi saygı duyuyor ama anlamıyor.", "Herkesle aynı şeyi seçtin. Güvenli tercih.", "Kazanan taraftasın. Tahmin edilir ama olsun."],
      minority: ["Herkes diğerini seçti. Sen mi haklısın onlar mı? Kimse bilmiyor.", "Azınlıktasın. Oddvi'nin en sevdiği tür insan.", "Kalabalığa uymadın. Tam da Oddvi'lik.", "Yalnız kaldın ama en azından ilginçsin."]
    },
    de: {
      majority: ["Mit der Masse gegangen? Mutig… auf normale Art.", "Du bist in der Mehrheit. Oddvi respektiert's, versteht's aber nicht.", "Gleiche Wahl wie alle. Sichere Bank.", "Gewinnerseite. Vorhersehbar, aber okay."],
      minority: ["Alle anderen wählten das andere. Du oder sie — wer ist hier odd?", "Du bist in der Minderheit. Oddvis Lieblingsmenschen.", "Nicht der Masse gefolgt. Sehr Oddvi-like.", "Allein, aber wenigstens interessant."]
    },
    fr: {
      majority: ["Suivre la foule ? Audacieusement… normal.", "Tu es dans la majorité. Oddvi respecte, sans comprendre.", "Même choix que tout le monde. Sûr, mais bon.", "Camp gagnant. Prévisible, mais ça va."],
      minority: ["Tout le monde a choisi l'autre. Toi ou eux — qui est bizarre ici ?", "Tu es dans la minorité. Le genre préféré d'Oddvi.", "Pas suivi la foule. Très Oddvi.", "Seul, mais au moins intéressant."]
    },
    hu: {
      majority: ["A tömeggel tartottál? Bátran… normális.", "Többségben vagy. Oddvi tiszteli, de nem érti.", "Ugyanazt választottad, mint mindenki. Biztos, de oké.", "Nyerő oldal. Kiszámítható, de rendben."],
      minority: ["Mindenki más a másikat választotta. Te vagy ők — ki a fura itt?", "Kisebbségben vagy. Oddvi kedvenc fajtája.", "Nem követted a tömeget. Nagyon Oddvi-s.", "Egyedül maradtál, de legalább érdekes vagy."]
    }
  };

  function currentLang() {
    return (document.documentElement.lang && UI[document.documentElement.lang]) ? document.documentElement.lang : 'en';
  }

  function dayHash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  var CONFETTI_COLORS = ['#ff3366', '#ffc93c', '#1ec8c8', '#845ec2', '#ff7a45'];

  function fireConfetti() {
    var host = q('pollConfetti');
    if (!host) return;
    host.innerHTML = '';
    var n = 22;
    for (var i = 0; i < n; i++) {
      var el = document.createElement('span');
      el.className = 'confetti-piece';
      var angle = Math.random() * Math.PI * 2;
      var dist = 70 + Math.random() * 110;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist - 30;
      el.style.setProperty('--tx', tx.toFixed(0) + 'px');
      el.style.setProperty('--ty', ty.toFixed(0) + 'px');
      el.style.setProperty('--rot', (Math.random() * 480 - 240).toFixed(0) + 'deg');
      el.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
      host.appendChild(el);
    }
    setTimeout(function () { host.innerHTML = ''; }, 1100);
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
    var t = UI[l];
    var p = state.poll;

    if (els.series) els.series.textContent = p.series[l] || p.series.en;
    if (els.question) els.question.textContent = p.question[l] || p.question.en;
    if (els.optA) els.optA.textContent = p.option_a[l] || p.option_a.en;
    if (els.optB) els.optB.textContent = p.option_b[l] || p.option_b.en;

    var votes = p.votes || { a: 0, b: 0 };
    var percentages = pct(votes.a || 0, votes.b || 0);
    var total = (votes.a || 0) + (votes.b || 0);

    if (state.voted) {
      els.card.classList.add('voted');
      if (els.fillA) els.fillA.style.width = percentages[0] + '%';
      if (els.fillB) els.fillB.style.width = percentages[1] + '%';
      if (els.pctA) els.pctA.textContent = percentages[0] + '%';
      if (els.pctB) els.pctB.textContent = percentages[1] + '%';
      if (els.btnA) els.btnA.classList.toggle('picked', state.choice === 'a');
      if (els.btnB) els.btnB.classList.toggle('picked', state.choice === 'b');
      if (els.share) els.share.style.display = '';

      var winner = percentages[0] === percentages[1] ? null : (percentages[0] > percentages[1] ? 'a' : 'b');
      if (els.btnA) els.btnA.classList.toggle('winner', winner === 'a');
      if (els.btnB) els.btnB.classList.toggle('winner', winner === 'b');

      if (els.counter) {
        var countTxt = total > 0 ? t.counter.replace('{n}', total.toLocaleString(l === 'tr' ? 'tr-TR' : l)) : '';
        els.counter.textContent = countTxt;
      }

      if (els.comment && els.commentText) {
        var seed = dayHash(todayStr() + '|' + (p.question[l] || p.question.en));
        var bucket = (winner && state.choice === winner) ? 'majority' : 'minority';
        var pool = (ODDVI_COMMENTS[l] || ODDVI_COMMENTS.en)[bucket];
        var idx = seed % pool.length;
        els.commentText.textContent = pool[idx];
        els.comment.classList.add('show');
      }
    } else {
      els.card.classList.remove('voted');
      if (els.share) els.share.style.display = 'none';
      if (els.btnA) els.btnA.classList.remove('winner');
      if (els.btnB) els.btnB.classList.remove('winner');
      if (els.comment) els.comment.classList.remove('show');
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
    fireConfetti();
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

  function stripEmoji(str) {
    return String(str).replace(/[\u{1F1E6}-\u{1FAFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  }

  // ---------- result card (canvas) ----------
  function buildResultCardBlob() {
    return new Promise(function (resolve) {
      var l = currentLang();
      var p = state.poll;
      var votes = p.votes || { a: 0, b: 0 };
      var percentages = pct(votes.a || 0, votes.b || 0);
      var pickedLabel = stripEmoji(state.choice === 'a' ? (p.option_a[l] || p.option_a.en) : (p.option_b[l] || p.option_b.en));
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
    els.counter = q('pollCounter');
    els.comment = q('pollOddviComment');
    els.commentText = q('pollOddviCommentText');

    if (els.btnA) els.btnA.addEventListener('click', function () { vote('a'); });
    if (els.btnB) els.btnB.addEventListener('click', function () { vote('b'); });
    if (els.shareBtn) els.shareBtn.addEventListener('click', shareResult);

    var mascotEl = q('pollMascot');
    if (mascotEl && window.OddviPollMascot) mascotEl.src = window.OddviPollMascot.get();

    window.addEventListener('oddvi:lang', renderPoll);

    load();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
