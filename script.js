
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
  document.getElementById("contactModal").classList.add("show");
  document.getElementById("mainContent").classList.add("blurred");
}

function closeContact() {
  document.getElementById("contactModal").classList.remove("show");
  document.getElementById("mainContent").classList.remove("blurred");
}
