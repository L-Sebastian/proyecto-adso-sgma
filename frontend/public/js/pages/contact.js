// =======================
// contacto.js
// =======================

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = this.querySelector("input[type='text']").value.trim();
  const email = this.querySelector("input[type='email']").value.trim();
  const mensaje = this.querySelector("textarea").value.trim();

  if (!nombre || !email || !mensaje) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  // Simulación de envío
  alert("Gracias por contactarnos, " + nombre + ". ¡Te responderemos pronto!");
  this.reset();
});
