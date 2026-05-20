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
    const radius = 370;
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
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.proj-card.tapped').forEach(c => c.classList.remove('tapped'));
});

document.querySelectorAll('.proj-card').forEach(card => {
  const hasLink = card.tagName === 'A' && card.getAttribute('href');

  if (hasLink) {
    // Intercept touchstart to block the default tap-to-navigate
    card.addEventListener('touchstart', e => {
      if (!card.classList.contains('tapped')) {
        e.preventDefault();
        document.querySelectorAll('.proj-card.tapped').forEach(c => c.classList.remove('tapped'));
        card.classList.add('tapped');
      }
      // If already tapped, do nothing — let the default click/navigate happen
    }, { passive: false });
  } else {
    card.addEventListener('click', e => {
      const isAlreadyTapped = card.classList.contains('tapped');
      document.querySelectorAll('.proj-card.tapped').forEach(c => c.classList.remove('tapped'));
      if (!isAlreadyTapped) card.classList.add('tapped');
    });
  }
});

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
/* SCROLLSPY — active nav highlight */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('nav-active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

/* ABOUT PHOTO FLASHLIGHT */
const aboutWrap = document.getElementById('aboutPhotoWrap');
const aboutCanvas = document.getElementById('aboutFlashCanvas');
const aboutCtx = aboutCanvas.getContext('2d');
let aboutHovering = false;
let aFlashX = 0, aFlashY = 0, aTargetX = 0, aTargetY = 0;

function resizeAboutCanvas() {
  aboutCanvas.width = aboutWrap.offsetWidth;
  aboutCanvas.height = aboutWrap.offsetHeight;
}
resizeAboutCanvas();
window.addEventListener('resize', resizeAboutCanvas);

aboutWrap.addEventListener('mouseenter', () => { aboutHovering = true; });
aboutWrap.addEventListener('mouseleave', () => {
  aboutHovering = false;
  aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
});
aboutWrap.addEventListener('mousemove', e => {
  const r = aboutWrap.getBoundingClientRect();
  aTargetX = e.clientX - r.left;
  aTargetY = e.clientY - r.top;
});

function drawAboutFlashlight() {
  aFlashX += (aTargetX - aFlashX) * .12;
  aFlashY += (aTargetY - aFlashY) * .12;

  if (aboutHovering) {
    aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);

    aboutCtx.fillStyle = 'rgba(0,0,0,0.88)';
    aboutCtx.fillRect(0, 0, aboutCanvas.width, aboutCanvas.height);

    const radius = 370;
    const gradient = aboutCtx.createRadialGradient(aFlashX, aFlashY, 0, aFlashX, aFlashY, radius);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.35, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.65, 'rgba(0,0,0,0.35)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    aboutCtx.globalCompositeOperation = 'destination-out';
    aboutCtx.fillStyle = gradient;
    aboutCtx.beginPath();
    aboutCtx.arc(aFlashX, aFlashY, radius, 0, Math.PI * 2);
    aboutCtx.fill();

    aboutCtx.globalCompositeOperation = 'source-over';
    const warmGlow = aboutCtx.createRadialGradient(aFlashX, aFlashY, 0, aFlashX, aFlashY, radius * 0.55);
    warmGlow.addColorStop(0, 'rgba(255,200,80,0.10)');
    warmGlow.addColorStop(1, 'rgba(255,200,80,0)');
    aboutCtx.fillStyle = warmGlow;
    aboutCtx.beginPath();
    aboutCtx.arc(aFlashX, aFlashY, radius * 0.6, 0, Math.PI * 2);
    aboutCtx.fill();
  }
  requestAnimationFrame(drawAboutFlashlight);
}
drawAboutFlashlight();

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docHeight * 100) + '%';
});

/* ── PARTICLE BACKGROUND ── */
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticle() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticle();
window.addEventListener('resize', () => { resizeParticle(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor((pCanvas.width * pCanvas.height) / 15000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
}
initParticles();

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach(p => {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(212,168,67,${p.opacity})`;
    pCtx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > pCanvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > pCanvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── TYPING EFFECT ── */
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const originalText = eyebrow.textContent;
  eyebrow.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  eyebrow.appendChild(cursor);
  let i = 0;
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      eyebrow.insertBefore(document.createTextNode(originalText[i]), cursor);
      i++;
      if (i >= originalText.length) clearInterval(typeInterval);
    }, 60);
  }, 1200);
}

/* ── COUNT UP ANIMATION ── */
function countUp(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); return; }
    el.textContent = Math.floor(start) + '+';
  }, 16);
}

const bnums = document.querySelectorAll('.badge .bnum');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const txt = e.target.textContent;
      const num = parseInt(txt);
      if (!isNaN(num)) countUp(e.target, num);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
bnums.forEach(el => countObs.observe(el));

/* ── TILT EFFECT ON PROJECT CARDS ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    const tiltX = -(y / r.height) * 12;
    const tiltY = (x / r.width) * 12;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
});

/* ── PARALLAX HERO ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  if (heroLeft) heroLeft.style.transform = `translateY(${scrollY * 0.12}px)`;
  if (heroRight) heroRight.style.transform = `translateY(${scrollY * 0.07}px)`;
});
