(function(){
  'use strict';

  // ---------- Helpers ----------
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function show(el){ if(el) el.classList.add('show'); }
  function hide(el){ if(el) el.classList.remove('show'); }

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
    var starsHTML= starsEl ? starsEl.innerHTML : '';

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
    if(starsNode)  starsNode.innerHTML = starsHTML;
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
    setupReviewOpeners();
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