/* ============================================================
   ODDVI · Poll mascot picker
   Picks one small Oddvi image per day (stable all day, changes
   daily) to decorate the poll widgets. Same day = same image on
   both the homepage poll and the poll history page.
   ============================================================ */
(function () {
  var IMAGES = [
    '/uploads/oddgallery/oddvi-goes-to-france.jpg',
    '/uploads/oddgallery/oddvi-goes-to-italy.jpg',
    '/uploads/oddgallery/oddvi-goes-to-germany.jpg',
    '/uploads/oddgallery/oddvi-goes-to-belgium.jpg',
    '/uploads/oddgallery/oddvi-goes-to-netherlands.jpg',
    '/uploads/oddgallery/oddvi-goes-to-russia.jpg',
    '/uploads/oddgallery/austria-alpine-oddvi.jpg',
    '/uploads/oddgallery/hungary-folk-boxers.jpg',
    '/uploads/oddgallery/turkey-fez-boxers.jpg'
  ];

  function indexForDay(dayStr) {
    var h = 0;
    for (var i = 0; i < dayStr.length; i++) {
      h = (h * 31 + dayStr.charCodeAt(i)) >>> 0;
    }
    return h % IMAGES.length;
  }

  function get(dayStr) {
    var day = dayStr || new Date().toISOString().slice(0, 10);
    return IMAGES[indexForDay(day)];
  }

  window.OddviPollMascot = { get: get };
})();
