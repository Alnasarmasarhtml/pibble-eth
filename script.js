/* ==========================================================
   $PIBBLE v3 — ocean canvas, cursor ripples, bubble trail,
   parallax pibbles, audio, all interactions
   ========================================================== */

(() => {

const CONFIG = {
  ca: 'CA · coming soon',
  links: {
    x: 'https://x.com/ethpibble',
    tt: 'https://www.tiktok.com/@pibblefluencer',
    tg: '#',
    dex: '#',
    uni: '#'
  }
};

// apply links
const map = {sx:'x', stt:'tt', stg:'tg', sdex:'dex', uniswapBig:'uni', wcX:'x', wcTT:'tt', wcTG:'tg', fX:'x', fTT:'tt', fTG:'tg'};
Object.entries(map).forEach(([id,key]) => { const el = document.getElementById(id); if (el) el.href = CONFIG.links[key] || '#'; });
document.querySelectorAll('#caValue, #caValueBig').forEach(el => { if (el) el.textContent = CONFIG.ca; });

// ---------- TICKER ----------
const TICKER_ITEMS = [
  'pibble rides', 'small dog giant wave', 'dolphins approved', 'surfing detected',
  'pibblefluencer', '75M views and counting', 'one pibble', 'tiny dog big ocean',
  'turquoise wave protocol', 'milky just the way you are', 'no team only pibble',
];
const tickerTrack = document.getElementById('tickerTrack');
if (tickerTrack) {
  const html = TICKER_ITEMS.map(i => `<span>${i}</span><span class="dot">◆</span>`).join('');
  tickerTrack.innerHTML = html + html;
}

// ---------- COPY BUTTONS ----------
async function copy(text){
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea'); ta.value = text;
    ta.style.position='fixed'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    return true;
  }
}
function flash(btn, label='COPIED'){
  const o = btn.textContent;
  btn.textContent = `✓ ${label}`;
  btn.classList.add('copied');
  setTimeout(()=>{btn.textContent = o; btn.classList.remove('copied');}, 1400);
}
['copyCa','copyCaBig'].forEach(id => {
  const b = document.getElementById(id);
  if (!b) return;
  b.addEventListener('click', async () => { await copy(CONFIG.ca); flash(b); });
});

// ---------- STICKER GRID (all 31) ----------
const TOTAL_STICKERS = 31;
const grid = document.getElementById('stickerGrid');
const gradients = [
  'linear-gradient(135deg,#fff263,#fff5bc)',
  'linear-gradient(135deg,#16e7dc,#6ff5bc)',
  'linear-gradient(135deg,#ff7aa8,#fff263)',
  'linear-gradient(135deg,#52d8f5,#fff263)',
  'linear-gradient(135deg,#ff3f91,#ffb27c)',
  'linear-gradient(135deg,#6ff5bc,#fff263)',
  'linear-gradient(135deg,#52d8f5,#16e7dc)',
  'linear-gradient(135deg,#fff263,#ff7aa8)',
  'linear-gradient(135deg,#ffb832,#fff263)',
  'linear-gradient(135deg,#ff3f91,#fff263)',
];
if (grid) {
  for (let i = 1; i <= TOTAL_STICKERS; i++) {
    const id = String(i).padStart(2, '0');
    const card = document.createElement('div');
    card.className = 'sticker-card';
    card.style.setProperty('--bg-grad', gradients[i % gradients.length]);
    const rot = (Math.random() * 4 - 2).toFixed(2);
    card.style.transform = `rotate(${rot}deg)`;
    card.innerHTML = `<img src="assets/stickers/${id}.png" alt="Pibble #${id}" draggable="true" />`;
    grid.appendChild(card);
  }
}

// ---------- AUDIO ----------
const audio = document.getElementById('pibbleAudio');
const muteBtn = document.getElementById('muteBtn');
if (audio && muteBtn) {
  audio.volume = .5;
  audio.loop = true;
  muteBtn.classList.add('playing');
  muteBtn.textContent = 'Ⅱ';
  muteBtn.title = 'stop song';
  const updateBtn = () => {
    const p = !audio.paused;
    muteBtn.classList.toggle('playing', p);
    muteBtn.textContent = p ? 'Ⅱ' : '♪';
    muteBtn.title = p ? 'stop song' : 'play song';
  };
  audio.addEventListener('play', updateBtn);
  audio.addEventListener('pause', updateBtn);
  muteBtn.addEventListener('click', async () => {
    if (audio.paused) { try { await audio.play(); } catch {} }
    else { audio.pause(); }
  });
  const tryPlay = async () => { try { await audio.play(); } catch {} };
  tryPlay();
  const kick = () => { if (audio.paused) tryPlay(); };
  ['pointerdown','keydown','touchstart','scroll'].forEach(ev =>
    document.addEventListener(ev, kick, { once: true, passive: true })
  );
}

// =====================================================
//  OCEAN CANVAS — animated waves + cursor ripples
// =====================================================
(() => {
  const canvas = document.getElementById('ocean');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  function resize(){
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const ripples = [];
  let lastSpawn = 0;
  let mouseX = -200, mouseY = -200;

  function addRipple(x, y, force = 1){
    ripples.push({
      x, y,
      r: 6,
      maxR: 180 + Math.random() * 80,
      life: 1,
      force,
      hue: 180 + Math.random() * 30,
    });
    if (ripples.length > 30) ripples.shift();
  }

  // mouse move → ripples (throttled)
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    const now = performance.now();
    if (now - lastSpawn > 60) {
      addRipple(e.clientX, e.clientY, .8);
      lastSpawn = now;
    }
  }, { passive: true });

  // click → big splash
  window.addEventListener('pointerdown', (e) => {
    addRipple(e.clientX, e.clientY, 2.4);
    addRipple(e.clientX, e.clientY, 1.6);
  });

  // touch on mobile = device tilt fallback
  if (window.DeviceOrientationEvent && /Mobi|Android/i.test(navigator.userAgent)) {
    let tx = 0, ty = 0;
    window.addEventListener('deviceorientation', (e) => {
      const newX = (e.gamma || 0) * 8 + W/2;
      const newY = (e.beta || 0) * 4 + H/2;
      if (Math.abs(newX - tx) > 8 || Math.abs(newY - ty) > 8) {
        addRipple(newX, newY, .6);
        tx = newX; ty = newY;
      }
    }, { passive: true });
  }

  let t = 0;
  function frame(){
    t += .016;
    ctx.clearRect(0, 0, W, H);

    // animated wave bands (3 layers, different speeds)
    for (let layer = 0; layer < 3; layer++) {
      const phase = t * (.4 + layer * .3);
      const amp = 22 + layer * 14;
      const yBase = H * (.4 + layer * .15);
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W + 20; x += 16) {
        const y = yBase + Math.sin((x * .008) + phase) * amp + Math.sin((x * .024) + phase * 1.7) * (amp * .35);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, yBase - amp, 0, H);
      const alpha = .08 + layer * .04;
      grad.addColorStop(0, `rgba(255,255,255,${alpha + .04})`);
      grad.addColorStop(.5, `rgba(124,238,236,${alpha})`);
      grad.addColorStop(1, `rgba(7,95,189,${alpha * .6})`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // glints (caustic dots drifting upward)
    for (let i = 0; i < 22; i++) {
      const x = (i * 67 + t * 18) % W;
      const y = H - ((i * 53 + t * 30) % H);
      const a = .15 + Math.sin(t * 2 + i) * .1;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, a)})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + Math.sin(t + i) * .5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += 2.6 * rp.force;
      rp.life -= .012;
      if (rp.life <= 0 || rp.r >= rp.maxR) { ripples.splice(i, 1); continue; }
      const a = rp.life * .6 * rp.force;
      // outer ring
      ctx.strokeStyle = `rgba(220,250,255,${a * .9})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
      // inner softer ring
      ctx.strokeStyle = `rgba(124,236,255,${a * .5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r * .7, 0, Math.PI * 2);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// =====================================================
//  BUBBLE CURSOR TRAIL
// =====================================================
(() => {
  const canvas = document.getElementById('bubbles');
  if (!canvas) return;
  // skip on touch
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    canvas.style.display = 'none';
    return;
  }
  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  function resize(){
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const bubbles = [];
  let lastX = -1, lastY = -1, lastT = 0;
  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (lastX < 0 || now - lastT > 40) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const speed = Math.min(1, Math.hypot(dx, dy) / 50);
      const count = 1 + Math.floor(speed * 2);
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: e.clientX + (Math.random() - .5) * 12,
          y: e.clientY + (Math.random() - .5) * 12,
          vx: (Math.random() - .5) * .8,
          vy: -.4 - Math.random() * 1.2,
          r: 3 + Math.random() * 7,
          life: 1,
        });
      }
      if (bubbles.length > 80) bubbles.splice(0, bubbles.length - 80);
      lastX = e.clientX; lastY = e.clientY; lastT = now;
    }
  }, { passive: true });

  function frame(){
    ctx.clearRect(0, 0, W, H);
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx; b.y += b.vy; b.vy *= .985; b.life -= .008;
      if (b.life <= 0) { bubbles.splice(i, 1); continue; }
      const a = b.life * .85;
      // bubble outline
      ctx.strokeStyle = `rgba(220,250,255,${a})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
      // highlight dot
      ctx.fillStyle = `rgba(255,255,255,${a * .9})`;
      ctx.beginPath();
      ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .25, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

// =====================================================
//  PIBBLE PARALLAX FIELD — 25 pibbles scattered & drifting
// =====================================================
(() => {
  const field = document.getElementById('pibbleField');
  if (!field) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  // size field to match document height
  function sizeField(){
    field.style.height = document.documentElement.scrollHeight + 'px';
  }
  setTimeout(sizeField, 200);
  window.addEventListener('load', sizeField);
  window.addEventListener('resize', sizeField);

  const COUNT = 22;
  const pibbles = [];
  const used = new Set();
  for (let i = 0; i < COUNT; i++) {
    let stickerNum;
    do { stickerNum = 1 + Math.floor(Math.random() * 31); } while (used.has(stickerNum) && used.size < 31);
    used.add(stickerNum);
    const id = String(stickerNum).padStart(2, '0');

    const img = document.createElement('img');
    img.className = 'pibble-drift';
    img.src = `assets/stickers/${id}.png`;
    img.alt = '';
    const depth = .15 + Math.random() * .55; // 0.15-0.7
    const size = 70 + (1 - depth) * 110; // smaller = deeper
    const x = Math.random() * 95;
    const y = Math.random() * 100;
    const rot = (Math.random() - .5) * 30;
    const driftX = 18 + Math.random() * 22;
    const driftDur = 9 + Math.random() * 12;
    const driftDelay = -Math.random() * driftDur;
    img.style.cssText = `
      left:${x}vw; top:${y}%;
      width:${size}px;
      transform:translate(0,0) rotate(${rot}deg);
      opacity:${.45 + depth * .35};
      animation: pibbleDrift${i} ${driftDur}s ease-in-out infinite;
      animation-delay: ${driftDelay}s;
    `;
    img.dataset.depth = depth;
    img.dataset.baseRot = rot;
    img.dataset.driftX = driftX;
    field.appendChild(img);

    // create a unique keyframe so each pibble drifts differently
    const sign = Math.random() < .5 ? 1 : -1;
    const kf = `@keyframes pibbleDrift${i}{
      0%,100%{transform:translate(0,0) rotate(${rot}deg)}
      50%{transform:translate(${sign * driftX}px,-${10 + Math.random()*16}px) rotate(${rot + sign * 8}deg)}
    }`;
    const styleEl = document.createElement('style');
    styleEl.textContent = kf;
    document.head.appendChild(styleEl);

    pibbles.push({ el: img, depth });
  }

  // parallax on scroll
  let scrollY = window.scrollY;
  let ticking = false;
  function updateParallax(){
    pibbles.forEach(p => {
      const offset = scrollY * (1 - p.depth) * .25;
      p.el.style.marginTop = `-${offset}px`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
})();

})();
