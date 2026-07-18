/* ============================================================
   ODDVI · Odd Test page FAQ ("How It Works")
   Self-contained 5-language Q&A, mirrors the FAQPage JSON-LD
   in <head>. Separate from i18n-dict.js on purpose.
   ============================================================ */
(function () {
  var HEADING = {
    en: "How It Works",
    tr: "Nasıl Çalışır",
    de: "So Funktioniert's",
    fr: "Comment Ça Marche",
    hu: "Hogyan Működik"
  };

  var FAQ = {
    en: [
      { q: "What is the Odd Test?", a: "A short quiz that turns your quirks into a result: which flavor of odd you are, based on how you answer ten quick questions." },
      { q: "How many questions are there?", a: "Ten. Each one is a two-option pick — no typing, no overthinking. Most people finish in under two minutes." },
      { q: "How is my result calculated?", a: "Every answer nudges you toward one of several Odd archetypes. After the last question, whichever archetype you leaned toward the most becomes your result, with a full breakdown of how close the others were." },
      { q: "Can I retake the test?", a: "Yes — hit \"Retake\" on the result screen and go again. Your answers aren't saved anywhere, so nothing carries over." },
      { q: "Can I download or share my result?", a: "Yes. Your result screen gives you a matching wallpaper, profile picture, and Odd card you can save and post — tag @theoddvi if you do." }
    ],
    tr: [
      { q: "Odd Test nedir?", a: "On hızlı soruya nasıl cevap verdiğine göre, senin tuhaflığını bir sonuca dönüştüren kısa bir test: hangi Odd türü olduğunu bulur." },
      { q: "Kaç soru var?", a: "On soru. Her biri iki seçenekli — yazmak yok, çok düşünmek yok. Çoğu kişi iki dakikadan kısa sürede bitiriyor." },
      { q: "Sonucum nasıl hesaplanıyor?", a: "Her cevap seni birkaç Odd arketipinden birine yaklaştırır. Son sorudan sonra en çok yaklaştığın arketip sonucun olur, diğerlerine ne kadar yakın olduğunun tam dökümüyle birlikte." },
      { q: "Testi tekrar çözebilir miyim?", a: "Evet — sonuç ekranında \"Tekrar Çöz\"e bas ve baştan başla. Cevapların hiçbir yerde saklanmıyor, yani hiçbir şey taşınmaz." },
      { q: "Sonucumu indirebilir/paylaşabilir miyim?", a: "Evet. Sonuç ekranın sana uyumlu bir duvar kağıdı, profil fotoğrafı ve Odd kartı veriyor, kaydedip paylaşabilirsin — paylaşırsan @theoddvi'yi etiketle." }
    ],
    de: [
      { q: "Was ist der Odd Test?", a: "Ein kurzes Quiz, das deine Eigenheiten in ein Ergebnis verwandelt: welche Odd-Variante du bist, basierend darauf, wie du zehn schnelle Fragen beantwortest." },
      { q: "Wie viele Fragen gibt es?", a: "Zehn. Jede ist eine Zwei-Optionen-Wahl — kein Tippen, kein Grübeln. Die meisten sind in unter zwei Minuten fertig." },
      { q: "Wie wird mein Ergebnis berechnet?", a: "Jede Antwort bringt dich näher an einen von mehreren Odd-Archetypen. Nach der letzten Frage wird der Archetyp, dem du am nächsten warst, dein Ergebnis, mit einer vollständigen Übersicht, wie nah die anderen waren." },
      { q: "Kann ich den Test wiederholen?", a: "Ja — klick auf dem Ergebnisbildschirm auf \"Wiederholen\" und leg neu los. Deine Antworten werden nirgends gespeichert, es überträgt sich also nichts." },
      { q: "Kann ich mein Ergebnis herunterladen oder teilen?", a: "Ja. Dein Ergebnisbildschirm liefert dir ein passendes Hintergrundbild, Profilbild und eine Odd-Karte zum Speichern und Posten — markiere @theoddvi, wenn du es tust." }
    ],
    fr: [
      { q: "Qu'est-ce que l'Odd Test ?", a: "Un quiz court qui transforme tes bizarreries en résultat : quel type d'Odd tu es, selon la façon dont tu réponds à dix questions rapides." },
      { q: "Combien de questions y a-t-il ?", a: "Dix. Chacune est un choix à deux options — pas de saisie, pas de réflexion excessive. La plupart des gens terminent en moins de deux minutes." },
      { q: "Comment mon résultat est-il calculé ?", a: "Chaque réponse te rapproche de l'un des différents archétypes Odd. Après la dernière question, l'archétype dont tu étais le plus proche devient ton résultat, avec le détail complet de la proximité des autres." },
      { q: "Puis-je repasser le test ?", a: "Oui — clique sur \"Recommencer\" sur l'écran de résultat et relance-le. Tes réponses ne sont enregistrées nulle part, donc rien n'est conservé." },
      { q: "Puis-je télécharger ou partager mon résultat ?", a: "Oui. Ton écran de résultat te donne un fond d'écran assorti, une photo de profil et une carte Odd à sauvegarder et publier — identifie @theoddvi si tu le fais." }
    ],
    hu: [
      { q: "Mi az az Odd Test?", a: "Egy rövid kvíz, ami a különcségeidet eredménnyé alakítja: kiderül, milyen fajta Odd vagy, aszerint, hogyan válaszolsz tíz gyors kérdésre." },
      { q: "Hány kérdés van?", a: "Tíz. Mindegyik kételemű választás — nincs gépelés, nincs túlgondolás. A legtöbben két percen belül végeznek." },
      { q: "Hogyan számolódik ki az eredményem?", a: "Minden válasz közelebb visz az egyik Odd-archetípushoz. Az utolsó kérdés után az az archetípus lesz az eredményed, amelyikhez a legközelebb kerültél, a többiek pontos közelségének részletes bontásával együtt." },
      { q: "Újra kitölthetem a tesztet?", a: "Igen — nyomj az eredményképernyőn az \"Újra\" gombra, és kezdd elölről. A válaszaid sehol sem kerülnek mentésre, szóval semmi nem marad meg." },
      { q: "Letölthetem vagy megoszthatom az eredményemet?", a: "Igen. Az eredményképernyőd ad egy hozzáillő háttérképet, profilképet és Odd-kártyát, amit elmenthetsz és posztolhatsz — jelöld meg a @theoddvi-t, ha megteszed." }
    ]
  };

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && FAQ[l]) ? l : 'en';
  }

  function render() {
    var list = document.getElementById('testFaqList');
    var heading = document.getElementById('testFaqHeading');
    if (!list) return;
    var l = currentLang();
    if (heading) heading.textContent = HEADING[l];

    list.innerHTML = FAQ[l].map(function (item, i) {
      return (
        '<div class="faq-item" data-i="' + i + '">' +
          '<button type="button" class="faq-q"><span>' + item.q + '</span><span class="plus" aria-hidden="true">+</span></button>' +
          '<div class="faq-a"><p>' + item.a + '</p></div>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('.faq-item').forEach(function (item) {
      item.querySelector('.faq-q').addEventListener('click', function () {
        item.classList.toggle('open');
      });
    });
  }

  window.addEventListener('oddvi:lang', render);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
