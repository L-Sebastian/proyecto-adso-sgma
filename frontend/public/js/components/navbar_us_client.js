document.addEventListener("DOMContentLoaded", () => {

  fetch("/frontend/public/views/components/navbar_us_client.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el navbar");
      }
      return response.text();
    })
    .then(html => {
      // Insertar navbar en el DOM
      document.getElementById(".navbar__index").innerHTML = html;

      // === UNA VEZ CARGADO, ACTIVAMOS FUNCIONALIDAD ===
      initNavbar();
    })
    .catch(error => {
      console.error("Error cargando navbar:", error);
    });

});

// ===============================
// FUNCIONALIDAD DEL NAVBAR
// ===============================
function initNavbar() {

  const navbar = document.querySelector(".navbar__index");
  const menu = document.querySelector(".navbar__link__index");
  const userBtn = document.querySelector(".navbar__link__ONE__index");
  const userMenu = document.querySelector(".menu__inside");

  if (!navbar || !menu) return;

  // Botón hamburguesa
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "navbar__toggle";
  toggleBtn.textContent = "☰";
  navbar.prepend(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("is-active");
  });

  // Dropdown usuario
  if (userBtn && userMenu) {
    userBtn.addEventListener("click", e => {
      e.preventDefault();
      userMenu.classList.toggle("is-active");
    });
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const shareSection = document.querySelector(".navbar__index");

  if (shareSection) {
    fetch("/frontend/public/views/components/navbar_us_client.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el componente.");
        }
        return response.text();
      })
      .then(data => {
        shareSection.innerHTML = data;
      })
      .catch(error => {
        console.error("Error al cargar el componente 'share-section':", error);
      });
  }
});
