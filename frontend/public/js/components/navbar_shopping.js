document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: buscaba '.navbar' e insertaba navbarshopping.html que tiene
       <nav class="navbar__container-shopping"> → doble <nav> generando doble borde.
       Ahora inserta el contenido directamente dentro del <nav class="navbar"> de la vista */
    var navContainer = document.querySelector('.navbar');
    if (!navContainer) return;

    var headerURL = '/frontend/public/views/components/navbarshopping.html';

    fetch(headerURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            navContainer.innerHTML = data;

            /* Resaltar enlace activo */
            var currentPage = window.location.pathname.split('/').pop() || 'index.html';
            var navLinks = navContainer.querySelectorAll('.navbar__link-shopping');
            navLinks.forEach(function (link) {
                if (link.getAttribute('href') && link.getAttribute('href').includes(currentPage)) {
                    link.classList.add('active');
                }
            });
        })
        .catch(function (error) {
            console.error('Error cargando el navbar:', error);
        });
});