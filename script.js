
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
