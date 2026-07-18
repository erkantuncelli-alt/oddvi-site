/* ============================================================
   ODDVI · Homepage FAQ accordion
   Self-contained 5-language Q&A, separate from the global
   i18n-dict.js so it doesn't require touching that file for a
   single page. Content mirrors the FAQPage JSON-LD in <head>.
   ============================================================ */
(function () {
  var HEADING = {
    en: "Questions, Answered",
    tr: "Merak Edilenler",
    de: "Häufige Fragen",
    fr: "Questions Fréquentes",
    hu: "Gyakori Kérdések"
  };

  var FAQ = {
    en: [
      { q: "Who is Oddvi?", a: "Oddvi is a black, rounded mascot character with one white oval for a mouth and two eyes that never blink. Nobody knows where it came from — its whole philosophy is that normal is everywhere, but odd is what gets remembered." },
      { q: "What is Pardon My Odd?", a: "Pardon My Odd (PMO) is the streetwear and lifestyle brand built around Oddvi — colorful, playful gift-box underwear and apparel. It's coming soon; leave your email on this page and you'll be the first to know when it launches." },
      { q: "What does \"Normal is everywhere, Odd is remembered\" mean?", a: "It's the core of the Oddvi manifesto: fitting in is the easy, forgettable choice. Being yourself — quirks and all — is what people actually remember you for." },
      { q: "What's the difference between Normal Mode and Odd Mode on this site?", a: "Odd Mode is the site as designed — full color, motion, personality. Normal Mode drains it all to grayscale and kills the animations, as a joke about what conformity actually looks like. You can toggle it from the menu." },
      { q: "Where can I follow Oddvi?", a: "Oddvi posts on Instagram at @theoddvi. Tag a post, send a DM, or just say hi — every message gets a reply from Oddvi, not a bot." }
    ],
    tr: [
      { q: "Oddvi kimdir?", a: "Oddvi, ağzı tek bir beyaz oval, gözleri hiç kırpmayan, siyah yuvarlak vücutlu bir maskot karakteridir. Nereden geldiği bilinmiyor — tüm felsefesi şu: normal her yerde, ama hatırlanan hep tuhaf olandır." },
      { q: "Pardon My Odd nedir?", a: "Pardon My Odd (PMO), Oddvi etrafında kurulan sokak modası/yaşam tarzı markası — renkli, eğlenceli hediye kutulu iç çamaşırı ve giyim. Çok yakında geliyor; bu sayfaya e-postanı bırakırsan lansmanı ilk sen öğrenirsin." },
      { q: "\"Normal her yerde, hatırlanan hep Odd'dur\" ne demek?", a: "Oddvi manifestosunun özeti bu: uyum sağlamak kolay ve unutulur bir seçim. Kendin olmak — tuhaflıkların dahil — insanların seni gerçekten hatırladığı şeydir." },
      { q: "Sitedeki Normal Mode ve Odd Mode arasındaki fark ne?", a: "Odd Mode, sitenin tasarlandığı hâli — tam renk, hareket, karakter. Normal Mode ise her şeyi griye çevirip animasyonları öldürüyor; uyumun aslında nasıl göründüğüne dair küçük bir şaka. Menüden değiştirebilirsin." },
      { q: "Oddvi'yi nereden takip edebilirim?", a: "Oddvi Instagram'da @theoddvi hesabında paylaşım yapıyor. Bir gönderiyi etiketle, DM at ya da sadece merhaba de — her mesaja bot değil, Oddvi'nin kendisi cevap veriyor." }
    ],
    de: [
      { q: "Wer ist Oddvi?", a: "Oddvi ist ein schwarzer, rundlicher Maskottchen-Charakter mit einem weißen ovalen Mund und zwei Augen, die nie blinzeln. Niemand weiß, woher es kommt — seine ganze Philosophie ist: Normal ist überall, aber seltsam ist das, woran man sich erinnert." },
      { q: "Was ist Pardon My Odd?", a: "Pardon My Odd (PMO) ist die Streetwear- und Lifestyle-Marke rund um Oddvi — bunte, verspielte Geschenkbox-Unterwäsche und Kleidung. Es kommt bald; hinterlasse deine E-Mail auf dieser Seite, um als Erster vom Launch zu erfahren." },
      { q: "Was bedeutet \"Normal ist überall, Seltsam bleibt in Erinnerung\"?", a: "Das ist der Kern des Oddvi-Manifests: Sich anzupassen ist die einfache, vergessliche Wahl. Man selbst zu sein — mit allen Eigenheiten — ist das, wofür man sich tatsächlich erinnert wird." },
      { q: "Was ist der Unterschied zwischen Normal Mode und Odd Mode auf dieser Seite?", a: "Odd Mode ist die Seite wie sie designt wurde — volle Farbe, Bewegung, Persönlichkeit. Normal Mode entzieht alles zu Graustufen und stoppt die Animationen, als Witz darüber, wie Konformität wirklich aussieht. Umschaltbar über das Menü." },
      { q: "Wo kann ich Oddvi folgen?", a: "Oddvi postet auf Instagram unter @theoddvi. Markiere einen Post, schick eine DM oder sag einfach Hallo — jede Nachricht bekommt eine Antwort von Oddvi, nicht von einem Bot." }
    ],
    fr: [
      { q: "Qui est Oddvi ?", a: "Oddvi est un personnage mascotte noir et arrondi, avec une bouche ovale blanche et deux yeux qui ne clignent jamais. Personne ne sait d'où il vient — toute sa philosophie tient en une phrase : le normal est partout, mais c'est le bizarre qu'on retient." },
      { q: "Qu'est-ce que Pardon My Odd ?", a: "Pardon My Odd (PMO) est la marque streetwear et lifestyle construite autour d'Oddvi — sous-vêtements et vêtements colorés et ludiques en coffret cadeau. Le lancement arrive bientôt ; laisse ton email sur cette page pour être informé en premier." },
      { q: "Que signifie \"Le normal est partout, l'Odd reste en mémoire\" ?", a: "C'est le cœur du manifeste Oddvi : se fondre dans la masse est le choix facile et oubliable. Être soi-même — avec toutes ses bizarreries — c'est ce dont les gens se souviennent vraiment." },
      { q: "Quelle est la différence entre Normal Mode et Odd Mode sur ce site ?", a: "Odd Mode, c'est le site tel qu'il a été conçu — pleine couleur, mouvement, personnalité. Normal Mode désature tout en niveaux de gris et coupe les animations, comme une blague sur ce à quoi ressemble vraiment le conformisme. Activable depuis le menu." },
      { q: "Où puis-je suivre Oddvi ?", a: "Oddvi publie sur Instagram sous @theoddvi. Identifie un post, envoie un DM, ou dis simplement bonjour — chaque message reçoit une réponse d'Oddvi, pas d'un bot." }
    ],
    hu: [
      { q: "Ki az az Oddvi?", a: "Oddvi egy fekete, kerekded kabalafigura, egyetlen fehér ovális szájjal és két szemmel, amik sosem pislognak. Senki sem tudja, honnan jött — a filozófiája egyszerű: a normális mindenhol ott van, de amit megjegyeznek, az a fura." },
      { q: "Mi az a Pardon My Odd?", a: "A Pardon My Odd (PMO) az Oddvi köré épített streetwear és életmód márka — színes, játékos ajándékdobozos fehérnemű és ruházat. Hamarosan érkezik; hagyd itt az e-mail címed ezen az oldalon, hogy elsőként értesülj az indulásról." },
      { q: "Mit jelent az, hogy \"A normális mindenhol ott van, az Odd az, amit megjegyeznek\"?", a: "Ez az Oddvi-manifesztó lényege: a beilleszkedés a könnyű, feledhető választás. Önmagadnak lenni — a különcségeiddel együtt — az, amiért az emberek tényleg emlékeznek rád." },
      { q: "Mi a különbség a Normal Mode és az Odd Mode között ezen az oldalon?", a: "Az Odd Mode az oldal úgy, ahogy megtervezték — teljes szín, mozgás, karakter. A Normal Mode mindent szürkeárnyalatosra vált és leállítja az animációkat, viccként arról, hogy a konformizmus valójában hogy néz ki. A menüből kapcsolható." },
      { q: "Hol követhetem Oddvit?", a: "Oddvi az Instagramon posztol, @theoddvi néven. Jelölj meg egy posztot, írj DM-et, vagy csak köszönj — minden üzenetre Oddvi válaszol, nem egy bot." }
    ]
  };

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && FAQ[l]) ? l : 'en';
  }

  function render() {
    var list = document.getElementById('faqList');
    var heading = document.getElementById('faqHeading');
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
