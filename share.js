/* ============================================================
   ODDVI · Odd Share
   Galeri kartlarına paylaşım davranışı ekler: rastgele bir
   slogan + görselin kendisi (mümkünse) veya WhatsApp linki.
   ============================================================ */
window.OddShare = (function () {
  var SLOGANS = {
    tr: [
      'Bunu görünce seni düşündüm 👀',
      'Bak bu tam sana göre 😂',
      'Şaka yapmak istediğin birine gönder',
      'Bunu görmeyen pişman olur',
      'Arkadaşını etiketle, kendini gör',
      'Bu senin bugünkü ruh halin olabilir mi?',
      'Kimseye söyleme ama bu tam senlik',
      'Bunu WhatsApp\u2019ta atacağın biri var, biliyorsun',
      'Grup sohbetine bunu bırak ve kaç'
    ],
    en: [
      'Saw this and thought of you 👀',
      'This is exactly your vibe 😂',
      'Send this to someone you want to roast',
      'You\u2019ll regret not sharing this',
      'Tag a friend, see yourself',
      'Is this your mood today?',
      'Don\u2019t tell anyone but this is so you',
      'You know exactly who needs this on WhatsApp',
      'Drop this in the group chat and disappear'
    ],
    de: [
      'Hab das gesehen und an dich gedacht 👀',
      'Das ist genau dein Vibe 😂',
      'Schick das jemandem, den du aufziehen willst',
      'Du wirst es bereuen, das nicht zu teilen',
      'Markier eine Freundin, erkenn dich selbst',
      'Ist das deine Stimmung heute?',
      'Sag es niemandem, aber das bist so du',
      'Du weißt genau, wer das auf WhatsApp braucht',
      'Wirf das in den Gruppenchat und verschwinde'
    ],
    fr: [
      'J\u2019ai vu ça et j\u2019ai pensé à toi 👀',
      'C\u2019est exactement ton vibe 😂',
      'Envoie ça à quelqu\u2019un que tu veux clasher',
      'Tu vas regretter de ne pas avoir partagé ça',
      'Tague un(e) ami(e), reconnais-toi',
      'C\u2019est ton mood aujourd\u2019hui ?',
      'Le dis à personne mais c\u2019est tellement toi',
      'Tu sais exactement qui a besoin de ça sur WhatsApp',
      'Balance ça dans le groupe et disparais'
    ],
    hu: [
      'Ezt láttam és rád gondoltam 👀',
      'Ez pontosan a te stílusod 😂',
      'Küldd el annak, akit ugratni akarsz',
      'Megbánod, ha nem osztod meg ezt',
      'Jelölj meg egy barátot, ismerd fel magad',
      'Ez a mai hangulatod?',
      'Ne mondd el senkinek, de ez pont te vagy',
      'Pontosan tudod, kinek kell ez WhatsAppon',
      'Dobd be a csoportba és tűnj el'
    ]
  };

  function lang() { return document.documentElement.lang || localStorage.getItem('oddvi_lang') || 'en'; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function pickSlogan() {
    var l = SLOGANS[lang()] ? lang() : 'en';
    return pick(SLOGANS[l]);
  }

  /* imagePath: /uploads/oddgallery/x.jpg | caption: string | deepUrl: full page URL to share */
  function shareImage(imagePath, caption, deepUrl) {
    var slogan = pickSlogan();
    var text = slogan + (caption ? ' \u2014 "' + caption + '"' : '') + '\n' + deepUrl;

    function fallback() {
      var wa = 'https://wa.me/?text=' + encodeURIComponent(text);
      window.open(wa, '_blank');
    }

    (async function () {
      try {
        if (navigator.canShare) {
          var resp = await fetch(imagePath);
          var blob = await resp.blob();
          var file = new File([blob], 'oddvi.jpg', { type: blob.type || 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], text: text });
            return;
          }
        }
        if (navigator.share) {
          await navigator.share({ title: 'Oddvi', text: text, url: deepUrl });
          return;
        }
        fallback();
      } catch (e) { /* user cancelled or failed silently — no fallback spam */ }
    })();
  }

  return { pickSlogan: pickSlogan, shareImage: shareImage };
})();
