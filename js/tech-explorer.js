function initTechExplorer() {
  const data = window.TECH_EXPLORER_DATA;
  if (!data) return;

  document.querySelectorAll('[data-tech-explorer]').forEach(root => {
    const key = root.dataset.techExplorer;
    const stack = data[key];
    if (!stack || root.dataset.mounted) return;
    root.dataset.mounted = 'true';
    mountTechExplorer(root, stack);
  });
}

function mountTechExplorer(root, stack) {
  let activeId = stack.items[0]?.id;
  let activeFilter = 'all';

  root.className = 'tech-explorer';
  root.innerHTML =
    '<div class="tech-explorer__filters" role="tablist"></div>' +
    '<div class="tech-explorer__layout">' +
      '<div class="tech-explorer__grid" role="list"></div>' +
      '<aside class="tech-explorer__panel" aria-live="polite">' +
        '<div class="tech-explorer__panel-inner"></div>' +
      '</aside>' +
    '</div>' +
    '<p class="tech-explorer__hint" aria-hidden="true">' +
      '<span class="tech-explorer__hint-desktop">Klik kartu untuk detail lengkap</span>' +
      '<span class="tech-explorer__hint-mobile">Ketuk kartu untuk update penjelasan di panel atas (sticky)</span>' +
    '</p>';

  // Create mobile bottom sheet (once per explorer)
  const sheet = document.createElement('div');
  sheet.className = 'tech-explorer__sheet';
  sheet.innerHTML = `
    <div class="tech-explorer__sheet-header">
      <div class="tech-explorer__sheet-title"></div>
      <button class="tech-explorer__sheet-close" aria-label="Tutup">×</button>
    </div>
    <div class="tech-explorer__sheet-body"></div>
  `;
  document.body.appendChild(sheet);

  const sheetTitle = sheet.querySelector('.tech-explorer__sheet-title');
  const sheetBody = sheet.querySelector('.tech-explorer__sheet-body');
  const sheetClose = sheet.querySelector('.tech-explorer__sheet-close');

  function closeSheet() {
    sheet.classList.remove('is-open');
  }

  sheetClose.addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) closeSheet();
  });

  function showMobileDetail(item) {
    if (!item) return;

    // Lightweight content update
    sheetTitle.textContent = item.name;
    sheetBody.innerHTML = `
      <div style="display:flex; gap:12px; margin-bottom:12px; align-items:flex-start;">
        <span style="width:36px;height:36px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:var(--color-accent-light); border-radius:8px; color:var(--color-primary);">
          ${getTechIcon(item.category)}
        </span>
        <div style="flex:1; min-width:0;">
          <span style="font-size:0.75rem; color:var(--color-text-light);">${item.categoryLabel}</span>
          <h3 style="font-size:1.05rem; margin:2px 0 4px; color:var(--color-dark);">${item.name}</h3>
          <p style="margin:0; font-size:0.88rem; color:var(--color-text-light);">${item.tagline}</p>
        </div>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:0.82rem; margin-bottom:4px; color:var(--color-dark);">Kegunaan</h4>
        <ul style="margin:0; padding-left:18px; font-size:0.88rem; line-height:1.45;">
          ${item.use.map(u => `<li>${u}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom:12px;">
        <h4 style="font-size:0.82rem; margin-bottom:4px; color:var(--color-dark);">Fungsi Utama</h4>
        <ul style="margin:0; padding-left:18px; font-size:0.88rem; line-height:1.45;">
          ${item.functions.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div style="background:var(--color-bg-alt); border:1px solid var(--color-border); border-radius:8px; padding:10px 12px; font-size:0.88rem;">
        <strong style="font-size:0.82rem;">Cocok Untuk:</strong><br>
        ${item.fit}
      </div>
    `;

    // Open immediately with CSS transition (no extra RAF to reduce delay)
    sheet.classList.add('is-open');
  }

  const filtersEl = root.querySelector('.tech-explorer__filters');
  const gridEl = root.querySelector('.tech-explorer__grid');
  const panelInner = root.querySelector('.tech-explorer__panel-inner');

  stack.categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tech-explorer__filter' + (i === 0 ? ' is-active' : '');
    btn.dataset.filter = cat.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => setFilter(cat.id));
    filtersEl.appendChild(btn);
  });

  function getFilteredItems() {
    if (activeFilter === 'all') return stack.items;
    return stack.items.filter(item => item.category === activeFilter);
  }

  function setFilter(filter) {
    activeFilter = filter;
    filtersEl.querySelectorAll('.tech-explorer__filter').forEach(btn => {
      const on = btn.dataset.filter === filter;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    const visible = getFilteredItems();
    if (!visible.find(item => item.id === activeId)) {
      activeId = visible[0]?.id;
    }
    renderGrid();

    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      renderPanel();
    } else if (activeId) {
      // On mobile, if a card was already selected, refresh the open sheet
      const item = stack.items.find(i => i.id === activeId);
      if (item && sheet.classList.contains('is-open')) {
        showMobileDetail(item);
      }
    }
  }

  function setActive(id) {
    activeId = id;

    // Lightweight update: only toggle active class instead of full re-render (big win for mobile performance)
    const cards = gridEl.querySelectorAll('.tech-card');
    cards.forEach(c => {
      c.classList.toggle('is-active', c.dataset.id === activeId);
    });

    // Always render the panel so the explanation is visible in the layout on all devices (including HP).
    // This brings back the panel ("tampilkan lagi") as requested.
    // The bottom sheet is still available as an optional more "app-like" popup if needed, but panel is primary now.
    renderPanel();

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // On mobile, after updating the panel (which is above), auto-scroll the panel into view
      // so the explanation is immediately visible without manual scrolling up.
      const panel = root.querySelector('.tech-explorer__panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Only scroll to the tapped card on non-mobile (desktop/tablet)
    const card = gridEl.querySelector(`[data-id="${id}"]`);
    if (card && !isMobile && window.innerWidth < 900) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function renderGrid() {
    const visible = getFilteredItems();
    gridEl.innerHTML = '';

    visible.forEach((item, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'tech-card' + (item.id === activeId ? ' is-active' : '');
      card.dataset.id = item.id;
      card.setAttribute('role', 'listitem');
      card.style.setProperty('--delay', `${i * 60}ms`);
      card.innerHTML =
        '<span class="tech-card__icon" aria-hidden="true">' + getTechIcon(item.category) + '</span>' +
        '<span class="tech-card__body">' +
          '<span class="tech-card__name">' + item.name + '</span>' +
          '<span class="tech-card__cat">' + item.categoryLabel + '</span>' +
          '<span class="tech-card__tagline">' + item.tagline + '</span>' +
        '</span>' +
        '<span class="tech-card__arrow" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</span>';
      card.addEventListener('click', () => setActive(item.id));
      gridEl.appendChild(card);
    });
  }

  function renderPanel() {
    const item = stack.items.find(i => i.id === activeId);
    if (!item) {
      panelInner.innerHTML = '';
      return;
    }

    panelInner.classList.remove('is-visible');
    requestAnimationFrame(() => {
      panelInner.innerHTML =
        '<div class="tech-panel__head">' +
          '<span class="tech-panel__icon" aria-hidden="true">' + getTechIcon(item.category) + '</span>' +
          '<div>' +
            '<span class="tech-panel__cat">' + item.categoryLabel + '</span>' +
            '<h3 class="tech-panel__title">' + item.name + '</h3>' +
            '<p class="tech-panel__tagline">' + item.tagline + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="tech-panel__blocks">' +
          '<div class="tech-panel__block">' +
            '<h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg> Kegunaan</h4>' +
            '<ul>' + item.use.map(u => '<li>' + u + '</li>').join('') + '</ul>' +
          '</div>' +
          '<div class="tech-panel__block">' +
            '<h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Fungsi Utama</h4>' +
            '<ul>' + item.functions.map(f => '<li>' + f + '</li>').join('') + '</ul>' +
          '</div>' +
          '<div class="tech-panel__block tech-panel__block--fit">' +
            '<h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Cocok Untuk</h4>' +
            '<p>' + item.fit + '</p>' +
          '</div>' +
        '</div>';

      requestAnimationFrame(() => panelInner.classList.add('is-visible'));
    });
  }

  renderGrid();

  if (window.innerWidth >= 768) {
    renderPanel();
  } else {
    // On mobile start with first item selected but sheet closed
    // User taps a card to open the nice bottom sheet
  }

  root.addEventListener('keydown', e => {
    const visible = getFilteredItems();
    const idx = visible.findIndex(i => i.id === activeId);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActive(visible[(idx + 1) % visible.length].id);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive(visible[(idx - 1 + visible.length) % visible.length].id);
    }
  });
}

function getTechIcon(category) {
  const icons = {
    os: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    virt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
    ops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    router: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 15h6M12 9v6"/></svg>',
    wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    cable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4"/></svg>',
    security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    device: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    access: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    infra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>'
  };
  return icons[category] || icons.os;
}