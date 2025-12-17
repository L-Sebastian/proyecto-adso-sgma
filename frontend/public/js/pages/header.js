// =========================
// header.js
// =========================

// Espera a que el documento cargue completamente
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");

  // Verificamos que exista el contenedor
  if (!headerContainer) {
    console.error("No se encontró el contenedor #header-container en el DOM.");
    return;
  }

  // Cargamos el contenido del header.html
  fetch("/frontend/public/views/components/components/header.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el header.html");
      }
      return response.text();
    })
    .then(html => {
      // Insertamos el contenido del header en el div
      headerContainer.innerHTML = html;

      console.log("Header cargado correctamente");
    })
    .catch(error => {
      console.error("Error al cargar el header:", error);
    });
});
