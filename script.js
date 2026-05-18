/* HAMBURGER */
const hamburger = document.getElementById('hamburger');
const navRight = document.getElementById('navRight');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navRight.classList.toggle('open');
});
function closeNav() {
  hamburger.classList.remove('open');
  navRight.classList.remove('open');
}

/* LOADER */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 1100);
});

/* CURSOR */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.proj-card,.trait,.cinfo,.photo-wrap').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* FLASHLIGHT EFFECT */
const wrap = document.getElementById('photoWrap');
const canvas = document.getElementById('flashCanvas');
const ctx = canvas.getContext('2d');
let isHovering = false;
let flashX = 0, flashY = 0, targetX = 0, targetY = 0;

function resizeCanvas() {
  canvas.width = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

wrap.addEventListener('mouseenter', () => { isHovering = true; });
wrap.addEventListener('mouseleave', () => { isHovering = false; ctx.clearRect(0, 0, canvas.width, canvas.height); });
wrap.addEventListener('mousemove', e => {
  const r = wrap.getBoundingClientRect();
  targetX = e.clientX - r.left;
  targetY = e.clientY - r.top;
});

function drawFlashlight() {
  flashX += (targetX - flashX) * .12;
  flashY += (targetY - flashY) * .12;

  if (isHovering) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cut out flashlight cone
    const radius = 220;
    const gradient = ctx.createRadialGradient(flashX, flashY, 0, flashX, flashY, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.35, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.65, 'rgba(0,0,0,0.35)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(flashX, flashY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Warm tint glow on the revealed area
    ctx.globalCompositeOperation = 'source-over';
    const warmGlow = ctx.createRadialGradient(flashX, flashY, 0, flashX, flashY, radius * 0.55);
    warmGlow.addColorStop(0, 'rgba(255,200,80,0.10)');
    warmGlow.addColorStop(1, 'rgba(255,200,80,0)');
    ctx.fillStyle = warmGlow;
    ctx.beginPath();
    ctx.arc(flashX, flashY, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawFlashlight);
}
drawFlashlight();

/* MOBILE TAP TO REVEAL PROJECT CARDS */
if ('ontouchstart' in window) {
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', e => {
      const isAlreadyTapped = card.classList.contains('tapped');
      // Close all others first
      document.querySelectorAll('.proj-card.tapped').forEach(c => c.classList.remove('tapped'));
      // Toggle current
      if (!isAlreadyTapped) card.classList.add('tapped');
    });
  });
}

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      e.target.querySelectorAll('.skill-bar-inner').forEach(b => b.style.width = b.dataset.w + '%');
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.skill-bar-inner').forEach(b => b.style.width = b.dataset.w + '%');
  });
}, { threshold: .1 });
document.querySelectorAll('#skills').forEach(el => skillObs.observe(el));