
// === Overlay Preview ===
function expandImage(el) {
  try {
    var img = el.querySelector('img');
    if (!img) return;
    var overlay = document.getElementById('overlay');
    var overlayImg = document.getElementById('overlayImg');
    if (!overlay || !overlayImg) return;
    overlayImg.src = img.src;
    overlay.classList.add('show');
  } catch (e) { console.error('expandImage error', e); }
}
function hideOverlay() {
  var overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('show');
}

// === Theme Toggle ===
function toggleLightMode() {
  document.body.classList.toggle('light-mode');
}

// === Contact Modal ===
function showContact() {
  var modal = document.getElementById('contactModal');
  var blur = document.getElementById('pageBlur');
  if (blur) blur.classList.add('show');
  if (modal) modal.classList.add('show');
}
function closeContact() {
  var modal = document.getElementById('contactModal');
  var blur = document.getElementById('pageBlur');
  if (modal) modal.classList.remove('show');
  if (blur) blur.classList.remove('show');
}

// === Review Modal ===
function openReview(cardEl) {
  var modal = document.getElementById('reviewModal');
  var blur = document.getElementById('pageBlur');
  if (!modal) return;
  // Username
  var nameEl = cardEl.querySelector('.username');
  var username = nameEl ? nameEl.textContent.trim() : 'User';
  // Stars (copy HTML of the speechbox's stars)
  var starsEl = cardEl.querySelector('.speechbox');
  var starsHTML = starsEl ? starsEl.innerHTML : '';
  // Avatar (from background-image style)
  var picEl = cardEl.querySelector('.profile-pic');
  var bg = picEl ? (picEl.style.backgroundImage || '') : '';
  var match = bg.match(/url\(['"]?(.*?)['"]?\)/);
  var avatarUrl = match ? match[1] : '';

  var reviewText = cardEl.getAttribute('data-review') || '';

  var avatarNode = modal.querySelector('.review-avatar');
  var starsNode  = modal.querySelector('.review-stars');
  var userNode   = modal.querySelector('.review-username');
  var textNode   = modal.querySelector('.review-text');

  if (avatarNode) avatarNode.style.backgroundImage = avatarUrl ? "url('" + avatarUrl + "')" : '';
  if (starsNode)  starsNode.innerHTML = starsHTML;
  if (userNode)   userNode.textContent = username + '’s review:';
  if (textNode)   textNode.textContent = reviewText || 'This user has not added a review yet.';

  if (blur) blur.classList.add('show');
  modal.classList.add('show');
}
function closeReview() {
  var modal = document.getElementById('reviewModal');
  var blur = document.getElementById('pageBlur');
  if (modal) modal.classList.remove('show');
  if (blur) blur.classList.remove('show');
}

// === Accessibility & UX Helpers ===
function setupNavAccessibility() {
  var items = document.querySelectorAll('.nav-item[role="button"]');
  items.forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });
}
function setupModalOutsideClick() {
  var modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeContact();
  });
}
function setupReviewOutsideClick() {
  var modal = document.getElementById('reviewModal');
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeReview();
  });
}
function setupStaggeredHover() {
  var gameCards = document.querySelectorAll('.grid .game');
  gameCards.forEach(function(el, i) { el.style.setProperty('--i', i % 12); });
  var iconCards = document.querySelectorAll('.icon-grid .icon-game');
  iconCards.forEach(function(el, i) { el.style.setProperty('--i', i % 12); });
}
// Keep function for compatibility, but it does nothing since blur-up CSS is removed
function setupBlurUp() { /* no-op */ }

// Make profile pics clickable
function setupReviewOpeners() {
  var cards = document.querySelectorAll('.profile-card');
  cards.forEach(function(card) {
    var pic = card.querySelector('.profile-pic');
    var target = pic || card;
    target.setAttribute('role', 'button');
    target.setAttribute('tabindex', '0');
    target.addEventListener('click', function() { openReview(card); });
    target.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReview(card); }
    });
  });
}

// Global ESC handler
\1
    closeTerms();}
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  setupNavAccessibility();
  setupModalOutsideClick();
  setupReviewOutsideClick();
  setupStaggeredHover();
  setupBlurUp();
  setupReviewOpeners();
});
document.addEventListener('keydown', handleGlobalEsc);


function showTerms() {
  var modal = document.getElementById('termsModal');
  var blur = document.getElementById('pageBlur');
  if (blur) blur.classList.add('show');
  if (modal) modal.classList.add('show');
}
function closeTerms() {
  var modal = document.getElementById('termsModal');
  var blur = document.getElementById('pageBlur');
  if (modal) modal.classList.remove('show');
  if (blur) blur.classList.remove('show');
}


function setupTermsOutsideClick() {
  var modal = document.getElementById('termsModal');
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeTerms();
  });
}
document.addEventListener('DOMContentLoaded', setupTermsOutsideClick);

