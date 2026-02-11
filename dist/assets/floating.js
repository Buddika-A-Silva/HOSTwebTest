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

  async function loadList(){
    var container = ensureContainer();
    if(!container) return;
    try{
      var res = await fetch('assets/floating.json', {cache: 'no-store'});
      if(!res.ok) return;
      var list = await res.json();
      if(!Array.isArray(list) || list.length===0) return;
      list.forEach(function(p,i){
        // ensure path is relative to assets
        var src = p.indexOf('assets/')===0 ? p : ('assets/' + p);
        placeImage(container, src, i);
      });
    }catch(e){
      // graceful fallback: do nothing
      return;
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    loadList();
  });
})();
