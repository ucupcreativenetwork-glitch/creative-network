document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const contactForm = document.getElementById('contact-form');
  const siteConfig = window.SITE_CONFIG || {};
  const formConfig = window.FORM_CONFIG || {};

  // Initialize Tech Explorer early and safely (for layanan pages).
  // This ensures the full desktop-like 2-column interactive (cards + detail panel with all keterangan)
  // appears on mobile/Android/iPhone mode exactly like on PC, without being affected by other inits failing.
  try {
    if (typeof initTechExplorer === 'function') {
      initTechExplorer();
    }
  } catch (e) {
    console.warn('Tech Explorer init skipped or failed (safe for non-layanan pages):', e);
  }

  initWhatsAppFloat(siteConfig, formConfig);
  initStickyCta();
  initCookieBanner();
  initAnalytics(siteConfig);
  initScrollUX();
  initEnhancedMobileNav(navToggle, navMenu);
  initSmoothScroll();
  initFormFocusStates();
  initPortfolioTouch();
  initAnimatedBackground();
  initParallax();
  initCardTilt();
  initCounters();

  if (header) {
    // Scroll listener - keep passive for performance
  window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

  // On mobile, disable the scroll progress bar (saves some paint work during scroll)
  if (window.innerWidth < 768) {
    const progress = document.getElementById('scroll-progress');
    if (progress) progress.style.display = 'none';
  }

  // Extra: on mobile, make sure no smooth scroll behavior fights with native scrolling
  if (window.innerWidth < 768) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
  }

  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);

      if (link && scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  initScrollAnimations();

  initTestimonialSlider();

  // Testimonials modal (Lihat semua)
  const moreBtn = document.querySelector('.testimonials-more-btn');
  const modal = document.getElementById('testimonials-modal');
  const modalGrid = modal ? modal.querySelector('.testimonials-modal__grid') : null;
  const modalClose = modal ? modal.querySelector('.testimonials-modal__close') : null;
  const modalBackdrop = modal ? modal.querySelector('.testimonials-modal__backdrop') : null;

  if (moreBtn && modal && modalGrid) {
    const originalTrack = document.getElementById('testimonials-track');

    const openModal = () => {
      if (!modalGrid.dataset.populated && originalTrack) {
        modalGrid.innerHTML = '';
        const cards = originalTrack.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          // Clean slider-specific classes for modal
          clone.classList.remove('testimonials-slider__slide', 'is-active');
          modalGrid.appendChild(clone);
        });
        modalGrid.dataset.populated = 'true';
      }
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    moreBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });
  }

  // Contact form
  if (!contactForm) return;

  const formNotice = document.getElementById('form-notice');
  const config = window.FORM_CONFIG || {};
  const FORM_EMAIL = config.FORM_EMAIL || 'ptcreativenetwork@gmail.com';
  const WEB3FORMS_KEY = config.WEB3FORMS_ACCESS_KEY || '';
  const isLocalFile = window.location.protocol === 'file:';
  const FORM_LIMITS = { name: 100, email: 254, subject: 150, message: 2000 };
  const FORM_RATE_MS = 60000;
  const FORM_RATE_KEY = 'cn_form_last_submit';

  function sanitizeField(value) {
    return String(value).replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
  }

  function getFormValues() {
    return {
      name: sanitizeField(contactForm.name.value).slice(0, FORM_LIMITS.name),
      email: sanitizeField(contactForm.email.value).slice(0, FORM_LIMITS.email),
      subject: sanitizeField(contactForm.subject.value).slice(0, FORM_LIMITS.subject),
      message: sanitizeField(contactForm.message.value).slice(0, FORM_LIMITS.message)
    };
  }

  function validateFormData(data) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!data.name || data.name.length < 2) return 'Nama minimal 2 karakter.';
    if (!emailRe.test(data.email)) return 'Format email tidak valid.';
    if (!data.subject || data.subject.length < 3) return 'Subjek minimal 3 karakter.';
    if (!data.message || data.message.length < 10) return 'Kebutuhan minimal 10 karakter.';
    return '';
  }

  function isRateLimited() {
    const last = Number(sessionStorage.getItem(FORM_RATE_KEY) || 0);
    return Date.now() - last < FORM_RATE_MS;
  }

  function markFormSubmitted() {
    sessionStorage.setItem(FORM_RATE_KEY, String(Date.now()));
  }

  function showNotice(text, type) {
    formNotice.textContent = text;
    formNotice.className = `form-notice form-notice--${type}`;
  }

  function openWhatsAppFallback(data) {
    const text = encodeURIComponent(
      `Halo Creative Network,\n\nNama: ${data.name}\nEmail: ${data.email}\nSubjek: ${data.subject}\n\nPesan:\n${data.message}`
    );
    window.open(`https://wa.me/${config.WHATSAPP || '6287882521602'}?text=${text}`, '_blank');
  }

  async function sendViaWeb3Forms(data) {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name: data.name,
        email: data.email,
        subject: `[Website] ${data.subject} — Creative Network`,
        message: data.message,
        from_name: 'Creative Network Website',
        replyto: data.email
      })
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Web3Forms gagal');
    }
    return true;
  }

  async function sendViaFormSubmitAjax(data) {
    const body = new FormData();
    body.append('name', data.name);
    body.append('email', data.email);
    body.append('subject', data.subject);
    body.append('message', data.message);
    body.append('_subject', `[Website] ${data.subject} — Creative Network`);
    body.append('_template', 'table');
    body.append('_captcha', 'false');

    const response = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' }
    });

    const result = await response.json();

    if (result.success === 'true' || result.success === true) {
      return true;
    }

    if (result.message && result.message.includes('Activation')) {
      throw new Error('ACTIVATION');
    }

    if (result.message && result.message.includes('web server')) {
      throw new Error('WEBSERVER');
    }

    throw new Error(result.message || 'FormSubmit gagal');
  }

  function sendViaFormSubmitIframe(data) {
    return new Promise(resolve => {
      const iframe = document.getElementById('formsubmit-iframe');
      const hiddenSubject = document.getElementById('formsubmit-subject');
      if (hiddenSubject) {
        hiddenSubject.value = `[Website] ${data.subject} — Creative Network`;
      }

      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      };

      iframe.onload = done;
      contactForm.target = 'formsubmit-iframe';
      contactForm.submit();
      contactForm.removeAttribute('target');
      setTimeout(done, 2500);
    });
  }

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = document.getElementById('form-submit-btn');
    const originalText = btn.textContent;
    const data = getFormValues();

    if ((contactForm._honey && contactForm._honey.value) || (contactForm.website && contactForm.website.value)) {
      return;
    }

    const validationError = validateFormData(data);
    if (validationError) {
      showNotice(validationError, 'error');
      return;
    }

    if (isRateLimited()) {
      showNotice('Terlalu cepat. Tunggu sekitar 1 menit sebelum kirim lagi.', 'error');
      return;
    }

    btn.textContent = 'Mengirim...';
    btn.disabled = true;
    btn.classList.add('btn--loading');
    formNotice.textContent = '';
    formNotice.className = 'form-notice';

    try {
      if (WEB3FORMS_KEY) {
        await sendViaWeb3Forms(data);
        markFormSubmitted();
      } else if (!isLocalFile) {
        await sendViaFormSubmitAjax(data);
        markFormSubmitted();
      } else {
        await sendViaFormSubmitIframe(data);
        markFormSubmitted();
        showNotice(
          'Pesan sedang dikirim. Jika ini pertama kali, cek email ptcreativenetwork@gmail.com dan klik link aktivasi dari FormSubmit.',
          'info'
        );
        contactForm.reset();
        btn.classList.remove('btn--loading');
        btn.textContent = 'Pesan Terkirim!';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 3000);
        return;
      }

      showNotice('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
      contactForm.reset();
      btn.classList.remove('btn--loading');
      btn.textContent = 'Pesan Terkirim!';
    } catch (err) {
      if (err.message === 'ACTIVATION') {
        showNotice(
          'Form perlu diaktifkan sekali. Cek inbox ptcreativenetwork@gmail.com, klik link "Activate Form" dari FormSubmit, lalu coba kirim lagi.',
          'info'
        );
      } else if (err.message === 'WEBSERVER' || isLocalFile) {
        try {
          await sendViaFormSubmitIframe(data);
          markFormSubmitted();
          showNotice(
            'Pesan sedang dikirim. Untuk hasil terbaik, jalankan website via jalankan-website.bat (bukan double-click file HTML).',
            'info'
          );
          contactForm.reset();
          btn.classList.remove('btn--loading');
          btn.textContent = 'Pesan Terkirim!';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 3000);
          return;
        } catch {
          showNotice('Gagal mengirim via email. Mengalihkan ke WhatsApp...', 'error');
          openWhatsAppFallback(data);
        }
      } else {
        try {
          await sendViaFormSubmitIframe(data);
          markFormSubmitted();
          showNotice('Pesan sedang dikirim ke email kami.', 'info');
          contactForm.reset();
          btn.classList.remove('btn--loading');
          btn.textContent = 'Pesan Terkirim!';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 3000);
          return;
        } catch {
          showNotice('Gagal mengirim pesan. Mengalihkan ke WhatsApp sebagai alternatif.', 'error');
          openWhatsAppFallback(data);
        }
      }
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('btn--loading');
      return;
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('btn--loading');
    }, 3000);
  });
});

function initScrollUX() {
  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.id = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);
  }

  let backToTop = document.getElementById('back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.id = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Kembali ke atas');
    backToTop.hidden = true;
    backToTop.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(backToTop);
  }

  const heroScroll = document.querySelector('.hero__scroll');
  let ticking = false;

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;

    const showTop = scrollTop > 400;
    backToTop.classList.toggle('is-visible', showTop);
    backToTop.hidden = !showTop;

    if (heroScroll) {
      heroScroll.style.opacity = scrollTop > 80 ? '0' : '';
      heroScroll.style.pointerEvents = scrollTop > 80 ? 'none' : '';
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollUI);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initEnhancedMobileNav(navToggle, navMenu) {
  if (!navToggle || !navMenu) return;

  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.prepend(overlay);
  }

  const navLinks = navMenu.querySelectorAll('.nav__link');

  function setOpen(open) {
    navToggle.classList.toggle('active', open);
    navMenu.classList.toggle('open', open);
    overlay.classList.toggle('is-visible', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }

  function closeMenu() {
    setOpen(false);
  }

  navToggle.addEventListener('click', () => {
    setOpen(!navMenu.classList.contains('open'));
  });

  overlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

function initSmoothScroll() {
  const header = document.getElementById('header');
  const offset = (header?.offsetHeight || 72) + 8;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const id = href.slice(1);

      if (!id) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initFormFocusStates() {
  document.querySelectorAll('.form-group').forEach(group => {
    const fields = group.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.addEventListener('focus', () => group.classList.add('is-focused'));
      field.addEventListener('blur', () => {
        setTimeout(() => {
          if (!group.contains(document.activeElement)) {
            group.classList.remove('is-focused');
          }
        }, 0);
      });
    });
  });
}

function initPortfolioTouch() {
  const cards = document.querySelectorAll('.portfolio-card');
  if (!cards.length) return;

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (!isTouch) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const active = card.classList.contains('is-touched');
      cards.forEach(c => c.classList.remove('is-touched'));
      if (!active) card.classList.add('is-touched');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.portfolio-card')) {
      cards.forEach(c => c.classList.remove('is-touched'));
    }
  });
}

const IT_NETWORK_SVG = `
  <defs>
    <linearGradient id="packet-glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C4B5FD" stop-opacity="0"/>
      <stop offset="50%" stop-color="#A78BFA" stop-opacity="1"/>
      <stop offset="100%" stop-color="#C4B5FD" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path id="it-path-1" d="M600,400 L340,280" fill="none"/>
  <path id="it-path-2" d="M600,400 L820,320" fill="none"/>
  <path id="it-path-3" d="M600,400 L420,440" fill="none"/>
  <path id="it-path-4" d="M600,400 L640,560" fill="none"/>
  <path id="it-path-5" d="M340,280 L120,180" fill="none"/>
  <path id="it-path-6" d="M820,320 L1050,240" fill="none"/>
  <line x1="600" y1="400" x2="340" y2="280"/>
  <line x1="600" y1="400" x2="820" y2="320"/>
  <line x1="600" y1="400" x2="420" y2="440"/>
  <line x1="600" y1="400" x2="640" y2="560"/>
  <line x1="340" y1="280" x2="120" y2="180"/>
  <line x1="340" y1="280" x2="580" y2="200"/>
  <line x1="820" y1="320" x2="1050" y2="240"/>
  <line x1="420" y1="440" x2="200" y2="520"/>
  <line x1="640" y1="560" x2="900" y2="480"/>
  <line x1="580" y1="200" x2="820" y2="320"/>
  <g class="bg-anim__server">
    <rect x="592" y="388" width="16" height="22" rx="2"/>
    <line x1="595" y1="395" x2="605" y2="395"/><line x1="595" y1="401" x2="605" y2="401"/>
    <circle cx="600" cy="408" r="1.5" fill="#34D399"/>
  </g>
  <g class="bg-anim__server">
    <rect x="332" y="268" width="16" height="22" rx="2"/>
    <line x1="335" y1="275" x2="345" y2="275"/><line x1="335" y1="281" x2="345" y2="281"/>
  </g>
  <g class="bg-anim__server">
    <rect x="812" y="308" width="16" height="22" rx="2"/>
    <line x1="815" y1="315" x2="825" y2="315"/><line x1="815" y1="321" x2="825" y2="321"/>
  </g>
  <g class="bg-anim__server">
    <rect x="412" y="428" width="16" height="22" rx="2"/>
    <line x1="415" y1="435" x2="425" y2="435"/><line x1="415" y1="441" x2="425" y2="441"/>
  </g>
  <g class="bg-anim__client">
    <rect x="112" y="172" width="14" height="10" rx="1"/>
    <line x1="112" y1="186" x2="126" y2="186"/>
  </g>
  <g class="bg-anim__client">
    <rect x="1042" y="234" width="14" height="10" rx="1"/>
    <line x1="1042" y1="248" x2="1056" y2="248"/>
  </g>
  <circle class="bg-anim__node" cx="600" cy="400" r="5"/>
  <circle class="bg-anim__node" cx="340" cy="280" r="4"/>
  <circle class="bg-anim__node" cx="820" cy="320" r="4"/>
  <circle class="bg-anim__node" cx="580" cy="200" r="3"/>
  <circle class="bg-anim__packet" r="3" fill="url(#packet-glow)">
    <animateMotion dur="7s" repeatCount="indefinite" path="M600,400 L340,280"/>
  </circle>
  <circle class="bg-anim__packet" r="2.5" fill="#C4B5FD">
    <animateMotion dur="9s" repeatCount="indefinite" begin="1.5s" path="M600,400 L820,320"/>
  </circle>
  <circle class="bg-anim__packet" r="2.5" fill="#A78BFA">
    <animateMotion dur="8s" repeatCount="indefinite" begin="3s" path="M600,400 L420,440"/>
  </circle>
  <circle class="bg-anim__packet" r="2" fill="#DDD6FE">
    <animateMotion dur="6s" repeatCount="indefinite" begin="0.5s" path="M340,280 L120,180"/>
  </circle>
  <circle class="bg-anim__packet" r="2" fill="#C4B5FD">
    <animateMotion dur="10s" repeatCount="indefinite" begin="4s" path="M820,320 L1050,240"/>
  </circle>
  <g class="bg-anim__wifi" transform="translate(190,500)">
    <path d="M0,8 Q12,-4 24,8"/><path d="M6,8 Q12,2 18,8"/><circle cx="12" cy="10" r="1.5"/>
  </g>
  <g class="bg-anim__wifi" transform="translate(880,460)">
    <path d="M0,8 Q12,-4 24,8"/><path d="M6,8 Q12,2 18,8"/><circle cx="12" cy="10" r="1.5"/>
  </g>
  <text class="bg-anim__label" x="608" y="382">CORE</text>
  <text class="bg-anim__label" x="328" y="262">SW-01</text>
  <text class="bg-anim__label" x="808" y="302">SRV</text>
`;

const IT_FLOAT_TERMS = [
  'TCP/IP', 'DNS', 'HTTPS', 'LAN', 'WAN', 'VPN', 'SSH', 'API',
  'IPv4', 'WiFi', 'Cloud', 'Backup', 'Firewall', 'Router', 'CCTV', 'Ping'
];

function createBinaryRain(mode) {
  const binary = document.createElement('div');
  binary.className = 'bg-anim__binary';
  const colCount = mode === 'subtle' ? 5 : 9;

  for (let c = 0; c < colCount; c++) {
    const col = document.createElement('div');
    col.className = 'bg-anim__binary-col';
    col.style.left = `${6 + (c / colCount) * 88}%`;
    col.style.animationDuration = `${32 + Math.random() * 24}s`;
    col.style.animationDelay = `${Math.random() * 18}s`;

    let chars = '';
    const rows = mode === 'subtle' ? 14 : 22;
    for (let r = 0; r < rows; r++) {
      chars += Math.random() > 0.5 ? '1' : '0';
      if (r % 4 === 3 && mode !== 'subtle') chars += Math.random() > 0.6 ? ' ' : '';
    }
    col.textContent = chars;
    binary.appendChild(col);
  }

  return binary;
}

function createItTerms(mode) {
  const terms = document.createElement('div');
  terms.className = 'bg-anim__it-terms';
  const count = mode === 'subtle' ? 4 : 8;
  const pool = [...IT_FLOAT_TERMS].sort(() => Math.random() - 0.5).slice(0, count);

  pool.forEach((term, i) => {
    const span = document.createElement('span');
    span.className = 'bg-anim__it-term';
    span.textContent = term;
    span.style.left = `${8 + (i * 11) % 82}%`;
    span.style.top = `${12 + (i * 17) % 70}%`;
    span.style.animationDuration = `${24 + Math.random() * 16}s`;
    span.style.animationDelay = `${Math.random() * 12}s`;
    terms.appendChild(span);
  });

  return terms;
}

function createBgAnimLayers(mode = 'full', withParticles = true) {
  const wrap = document.createElement('div');
  wrap.className = `bg-anim bg-anim--${mode}`;
  wrap.setAttribute('aria-hidden', 'true');

  const mesh = document.createElement('div');
  mesh.className = 'bg-anim__mesh';

  const grid = document.createElement('div');
  grid.className = 'bg-anim__grid';

  const circuit = document.createElement('div');
  circuit.className = 'bg-anim__circuit';

  const network = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  network.setAttribute('class', 'bg-anim__network');
  network.setAttribute('viewBox', '0 0 1200 800');
  network.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  network.innerHTML = IT_NETWORK_SVG;

  wrap.append(mesh, grid, circuit, network, createBinaryRain(mode), createItTerms(mode));

  if (mode === 'full' || mode === 'hero') {
    const fade = document.createElement('div');
    fade.className = 'bg-anim__fade';
    wrap.appendChild(fade);
  }

  if (withParticles) {
    const dataStream = document.createElement('div');
    dataStream.className = 'bg-anim__datastream';
    const symbols = ['{ }', '</>', '0x', '01', '10', 'FF', '::', '=>'];
    const count = mode === 'subtle' ? 4 : 10;

    for (let i = 0; i < count; i++) {
      const bit = document.createElement('span');
      bit.className = 'bg-anim__data-bit';
      bit.textContent = symbols[i % symbols.length];
      bit.style.left = `${4 + Math.random() * 92}%`;
      bit.style.animationDuration = `${28 + Math.random() * 24}s`;
      bit.style.animationDelay = `${Math.random() * 20}s`;
      bit.style.setProperty('--drift', `${-14 + Math.random() * 28}px`);
      dataStream.appendChild(bit);
    }

    wrap.appendChild(dataStream);
  }

  return wrap;
}

function mountBgAnim(container, mode, withParticles) {
  if (!container || container.querySelector(':scope > .bg-anim')) return;

  container.querySelectorAll(
    ':scope > .bg-anim__mesh, :scope > .bg-anim__grid, :scope > .bg-anim__orbs, :scope > .bg-anim__network, :scope > .bg-anim__particles, :scope > .bg-anim__fade'
  ).forEach(el => el.remove());

  const anim = createBgAnimLayers(mode, withParticles);
  container.insertBefore(anim, container.firstChild);
}

function initAnimatedBackground() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const withParticles = !reducedMotion;

  document.querySelectorAll('.hero__bg').forEach(el => {
    mountBgAnim(el, 'hero', withParticles);
  });

  document.querySelectorAll('.service-hero, .service-cta, .footer').forEach(el => {
    mountBgAnim(el, 'full', withParticles);
  });

  document.querySelectorAll(
    '.section, .section-block, .service-detail, .service-process, .other-services, .karir-page, .legal-page'
  ).forEach(el => {
    mountBgAnim(el, 'subtle', withParticles);
  });
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  const hero = heroBg.closest('.hero');
  const mesh = heroBg.querySelector('.bg-anim--hero .bg-anim__mesh, .bg-anim__mesh');
  if (!hero || !mesh) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroHeight) {
      mesh.style.transform = `translateY(${scrollY * 0.12}px)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

function initCardTilt() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.client-card, .service-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  counters.forEach(counter => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || counter.dataset.animated) return;
        counter.dataset.animated = 'true';

        const target = parseInt(counter.getAttribute('data-count'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = String(Math.floor(current));
            requestAnimationFrame(update);
          } else {
            counter.textContent = String(target) + suffix;
          }
        };

        update();
        observer.unobserve(counter);
      });
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

function initScrollAnimations() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fadeSelectors = [
    '.service-card',
    '.portfolio-card',
    '.client-card',
    '.team-card',
    '.about__value',
    '.about__image',
    '.about__content',
    '.clients__stat',
    '.contact__info-item',
    '.contact__form',
    '.service-hero__icon',
    '.service-hero__title',
    '.service-hero__desc',
    '.service-hero__stat',
    '.service-detail__content',
    '.service-sidebar__card',
    '.process-step',
    '.faq-item',
    '.service-cta'
  ];

  fadeSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('fade-in')) {
        el.classList.add('fade-in');
        el.style.setProperty('--delay', `${Math.min(i % 6, 5) * 120}ms`);
      }
    });
  });

  document.querySelectorAll('.section__header, .service-hero__stats').forEach(header => {
    if (!header.classList.contains('reveal-header')) {
      header.classList.add('reveal-header');
    }
  });

  if (reducedMotion) {
    document.querySelectorAll('.fade-in, .reveal-header').forEach(el => {
      el.classList.add('visible', 'is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible', 'is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in, .reveal-header').forEach(el => observer.observe(el));
}

function initTestimonialSlider() {
  const slider = document.getElementById('testimonials-slider');
  const track = document.getElementById('testimonials-track');
  if (!slider || !track) return;

  // On mobile (<768px) force a clean vertical 2-col grid.
  // Completely skip the custom horizontal slider (transform + drag + RAF + listeners).
  // This was causing noticeable scroll delay/jank on Samsung Internet browser.
  if (window.innerWidth < 768) {
    // Force clean vertical grid on mobile - no horizontal slider at all
    if (track) {
      track.style.display = 'flex';
      track.style.flexDirection = 'column';
      track.style.gap = '16px';
      track.style.transform = 'none';
      track.style.transition = 'none';
    }
    // Also force each slide to behave in grid
    const mobileSlides = track ? track.querySelectorAll('.testimonials-slider__slide') : [];
    mobileSlides.forEach(slide => {
      slide.style.flex = 'none';
      slide.style.width = '100%';
      slide.style.minWidth = '0';
    });
    return;
  }

  const slides = [...track.querySelectorAll('.testimonials-slider__slide')];
  const prevBtn = slider.querySelector('.testimonials-slider__btn--prev');
  const nextBtn = slider.querySelector('.testimonials-slider__btn--next');
  const dotsContainer = document.getElementById('testimonials-dots');
  const progressBar = document.getElementById('testimonials-progress');
  const GAP = 24;
  const AUTOPLAY_MS = 5000;
  let current = 0;
  let perView = 3;
  let maxIndex = 0;
  let autoplayOn = true;
  let autoplayTimer = null;
  let progressRAF = null;
  let progressStart = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDelta = 0;

  function getPerView() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    if (w < 1400) return 3;
    return 6; // on very wide screens: show all 6 testimonials at once (no sliding needed)
  }

  function getSlideStep() {
    if (!slides.length) return 0;

    // Most reliable: measure actual on-screen distance between first two rendered slides
    if (slides.length > 1) {
      const r1 = slides[0].getBoundingClientRect();
      const r2 = slides[1].getBoundingClientRect();
      const dist = r2.left - r1.left;
      if (dist > 10) return dist;
    }

    // Fallback to measured slide width
    const slide = slides[0];
    if (slide && slide.offsetWidth > 10) {
      return slide.offsetWidth + GAP;
    }

    // Final fallback using current perView + viewport
    const vp = slider.querySelector('.testimonials-slider__viewport');
    if (vp && perView > 0) {
      const vpW = vp.clientWidth || vp.offsetWidth;
      if (vpW > 50) {
        return (vpW - GAP * (perView - 1)) / perView + GAP;
      }
    }
    return 320;
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonials-slider__dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ke testimoni ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i, true));
      dotsContainer.appendChild(dot);
    }
  }

  function updateActiveSlides() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i >= current && i < current + perView);
    });
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = current <= 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex;
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.testimonials-slider__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function applyTransform(animate = true) {
    let step = getSlideStep();
    // If measurement looks bad (e.g. 0 or too small), force fresh recalc
    if (step < 50 && slides.length > 0) {
      recalc();
      step = getSlideStep();
    }
    track.style.transition = animate ? 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(-${current * step}px)`;
    updateActiveSlides();
    updateButtons();
    updateDots();
  }

  function stopProgress() {
    if (progressRAF) cancelAnimationFrame(progressRAF);
    progressRAF = null;
    if (progressBar) progressBar.style.width = '0%';
  }

  function startProgress() {
    stopProgress();
    if (!autoplayOn || !progressBar) return;
    progressStart = performance.now();

    const tick = now => {
      const elapsed = now - progressStart;
      const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
      progressBar.style.width = `${pct}%`;
      if (pct < 100) progressRAF = requestAnimationFrame(tick);
    };
    progressRAF = requestAnimationFrame(tick);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
    stopProgress();
  }

  function startAutoplay() {
    stopAutoplay();
    if (!autoplayOn) return;
    startProgress();
    autoplayTimer = setInterval(() => {
      if (current >= maxIndex) goTo(0);
      else goTo(current + 1);
    }, AUTOPLAY_MS);
  }

  function goTo(index, userAction = false) {
    current = Math.max(0, Math.min(index, maxIndex));
    applyTransform(true);
    if (userAction) startAutoplay();
    else if (autoplayOn) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function recalc() {
    perView = getPerView();
    // For the 6-grid + slider: allow full traversal so user can slide through every testimonial card one by one.
    // (perView still controls the "active group" highlight/scale size)
    maxIndex = Math.max(0, slides.length - 1);
    if (current > maxIndex) current = maxIndex;

    // "6 grid dengan slider": all 6 testimonials in a horizontal grid of cards.
    // Slider controls (arrows, drag, dots) let you scroll the row.
    // Card width fixed for consistent grid look; responsive for mobile.
    let cardWidth = 240;
    const ww = window.innerWidth;
    if (ww < 640) cardWidth = 280;
    if (ww < 480) cardWidth = 260;

    slides.forEach(slide => {
      slide.style.flex = `0 0 ${cardWidth}px`;
      slide.style.width = `${cardWidth}px`;
      slide.style.minWidth = '0';
    });

    buildDots();
    applyTransform(false);
    if (autoplayOn) startAutoplay();
  }

  // Attach button + interaction listeners AFTER we have good layout measurements
  prevBtn?.addEventListener('click', () => goTo(current - 1, true));
  nextBtn?.addEventListener('click', () => goTo(current + 1, true));

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', () => { if (autoplayOn) startAutoplay(); });

  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1, true);
    if (e.key === 'ArrowRight') goTo(current + 1, true);
  });

  const viewport = slider.querySelector('.testimonials-slider__viewport');

  viewport?.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragDelta = 0;
    stopAutoplay();
    viewport.setPointerCapture(e.pointerId);
  });

  viewport?.addEventListener('pointermove', e => {
    if (!isDragging) return;
    dragDelta = e.clientX - dragStartX;
    const step = getSlideStep();
    track.style.transition = 'none';
    track.style.transform = `translateX(${-current * step + dragDelta}px)`;
  });

  viewport?.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    viewport.releasePointerCapture(e.pointerId);
    const threshold = getSlideStep() * 0.2;
    if (dragDelta < -threshold) goTo(current + 1, true);
    else if (dragDelta > threshold) goTo(current - 1, true);
    else applyTransform(true);
    if (autoplayOn) startAutoplay();
  });

  window.addEventListener('resize', () => {
    clearTimeout(slider._resizeTimer);
    slider._resizeTimer = setTimeout(recalc, 150);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    autoplayOn = false;
  }

  // Defer initial measurement so offsetWidth / clientWidth are reliable
  // (important when section is lower in the page or fonts/images affect layout)
  requestAnimationFrame(() => {
    recalc();
    // Second rAF for extra safety after paint
    requestAnimationFrame(() => {
      recalc();
    });
  });
}

function initStickyCta() {
  const bar = document.getElementById('sticky-cta');
  if (!bar || window.innerWidth > 768) return;

  document.body.classList.add('has-sticky-cta');
  bar.removeAttribute('hidden');

  window.addEventListener('scroll', () => {
    bar.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(100%)';
  }, { passive: true });
  bar.style.transform = 'translateY(100%)';
  bar.style.transition = 'transform 0.3s ease';
}

function initWhatsAppFloat(siteConfig, formConfig) {
  if (document.querySelector('.wa-float')) return;

  const wa = siteConfig.whatsapp || formConfig.WHATSAPP || '6287882521602';
  const link = document.createElement('a');
  link.href = `https://wa.me/${wa}?text=${encodeURIComponent('Halo Creative Network, saya mau konsultasi GRATIS!')}`;
  link.className = 'wa-float';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', 'Chat WhatsApp Creative Network');
  link.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
  document.body.appendChild(link);
}

function initCookieBanner() {
  if (localStorage.getItem('cn_cookie_consent')) return;

  const base = window.location.pathname.includes('/layanan/') ? '../' : '';
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <p>Website ini menggunakan cookie esensial dan analitik (jika diaktifkan) untuk pengalaman yang lebih baik.
    <a href="${base}kebijakan-cookie.html">Kebijakan Cookie</a></p>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-banner__btn cookie-banner__btn--decline">Tolak</button>
      <button type="button" class="cookie-banner__btn cookie-banner__btn--accept">Terima</button>
    </div>`;

  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));

  const close = value => {
    localStorage.setItem('cn_cookie_consent', value);
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 350);
  };

  banner.querySelector('.cookie-banner__btn--accept').addEventListener('click', () => {
    close('accepted');
    initAnalytics(window.SITE_CONFIG || {});
  });
  banner.querySelector('.cookie-banner__btn--decline').addEventListener('click', () => close('declined'));
}

function initAnalytics(siteConfig) {
  const gaId = siteConfig.gaId;
  if (!gaId || localStorage.getItem('cn_cookie_consent') === 'declined') return;
  if (!localStorage.getItem('cn_cookie_consent')) return;
  if (window.__cnAnalyticsLoaded) return;
  window.__cnAnalyticsLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId);
}