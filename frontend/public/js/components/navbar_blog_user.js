document.addEventListener("DOMContentLoaded", () => {

  // 1️⃣ Cargar navbar
  fetch("/frontend/public/views/components/navbar_blog_client.html")
    .then(res => {
      if (!res.ok) throw new Error("Error cargando navbar");
      return res.text();
    })
    .then(html => {
      document.getElementById("navbar-root").innerHTML = html;

      // 2️⃣ Activar interacciones
      initNavbar();
    })
    .catch(err => console.error(err));
});

// ===============================
// FUNCIONES DEL NAVBAR
// ===============================
function initNavbar() {

  const navbar = document.querySelector(".navbar__index");
  const menu = document.querySelector(".navbar__link__index");
  const userBtn = document.querySelector(".navbar__link__ONE__index");
  const userMenu = document.querySelector(".menu__inside");

  if (!navbar || !menu) return;

  // 🔥 Botón hamburguesa
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "navbar__toggle";
  toggleBtn.innerHTML = "☰";
  navbar.querySelector(".navbar__container").prepend(toggleBtn);

  // Abrir / cerrar menú principal
  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("is-active");
  });

  // Abrir / cerrar menú usuario
  if (userBtn && userMenu) {
    userBtn.addEventListener("click", e => {
      e.preventDefault();
      userMenu.classList.toggle("is-active");
    });
  }

  // Cerrar al hacer click fuera
  document.addEventListener("click", e => {
    if (!navbar.contains(e.target)) {
      menu.classList.remove("is-active");
      userMenu?.classList.remove("is-active");
    }
  });
}



document.addEventListener("DOMContentLoaded", function () {
  const shareSection = document.querySelector(".navbar__index");

  if (shareSection) {
    fetch("/frontend/public/views/components/navbar_blog_user.html")
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
