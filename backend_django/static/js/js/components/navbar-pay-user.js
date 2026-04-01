
// Avatar Funcional
document.addEventListener("DOMContentLoaded", function(){

  const navbarElement = document.querySelector(".navbar__pay__user");

  if(navbarElement){

      fetch("/frontend/public/views/components/navbar-pay-user.html")
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