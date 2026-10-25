// Site enhancements: hero parallax, staggered reveal, and simple carousel
document.addEventListener('DOMContentLoaded', ()=>{
  // Parallax: move hero background pseudo-element slightly on scroll
  const hero = document.querySelector('.hero');
  if(hero){
    const onScroll = ()=>{
      const rect = hero.getBoundingClientRect();
      const winH = window.innerHeight;
      // when hero is in view, compute progress
      const progress = Math.min(Math.max((winH - rect.top) / (winH + rect.height), 0), 1);
      // translate the pseudo background
      hero.style.setProperty('--parallax', `${Math.round(progress*20)}px`);
      hero.style.setProperty('transform','none');
      hero.querySelector('::before');
      // apply transform to before via inline style on element for simpler behavior
      hero.style.setProperty('--ph', `${(progress*20).toFixed(2)}px`);
      hero.style.transform = 'none';
      hero.style.willChange = 'transform';
      // set transform on pseudo by using CSS variable applied to :before in style tag
      hero.style.setProperty('background-position', `center ${10 - progress*8}%`);
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // Staggered reveal: small delay already in CSS keyframes

  // Carousel: simple auto-advance and controls
  const carousels = document.querySelectorAll('.blog-carousel');
  carousels.forEach(root=>{
    const slidesWrap = root.querySelector('.blog-slides');
    const slides = root.querySelectorAll('.blog-slide');
    if(!slidesWrap || slides.length<=1) return;
    let idx = 0; const total = slides.length; let timer = null; const interval = 4000;
    function go(i){ idx = (i+total)%total; slidesWrap.style.transform = `translateX(${ -idx * 100 }%)`; }
    function start(){ timer = setInterval(()=>go(idx+1), interval); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; }}
    // prev/next
    const prev = root.querySelector('.carousel-prev');
    const next = root.querySelector('.carousel-next');
    if(prev) prev.addEventListener('click', ()=>{ stop(); go(idx-1); start(); });
    if(next) next.addEventListener('click', ()=>{ stop(); go(idx+1); start(); });
    // pause on hover
    root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', start);
    start();
  });
});
