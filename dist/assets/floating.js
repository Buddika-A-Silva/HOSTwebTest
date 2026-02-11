(function(){
  if(typeof window === 'undefined') return;
  function ensureContainer(){
    var g = document.querySelector('.bg-graphics');
    if(!g) return null;
    var c = g.querySelector('.floating-images');
    if(!c){ c = document.createElement('div'); c.className = 'floating-images'; g.appendChild(c); }
    return c;
  }
  // Build a slow crossfading slideshow instead of many floating images
  function buildSlideshow(container, list){
    // remove existing slideshow if present
    var existing = container.querySelector('.slideshow');
    if(existing) existing.remove();
    var slideshow = document.createElement('div');
    slideshow.className = 'slideshow';
    // slide duration per image (seconds)
    var slideDuration = 12;
    var total = slideDuration * Math.max(1, list.length);
    list.forEach(function(p, i){
      var img = document.createElement('img');
      img.className = 'slide';
      img.src = p.indexOf('assets/')===0 ? p : ('assets/' + p);
      img.style.setProperty('--total', total + 's');
      img.style.setProperty('--delay', (i * slideDuration) + 's');
      // gentle variety in max-width
      if(i % 3 === 0) img.style.maxWidth = '80%';
      if(i % 3 === 1) img.style.maxWidth = '65%';
      if(i % 3 === 2) img.style.maxWidth = '45%';
      slideshow.appendChild(img);
    });
    container.appendChild(slideshow);
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
        // build a single slideshow
        buildSlideshow(container, list);
        return;
      }
      try{
        var res = await fetch('assets/floating.json', {cache: 'no-store'});
        if(!res.ok) return;
        var fetched = await res.json();
        if(!Array.isArray(fetched) || fetched.length===0) return;
        // build slideshow from fetched manifest
        buildSlideshow(container, fetched);
      }catch(e){
        // graceful fallback: nothing
        return;
      }
    }

  document.addEventListener('DOMContentLoaded', function(){
      loadList();
    });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadList();
    });
  } else {
    // DOMContentLoaded already fired (script was injected after parsing)
    // call loadList immediately so floating images are created.
    loadList();
  }
})();
