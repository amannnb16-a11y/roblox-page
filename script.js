
function expandImage(el) {
  const imgSrc = el.querySelector("img").src;
  const overlay = document.getElementById("overlay");
  const overlayImg = document.getElementById("overlayImg");
  overlayImg.src = imgSrc;
  overlay.classList.add("show");
}

function hideOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("show");
}
