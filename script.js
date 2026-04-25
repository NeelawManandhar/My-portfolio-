/* ========================
   Portfolio JS — Neelaw Manandhar
======================== */

const isMobile = () => window.innerWidth <= 768;
const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

/* ---- Navbar scroll effect ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Mobile menu toggle ---- */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function closeMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

navToggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const spans = navToggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    closeMenu();
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('touchstart', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
}, { passive: true });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

/* ---- Reveal on scroll ---- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = isMobile() ? 0 : (entry.target.getAttribute('data-delay') || 0);
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Animated counters ---- */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = (target / duration) * 16;
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.getAttribute('data-target')));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ---- Active nav link highlighting ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = origHTML;
    btn.disabled = false;
    contactForm.reset();
    formSuccess.classList.add('show');
    if (isMobile()) formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1800);
});

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ---- Parallax hero bg text (desktop only) ---- */
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText && !isTouchDevice()) {
  window.addEventListener('scroll', () => {
    heroBgText.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.25}px))`;
  }, { passive: true });
}

/* ---- Skill tag touch + hover ---- */
document.querySelectorAll('.skill-tags span').forEach(tag => {
  const on = () => { tag.style.background = 'rgba(61,255,160,0.1)'; tag.style.color = 'var(--accent)'; };
  const off = () => { tag.style.background = ''; tag.style.color = ''; };
  tag.addEventListener('mouseenter', on);
  tag.addEventListener('mouseleave', off);
  tag.addEventListener('touchstart', on, { passive: true });
  tag.addEventListener('touchend', () => setTimeout(off, 400), { passive: true });
});

/* ---- Touch ripple on cards ---- */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.project-card, .skill-card, .edu-card, .contact-item').forEach(card => {
  card.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none; z-index:0;
      width:${size}px; height:${size}px;
      left:${touch.clientX - rect.left - size/2}px;
      top:${touch.clientY - rect.top - size/2}px;
      background:rgba(61,255,160,0.07);
      transform:scale(0); animation:rippleAnim 0.55s ease-out forwards;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, { passive: true });
});

/* ---- Resize handler ---- */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.body.style.overflow = '';
    if (menuOpen) closeMenu();
  }
});
