/* OddLikes — shared like-button widget for gallery images and reels.
   Reuses the same /api/like and /api/likes endpoints as the Share Your Odd feature.
   Usage:
     OddLikes.pathId(path)              -> stable id derived from an image/video path
     OddLikes.buttonHTML(id, cls)       -> HTML string for a like button
     OddLikes.wire(containerEl)         -> fetches counts + wires click handling for all
                                            .like-btn elements inside containerEl
*/
window.OddLikes = (function () {
  function pathId(path) {
    var s = String(path || ''), h = 0;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return 'p' + Math.abs(h).toString(36);
  }

  function buttonHTML(id, cls) {
    var liked = localStorage.getItem('oddvi_liked_' + id) === '1';
    return '<button type="button" class="like-btn ' + (cls || '') + (liked ? ' liked' : '') +
      '" data-like-id="' + id + '" aria-label="Like">' +
      '<span class="like-heart">' + (liked ? '\u2764\uFE0F' : '\uD83E\uDD0D') + '</span>' +
      '<span class="like-count">\u2013</span></button>';
  }

  function wire(container) {
    if (!container) return;
    var buttons = container.querySelectorAll('.like-btn');
    var ids = Array.prototype.map.call(buttons, function (b) { return b.getAttribute('data-like-id'); });
    if (ids.length) {
      fetch('/api/likes?ids=' + encodeURIComponent(ids.join(',')))
        .then(function (r) { return r.ok ? r.json() : {}; })
        .then(function (counts) {
          buttons.forEach(function (b) {
            var id = b.getAttribute('data-like-id');
            var el = b.querySelector('.like-count');
            if (el) el.textContent = counts[id] || 0;
          });
        })
        .catch(function () {
          buttons.forEach(function (b) { var el = b.querySelector('.like-count'); if (el) el.textContent = 0; });
        });
    }
    if (container.__oddLikesWired) return;
    container.__oddLikesWired = true;
    container.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.like-btn');
      if (!btn || !container.contains(btn)) return;
      e.preventDefault(); e.stopPropagation();
      var id = btn.getAttribute('data-like-id');
      if (localStorage.getItem('oddvi_liked_' + id) === '1') return;
      btn.disabled = true;
      fetch('/api/like', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id })
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (d && typeof d.likes === 'number') {
            var cEl = btn.querySelector('.like-count'); if (cEl) cEl.textContent = d.likes;
            var hEl = btn.querySelector('.like-heart'); if (hEl) hEl.textContent = '\u2764\uFE0F';
            btn.classList.add('liked');
            localStorage.setItem('oddvi_liked_' + id, '1');
          }
          btn.disabled = false;
        })
        .catch(function () { btn.disabled = false; });
    });
  }

  return { pathId: pathId, buttonHTML: buttonHTML, wire: wire };
})();
