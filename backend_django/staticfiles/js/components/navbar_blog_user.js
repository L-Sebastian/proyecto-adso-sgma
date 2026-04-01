document.addEventListener("DOMContentLoaded", () => {

  // Cargar navbar
  fetch("/static/views/components/navbar_blog_user.html")
    .then(res => {
      if (!res.ok) throw new Error("Error cargando navbar");
      return res.text();
    })
    .then(html => {
      document.getElementById("navbar-root").innerHTML = html;

      // Activar interacciones
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

  // Botón hamburguesa
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


document.addEventListener("DOMContentLoaded", function(){

  const navbarElement = document.querySelector(".navbar__index");

  if(navbarElement){

      fetch("/static/views/components/navbar_blog_user.html")
      .then(response => response.text())
      .then(data => {

          /* Insertar navbar */
          navbarElement.innerHTML = data;

          /* Aplicar avatar DESPUÉS de insertar el HTML */
          aplicarDatosNavbar();

      })
      .catch(error => console.log("Error cargando el header", error));

  }

});

// Avatar 

function aplicarDatosNavbar() {

  const foto = localStorage.getItem('profilePhoto');

  const avatarImgs = document.querySelectorAll('[data-profile-photo]');
  const avatarSvgs = document.querySelectorAll('[data-profile-svg]');

  avatarImgs.forEach(function(img, index){

      const svg = avatarSvgs[index];

      if (foto) {
          img.src = foto;
          img.style.display = 'block';

          if (svg) svg.style.display = 'none';

      } else {

          img.style.display = 'none';

          if (svg) svg.style.display = 'block';
    }

  });

  if (typeof window.aplicarDatosPerfil === 'function') {
      window.aplicarDatosPerfil();
  }

}