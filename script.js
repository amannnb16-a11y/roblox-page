(function(){
  'use strict';

  // ---------- Helpers ----------
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function show(el){ if(el) el.classList.add('show'); }
  function hide(el){ if(el) el.classList.remove('show'); }

  // ---------- Reviews from JSON ----------
  // Escaping helpers (keep your page safe when inserting text)
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => (
      { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]
    ));
  }
  function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  // Build star icons (supports halves like 3.5)
  function starsHTML(value) {
    const v = Number(value) || 0;
    const out = [];
    for (let i = 1; i <= 5; i++) {
      const diff = v - (i - 1);
      let cls = "empty";
      if (diff >= 1) cls = "full";
      else if (diff >= 0.5) cls = "half";
      out.push(`<span class="star ${cls}"></span>`);
    }
    return out.join("");
  }

  // Make one profile card from a JSON record
  function renderProfileCard(r) {
    const avatar = r.avatar ? `background-image: url("${escapeAttr(r.avatar)}");` : "";
    const review = r.review || "This user has not added a review yet.";
    return `
      <div class="profile-card" data-review="${escapeAttr(review)}">
        <div class="profile-pic" style="${avatar}"></div>
        <div class="username">${escapeHtml(r.username || "User")}</div>
        <div class="speechbox">${starsHTML(r.rating)}</div>
      </div>
    `;
  }

  // Fetch /assets/data/reviews.json and populate the strip
  async function loadReviews() {
    try {
      const res = await fetch('/assets/data/reviews.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const container = qs('.profile-section');
      if (!container || !data || !Array.isArray(data.reviews)) return;

      container.innerHTML = data.reviews.map(renderProfileCard).join('');
      // After we inject new cards, attach click/keyboard handlers
      setupReviewOpeners();
    } catch (e) {
      console.warn('reviews.json not loaded; using any hard-coded cards instead.', e);
      // If JSON fails, we simply keep whatever is already in the HTML.
    }
  }

  // ---------- Overlay (image preview) ----------
  function expandImage(el){
    try {
      var img = el.querySelector('img');
      if(!img) return;
      var overlay = qs('#overlay');
      var overlayImg = qs('#overlayImg');
      if(!overlay || !overlayImg) return;
      overlayImg.src = img.src;
      show(overlay);
    } catch(e){ console.error('expandImage error', e); }
  }
  function hideOverlay(){
    var overlay = qs('#overlay');
    hide(overlay);
  }

  // ---------- Theme toggle ----------
  function toggleLightMode(){
    hideOverlay();
    document.body.classList.toggle('light-mode');
  }

  // ---------- Contact modal ----------
  function showContact(){
    hideOverlay();
    var modal = qs('#contactModal');
    var blur  = qs('#pageBlur');
    show(blur); show(modal);
  }
  function closeContact(){
    var modal = qs('#contactModal');
    var blur  = qs('#pageBlur');
    hide(modal); hide(blur);
  }

  // ---------- Terms modal ----------
  function showTerms(){
    hideOverlay();
    var modal = qs('#termsModal');
    var blur  = qs('#pageBlur');
    show(blur); show(modal);
  }
  function closeTerms(){
    var modal = qs('#termsModal');
    var blur  = qs('#pageBlur');
    hide(modal); hide(blur);
  }

  // ---------- Review modal ----------
  function openReview(cardEl){
    hideOverlay();
    var modal = qs('#reviewModal');
    var blur  = qs('#pageBlur');
    if(!modal) return;

    var nameEl   = qs('.username', cardEl);
    var username = nameEl ? nameEl.textContent.trim() : 'User';

    var starsEl  = qs('.speechbox', cardEl);
    var starsHTMLStr = starsEl ? starsEl.innerHTML : '';

    var picEl    = qs('.profile-pic', cardEl);
    var bg       = picEl ? (picEl.style.backgroundImage || '') : '';
    var match    = bg.match(/url\(['"]?(.*?)['"]?\)/);
    var avatarUrl= match ? match[1] : '';

    var reviewText = cardEl.getAttribute('data-review') || 'This user has not added a review yet.';

    var avatarNode = qs('.review-avatar', modal);
    var starsNode  = qs('.review-stars', modal);
    var userNode   = qs('.review-username', modal);
    var textNode   = qs('.review-text', modal);

    if(avatarNode) avatarNode.style.backgroundImage = avatarUrl ? "url('"+avatarUrl+"')" : '';
    if(starsNode)  starsNode.innerHTML = starsHTMLStr;
    if(userNode)   userNode.textContent = username + '’s review:';
    if(textNode)   textNode.textContent = reviewText;

    show(blur); show(modal);
  }
  function closeReview(){
    var modal = qs('#reviewModal');
    var blur  = qs('#pageBlur');
    hide(modal); hide(blur);
  }

  // ---------- Setup (runs once DOM is ready) ----------
  function setupNavAccessibility(){
    qsa('.nav-item[role="button"]').forEach(function(el){
      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
      });
    });
  }

  function setupOverlayClose(){
    var overlay = qs('#overlay');
    if(!overlay) return;
    overlay.addEventListener('click', function(){ hideOverlay(); });
  }

  function setupOutsideCloses(){
    var c = qs('#contactModal');
    if(c) c.addEventListener('click', function(e){ if(e.target === c) closeContact(); });
    var t = qs('#termsModal');
    if(t) t.addEventListener('click', function(e){ if(e.target === t) closeTerms(); });
    var r = qs('#reviewModal');
    if(r) r.addEventListener('click', function(e){ if(e.target === r) closeReview(); });
  }

  function setupReviewOpeners(){
    qsa('.profile-card').forEach(function(card){
      var pic = qs('.profile-pic', card);
      var target = pic || card;
      target.setAttribute('role','button');
      target.setAttribute('tabindex','0');
      target.addEventListener('click', function(){ openReview(card); });
      target.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openReview(card); }
      });
    });
  }

  function handleGlobalEsc(e){
    if(e.key === 'Escape'){
      hideOverlay();
      closeContact();
      closeTerms();
      closeReview();
    }
  }

  function init(){
    setupNavAccessibility();
    setupOverlayClose();
    setupOutsideCloses();

    // ← THIS is the new line that loads /assets/data/reviews.json
    loadReviews();

    document.addEventListener('keydown', handleGlobalEsc);
  }

  // Run when DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

  // Expose globals for inline onclick=... in HTML
  window.expandImage    = expandImage;
  window.hideOverlay    = hideOverlay;
  window.toggleLightMode= toggleLightMode;
  window.showContact    = showContact;
  window.closeContact   = closeContact;
  window.showTerms      = showTerms;
  window.closeTerms     = closeTerms;
  window.openReview     = openReview;
  window.closeReview    = closeReview;
})();
