(() => {
  if (window.__auroraLoaded) return;
  window.__auroraLoaded = true;

  const PIN_STORAGE_KEY = 'aurora:pincode';

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    }
  };

  /* ---------- Variant change: refresh blocks marked data-aurora-rerender ---------- */
  const refreshFromHtml = (html) => {
    if (!html || typeof html.querySelectorAll !== 'function') return;
    document.querySelectorAll('[data-aurora-rerender][id]').forEach((el) => {
      const source = html.getElementById ? html.getElementById(el.id) : html.querySelector(`#${CSS.escape(el.id)}`);
      if (source) el.innerHTML = source.innerHTML;
    });
  };
  const listenedSections = new Set();
  const initRerender = (scope) => {
    scope.querySelectorAll('[data-aurora-rerender][data-section-id]').forEach((el) => {
      const sectionId = el.dataset.sectionId;
      if (listenedSections.has(sectionId)) return;
      listenedSections.add(sectionId);
      document.addEventListener(`neone:product-page-variant-select:updated:${sectionId}`, (event) => {
        refreshFromHtml(event.detail && event.detail.html);
      });
    });
  };

  /* ---------- Pincode checker ---------- */
  const SOUTH_STATES = ['kerala', 'karnataka', 'andhra pradesh', 'telangana', 'puducherry', 'pondicherry'];

  const addWorkingDays = (start, days) => {
    const date = new Date(start);
    let added = 0;
    while (added < days) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) added += 1; // skip Sundays
    }
    return date;
  };
  const formatDate = (date) => date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const lookupPincode = async (pin) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: controller.signal });
      const data = await res.json();
      const entry = Array.isArray(data) ? data[0] : null;
      if (!entry) return { status: 'unknown' };
      if (entry.Status !== 'Success' || !entry.PostOffice || !entry.PostOffice.length) return { status: 'invalid' };
      const office = entry.PostOffice[0];
      return { status: 'ok', district: office.District, state: office.State };
    } catch (e) {
      return { status: 'unknown' };
    } finally {
      clearTimeout(timer);
    }
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const initPincode = (root) => {
    if (root.dataset.auroraReady) return;
    root.dataset.auroraReady = 'true';
    const cfg = JSON.parse(root.querySelector('script[type="application/json"]').textContent);
    const form = root.querySelector('form');
    const input = root.querySelector('input');
    const button = root.querySelector('button');
    const output = root.querySelector('[data-pincode-output]');

    const blocked = (cfg.blocked || '')
      .split(/[\s,]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const render = (pin, place) => {
      const state = (place && place.state ? place.state : '').toLowerCase();
      let range = cfg.rest;
      if (state && state === String(cfg.homeState || '').toLowerCase()) range = cfg.home;
      else if (SOUTH_STATES.includes(state)) range = cfg.south;

      const now = new Date();
      const from = addWorkingDays(now, range[0]);
      const to = addWorkingDays(now, range[1]);
      const where = place && place.district ? ` to ${escapeHtml(place.district)}, ${escapeHtml(place.state)}` : '';
      const items = [
        `<li><span aria-hidden="true">🚚</span><span>Delivery${where} by <strong>${formatDate(from)} – ${formatDate(to)}</strong></span></li>`
      ];
      if (cfg.shippingText) items.push(`<li><span aria-hidden="true">📦</span><span>${escapeHtml(cfg.shippingText)}</span></li>`);
      if (cfg.codEnabled && cfg.codText) items.push(`<li><span aria-hidden="true">💵</span><span>${escapeHtml(cfg.codText)}</span></li>`);
      if (!cfg.codEnabled && cfg.prepaidText) items.push(`<li><span aria-hidden="true">💳</span><span>${escapeHtml(cfg.prepaidText)}</span></li>`);
      output.innerHTML = `<ul class="aurora-pincode__result">${items.join('')}</ul>`;
    };

    const check = async (pin) => {
      if (!/^[1-9][0-9]{5}$/.test(pin)) {
        output.innerHTML = `<p class="aurora-pincode__error">${escapeHtml(cfg.invalidText)}</p>`;
        return;
      }
      if (blocked.some((prefix) => pin.indexOf(prefix) === 0)) {
        output.innerHTML = `<p class="aurora-pincode__error">${escapeHtml(cfg.unserviceableText)}</p>`;
        return;
      }
      button.disabled = true;
      const place = await lookupPincode(pin);
      button.disabled = false;
      if (place.status === 'invalid') {
        output.innerHTML = `<p class="aurora-pincode__error">${escapeHtml(cfg.invalidText)}</p>`;
        return;
      }
      safeStorage.set(PIN_STORAGE_KEY, pin);
      render(pin, place.status === 'ok' ? place : null);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      check(input.value.trim());
    });
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 6);
    });

    const saved = safeStorage.get(PIN_STORAGE_KEY);
    if (saved && /^[1-9][0-9]{5}$/.test(saved)) {
      input.value = saved;
      check(saved);
    }
  };

  /* ---------- Sticky "Buy now" ---------- */
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-aurora-buy-now]');
    if (!btn) return;
    e.preventDefault();
    const form = document.getElementById(btn.dataset.form);
    const idInput = form && form.querySelector('input[name="id"]');
    if (!idInput || !idInput.value) return;
    const qtyInput = document.querySelector(`input[name="quantity"][form="${btn.dataset.form}"]`)
      || document.getElementById(btn.dataset.mainQty || '');
    const quantity = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);
    btn.disabled = true;
    try {
      const res = await fetch(`${(window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/'}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(idInput.value), quantity }] })
      });
      if (!res.ok) throw new Error('add failed');
      window.location.href = '/checkout';
    } catch (err) {
      btn.disabled = false;
      form.querySelector('button[name="add"]')?.click();
    }
  });

  /* ---------- Image review lightbox ---------- */
  document.addEventListener('click', (e) => {
    const item = e.target.closest('[data-aurora-lightbox]');
    if (!item) return;
    const dialog = document.getElementById(item.dataset.auroraLightbox);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const img = dialog.querySelector('img');
    img.src = item.dataset.full;
    img.alt = item.dataset.alt || '';
    dialog.showModal();
  });
  document.addEventListener('click', (e) => {
    if (e.target.matches('.aurora-lightbox, .aurora-lightbox button')) e.target.closest('dialog').close();
  });

  /* ---------- Lead capture: normalise phone before submit ---------- */
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-aurora-lead]');
    if (!form) return;
    const phone = form.querySelector('[data-aurora-phone]');
    const hidden = form.querySelector('[data-aurora-phone-field]');
    const tags = form.querySelector('input[name="contact[tags]"]');
    if (!phone || !hidden) return;
    const digits = phone.value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (digits && !/^[6-9]\d{9}$/.test(digits)) {
      e.preventDefault();
      phone.setCustomValidity('Please enter a valid 10-digit mobile number');
      phone.reportValidity();
      return;
    }
    phone.setCustomValidity('');
    hidden.value = digits ? `+91${digits}` : '';
    if (digits) hidden.name = 'contact[phone]';
    else hidden.removeAttribute('name');
    // With a consent checkbox on the form, only an explicit tick counts as WhatsApp opt-in.
    const consent = form.querySelector('[data-aurora-wa-consent]');
    const optedIn = digits && (!consent || consent.checked);
    if (optedIn && tags && tags.value.indexOf('whatsapp-optin') === -1) tags.value += ',whatsapp-optin';
  });

  /* ---------- Theme fix: cart drawer reads xPopupInsurance even when insurance is disabled ---------- */
  const stubInsuranceStore = () => {
    if (window.Alpine && !window.Alpine.store('xPopupInsurance')) {
      window.Alpine.store('xPopupInsurance', { openInsuranceNoti: false, openInsuranceNotification() {} });
    }
  };
  if (window.Alpine) stubInsuranceStore();
  else document.addEventListener('alpine:init', stubInsuranceStore);

  /* ---------- Footer: link columns collapsed on phones, open on desktop ---------- */
  const syncFooterCols = () => {
    const mobile = window.matchMedia('(max-width: 989px)').matches;
    document.querySelectorAll('.aurora-foot__col').forEach((col) => {
      if (col.dataset.auroraMode === String(mobile)) return;
      col.dataset.auroraMode = String(mobile);
      col.open = !mobile;
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncFooterCols);
  else syncFooterCols();
  window.matchMedia('(max-width: 989px)').addEventListener('change', syncFooterCols);

  /* ---------- Hero slideshow: arrows, dots, swipe (native scroll-snap), auto-rotate ---------- */
  const initHero = (hero) => {
    if (hero.dataset.auroraReady) return;
    hero.dataset.auroraReady = '';
    const track = hero.querySelector('[data-hero-track]');
    const slides = [...track.children];
    const dots = [...hero.querySelectorAll('[data-hero-dot]')];
    if (slides.length < 2) return;
    let index = 0;
    const current = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (n) => {
      index = (n + slides.length) % slides.length;
      track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
    };
    const markDots = () => {
      index = current();
      dots.forEach((d, n) => {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
    };
    let scrollTimer;
    track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(markDots, 80); }, { passive: true });
    hero.querySelector('[data-hero-prev]')?.addEventListener('click', () => go(current() - 1));
    hero.querySelector('[data-hero-next]')?.addEventListener('click', () => go(current() + 1));
    dots.forEach((d) => d.addEventListener('click', () => go(Number(d.dataset.heroDot))));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero.dataset.autoplay !== 'true' || reduced) return;
    let timer = null;
    let paused = false;
    const start = () => { stop(); timer = setInterval(() => { if (!paused && !document.hidden) go(current() + 1); }, Number(hero.dataset.interval) || 5000); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    hero.addEventListener('mouseenter', () => { paused = true; });
    hero.addEventListener('mouseleave', () => { paused = false; });
    hero.addEventListener('focusin', () => { paused = true; });
    hero.addEventListener('focusout', () => { paused = false; });
    track.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    track.addEventListener('touchend', () => { setTimeout(() => { paused = false; }, 4000); }, { passive: true });
    start();
  };
  const initHeroes = (root) => root.querySelectorAll('[data-aurora-hero]').forEach(initHero);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initHeroes(document));
  else initHeroes(document);
  document.addEventListener('shopify:section:load', (e) => initHeroes(e.target));

  /* ---------- Product gallery: highlight the thumbnail of the photo actually shown ---------- */
  // In loop mode Splide adds cloned slides, which throws off the theme's own thumbnail state.
  const syncThumbs = (gallery) => {
    const sectionId = gallery.id.replace(/^x-product-/, '');
    const slides = [...gallery.querySelectorAll('.splide__slide:not(.splide__slide--clone)')];
    const active = slides.findIndex((s) => s.classList.contains('is-active'));
    document.querySelectorAll(`#x-product-thumbnail-${CSS.escape(sectionId)} .x-thumbnail`).forEach((thumb, n) => {
      thumb.classList.toggle('aurora-thumb-active', n === active);
    });
  };
  const watchGallery = (gallery) => {
    if (gallery.dataset.auroraThumbs) return;
    gallery.dataset.auroraThumbs = '';
    syncThumbs(gallery);
    new MutationObserver(() => syncThumbs(gallery)).observe(gallery, { subtree: true, attributes: true, attributeFilter: ['class'] });
  };
  new MutationObserver(() => document.querySelectorAll('.x-splide.swiper-product[id^="x-product-"]').forEach(watchGallery))
    .observe(document.documentElement, { childList: true, subtree: true });
  document.querySelectorAll('.x-splide.swiper-product[id^="x-product-"]').forEach(watchGallery);

  /* ---------- Product cards: Add to cart (opens the cart drawer) ---------- */
  document.addEventListener('click', async (e) => {
    const button = e.target.closest('[data-aurora-card-add]');
    if (!button) return;
    e.preventDefault();
    e.stopPropagation();
    if (button.disabled) return;
    const label = button.textContent;
    button.disabled = true;
    button.classList.add('is-loading');
    const store = (name) => (window.Alpine && window.Alpine.store(name)) || null;
    const helper = store('xCartHelper');
    try {
      if (helper && helper.waitForCartUpdate) await helper.waitForCartUpdate();
      window.updatingCart = true;
      const sections = helper ? helper.getSectionsToRender().map((section) => section.id) : [];
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: Number(button.dataset.variantId), quantity: 1 }], sections })
      });
      const data = await response.json();
      if (!response.ok || data.status) throw new Error(data.description || data.message || 'Could not add to cart');
      if (helper && data.sections) helper.reRenderSections(data.sections);
      const noti = store('xCartNoti');
      const miniCart = store('xMiniCart');
      if (noti && noti.enable) noti.setItem(data);
      else if (miniCart) miniCart.openCart();
      else window.location.href = `${window.Shopify.routes.root}cart`;
      document.dispatchEvent(new CustomEvent('neone:cart:items-changed'));
      button.textContent = 'Added ✓';
      setTimeout(() => { button.textContent = label; }, 1800);
    } catch (err) {
      button.textContent = 'Try again';
      setTimeout(() => { button.textContent = label; }, 2200);
    } finally {
      window.updatingCart = false;
      button.disabled = false;
      button.classList.remove('is-loading');
    }
  }, true);

  /* ---------- Pack tiers drive the (hidden) theme variant picker ---------- */
  document.addEventListener('click', (e) => {
    const tier = e.target.closest('[data-aurora-tier]');
    if (!tier) return;
    const box = tier.closest('.aurora-tiers--picker');
    if (!box) return; // plain links: let the browser navigate
    const scope = document.getElementById(`shopify-section-${box.dataset.sectionId}`) || document;
    const value = tier.dataset.optionValue;
    const input = [...scope.querySelectorAll('.x-variant-picker input[type="radio"]')].find((el) => el.value === value);
    if (!input) return;
    e.preventDefault();
    if (!input.checked) input.click();
    box.querySelectorAll('[data-aurora-tier]').forEach((el) => {
      const active = el === tier;
      el.classList.toggle('aurora-tier--current', active);
      el.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  });

  /* ---------- Collection filters: multi-select chips + menu links (?type=&fragrance=&mood=&pack=&price=&min=&max=) ---------- */
  const PRICE_BANDS = { u500: [null, 500], '500-1000': [500, 1000], '1000p': [1000, null] };

  const readFilters = () => {
    const p = new URLSearchParams(window.location.search);
    const list = (key) => (p.get(key) || '').split(',').map((v) => v.trim()).filter(Boolean);
    const num = (key) => (p.get(key) !== null && p.get(key) !== '' ? Number(p.get(key)) : null);
    return { type: list('type'), fragrance: list('fragrance'), mood: list('mood'), pack: list('pack'), price: list('price'), list: list('list'), min: num('min'), max: num('max') };
  };

  const has = (attr, value) => (attr || '').includes(` ${value} `);
  const inRange = (price, lo, hi) => (lo === null || price >= lo) && (hi === null || price < hi);

  // Named product lists from Theme settings > Aurora layout > Menu page product lists
  // ("key: handle, handle" per line). ?list=key shows exactly those products.
  let listCache = null;
  const readLists = () => {
    if (listCache) return listCache;
    listCache = {};
    const el = document.querySelector('[data-aurora-lists]');
    ((el && el.getAttribute('data-aurora-lists')) || '').split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(':');
      if (i > 0) listCache[line.slice(0, i).trim()] = line.slice(i + 1).split(',').map((h) => h.trim()).filter(Boolean);
    });
    return listCache;
  };

  // OR within a group, AND between groups.
  const matches = (item, f) => {
    const price = Number(item.dataset.auroraPrice);
    if (f.list.length) {
      const lists = readLists();
      const known = f.list.filter((k) => lists[k]);
      // an unknown key is ignored rather than hiding every product
      if (known.length && !known.some((k) => lists[k].includes(item.dataset.auroraHandle))) return false;
    }
    if (f.type.length && !f.type.includes(item.dataset.auroraKind)) return false;
    if (f.fragrance.length && !f.fragrance.some((v) => has(item.dataset.auroraFragrance, v))) return false;
    if (f.mood.length && !f.mood.some((v) => has(item.dataset.auroraMood, v))) return false;
    if (f.pack.length && !f.pack.some((v) => has(item.dataset.auroraPacks, v))) return false;
    if (f.price.length && !f.price.some((b) => PRICE_BANDS[b] && inRange(price, ...PRICE_BANDS[b]))) return false;
    if (!inRange(price, f.min, f.max)) return false;
    return true;
  };

  // Name the page after the menu item that links here (e.g. "Calm & Unwind", "Floral Incense Sticks").
  const menuLabelForUrl = () => {
    const here = window.location.pathname + window.location.search;
    const link = [...document.querySelectorAll('.aurora-nav__item a[href], .aurora-mnav a[href]')]
      .filter((a) => !a.classList.contains('aurora-mnav__all'))
      .find((a) => a.getAttribute('href') === here);
    if (!link) return '';
    const head = link.classList.contains('aurora-nav__leaf') && link.closest('.aurora-nav__col')?.querySelector('.aurora-nav__head');
    return head ? `${link.textContent.trim()} ${head.textContent.trim()}` : link.textContent.trim();
  };

  const syncChipState = (bar, f) => {
    bar.querySelectorAll('.aurora-chips__row').forEach((row) => {
      const chips = [...row.querySelectorAll('[data-chip-group]')];
      if (!chips.length) return;
      const selected = f[chips[0].dataset.chipGroup] || [];
      chips.forEach((chip) => {
        const on = chip.dataset.chipValue ? selected.includes(chip.dataset.chipValue) : !selected.length;
        chip.classList.toggle('is-active', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  };

  /* Compact filters (phones/tablets): one row of pills, each opening its chip group as a bottom sheet */
  const chipText = (chip) => (chip.firstChild ? chip.firstChild.textContent : chip.textContent).trim();
  const closeChipSheets = () => {
    document.querySelectorAll('.aurora-chips__row.is-open').forEach((row) => row.classList.remove('is-open'));
    document.querySelectorAll('.aurora-chips__pill[aria-expanded="true"]').forEach((pill) => pill.setAttribute('aria-expanded', 'false'));
    document.documentElement.classList.remove('aurora-sheet-open');
  };
  const updateCompactBar = (chips) => {
    chips.querySelectorAll('.aurora-chips__pill[data-group]').forEach((pill) => {
      const row = chips.querySelector(`.aurora-chips__row[data-group="${pill.dataset.group}"]`);
      if (!row) return;
      const active = [...row.querySelectorAll('.aurora-chip.is-active')].filter((c) => c.dataset.chipValue);
      const label = pill.dataset.label;
      pill.querySelector('span').textContent = active.length === 1 ? `${label}: ${chipText(active[0])}` : active.length > 1 ? `${label} (${active.length})` : label;
      pill.classList.toggle('is-active', active.length > 0);
    });
  };
  const buildCompactBar = (chips) => {
    if (chips.dataset.compact) return;
    const rows = [...chips.querySelectorAll('.aurora-chips__row')];
    if (!rows.length) return;
    chips.dataset.compact = '1';
    const bar = document.createElement('div');
    bar.className = 'aurora-chips__bar';
    const caret = '<svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true"><path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const host = chips.closest('[id^="shopify-section-"]') || document;
    if (document.getElementById('btn-filter') || host.querySelector('#header-filter, template[x-teleport="#header-filter"]')) {
      const sort = document.createElement('button');
      sort.type = 'button';
      sort.className = 'aurora-chips__pill aurora-chips__pill--sort';
      sort.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg><span>Sort &amp; filter</span>';
      sort.addEventListener('click', () => { const btn = document.getElementById('btn-filter'); if (btn) btn.click(); });
      bar.appendChild(sort);
    }
    rows.forEach((row) => {
      const first = row.querySelector('[data-chip-group]');
      if (!first) return;
      const group = first.dataset.chipGroup;
      const label = (row.querySelector('.aurora-chips__label') || {}).textContent || row.getAttribute('aria-label') || group;
      row.dataset.group = group;
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'aurora-chips__pill';
      pill.dataset.group = group;
      pill.dataset.label = label.trim().charAt(0) + label.trim().slice(1).toLowerCase();
      pill.setAttribute('aria-expanded', 'false');
      pill.innerHTML = `<span>${escapeHtml(pill.dataset.label)}</span>${caret}`;
      pill.addEventListener('click', () => {
        const open = !row.classList.contains('is-open');
        closeChipSheets();
        if (!open) return;
        row.classList.add('is-open');
        pill.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('aurora-sheet-open');
      });
      bar.appendChild(pill);
      if (!row.querySelector('.aurora-chips__done')) {
        const done = document.createElement('button');
        done.type = 'button';
        done.className = 'aurora-chips__done';
        done.textContent = 'Done';
        done.addEventListener('click', closeChipSheets);
        row.appendChild(done);
      }
    });
    chips.prepend(bar);
    if (!document.querySelector('.aurora-chips__backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'aurora-chips__backdrop';
      backdrop.addEventListener('click', closeChipSheets);
      document.body.appendChild(backdrop);
    }
    const section = chips.closest('[id^="shopify-section-"]');
    if (section) section.classList.add('aurora-compact-filters');
    updateCompactBar(chips);
  };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChipSheets(); });

  const applyFilters = (scope) => {
    const grid = scope.querySelector('#items-grid');
    if (!grid || !grid.querySelector('.grid-item[data-aurora-kind]')) return;
    const f = readFilters();
    let visible = 0;
    grid.querySelectorAll('.grid-item[data-aurora-kind]').forEach((item) => {
      const show = matches(item, f);
      item.classList.toggle('aurora-chip-hidden', !show);
      if (show) visible += 1;
    });
    const bar = scope.querySelector('[data-aurora-chips]');
    if (bar) {
      buildCompactBar(bar);
      syncChipState(bar, f);
      updateCompactBar(bar);
      const count = bar.querySelector('[data-aurora-visible-count]');
      if (count) count.textContent = visible;
    }
    const filtered = Object.values(f).some((v) => (Array.isArray(v) ? v.length : v !== null));
    const label = filtered ? menuLabelForUrl() : '';
    const heading = document.querySelector('.collection-title h1, .collection-title h2, [id*="collection_banner"] h1');
    if (heading) {
      if (!heading.dataset.auroraOriginal) heading.dataset.auroraOriginal = heading.textContent.trim();
      heading.textContent = label || heading.dataset.auroraOriginal;
    }
    const active = bar && bar.querySelector('[data-aurora-active]');
    if (active) {
      active.hidden = !filtered;
      if (filtered) active.innerHTML = ` · <a href="${window.location.pathname}">Clear filters</a>`;
    }
    const empty = scope.querySelector('.aurora-empty');
    if (filtered && !visible && !empty) {
      grid.insertAdjacentHTML('afterend', `<p class="aurora-empty">No products match these filters. <a href="${window.location.pathname}">See all products</a></p>`);
    } else if (visible && empty) {
      empty.remove();
    }
  };

  const initFilters = (root) => {
    root.querySelectorAll('#items-grid:not([data-aurora-filtered])').forEach((grid) => {
      grid.dataset.auroraFiltered = '';
      applyFilters(grid.closest('[id^="shopify-section-"]') || document);
    });
  };

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip-group]');
    if (!chip) return;
    const group = chip.dataset.chipGroup;
    const value = chip.dataset.chipValue;
    const url = new URL(window.location.href);
    let selected = (url.searchParams.get(group) || '').split(',').filter(Boolean);
    if (!value) selected = [];
    else if (selected.includes(value)) selected = selected.filter((v) => v !== value);
    else selected.push(value);
    if (selected.length) url.searchParams.set(group, selected.join(','));
    else url.searchParams.delete(group);
    window.history.replaceState(window.history.state, '', url);
    applyFilters(chip.closest('[id^="shopify-section-"]') || document);
  });

  // The theme re-renders the grid after sort/filter changes; re-apply then.
  new MutationObserver(() => initFilters(document)).observe(document.documentElement, { childList: true, subtree: true });

  /* ---------- Free-delivery notice: refresh after the cart changes ---------- */
  document.addEventListener('neone:cart:items-changed', () => {
    const ids = new Set([...document.querySelectorAll('.aurora-delivery[data-section-id]')].map((el) => el.dataset.sectionId));
    ids.forEach(async (sectionId) => {
      try {
        const url = `${window.location.pathname}${window.location.search ? `${window.location.search}&` : '?'}section_id=${encodeURIComponent(sectionId)}`;
        const text = await (await fetch(url)).text();
        const html = new DOMParser().parseFromString(text, 'text/html');
        document.querySelectorAll(`.aurora-delivery[data-section-id="${sectionId}"]`).forEach((el) => {
          const source = html.getElementById(el.id);
          if (source) el.replaceWith(source);
        });
      } catch (e) { /* keep the current notice */ }
    });
  });

  /* ---------- Frequently bought together ---------- */
  const formatMoney = (cents, format) => {
    const group = (value, decimals, thousands, decimal) => {
      const [whole, fraction] = (value / 100).toFixed(decimals).split('.');
      return whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + (fraction ? decimal + fraction : '');
    };
    return (format || 'Rs. {{amount}}').replace(/\{\{\s*(\w+)\s*\}\}/, (match, key) => {
      if (key === 'amount_no_decimals') return group(cents, 0, ',', '.');
      if (key === 'amount_with_comma_separator') return group(cents, 2, '.', ',');
      if (key === 'amount_no_decimals_with_comma_separator') return group(cents, 0, '.', ',');
      return group(cents, 2, ',', '.');
    });
  };

  const updateFbt = (box) => {
    let total = 0;
    let compare = 0;
    let count = 0;
    box.querySelectorAll('input[data-variant-id]').forEach((input) => {
      if (!input.checked) return;
      total += Number(input.dataset.price);
      compare += Number(input.dataset.compare);
      count += 1;
    });
    const format = box.dataset.moneyFormat;
    box.querySelector('[data-fbt-total]').textContent = formatMoney(total, format);
    box.querySelector('[data-fbt-compare]').textContent = compare > total ? formatMoney(compare, format) : '';
    box.querySelector('[data-fbt-add]').disabled = count === 0;
  };

  document.addEventListener('change', (e) => {
    const box = e.target.closest('[data-aurora-fbt]');
    if (box) updateFbt(box);
  });

  document.addEventListener('click', async (e) => {
    const button = e.target.closest('[data-fbt-add]');
    if (!button) return;
    const box = button.closest('[data-aurora-fbt]');
    const items = [...box.querySelectorAll('input[data-variant-id]:checked')].map((input) => ({
      id: Number(input.dataset.variantId),
      quantity: 1
    }));
    if (!items.length) return;

    const error = box.querySelector('[data-fbt-error]');
    error.hidden = true;
    button.disabled = true;
    button.classList.add('is-loading');

    const store = (name) => (window.Alpine && window.Alpine.store(name)) || null;
    const helper = store('xCartHelper');
    try {
      if (helper && helper.waitForCartUpdate) await helper.waitForCartUpdate();
      window.updatingCart = true;
      const sections = helper ? helper.getSectionsToRender().map((section) => section.id) : [];
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items, sections })
      });
      const data = await response.json();
      if (!response.ok || data.status) throw new Error(data.description || data.message || 'Could not add to cart');

      if (helper && data.sections) helper.reRenderSections(data.sections);
      const noti = store('xCartNoti');
      const miniCart = store('xMiniCart');
      if (noti && noti.enable) noti.setItem(data);
      else if (miniCart) miniCart.openCart();
      else window.location.href = `${window.Shopify.routes.root}cart`;
      document.dispatchEvent(new CustomEvent('neone:cart:items-changed'));
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    } finally {
      window.updatingCart = false;
      button.disabled = false;
      button.classList.remove('is-loading');
    }
  });

  /* ---------- Coupon strip: tap to copy ---------- */
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(field);
      field.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      field.remove();
      return ok;
    }
  };
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-aurora-copy]');
    if (!button) return;
    const hint = button.querySelector('.aurora-coupon__hint');
    if (!(await copyText(button.dataset.auroraCopy)) || !hint) return;
    if (!button.dataset.hint) button.dataset.hint = hint.textContent;
    hint.textContent = button.dataset.copied || 'Copied!';
    button.classList.add('is-copied');
    clearTimeout(button._auroraTimer);
    button._auroraTimer = setTimeout(() => {
      hint.textContent = button.dataset.hint;
      button.classList.remove('is-copied');
    }, 2000);
  });

  /* ---------- Product video: load and play only when tapped ---------- */
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-aurora-video-play]');
    if (!button) return;
    const frame = button.parentElement;
    const video = frame.querySelector('video[data-aurora-video-src]');
    if (!video) return;
    document.querySelectorAll('.aurora-pvideo__video').forEach((other) => { if (other !== video && !other.paused) other.pause(); });
    if (!video.getAttribute('src')) video.src = video.dataset.auroraVideoSrc;
    video.controls = true;
    frame.classList.add('is-playing');
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => {});
  });

  /* ---------- Collection banner: artwork for filtered views (?type=sticks, ?pack=6,12) ---------- */
  const bannerRuleMatches = (rule, params) => rule.split('&').every((part) => {
    const [key, list] = part.split('=').map((x) => (x || '').trim().toLowerCase());
    if (!key || !list) return false;
    const allowed = list.split(',').map((v) => v.trim()).filter(Boolean);
    const selected = (params.get(key) || '').toLowerCase().split(',').map((v) => v.trim()).filter(Boolean);
    return selected.length > 0 && selected.every((v) => allowed.includes(v));
  });
  const syncBanners = () => {
    const params = new URLSearchParams(window.location.search);
    document.querySelectorAll('.aurora-banner--has-alts').forEach((banner) => {
      let found = null;
      banner.querySelectorAll('[data-aurora-banner-alt]').forEach((alt) => {
        const hit = !found && bannerRuleMatches(alt.dataset.auroraBannerAlt, params);
        alt.hidden = !hit;
        if (hit) found = alt;
      });
      banner.classList.toggle('has-alt-match', Boolean(found));
    });
  };
  syncBanners();
  window.addEventListener('popstate', syncBanners);
  document.addEventListener('click', (e) => { if (e.target.closest('[data-chip-group]')) setTimeout(syncBanners, 0); });

  /* ---------- Google reviews: load from the review scraper feed (/api/reviews) ---------- */
  const timeAgo = (iso) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (!isFinite(days)) return '';
    if (days < 1) return 'today';
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  };
  const loadReviewFeed = async (url) => {
    const key = `aurora-greviews:${url}`;
    try {
      const cached = JSON.parse(window.sessionStorage.getItem(key) || 'null');
      if (cached && Date.now() - cached.at < 3600000) return cached.data;
    } catch (e) { /* storage unavailable */ }
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Review feed returned ${response.status}`);
    const data = await response.json();
    try { window.sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch (e) { /* storage unavailable */ }
    return data;
  };
  const renderReviewFeed = async (section) => {
    if (section.dataset.feedDone) return;
    section.dataset.feedDone = '1';
    let data;
    try {
      data = await loadReviewFeed(section.dataset.auroraGreviewsFeed);
    } catch (err) {
      return; // keep the Review blocks
    }
    const minStars = Number(section.dataset.minStars || 1);
    const max = Number(section.dataset.max || 12);
    const reviews = (data.reviews || [])
      .filter((r) => (r.review_text || '').trim() && Number(r.rating) >= minStars)
      .slice(0, max);
    const summary = section.querySelector('.aurora-greviews__summary');
    if (summary && Number(data.rating) > 0) {
      section.querySelector('[data-greviews-rating]').textContent = Number(data.rating).toFixed(1);
      const total = Number(data.totalReviews) || 0;
      const label = section.dataset.totalLabel || '';
      if (total > 0 && label) section.querySelector('[data-greviews-total]').textContent = ` · ${label.replace('[count]', total)}`;
      summary.hidden = false;
    }
    if (!reviews.length) return;
    const track = section.querySelector('.aurora-reviews__track');
    const showAvatar = section.dataset.avatar === 'true';
    const showPhotos = section.dataset.photos === 'true';
    track.innerHTML = reviews.map((r) => {
      const stars = Math.round(Number(r.rating) || 0);
      const name = escapeHtml(r.author_name || 'Google user');
      const when = escapeHtml(timeAgo(r.published_at));
      const photo = showPhotos && r.author_photo_url
        ? `<img class="aurora-greviews__photo" src="${escapeHtml(r.author_photo_url)}" alt="" width="36" height="36" loading="lazy" referrerpolicy="no-referrer">`
        : `<span class="aurora-greviews__avatar" aria-hidden="true">${escapeHtml((r.author_name || 'G').trim().charAt(0).toUpperCase())}</span>`;
      const head = showAvatar
        ? `<div class="aurora-greviews__head">${photo}<span><strong>${name}</strong>${when ? `<br><small>${when}</small>` : ''}</span></div>`
        : '';
      const foot = showAvatar ? '' : `<p class="aurora-greviews__author"><strong>${name}</strong>${when ? ` · ${when}` : ''}</p>`;
      return `<article class="aurora-reviews__item aurora-greviews__card">${head}<p class="aurora-greviews__stars" aria-label="${stars} out of 5 stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</p><p class="aurora-greviews__text">${escapeHtml(r.review_text)}</p>${foot}</article>`;
    }).join('');
    section.classList.add('aurora-greviews--feed');
    initReviewMore(section);
  };
  const initReviewMore = (scope = document) => {
    scope.querySelectorAll('.aurora-greviews__text').forEach((text) => {
      if (text.dataset.moreReady || text.scrollHeight <= text.clientHeight + 2) return;
      text.dataset.moreReady = '1';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'aurora-greviews__more';
      button.textContent = 'Read more';
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const open = text.classList.toggle('is-open');
        button.textContent = open ? 'Show less' : 'Read more';
        button.setAttribute('aria-expanded', String(open));
      });
      text.after(button);
    });
  };
  const initReviewFeeds = (scope = document) => {
    const sections = scope.querySelectorAll('[data-aurora-greviews-feed]');
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) { sections.forEach(renderReviewFeed); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { io.unobserve(entry.target); renderReviewFeed(entry.target); }
    }), { rootMargin: '600px 0px' });
    sections.forEach((section) => io.observe(section));
  };

  /* ---------- Init ---------- */
  const init = (scope = document) => {
    scope.querySelectorAll('[data-aurora-pincode]').forEach(initPincode);
    initRerender(scope);
    initFilters(scope);
    initReviewFeeds(scope);
    initReviewMore(scope);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
  document.addEventListener('shopify:section:load', (e) => init(e.target));
})();
