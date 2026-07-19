/* ============================================================
   ODDVI · Odd Playlist section text
   Self-contained 5-language labels for the Spotify embed section.
   ============================================================ */
(function () {
  var TEXT = {
    en: { kicker: "Now Playing", heading: "The Odd Playlist", intro: "Songs for being loud in a quiet room. Updated whenever Oddvi feels like it.", follow: "Follow on Spotify →" },
    tr: { kicker: "Şu An Çalıyor", heading: "Odd Playlist", intro: "Sessiz bir odada gürültü yapmak için şarkılar. Oddvi canı istedikçe güncellenir.", follow: "Spotify'da takip et →" },
    de: { kicker: "Läuft Gerade", heading: "Die Odd Playlist", intro: "Songs, um in einem stillen Raum laut zu sein. Wird aktualisiert, wann immer Oddvi Lust hat.", follow: "Auf Spotify folgen →" },
    fr: { kicker: "En Écoute", heading: "La Odd Playlist", intro: "Des chansons pour faire du bruit dans une pièce silencieuse. Mise à jour quand Oddvi en a envie.", follow: "Suivre sur Spotify →" },
    hu: { kicker: "Most Szól", heading: "Az Odd Playlist", intro: "Dalok ahhoz, hogy hangos legyél egy csendes szobában. Akkor frissül, amikor Oddvinek kedve van hozzá.", follow: "Kövesd a Spotify-on →" }
  };

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && TEXT[l]) ? l : 'en';
  }

  function apply() {
    var t = TEXT[currentLang()];
    var kicker = document.getElementById('oplKicker');
    var heading = document.getElementById('oplHeading');
    var intro = document.getElementById('oplIntro');
    var follow = document.getElementById('oplFollow');
    if (kicker) kicker.textContent = t.kicker;
    if (heading) heading.textContent = t.heading;
    if (intro) intro.textContent = t.intro;
    if (follow) follow.textContent = t.follow;
  }

  window.addEventListener('oddvi:lang', apply);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
