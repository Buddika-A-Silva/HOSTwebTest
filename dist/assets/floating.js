(function(){
  if(typeof window === 'undefined') return;
  function ensureContainer(){
    var g = document.querySelector('.bg-graphics');
    if(!g) return null;
    var c = g.querySelector('.floating-images');
    if(!c){ c = document.createElement('div'); c.className = 'floating-images'; g.appendChild(c); }
    return c;
  }
  function placeImage(container, src, idx){
    var img = document.createElement('img');
    img.className = 'floating-img';
    img.src = src;
    // random size class
    var sizes = ['small','medium','large'];
    img.classList.add(sizes[Math.floor(Math.random()*sizes.length)]);
    // random position
    var left = Math.round(Math.random()*80)+10 + '%';
    var top = Math.round(Math.random()*70)+5 + '%';
    img.style.left = left;
    img.style.top = top;
    // animation timing
    var dur = 18 + Math.round(Math.random()*36);
    img.style.setProperty('--dur', dur + 's');
    img.style.setProperty('--delay', (-Math.random()*dur).toFixed(2) + 's');
    container.appendChild(img);
  }

  // Embedded manifest (falls back to fetch if empty)
  var EMBED_MANIFEST = [
    "floating/WhatsApp Image 2026-01-26 at 00.11.29.jpeg",
    "floating/WhatsApp Image 2026-02-12 at 02.57.19.jpeg",
    "floating/WhatsApp Image 2026-02-12 at 02.59.42.jpeg",
    "floating/WhatsApp Image 2026-02-12 at 02.59.46.jpeg"
  ];

  async function loadList(){
      var container = ensureContainer();
      if(!container) return;
      // make visible for debugging/preview
      container.classList.add('visible-debug');
      // use embedded manifest when available (works with file://)
      var list = Array.isArray(EMBED_MANIFEST) && EMBED_MANIFEST.length ? EMBED_MANIFEST : null;
      if(list){
        list.forEach(function(p,i){
          var src = p.indexOf('assets/')===0 ? p : ('assets/' + p);
          placeImage(container, src, i);
        });
        return;
      }
      try{
        var res = await fetch('assets/floating.json', {cache: 'no-store'});
        if(!res.ok) return;
        var fetched = await res.json();
        if(!Array.isArray(fetched) || fetched.length===0) return;
        fetched.forEach(function(p,i){
          var src = p.indexOf('assets/')===0 ? p : ('assets/' + p);
          placeImage(container, src, i);
        });
      }catch(e){
        // graceful fallback: nothing
        return;
      }
    }

  document.addEventListener('DOMContentLoaded', function(){
      loadList();
    });
})();
