function expandImage(el) {
  const img = el.querySelector('img');
  const overlay = document.getElementById('overlay');
  const overlayImg = document.getElementById('overlayImg');
  overlayImg.src = img.src;
  overlay.classList.add('show');
}

function hideOverlay() {
  document.getElementById('overlay').classList.remove('show');
}

function toggleLightMode() {
  document.body.classList.toggle('light-mode');
}
