/* =====================================================
   $PIBBLE — interactivity
   ===================================================== */

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
const map = {sx:'x', stt:'tt', stg:'tg', sdex:'dex', uniswapBig:'uni'};
Object.entries(map).forEach(([id,key]) => { const el = document.getElementById(id); if (el) el.href = CONFIG.links[key] || '#'; });

// CA values
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

// ---------- STICKER GRID ----------
const STICKERS = [
  { file: '01.png', name: 'cheer' },
  { file: '02.png', name: 'surf' },
  { file: '03.png', name: 'wave' },
  { file: '04.png', name: 'flag' },
  { file: '05.png', name: 'heart' },
  { file: '06.png', name: 'float' },
  { file: '07.png', name: 'sleep' },
  { file: '08.png', name: 'lick' },
  { file: '09.png', name: 'skate' },
  { file: '10.png', name: 'party' },
];
const grid = document.getElementById('stickerGrid');
if (grid) {
  STICKERS.forEach(s => {
    const card = document.createElement('div');
    card.className = 'sticker-card';
    card.innerHTML = `
      <img src="assets/stickers/${s.file}" alt="Pibble — ${s.name}" draggable="true" />
      <span class="sticker-name">${s.name}</span>
    `;
    grid.appendChild(card);
  });
}

// ---------- AUDIO ----------
const audio = document.getElementById('pibbleAudio');
const muteBtn = document.getElementById('muteBtn');
if (audio && muteBtn) {
  audio.volume = .55;
  const SONG_START = 40;
  let started = false;
  const setStart = () => {
    if (Number.isFinite(audio.duration) && audio.duration > SONG_START) audio.currentTime = SONG_START;
  };
  audio.addEventListener('loadedmetadata', setStart);
  audio.addEventListener('ended', () => { setStart(); audio.play().catch(()=>{}); });
  const updateBtn = () => {
    const p = !audio.paused;
    muteBtn.classList.toggle('playing', p);
    muteBtn.textContent = p ? 'Ⅱ' : '♪';
  };
  audio.addEventListener('play', updateBtn);
  audio.addEventListener('pause', updateBtn);
  muteBtn.addEventListener('click', async () => {
    if (audio.paused) {
      if (!started) { setStart(); started = true; }
      try { await audio.play(); } catch {}
    } else {
      audio.pause();
    }
  });
  // first interaction → play
  document.addEventListener('pointerdown', async () => {
    if (audio.paused && !started) {
      setStart(); started = true;
      try { await audio.play(); } catch {}
    }
  }, { once: true });
}

// ---------- HERO PARALLAX (subtle, desktop only) ----------
if (window.matchMedia && !window.matchMedia('(pointer: coarse)').matches) {
  const heroArt = document.querySelector('.hero-art');
  if (heroArt) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - .5) * 12;
      const y = (e.clientY / window.innerHeight - .5) * 8;
      heroArt.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}

})();
