/* QuickSite main.js
- Homepage interactions: nav toggle, tabs (How it Works), accordion (FAQs), carousel (reviews)
- Integration checklist is in README; BASE_API_URL config lives in auth.js
- Socket.io placeholder: when ready, load client and authenticate with JWT
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav toggle
  const navToggle = $('.nav__toggle');
  const navMenu = $('#nav-menu');
  if (navToggle && navMenu) {
    navToggle.style.display = 'inline-flex';
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('is-open');
    });
  }

  // Tabs: How It Works
  const tabs = $$('.tabs__tab');
  const panels = $$('.tabs__panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      panels.forEach(p => { p.hidden = true; p.classList.add('is-hidden'); });
      tab.setAttribute('aria-selected', 'true');
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) { panel.hidden = false; panel.classList.remove('is-hidden'); }
    });
  });

  // Accordion: FAQs
  const accordion = $('[data-accordion]');
  if (accordion) {
    accordion.addEventListener('click', (e) => {
      const btn = e.target.closest('.accordion__button');
      if (!btn) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = expanded;
    });
  }

  // Carousel: Reviews
  const carousel = $('[data-carousel]');
  if (carousel) {
    const slides = $$('.carousel__slide', carousel);
    let current = 0;
    const update = () => {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      const viewport = $('.carousel__viewport', carousel);
      if (viewport) viewport.style.transform = `translateX(-${current * 100}%)`;
    };
    $('[data-prev]', carousel)?.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length; update();
    });
    $('[data-next]', carousel)?.addEventListener('click', () => {
      current = (current + 1) % slides.length; update();
    });
    // Auto-advance every 6s
    setInterval(() => { current = (current + 1) % slides.length; update(); }, 6000);
    update();
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
