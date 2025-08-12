
function expandImage(el) {
  const imgSrc = el.querySelector("img").src;
  const overlay = document.getElementById("overlay");
  const overlayImg = document.getElementById("overlayImg");
  overlayImg.src = imgSrc;
  overlay.classList.add("show");
}

function hideOverlay() {
  document.getElementById("overlay").classList.remove("show");
}

function toggleLightMode() {
  document.body.classList.toggle("light-mode");
}

function showContact() {
  var modal = document.getElementById("contactModal");
  var blur = document.getElementById("pageBlur");
  if (blur) blur.classList.add("show");
  if (modal) modal.classList.add("show");
}

function closeContact() {
  var modal = document.getElementById("contactModal");
  var blur = document.getElementById("pageBlur");
  if (modal) modal.classList.remove("show");
  if (blur) blur.classList.remove("show");
  // Also remove any legacy blur class on main content if present
  var main = document.getElementById("mainContent");
  if (main) main.classList.remove("blurred");
}

// Accessibility: allow Enter/Space on nav items
function setupNavAccessibility() {
  var items = document.querySelectorAll('.nav-item[role="button"]');
  items.forEach(function(el) {
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        el.click();
        e.preventDefault();
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', setupNavAccessibility);


// Global ESC to close overlay/contact
\1
  closeReview();
\2
}
document.addEventListener('keydown', handleGlobalEsc);


// Click outside modal-content to close contact
function setupModalOutsideClick() {
  var modal = document.getElementById('contactModal');
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeContact();
    }
  });
}
document.addEventListener('DOMContentLoaded', setupModalOutsideClick);


// Set --i for staggered hover delays
function setupStaggeredHover() {
  var gameCards = document.querySelectorAll('.grid .game');
  gameCards.forEach(function(el, i) { el.style.setProperty('--i', i % 12); });
  var iconCards = document.querySelectorAll('.icon-grid .icon-game');
  iconCards.forEach(function(el, i) { el.style.setProperty('--i', i % 12); });
}
document.addEventListener('DOMContentLoaded', setupStaggeredHover);


// Blur-up image loader on cards
function setupBlurUp() {
  function markLoaded(img) { img.classList.add('loaded'); }
  var imgs = document.querySelectorAll('.game img, .icon-game img');
  imgs.forEach(function(img) {
    if (img.complete && img.naturalWidth > 0) {
      markLoaded(img);
    } else {
      img.addEventListener('load', function() { markLoaded(img); }, { once: true });
    }
  });
}
document.addEventListener('DOMContentLoaded', setupBlurUp);


function openReview(cardEl) {
  var modal = document.getElementById('reviewModal');
  var blur = document.getElementById('pageBlur');
  if (!modal) return;
  // Pull username
  var nameEl = cardEl.querySelector('.username');
  var username = nameEl ? nameEl.textContent.trim() : "User";
  // Pull stars (clone existing HTML from speechbox)
  var starsEl = cardEl.querySelector('.speechbox');
  var starsHTML = starsEl ? starsEl.innerHTML : '';
  // Pull avatar url from inline background-image
  var picEl = cardEl.querySelector('.profile-pic');
  var bg = picEl ? (picEl.style.backgroundImage || '') : '';
  var match = bg.match(/url\(['"]?(.*?)['"]?\)/);
  var avatarUrl = match ? match[1] : '';

  // Optional custom review via data-review attr
  var customReview = cardEl.getAttribute('data-review') || "Your review text here. Replace by adding data-review to this profile.";

  // Populate modal
  var avatarNode = modal.querySelector('.review-avatar');
  var starsNode = modal.querySelector('.review-stars');
  var userNode = modal.querySelector('.review-username');
  var textNode = modal.querySelector('.review-text');

  if (avatarNode) avatarNode.style.backgroundImage = avatarUrl ? "url('" + avatarUrl + "')" : '';
  if (starsNode) starsNode.innerHTML = starsHTML;
  if (userNode) userNode.textContent = username + "’s review:";
  if (textNode) textNode.textContent = customReview;

  if (blur) blur.classList.add('show');
  modal.classList.add('show');
}
function closeReview() {
  var modal = document.getElementById('reviewModal');
  var blur = document.getElementById('pageBlur');
  if (modal) modal.classList.remove('show');
  if (blur) blur.classList.remove('show');
}


// Click/keyboard openers for profile cards
function setupReviewOpeners() {
  var cards = document.querySelectorAll('.profile-card');
  cards.forEach(function(card) {
    var pic = card.querySelector('.profile-pic');
    if (pic) {
      pic.setAttribute('role','button');
      pic.setAttribute('tabindex','0');
      pic.addEventListener('click', function() { openReview(card); });
      pic.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReview(card); }
      });
    } else {
      // fallback: whole card clickable
      card.addEventListener('click', function() { openReview(card); });
    }
  });
}
document.addEventListener('DOMContentLoaded', setupReviewOpeners);


// Click outside review content to close
function setupReviewOutsideClick() {
  var modal = document.getElementById('reviewModal');
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) { closeReview(); }
  });
}
document.addEventListener('DOMContentLoaded', setupReviewOutsideClick);

