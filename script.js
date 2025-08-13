(function(){
  'use strict';

  // ---------- Helpers ----------
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const show = el => el && el.classList.add('show');
  const hide = el => el && el.classList.remove('show');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => (
      { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]
    ));
  }
  const escapeAttr = s => String(s).replace(/"/g, "&quot;");

  function initialsFrom(name) {
    const clean = String(name||"").replace(/[^A-Za-z0-9]+/g, " ").trim();
    if (!clean) return "?";
    const p = clean.split(" ").filter(Boolean);
    return ((p[0]?.[0]||"") + (p.length>1 ? p[p.length-1][0] : "") || p[0]?.[0] || "?").toUpperCase();
  }

  function starsHTML(value) {
    const v = Number(value)||0;
    let out = "";
    for (let i=1;i<=5;i++){
      const diff = v - (i-1);
      out += `<span class="star ${diff>=1?'full':diff>=0.5?'half':'empty'}"></span>`;
    }
    return out;
  }

  // ---------- Image overlay ----------
  function expandImageFrom(el){
    const img = el.querySelector('img');
    if(!img) return;
    const overlay = $('#overlay'), overlayImg = $('#overlayImg');
    overlayImg.src = img.getAttribute('src');
    show(overlay);
  }
  function hideOverlay(){ hide($('#overlay')); }

  // ---------- Light mode with persistence ----------
  function applyStoredTheme() {
    try {
      const v = localStorage.getItem('theme');
      if (v === 'light') document.body.classList.add('light-mode');
    } catch {}
    const pressed = document.body.classList.contains('light-mode');
    const btn = $('#lightModeBtn'); if (btn) btn.setAttribute('aria-pressed', String(pressed));
  }
  function toggleLightMode(){
    const isLight = document.body.classList.toggle('light-mode');
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch {}
    const btn = $('#lightModeBtn'); if (btn) btn.setAttribute('aria-pressed', String(isLight));
  }

  // ---------- Modals (Contact / Terms) ----------
  function openModal(id){
    show($('#pageBlur')); show($('#'+id));
  }
  function closeModal(id){
    hide($('#'+id)); hide($('#pageBlur'));
  }

  // ---------- Reviews (JSON → 6 slots) ----------
  function renderProfileCard(r){
    const review   = r.review || '—';
    const username = r.username || 'User';
    const rating   = r.rating ?? 0;
    const avatar   = (r.avatar||'').trim();
    const styleBg  = avatar ? `style="background-image:url('${escapeAttr(avatar)}')"` : '';
    const initials = avatar ? '' : `<span class="initials">${escapeHtml(initialsFrom(username))}</span>`;
    return `
      <div class="profile-card" data-review="${escapeAttr(review)}" data-username="${escapeAttr(username)}" data-avatar="${escapeAttr(avatar)}">
        <div class="profile-pic" ${styleBg}>${initials}</div>
        <div class="username">${escapeHtml(username)}</div>
        <div class="speechbox">${starsHTML(rating)}</div>
      </div>`;
  }

  async function loadReviews(){
    try{
      const res = await fetch('/assets/data/reviews.json', { cache: 'no-cache' });
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      const list = Array.isArray(data.reviews) ? data.reviews.slice(0,6) : [];
      while (list.length < 6) list.push({ username:'Your Name', rating:0, review:'Add yours soon!' });
      const container = $('.profile-section');
      if(!container) return;
      container.innerHTML = list.map(renderProfileCard).join('');
    }catch(err){
      console.warn('Failed to load reviews.json; leaving any existing cards.', err);
    }
  }

  // ---------- Review modal open ----------
  function openReview(card){
    hideOverlay();
    const modal = $('#reviewModal'), blur = $('#pageBlur');
    const username = card.dataset.username || card.querySelector('.username')?.textContent?.trim() || 'User';
    const reviewText = card.getAttribute('data-review') || '—';
    const starsHTMLStr = card.querySelector('.speechbox')?.innerHTML || '';

    // avatar
    const avatarNode = modal.querySelector('.review-avatar');
    const bg = getComputedStyle(card.querySelector('.profile-pic')).backgroundImage || '';
    const m = bg.match(/url\(["']?(.*?)["']?\)/);
    const avatarUrl = m ? m[1] : '';

    avatarNode.style.backgroundImage = '';
    avatarNode.innerHTML = '';
    if (avatarUrl) {
      avatarNode.style.backgroundImage = "url('"+avatarUrl+"')";
      avatarNode.classList.add('has-avatar');
    } else {
      avatarNode.classList.remove('has-avatar');
      avatarNode.innerHTML = `<span class="initials">${escapeHtml(initialsFrom(username))}</span>`;
    }

    modal.querySelector('.review-stars').innerHTML = starsHTMLStr;
    modal.querySelector('.review-username').textContent = `${username}’s review:`;
    modal.querySelector('.review-text').textContent = reviewText;

    show(blur); show(modal);
  }

  // ---------- Global init ----------
  function init(){
    applyStoredTheme();

    // clicks
    document.addEventListener('click', (e) => {
      const t = e.target;

      // Light mode
      if (t.closest('#lightModeBtn')) { toggleLightMode(); return; }

      // Sidebar buttons
      if (t.closest('#contactBtn')) { openModal('contactModal'); return; }
      if (t.closest('#termsBtn'))   { openModal('termsModal'); return; }

      // Close buttons
      const closeAttr = t.closest('[data-close]')?.getAttribute('data-close');
      if (closeAttr) { closeModal(closeAttr); return; }

      // Overlay click to close
      if (t.closest('#overlay')) { hideOverlay(); return; }

      // Expand image from game/icon cards
      const gameThumb = t.closest('.game .thumb, .icon-game .thumb');
      if (gameThumb) { expandImageFrom(gameThumb); return; }

      // Open review from profile-card
      const card = t.closest('.profile-card');
      if (card) { openReview(card); return; }
    });

    // Close modals on outside click
    ['contactModal','termsModal','reviewModal'].forEach(id => {
      const el = $('#'+id);
      if (!el) return;
      el.addEventListener('click', (ev) => { if (ev.target === el) closeModal(id); });
    });

    // ESC closes everything
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideOverlay();
        closeModal('contactModal');
        closeModal('termsModal');
        closeModal('reviewModal');
      }
    });

    // Load reviews
    loadReviews();

    // Resilient image error fallback (SVG placeholder)
    const fallback = "data:image/svg+xml;utf8," +
      "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'>" +
      "<rect width='100%' height='100%' fill='%23cccccc'/>" +
      "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='24' font-family='Inter,sans-serif'>Image not found</text>" +
      "</svg>";
    $$('#projectsGrid img, #iconsGrid img, #moreGrid img').forEach(img => {
      img.addEventListener('error', () => { img.src = fallback; });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
