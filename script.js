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

/* ─── THEME TOGGLE ──────────────────────────────────────────────────── */
const themeToggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Check local storage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  htmlEl.setAttribute('data-theme', 'light');
} else if (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches) {
  // Uncomment to auto-apply system light theme if no preference is saved
  // htmlEl.setAttribute('data-theme', 'light');
}

themeToggleBtn.addEventListener('click', () => {
  if (htmlEl.getAttribute('data-theme') === 'light') {
    htmlEl.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    htmlEl.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
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
  card.addEventListener('click', function (e) {
    // Only trigger flip on touch devices via explicit click
    if (window.matchMedia('(hover: none)').matches) {
      flipped = !flipped;
      this.querySelector('.project-card-inner').style.transform = flipped ? 'rotateY(180deg)' : '';
    }
  });
});


/* ─── SMOOTH SCROLL FOR ALL INTERNAL LINKS ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
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


/* ─── CERT MODAL ────────────────────────────────────────────────────── */
const certData = [
  {
    id: 1, badge: '🏆',
    title: 'Databricks Certified Data Engineer Associate',
    org: 'Databricks', orgLogo: '⚡',
    type: 'Professional Certification',
    year: '2026 · Active',
    color: '#6c63ff',
    // ▼ Add your image filename in: certs/databricks_de.png  (leave '' if none)
    img: 'certs/De_associate.pdf',
    // ▼ Paste your Credly / credential verification URL below
    link: 'https://credentials.databricks.com/e6c7bc92-a6d1-419e-836c-395c4385b11b#acc.45qP9ZtE',
    desc: 'Validates expertise in building production-grade data pipelines on the Databricks Lakehouse Platform using Apache Spark, Delta Lake, and PySpark.',
    tags: ['Apache Spark', 'Delta Lake', 'PySpark', 'Databricks', 'ETL'],
  },
  {
    id: 2, badge: '☕',
    title: 'Oracle Associate SE 8',
    org: 'Oracle Corporation', orgLogo: '🔴',
    type: 'Professional Certification · 1Z0-808',
    year: '2023 · Active',
    color: '#f97316',
    img: 'certs/Oracle_certificate.pdf',
    link: '',
    desc: 'Certifies foundational Java SE 8 programming skills including OOP principles, exception handling, data structures, and the Collections Framework.',
    tags: ['Java SE 8', 'OOP', 'Collections', 'Lambda', 'Generics'],
  },
  {
    id: 3, badge: '📊',
    title: 'Databricks Fundamentals',
    org: 'Databricks Academy', orgLogo: '🎓',
    type: 'Academy Accreditation',
    year: '2025 · Active',
    color: '#ef4444',
    img: 'certs/databricks_fundamentals.pdf',
    link: 'https://credentials.databricks.com/6b76c739-a2bd-46bf-8872-0ad4f0f65de2#acc.pBTmfdiv',
    desc: 'Covers foundations of the Databricks platform including cluster management, notebooks, jobs, workflows, and the core Data Intelligence Platform concepts.',
    tags: ['Databricks', 'Clusters', 'Notebooks', 'Workflows'],
  },
  // {
  //   id: 4, badge: '🏗️',
  //   title: 'Lakehouse Fundamentals',
  //   org: 'Databricks Academy', orgLogo: '🎓',
  //   type: 'Academy Accreditation',
  //   year: '2024 · Active',
  //   color: '#22c55e',
  //   img: 'certs/lakehouse_fundamentals.png',
  //   link: '',
  //   desc: 'Validates understanding of Lakehouse architecture, Delta Lake, Unity Catalog, and how Databricks unifies data warehousing and data engineering.',
  //   tags: ['Lakehouse', 'Delta Lake', 'Unity Catalog', 'Architecture'],
  // },
  {
    id: 5, badge: '🤖',
    title: 'AI Agent Fundamentals',
    org: 'Databricks Academy', orgLogo: '🎓',
    type: 'Academy Accreditation',
    year: '2025 · Active',
    color: '#06b6d4',
    img: 'certs/ai_agent_fundamentals.pdf',
    link: 'https://credentials.databricks.com/363b871a-52e5-4cb8-9949-6062e2a80610',
    desc: 'Covers building AI agents and compound AI systems using MLflow, LangChain, and the Databricks AI platform for intelligent automation.',
    tags: ['AI Agents', 'MLflow', 'LLMs', 'LangChain', 'Databricks'],
  },
  {
    id: 6, badge: '🔄',
    title: 'Build Data Pipelines with Lakeflow',
    org: 'Databricks', orgLogo: '⚡',
    type: 'Knowledge Badge',
    year: '2025 · Active',
    color: '#a855f7',
    img: '',
    link: 'https://credentials.databricks.com/693838c9-c302-414d-90af-05346011fd17#acc.hzYjktOS',
    desc: 'Demonstrates hands-on proficiency in building scalable, declarative data pipelines using Databricks Lakeflow Spark Declarative Pipelines.',
    tags: ['Lakeflow', 'DLT', 'Declarative Pipelines', 'Spark'],
  },
  {
    id: 7, badge: '📥',
    title: 'Data Ingestion with Lakeflow Connect',
    org: 'Databricks', orgLogo: '⚡',
    type: 'Knowledge Badge',
    year: '2025 · Active',
    color: '#f59e0b',
    img: '',
    link: 'https://credentials.databricks.com/d0efa461-e390-4700-be89-b1a432a316ab#acc.gjeCPTzi',
    desc: 'Covers end-to-end data ingestion using Lakeflow Connect, including Auto Loader, structured streaming, and connector-based ingestion patterns.',
    tags: ['Lakeflow Connect', 'Auto Loader', 'Streaming', 'Ingestion'],
  },
];

const overlay = document.getElementById('certModalOverlay');
const modal = document.getElementById('certModal');
const closeBtn = document.getElementById('certModalClose');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function openCertModal(id) {
  const d = certData.find(c => c.id === id);
  if (!d) return;
  const rgb = hexToRgb(d.color);

  // --- Text content ---
  document.getElementById('certModalIcon').textContent = d.badge;
  document.getElementById('certModalTitle').textContent = d.title;
  document.getElementById('certModalType').textContent = d.type;
  document.getElementById('certModalOrgLogo').textContent = d.orgLogo;
  document.getElementById('certModalOrgName').textContent = d.org;
  document.getElementById('certModalDesc').textContent = d.desc;
  document.getElementById('certModalYear').textContent = d.year;
  document.getElementById('certModalTags').innerHTML = d.tags.map(t => `<span>${t}</span>`).join('');

  // --- Cert image/pdf + fallback ---
  const imgEl = document.getElementById('certModalImg');
  const pdfEl = document.getElementById('certModalPdf');
  const fallbackEl = document.getElementById('certModalFallback');

  imgEl.classList.remove('loaded');
  pdfEl.classList.remove('loaded');
  imgEl.style.display = '';
  pdfEl.style.display = '';
  imgEl.src = '';
  pdfEl.src = '';

  if (d.img) {
    if (d.img.toLowerCase().endsWith('.pdf')) {
      // It's a PDF
      imgEl.style.display = 'none';
      fallbackEl.style.display = 'none';
      pdfEl.src = d.img;
      pdfEl.onload = () => { pdfEl.classList.add('loaded'); };
      // Fallback if onload doesn't fire immediately for iframe
      setTimeout(() => pdfEl.classList.add('loaded'), 300);
    } else {
      // It's an image
      pdfEl.style.display = 'none';
      imgEl.onload = () => { imgEl.classList.add('loaded'); fallbackEl.style.display = 'none'; };
      imgEl.onerror = () => { imgEl.classList.remove('loaded'); fallbackEl.style.display = 'flex'; };
      imgEl.src = d.img;
      if (imgEl.complete && imgEl.naturalWidth > 0) {
        imgEl.classList.add('loaded'); fallbackEl.style.display = 'none';
      }
    }
  } else {
    // No media provided
    imgEl.style.display = 'none';
    pdfEl.style.display = 'none';
    fallbackEl.style.display = 'flex';
  }

  // --- Verify link ---
  const verifyBtn = document.getElementById('certModalVerifyBtn');
  if (d.link) {
    verifyBtn.href = d.link;
    verifyBtn.removeAttribute('style');
  } else {
    verifyBtn.href = '#';
  }

  // --- Colour theming ---
  modal.style.setProperty('--modal-color', d.color);
  modal.style.setProperty('--modal-accent', d.color);
  modal.style.setProperty('--modal-glow', `rgba(${rgb},0.3)`);
  modal.style.setProperty('--modal-outer', `rgba(${rgb},0.08)`);
  modal.style.setProperty('--modal-border', `rgba(${rgb},0.5)`);
  modal.style.setProperty('--modal-bg', `radial-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(${rgb},0.04) 100%)`);
  modal.style.setProperty('--modal-tag-bg', `rgba(${rgb},0.1)`);
  modal.style.setProperty('--modal-tag-border', `rgba(${rgb},0.3)`);
  modal.style.setProperty('--modal-star', d.color);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.cert-item[data-cert-id]').forEach(item => {
  item.addEventListener('click', () => openCertModal(Number(item.dataset.certId)));
});

closeBtn.addEventListener('click', closeCertModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeCertModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

console.log('%c🚀 Bharath Kumar M — Portfolio', 'color:#6c63ff;font-size:18px;font-weight:bold;');
console.log('%cData Engineer | AWS | Azure Databricks | PySpark', 'color:#00d4ff;font-size:12px;');
