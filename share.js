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
