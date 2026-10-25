(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize(){
    width = canvas.width = canvas.clientWidth * devicePixelRatio;
    height = canvas.height = canvas.clientHeight * devicePixelRatio;
  }

  function makeParticles(count){
    particles = [];
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*width,
        y: Math.random()*height,
        r: (Math.random()*2 + 1) * devicePixelRatio,
        vx: (Math.random()-0.5) * 0.3 * devicePixelRatio,
        vy: (Math.random()-0.5) * 0.3 * devicePixelRatio,
        life: Math.random()*1.2 + 0.6
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,width,height);
    // subtle gradient background
    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0,'#0b0b0b');
    g.addColorStop(1,'#1b1b1b');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // draw soft glowing blobs behind particles
    if(blobs){
      for(let b of blobs){
        b.x += b.vx; b.y += b.vy; b.vx += (Math.random()-0.5)*0.01*devicePixelRatio; b.vy += (Math.random()-0.5)*0.01*devicePixelRatio;
        if(b.x < -b.r) b.x = width + b.r;
        if(b.x > width + b.r) b.x = -b.r;
        if(b.y < -b.r) b.y = height + b.r;
        if(b.y > height + b.r) b.y = -b.r;
        const rg = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*2);
        rg.addColorStop(0,b.colorStart);
        rg.addColorStop(0.6,b.colorMid);
        rg.addColorStop(1,'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r*2,0,Math.PI*2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    // draw particles
    for(let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random()-0.5)*0.02*devicePixelRatio;
      p.vy += (Math.random()-0.5)*0.02*devicePixelRatio;
      if(p.x < -50*devicePixelRatio) p.x = width + 50*devicePixelRatio;
      if(p.x > width + 50*devicePixelRatio) p.x = -50*devicePixelRatio;
      if(p.y < -50*devicePixelRatio) p.y = height + 50*devicePixelRatio;
      if(p.y > height + 50*devicePixelRatio) p.y = -50*devicePixelRatio;

      const alpha = 0.06;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,220,140,${alpha})`;
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // subtle moving vignette
    ctx.globalCompositeOperation = 'soft-light';
    const vign = ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,Math.max(width,height)/1.1);
    vign.addColorStop(0,'rgba(255,255,255,0)');
    vign.addColorStop(1,'rgba(0,0,0,0.35)');
    ctx.fillStyle = vign;
    ctx.fillRect(0,0,width,height);
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
  }

  function start(){
    resize();
    makeParticles(Math.max(40, Math.floor((width*height)/(90000))));
    // create large soft blobs
    blobs = [];
    const centerColors = [
      {start:'rgba(255,200,120,0.22)',mid:'rgba(255,160,60,0.08)'},
      {start:'rgba(61,90,172,0.20)',mid:'rgba(30,60,120,0.06)'},
      {start:'rgba(200,170,110,0.18)',mid:'rgba(140,110,60,0.05)'}
    ];
    for(let i=0;i<3;i++){
      const c = centerColors[i%centerColors.length];
      blobs.push({
        x: Math.random()*width,
        y: Math.random()*height,
        r: Math.max(width,height)*0.18*(0.8+Math.random()*0.6),
        vx: (Math.random()-0.5)*0.2*devicePixelRatio,
        vy: (Math.random()-0.5)*0.2*devicePixelRatio,
        colorStart: c.start,
        colorMid: c.mid
      });
    }
    draw();
  }

  window.addEventListener('resize', ()=>{
    resize();
  });

  // start when DOM ready
  document.addEventListener('DOMContentLoaded', start);
})();
