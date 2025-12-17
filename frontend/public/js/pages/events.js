// =======================
// events.js
// =======================

// Marcar el link activo del menú
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", function() {
    document.querySelectorAll(".nav-menu a").forEach(el => el.classList.remove("active"));
    this.classList.add("active");
  });
});

// Ajustar altura del iframe dinámicamente
function ajustarAlturaIframe() {
  const iframe = document.querySelector("#iframe-cards");
  if (iframe) {
    iframe.onload = () => {
      iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
    };
  }
}
window.onload = ajustarAlturaIframe;
