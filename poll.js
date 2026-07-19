/* ============================================================
   ODDVI · Daily Odd Poll widget (3 questions/day, swipeable)
   Fetches today's 3 two-choice polls, renders in the active site
   language, submits a vote once per visitor/day/slot, lets people
   swipe or tap through all 3, then offers a generated result card
   or a copy-paste challenge message to share.
   ============================================================ */
(function () {
  var API_TODAY = '/api/poll/today';
  var API_VOTE = '/api/poll/vote';
  var SLOT_COUNT = 3;

  var UI = {
    en: { hint: "Tap one. See what everyone picked.", voted: "Thanks for voting!", share: "Share your pick", download: "Download image", challenge: "Challenge a friend", challengeCopied: "Copied! Paste it anywhere.", newTomorrow: "New question tomorrow", loading: "Loading today's odd question…", counter: "{n} odds have voted", next: "Next question →", allDone: "That's all 3! New ones tomorrow.", progress: "Question {n} of 3", challengeText: "I picked \"{pick}\" ({pct}% agreed). What would you pick? Vote here → theoddvi.com/#poll" },
    tr: { hint: "Birine dokun. Herkes ne seçmiş gör.", voted: "Oyun için teşekkürler!", share: "Seçimini paylaş", download: "Görseli indir", challenge: "Meydan oku", challengeCopied: "Kopyalandı! İstediğin yere yapıştır.", newTomorrow: "Yarın yeni soru", loading: "Bugünün garip sorusu yükleniyor…", counter: "{n} kişi oy verdi", next: "Sıradaki soru →", allDone: "3'ü de bitti! Yarın yenileri var.", progress: "{n}. soru / 3", challengeText: "Ben \"{pick}\" dedim (%{pct} aynı fikirde). Sen ne seçerdin? Gel oy ver → theoddvi.com/#poll" },
    de: { hint: "Tipp eins an. Sieh, was alle gewählt haben.", voted: "Danke fürs Abstimmen!", share: "Teile deine Wahl", download: "Bild herunterladen", challenge: "Herausfordern", challengeCopied: "Kopiert! Füg es überall ein.", newTomorrow: "Morgen neue Frage", loading: "Die heutige Frage wird geladen…", counter: "{n} Leute haben abgestimmt", next: "Nächste Frage →", allDone: "Alle 3 geschafft! Morgen neue.", progress: "Frage {n} von 3", challengeText: "Ich habe \"{pick}\" gewählt ({pct}% stimmten zu). Was wählst du? Jetzt abstimmen → theoddvi.com/#poll" },
    fr: { hint: "Touche une option. Regarde ce que tout le monde a choisi.", voted: "Merci d'avoir voté !", share: "Partage ton choix", download: "Télécharger l'image", challenge: "Défier", challengeCopied: "Copié ! Colle-le où tu veux.", newTomorrow: "Nouvelle question demain", loading: "Chargement de la question du jour…", counter: "{n} personnes ont voté", next: "Question suivante →", allDone: "Les 3 sont faites ! Demain, nouvelles questions.", progress: "Question {n} sur 3", challengeText: "J'ai choisi \"{pick}\" ({pct}% d'accord). Et toi ? Vote ici → theoddvi.com/#poll" },
    hu: { hint: "Koppints egyre. Nézd meg, mit választottak mások.", voted: "Köszönjük a szavazatot!", share: "Oszd meg a választásod", download: "Kép letöltése", challenge: "Kihívás", challengeCopied: "Másolva! Illeszd be bárhova.", newTomorrow: "Holnap új kérdés", loading: "A mai kérdés betöltése…", counter: "{n} ember szavazott", next: "Következő kérdés →", allDone: "Mind a 3 megvan! Holnap újak jönnek.", progress: "{n}. kérdés / 3", challengeText: "Én \"{pick}\"-et választottam ({pct}% értett egyet). Te mit választanál? Szavazz itt → theoddvi.com/#poll" }
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

  // per-poll accent theme, cycled deterministically so it's stable per question but varies slide to slide
  var THEME_PALETTE = [
    { accent: '#ff3366' },
    { accent: '#1ec8c8' },
    { accent: '#f5b400' },
    { accent: '#845ec2' },
    { accent: '#ff7a45' }
  ];

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

  // state.polls[i] = { slot, series, question, option_a, option_b, votes:{a,b}, yourVote }
  var state = { polls: null, current: 0 };
  var els = {};
  var toastTimer = null;

  function q(id) { return document.getElementById(id); }

  function pct(a, b) {
    var total = a + b;
    if (total <= 0) return [50, 50];
    var pa = Math.round((a / total) * 100);
    return [pa, 100 - pa];
  }

  function activePoll() {
    return state.polls ? state.polls[state.current] : null;
  }

  function applyTheme(poll, l) {
    var seed = dayHash((poll.question[l] || poll.question.en) + '|' + poll.slot);
    var theme = THEME_PALETTE[seed % THEME_PALETTE.length];
    if (els.card) els.card.style.setProperty('--poll-accent', theme.accent);
  }

  function renderDots() {
    if (!els.dots) return;
    var dots = els.dots.querySelectorAll('.dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === state.current);
      var p = state.polls && state.polls[i];
      d.classList.toggle('done', !!(p && p.yourVote));
    });
  }

  function renderNav() {
    if (els.prevBtn) els.prevBtn.disabled = state.current <= 0;
    if (els.nextBtn) els.nextBtn.disabled = state.current >= SLOT_COUNT - 1;
  }

  function renderStatic() {
    var l = currentLang();
    var t = UI[l];
    var p = activePoll();
    if (els.hint) els.hint.textContent = (p && p.yourVote) ? t.voted : t.hint;
    if (els.shareBtn) els.shareBtn.textContent = t.share;
    if (els.challengeBtn) els.challengeBtn.textContent = t.challenge;
    if (els.progress) els.progress.textContent = t.progress.replace('{n}', state.current + 1);
    if (els.nextQBtn) els.nextQBtn.textContent = t.next;
    if (els.allDone) els.allDone.textContent = t.allDone;
  }

  function renderPoll() {
    var p = activePoll();
    if (!p) return;
    var l = currentLang();
    var t = UI[l];

    applyTheme(p, l);

    if (els.series) els.series.textContent = p.series[l] || p.series.en;
    if (els.question) els.question.textContent = p.question[l] || p.question.en;
    if (els.optA) els.optA.textContent = p.option_a[l] || p.option_a.en;
    if (els.optB) els.optB.textContent = p.option_b[l] || p.option_b.en;

    var votes = p.votes || { a: 0, b: 0 };
    var percentages = pct(votes.a || 0, votes.b || 0);
    var total = (votes.a || 0) + (votes.b || 0);
    var voted = !!p.yourVote;

    if (voted) {
      els.card.classList.add('voted');
      if (els.fillA) els.fillA.style.width = percentages[0] + '%';
      if (els.fillB) els.fillB.style.width = percentages[1] + '%';
      if (els.pctA) els.pctA.textContent = percentages[0] + '%';
      if (els.pctB) els.pctB.textContent = percentages[1] + '%';
      if (els.btnA) els.btnA.classList.toggle('picked', p.yourVote === 'a');
      if (els.btnB) els.btnB.classList.toggle('picked', p.yourVote === 'b');
      if (els.share) els.share.style.display = '';

      var winner = percentages[0] === percentages[1] ? null : (percentages[0] > percentages[1] ? 'a' : 'b');
      if (els.btnA) els.btnA.classList.toggle('winner', winner === 'a');
      if (els.btnB) els.btnB.classList.toggle('winner', winner === 'b');

      if (els.counter) {
        els.counter.textContent = total > 0 ? t.counter.replace('{n}', total.toLocaleString(l === 'tr' ? 'tr-TR' : l)) : '';
      }

      if (els.comment && els.commentText) {
        if (p.comment && (p.comment[l] || p.comment.en)) {
          els.commentText.textContent = p.comment[l] || p.comment.en;
        } else {
          var seed = dayHash(todayStr() + '|' + (p.question[l] || p.question.en));
          var bucket = (winner && p.yourVote === winner) ? 'majority' : 'minority';
          var pool = (ODDVI_COMMENTS[l] || ODDVI_COMMENTS.en)[bucket];
          els.commentText.textContent = pool[seed % pool.length];
        }
        els.comment.classList.add('show');
      }

      if (els.nextQWrap) els.nextQWrap.style.display = state.current < SLOT_COUNT - 1 ? '' : 'none';
      if (els.allDone) els.allDone.style.display = state.current === SLOT_COUNT - 1 ? '' : 'none';
    } else {
      els.card.classList.remove('voted');
      if (els.share) els.share.style.display = 'none';
      if (els.btnA) els.btnA.classList.remove('winner');
      if (els.btnB) els.btnB.classList.remove('winner');
      if (els.comment) els.comment.classList.remove('show');
      if (els.nextQWrap) els.nextQWrap.style.display = 'none';
      if (els.allDone) els.allDone.style.display = 'none';
    }
    renderDots();
    renderNav();
    renderStatic();
  }

  async function vote(choice) {
    var p = activePoll();
    if (!p || p.yourVote) return;
    p.yourVote = choice;
    p.votes = p.votes || { a: 0, b: 0 };
    p.votes[choice] = (p.votes[choice] || 0) + 1; // optimistic
    renderPoll();
    fireConfetti();
    try {
      var res = await fetch(API_VOTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: choice, slot: p.slot })
      });
      var data = await res.json();
      if (data && data.votes) {
        p.votes = data.votes;
        p.yourVote = data.yourVote || choice;
      }
      renderPoll();
    } catch (e) { /* optimistic state already applied; fine to stay silent */ }
  }

  function goTo(idx) {
    if (!state.polls) return;
    idx = Math.max(0, Math.min(SLOT_COUNT - 1, idx));
    if (idx === state.current) return;
    var dir = idx > state.current ? 'left' : 'right'; // exit direction
    els.card.classList.remove('enter-left', 'enter-right');
    els.card.classList.add(dir === 'left' ? 'exit-left' : 'exit-right');
    setTimeout(function () {
      state.current = idx;
      els.card.classList.remove('exit-left', 'exit-right');
      renderPoll();
      els.card.classList.add(dir === 'left' ? 'enter-right' : 'enter-left');
      setTimeout(function () { els.card.classList.remove('enter-left', 'enter-right'); }, 300);
    }, 170);
  }

  function attachSwipe(el) {
    var startX = null, startY = null, dragging = false;
    el.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches.length) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = true;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (!dragging || startX === null) return;
      dragging = false;
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      var dx = endX - startX, dy = endY - startY;
      startX = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) goTo(state.current + 1); else goTo(state.current - 1);
    }, { passive: true });
  }

  function stripEmoji(str) {
    return String(str).replace(/[\u{1F1E6}-\u{1FAFF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  }

  // ---------- result card (canvas) ----------
  function buildResultCardBlob() {
    return new Promise(function (resolve) {
      var l = currentLang();
      var p = activePoll();
      var votes = p.votes || { a: 0, b: 0 };
      var percentages = pct(votes.a || 0, votes.b || 0);
      var pickedLabel = stripEmoji(p.yourVote === 'a' ? (p.option_a[l] || p.option_a.en) : (p.option_b[l] || p.option_b.en));
      var pickedPct = p.yourVote === 'a' ? percentages[0] : percentages[1];

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
    var p = activePoll();
    if (!p || !p.yourVote) return;
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

  function showToast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { els.toast.classList.remove('show'); }, 2200);
  }

  var challengeImgFilePromise = null;
  function getChallengeImageFile() {
    if (!challengeImgFilePromise) {
      challengeImgFilePromise = fetch('/uploads/oddvi-vote-sticker.png')
        .then(function (r) { return r.blob(); })
        .then(function (blob) { return new File([blob], 'oddvi.png', { type: blob.type || 'image/png' }); })
        .catch(function () { return null; });
    }
    return challengeImgFilePromise;
  }

  function copyTextFallback(msg, doneMsg) {
    var done = function () { showToast(doneMsg); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(done).catch(function () { legacyCopy(msg, done); });
    } else {
      legacyCopy(msg, done);
    }
  }

  function legacyCopy(msg, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = msg;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e2) { /* silent */ }
  }

  async function shareChallenge() {
    var p = activePoll();
    if (!p || !p.yourVote) return;
    var l = currentLang();
    var t = UI[l];
    var votes = p.votes || { a: 0, b: 0 };
    var percentages = pct(votes.a || 0, votes.b || 0);
    var pickedLabel = stripEmoji(p.yourVote === 'a' ? (p.option_a[l] || p.option_a.en) : (p.option_b[l] || p.option_b.en));
    var pickedPct = p.yourVote === 'a' ? percentages[0] : percentages[1];
    var msg = t.challengeText.replace('{pick}', pickedLabel).replace('{pct}', pickedPct);
    var deepUrl = 'https://theoddvi.com/#poll';

    var file = await getChallengeImageFile();

    try {
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: msg, url: deepUrl });
        return;
      }
      if (navigator.share) {
        await navigator.share({ text: msg, url: deepUrl });
        return;
      }
    } catch (e) { return; /* user cancelled — stay silent, no forced fallback */ }

    // desktop / unsupported browsers: copy the message instead
    copyTextFallback(msg, t.challengeCopied);
  }

  async function load() {
    try {
      var res = await fetch(API_TODAY);
      var data = await res.json();
      state.polls = data.polls || [];
      // start on the first unanswered question, or the last one if all answered
      var firstUnvoted = state.polls.findIndex(function (p) { return !p.yourVote; });
      state.current = firstUnvoted === -1 ? SLOT_COUNT - 1 : firstUnvoted;
      renderPoll();
    } catch (e) {
      if (els.hint) els.hint.textContent = UI[currentLang()].loading;
    }
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
    els.challengeBtn = q('pollChallengeBtn');
    els.counter = q('pollCounter');
    els.comment = q('pollOddviComment');
    els.commentText = q('pollOddviCommentText');
    els.dots = q('pollDots');
    els.prevBtn = q('pollPrev');
    els.nextBtn = q('pollNext');
    els.progress = q('pollProgress');
    els.nextQWrap = q('pollNextQWrap');
    els.nextQBtn = q('pollNextQBtn');
    els.allDone = q('pollAllDone');
    els.toast = q('pollToast');

    if (els.btnA) els.btnA.addEventListener('click', function () { vote('a'); });
    if (els.btnB) els.btnB.addEventListener('click', function () { vote('b'); });
    if (els.shareBtn) els.shareBtn.addEventListener('click', shareResult);
    if (els.challengeBtn) els.challengeBtn.addEventListener('click', shareChallenge);
    if (els.prevBtn) els.prevBtn.addEventListener('click', function () { goTo(state.current - 1); });
    if (els.nextBtn) els.nextBtn.addEventListener('click', function () { goTo(state.current + 1); });
    if (els.nextQBtn) els.nextQBtn.addEventListener('click', function () { goTo(state.current + 1); });
    if (els.dots) {
      els.dots.querySelectorAll('.dot').forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); });
      });
    }
    attachSwipe(els.card);

    var mascotEl = q('pollMascot');
    if (mascotEl && window.OddviPollMascot) mascotEl.src = window.OddviPollMascot.get();

    window.addEventListener('oddvi:lang', renderPoll);

    load();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
