/* ============================================================
   ODDVI · Odd Machine
   A press-and-reveal toy: one fixed question, a pool of witty
   answers. Press spins a short "thinking" animation, then reveals
   a random answer in a speech bubble. Press again for another.
   Self-contained 5-language dict, separate from i18n-dict.js.
   ============================================================ */
(function () {
  var UI = {
    en: { kicker: "Interactive", heading: "Ask The Odd Machine", intro: "Press it. It spins. It tells the truth nobody asked for.", question: "If your phone testified in court, who would it rat out first?", run: "🎲 Run The Odd Machine", again: "🎲 Run It Again", thinking: "Thinking" },
    tr: { kicker: "İnteraktif", heading: "Odd Machine'e Sor", intro: "Bas. Döner. Kimsenin istemediği gerçeği söyler.", question: "Telefonun mahkemede ifade verse, ilk kimi ele verirdi?", run: "🎲 Odd Machine'i Çalıştır", again: "🎲 Tekrar Çalıştır", thinking: "Düşünüyor" },
    de: { kicker: "Interaktiv", heading: "Frag Die Odd Machine", intro: "Drück drauf. Es dreht sich. Es sagt die Wahrheit, die niemand wollte.", question: "Wenn dein Handy vor Gericht aussagen würde, wen würde es zuerst verraten?", run: "🎲 Odd Machine Starten", again: "🎲 Nochmal", thinking: "Denkt nach" },
    fr: { kicker: "Interactif", heading: "Demande À La Odd Machine", intro: "Appuie. Ça tourne. Ça dit la vérité que personne n'a demandée.", question: "Si ton téléphone témoignait au tribunal, qui dénoncerait-il en premier ?", run: "🎲 Lancer La Odd Machine", again: "🎲 Relancer", thinking: "Réflexion" },
    hu: { kicker: "Interaktív", heading: "Kérdezd Az Odd Machine-t", intro: "Nyomd meg. Pörög. Kimondja az igazságot, amit senki sem kért.", question: "Ha a telefonod tanúskodna a bíróságon, kit árulna el elsőként?", run: "🎲 Indítsd El Az Odd Machine-t", again: "🎲 Újra", thinking: "Gondolkodik" }
  };

  var ANSWERS = {
    en: [
      "That 3am call.",
      "The 47 messages marked 'seen' and never answered.",
      "Looking up the same person six times in one day.",
      "The screenshot you deleted but never forgot.",
      "The 12th order you swore was 'the last one.'",
      "Being on WhatsApp during the meeting.",
      "How much faster you kill the alarm than you answer emails.",
      "The text sent at 6am, regretted by 9.",
      "Not closing TikTok even at 1% battery.",
      "'Just a sec' turning into 40 minutes.",
      "How many times the screen cracked, and you still haven't fixed it.",
      "Taking the same photo 30 times and liking none of them.",
      "Texting 'I'll wake up early tomorrow' at 2am.",
      "Every 'typing...' that quietly gave up — it remembers them all.",
      "Never turning off night mode, not even at noon.",
      "The real, actual length of 'one second.'",
      "Every 'I'll call you back' that never happened."
    ],
    tr: [
      "Gece 3'teki o aramayı.",
      "\"Görüldü\" yazıp cevap vermediğin 47 mesajı.",
      "Aynı kişiyi bir günde 6 kere aratmanı.",
      "Sildiğin ama hafızanda kalan o ekran görüntüsünü.",
      "\"Son kez\" diyerek verdiğin 12. siparişi.",
      "Toplantıdayken WhatsApp'ta olduğunu.",
      "Alarm kapatma hızını, e-posta cevap hızıyla kıyaslayarak.",
      "Sabah 6'da atıp sabah 9'da pişman olduğun o mesajı.",
      "Şarj %1'deyken bile TikTok'u kapatmadığını.",
      "\"Bir dakika bakarım\" deyip 40 dakika sonra çıktığını.",
      "Ekranın kaç kere kırıldığını, hâlâ değiştirmediğini.",
      "Aynı fotoğrafı 30 kere çekip hiçbirini beğenmediğini.",
      "Sabahın 2'sinde \"yarın erken kalkacağım\" yazdığını.",
      "Kimin \"yazıyor...\" yazıp sonra vazgeçtiğini — hepsini biliyor.",
      "Gece modunu hiç kapatmadığını, gündüz bile.",
      "\"Bir saniye\" cümlesinin gerçek süresini.",
      "Kaç kere \"az sonra ararım\" deyip aramadığını."
    ],
    de: [
      "Der Anruf um 3 Uhr nachts.",
      "Die 47 Nachrichten, 'gelesen' markiert, nie beantwortet.",
      "Dieselbe Person sechsmal an einem Tag gesucht.",
      "Der Screenshot, den du gelöscht, aber nie vergessen hast.",
      "Die 12. Bestellung, die 'die letzte' sein sollte.",
      "Im Meeting bei WhatsApp gewesen zu sein.",
      "Wie viel schneller du den Wecker ausschaltest als E-Mails beantwortest.",
      "Die Nachricht um 6 Uhr geschickt, um 9 Uhr bereut.",
      "TikTok nicht mal bei 1% Akku geschlossen.",
      "'Nur kurz schauen' wurde zu 40 Minuten.",
      "Wie oft der Bildschirm zersprungen ist, und du hast ihn immer noch nicht reparieren lassen.",
      "Dasselbe Foto 30-mal gemacht und keins gemocht.",
      "Um 2 Uhr nachts 'ich steh morgen früh auf' geschrieben.",
      "Jedes 'schreibt...', das leise aufgegeben hat — es erinnert sich an alle.",
      "Nachtmodus nie ausgeschaltet, nicht mal mittags.",
      "Die wahre Dauer von 'eine Sekunde'.",
      "Jedes 'ich ruf zurück', das nie passiert ist."
    ],
    fr: [
      "Cet appel à 3h du matin.",
      "Les 47 messages marqués 'lu', jamais répondus.",
      "Avoir cherché la même personne six fois en un jour.",
      "La capture d'écran supprimée mais jamais oubliée.",
      "La 12e commande censée être 'la dernière'.",
      "Être sur WhatsApp pendant la réunion.",
      "À quelle vitesse tu coupes l'alarme comparé à répondre aux emails.",
      "Le texto envoyé à 6h, regretté à 9h.",
      "Ne pas fermer TikTok même à 1% de batterie.",
      "'Juste une seconde' devenu 40 minutes.",
      "Combien de fois l'écran s'est fissuré, toujours pas réparé.",
      "Prendre la même photo 30 fois et n'en aimer aucune.",
      "Écrire 'je me lève tôt demain' à 2h du matin.",
      "Chaque '...' qui s'est éteint en silence — il se souvient de tous.",
      "Le mode nuit jamais désactivé, même en plein midi.",
      "La vraie durée d'une 'seconde'.",
      "Chaque 'je te rappelle' qui n'a jamais eu lieu."
    ],
    hu: [
      "Az a hajnali 3-kori hívás.",
      "A 47 üzenet, 'olvasva' jelölve, sosem megválaszolva.",
      "Ugyanazt a személyt hatszor megkeresni egy nap alatt.",
      "A képernyőkép, amit töröltél, de sosem felejtettél el.",
      "A 12. rendelés, ami 'az utolsó' lett volna.",
      "A WhatsAppon lenni a megbeszélés alatt.",
      "Mennyivel gyorsabban kapcsolod ki az ébresztőt, mint ahogy emailre válaszolsz.",
      "A hajnali 6-kor küldött üzenet, ami 9-re megbánva.",
      "A TikTokot még 1%-os akkumulátornál sem zárod be.",
      "A 'csak egy pillanat' negyven perccé vált.",
      "Hányszor repedt meg a képernyő, és még mindig nem javíttattad meg.",
      "Ugyanazt a fotót 30-szor lefotózni, és egyiket sem szeretni.",
      "Hajnali 2-kor azt írni: 'holnap korán kelek'.",
      "Minden '...gépel', ami csendben feladta — mindre emlékszik.",
      "Az éjszakai mód sosincs kikapcsolva, még délben sem.",
      "Az 'egy másodperc' valódi hossza.",
      "Minden 'visszahívlak', ami sosem történt meg."
    ]
  };

  var els = {};
  var lastIdx = -1;
  var hasRun = false;

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && UI[l]) ? l : 'en';
  }

  function pickAnswer(lang) {
    var pool = ANSWERS[lang] || ANSWERS.en;
    var idx;
    do { idx = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && idx === lastIdx);
    lastIdx = idx;
    return pool[idx];
  }

  function applyText() {
    var l = currentLang();
    var t = UI[l];
    if (els.kicker) els.kicker.textContent = t.kicker;
    if (els.heading) els.heading.textContent = t.heading;
    if (els.intro) els.intro.textContent = t.intro;
    if (els.question) els.question.textContent = t.question;
    if (els.runBtn) els.runBtn.textContent = hasRun ? t.again : t.run;
    if (els.thinkingLabel) els.thinkingLabel.textContent = t.thinking;
  }

  function run() {
    var l = currentLang();
    els.runBtn.disabled = true;
    els.answerWrap.classList.remove('show');
    els.thinking.classList.add('show');

    setTimeout(function () {
      els.thinking.classList.remove('show');
      els.answerText.textContent = pickAnswer(l);
      els.answerWrap.classList.add('show');
      els.runBtn.disabled = false;
      hasRun = true;
      applyText();
    }, 900 + Math.random() * 400);
  }

  function init() {
    els.kicker = document.getElementById('omKicker');
    els.heading = document.getElementById('omHeading');
    els.intro = document.getElementById('omIntro');
    els.question = document.getElementById('omQuestion');
    els.runBtn = document.getElementById('omRunBtn');
    els.thinking = document.getElementById('omThinking');
    els.thinkingLabel = document.getElementById('omThinkingLabel');
    els.answerWrap = document.getElementById('omAnswerWrap');
    els.answerText = document.getElementById('omAnswerText');
    if (!els.runBtn) return;

    els.runBtn.addEventListener('click', run);
    window.addEventListener('oddvi:lang', applyText);

    applyText();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
