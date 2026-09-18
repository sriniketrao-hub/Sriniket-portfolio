  function loadTape(el, client, title){
    document.querySelectorAll('.tape').forEach(function(t){ t.classList.remove('active-tape'); });
    el.classList.add('active-tape');
    var ph = document.getElementById('deckPh');
    ph.innerHTML = '<div class="loaded-tt">'+client+'</div><div class="loaded-ttl">'+title+'</div><div class="hint">Full script on request — this deck is a stylized index, not a player</div>';
  }
