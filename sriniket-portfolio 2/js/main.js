/* ===========================================================
   Interaction logic: tape deck, case-study modal, reel lightbox.
   Plain vanilla JS, no build step, no dependencies.
=========================================================== */

/* ---------- helpers ---------- */

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}

function trapFocus(panel){
  var f = panel.querySelector('button, a, [tabindex]');
  if (f) f.focus();
}

/* ---------- TAPE DECK (Writing section) ---------- */

var transcriptOpen = false;

function embedUrlForTape(t){
  if (t.type === 'youtube') return 'https://www.youtube.com/embed/' + t.id + '?autoplay=1&rel=0';
  return 'https://www.instagram.com/' + t.postType + '/' + t.id + '/embed/';
}

function loadTape(el, idx){
  var t = TAPES[idx];
  if (!t) return;

  document.querySelectorAll('.tape').forEach(function(tp){ tp.classList.remove('active-tape'); });
  el.classList.add('active-tape');

  var ph = document.getElementById('deckPh');
  transcriptOpen = false;

  // brief "tape catching" flicker before the video loads
  ph.innerHTML = '<div class="static flicker"></div>';
  ph.classList.add('is-flicker');

  setTimeout(function(){
    ph.classList.remove('is-flicker');
    ph.innerHTML = '<iframe class="deck-iframe" src="' + embedUrlForTape(t) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" title="' + escapeHtml(t.title) + '"></iframe>';

    var meta = document.getElementById('deckMeta');
    meta.innerHTML =
      '<div class="deck-meta-row">' +
        '<div>' +
          '<div class="deck-meta-tt">' + escapeHtml(t.show) + '</div>' +
          '<div class="deck-meta-ttl">' + escapeHtml(t.title) + '</div>' +
        '</div>' +
        '<div class="deck-meta-actions">' +
          '<button type="button" class="deck-btn" onclick="toggleTranscript()">Transcript</button>' +
          '<a class="deck-btn deck-btn-link" href="' + t.watchHref + '" target="_blank" rel="noopener">Open original ↗</a>' +
        '</div>' +
      '</div>' +
      '<div class="deck-transcript" id="deckTranscript" style="display:none">' +
        '<div class="deck-transcript-label">' + escapeHtml(t.forLine) + '</div>' +
        '<pre>' + escapeHtml(t.excerpt) + '</pre>' +
      '</div>';
  }, 420);
}

function toggleTranscript(){
  transcriptOpen = !transcriptOpen;
  var tr = document.getElementById('deckTranscript');
  if (tr) tr.style.display = transcriptOpen ? 'block' : 'none';
}

/* ---------- CASE STUDY MODAL (Work section) ---------- */

function renderCaseBody(c){
  var html = '';
  html += '<div class="modal-art" style="background-image:url(' + c.art + ')"></div>';
  html += '<div class="modal-body">';
  html += '<div class="modal-eyebrow mono">Case ' + c.num + '</div>';
  html += '<div class="case-client">' + escapeHtml(c.client) + '</div>';
  html += '<h3 id="caseModalTitle">' + escapeHtml(c.title) + '</h3>';

  html += '<div class="modal-meta-row">';
  c.meta.forEach(function(m){
    html += '<div class="modal-meta-item"><div class="k">' + escapeHtml(m[0]) + '</div><div class="v">' + escapeHtml(m[1]) + '</div></div>';
  });
  html += '</div>';

  html += '<h4>' + escapeHtml(c.problemH) + '</h4><p>' + escapeHtml(c.problem) + '</p>';
  html += '<h4>' + escapeHtml(c.ownershipH) + '</h4><p>' + escapeHtml(c.ownership) + '</p>';

  html += '<h4>' + escapeHtml(c.decisionsH) + '</h4>';
  c.forks.forEach(function(f){
    html += '<div class="modal-fork"><div class="modal-fork-title">' + escapeHtml(f[0]) + '</div><p>' + escapeHtml(f[1]) + '</p></div>';
  });

  html += '<h4>' + escapeHtml(c.resultsH) + '</h4><ul class="modal-results">';
  c.results.forEach(function(r){
    html += '<li>' + escapeHtml(r) + '</li>';
  });
  html += '</ul>';

  if (c.retro){
    html += '<div class="modal-retro">' + escapeHtml(c.retro) + '</div>';
  }

  html += '</div>';
  return html;
}

function openCaseModal(idx){
  var c = CASES[idx];
  if (!c) return;
  var modal = document.getElementById('caseModal');
  document.getElementById('caseModalBody').innerHTML = renderCaseBody(c);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  trapFocus(modal);
}

function closeCaseModal(){
  var modal = document.getElementById('caseModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ---------- REEL LIGHTBOX (Yard reels grid) ---------- */

function openReel(id){
  var lb = document.getElementById('lightbox');
  var frame = document.getElementById('lightboxFrame');
  var fallback = document.getElementById('lightboxFallback');
  var href = 'https://www.instagram.com/reel/' + id + '/';
  frame.innerHTML = '<iframe src="' + href + 'embed/" allow="autoplay; encrypted-media" allowfullscreen loading="lazy" title="The Yard reel"></iframe>';
  fallback.href = href;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  trapFocus(lb);
}

function closeLightbox(){
  var lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.getElementById('lightboxFrame').innerHTML = '';
  document.body.style.overflow = '';
}

/* ---------- wiring: click delegation, backdrop/Escape close ---------- */

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.case-card').forEach(function(card){
    card.addEventListener('click', function(){ openCaseModal(parseInt(card.getAttribute('data-case'), 10)); });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openCaseModal(parseInt(card.getAttribute('data-case'), 10)); }
    });
  });

  document.querySelectorAll('.thumb-card[role="button"]').forEach(function(tile){
    tile.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tile.click(); }
    });
  });

  ['caseModal', 'lightbox'].forEach(function(id){
    var el = document.getElementById(id);
    el.addEventListener('click', function(e){
      if (e.target === el){ id === 'caseModal' ? closeCaseModal() : closeLightbox(); }
    });
  });

  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    if (document.getElementById('caseModal').classList.contains('open')) closeCaseModal();
    if (document.getElementById('lightbox').classList.contains('open')) closeLightbox();
  });
});
