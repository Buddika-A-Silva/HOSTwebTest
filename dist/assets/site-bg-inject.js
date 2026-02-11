(function(){
  // Inject hero-effect CSS and optional hero-effect.js, and add .bg-graphics markup to the page body.
  if(typeof window === 'undefined') return;
  function ensureCss(){
    if(document.querySelector('link[href*="hero-effect.css"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'assets/hero-effect.css';
    document.head.appendChild(l);
  }
  function ensureHeroJs(){
    if(document.querySelector('script[src*="hero-effect.js"]')) return;
    var s = document.createElement('script');
    s.src = 'assets/hero-effect.js';
    s.defer = true;
    document.body.appendChild(s);
  }
  function injectBgGraphics(){
    if(document.querySelector('.bg-graphics') || document.querySelector('#heroCanvas')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'bg-graphics';
    wrapper.setAttribute('aria-hidden','true');
    wrapper.innerHTML = '<div class="bg-shape shape-1"></div><div class="bg-shape shape-2"></div><div class="bg-shape shape-3"></div><div class="bg-shape shape-4"></div>';
    // insert as first child of body
    var b = document.body;
    if(b.firstChild) b.insertBefore(wrapper, b.firstChild); else b.appendChild(wrapper);
  }
  document.addEventListener('DOMContentLoaded', function(){
    ensureCss();
    injectBgGraphics();
    // load hero JS to draw canvas blobs if heroCanvas present on page
    ensureHeroJs();
  });
})();
