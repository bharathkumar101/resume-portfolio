/* ═══════════════════════════════════════════════════════════════════════
   BHARATH KUMAR M — PORTFOLIO JAVASCRIPT
═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CURSOR GLOW ───────────────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ─── PARTICLE CANVAS ───────────────────────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    const palette = ['108,99,255', '0,212,255', '255,101,132', '168,85,247'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.02;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Draw connections between nearby particles
function drawConnections() {
  const MAX_DIST = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── NAVBAR SCROLL ─────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ─── HAMBURGER MENU ────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('active');
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ─── TYPING ANIMATION ──────────────────────────────────────────────── */
const phrases = [
  'Data Pipelines',
  'ETL Workflows',
  'Medallion Architectures',
  'Scalable Infrastructure',
  'Cloud-Native Solutions',
];

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 450);
      return;
    }
    setTimeout(type, 75);
  } else {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 95);
  }
}
setTimeout(type, 1000);

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ─── COUNTER ANIMATION ─────────────────────────────────────────────── */
const counterEls = document.querySelectorAll('.stat-num[data-target]');

function animateCounters() {
  counterEls.forEach(el => {
    const target = parseInt(el.dataset.target);
    const start = performance.now();
    const dur = 1800;

    function step(now) {
      const progress = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─── SKILL TAG TOOLTIP ─────────────────────────────────────────────── */
document.querySelectorAll('.skill-tag[data-level]').forEach(tag => {
  tag.setAttribute('title', `Proficiency: ${tag.dataset.level}%`);
});

/* ─── PROJECT CARD TOUCH SUPPORT ────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  let flipped = false;
  card.addEventListener('click', function(e) {
    // Only trigger flip on touch devices via explicit click
    if (window.matchMedia('(hover: none)').matches) {
      flipped = !flipped;
      this.querySelector('.project-card-inner').style.transform = flipped ? 'rotateY(180deg)' : '';
    }
  });
});

/* ─── CONTACT FORM ──────────────────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const msg = document.getElementById('formMsg').value.trim();
  const btn = document.getElementById('submitBtn');

  // Animate button
  btn.innerHTML = '<span>Sending...</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    // Compose mailto
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Hi Bharath,\n\n${msg}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:Bk10njr@gmail.com?subject=${subject}&body=${body}`;

    // Show success
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }, 800);
}

/* ─── SMOOTH SCROLL FOR ALL INTERNAL LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});

/* ─── PARALLAX HERO BG ──────────────────────────────────────────────── */
const heroSection = document.getElementById('home');
window.addEventListener('scroll', () => {
  if (!heroSection) return;
  const speed = window.scrollY * 0.3;
  heroSection.style.backgroundPositionY = `-${speed}px`;
}, { passive: true });

/* ─── SKILL TAG ENTER ANIMATION ─────────────────────────────────────── */
const skillCatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(12px)';
        setTimeout(() => {
          tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, i * 60);
      });
      skillCatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillCatObserver.observe(cat));

/* ─── EDUCATION BAR ANIMATION ───────────────────────────────────────── */
const eduObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.score-bar').forEach(bar => {
        bar.style.animationPlayState = 'running';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.edu-card').forEach(card => eduObserver.observe(card));

/* ─── TILT EFFECT ON PROJECT CARDS (desktop only) ───────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 4;
      const rotateY = -((x - centerX) / centerX) * 4;
      card.querySelector('.project-card-inner').style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.querySelector('.project-card-inner').style.transform = '';
    });
  });
}

/* ─── CERT HOVER GLOW ───────────────────────────────────────────────── */
document.querySelectorAll('.cert-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--mouse-x', `${x}%`);
    item.style.setProperty('--mouse-y', `${y}%`);
  });
});

console.log('%c🚀 Bharath Kumar M — Portfolio', 'color:#6c63ff;font-size:18px;font-weight:bold;');
console.log('%cData Engineer | AWS | Azure Databricks | PySpark', 'color:#00d4ff;font-size:12px;');
