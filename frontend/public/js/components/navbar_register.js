document.addEventListener('DOMContentLoaded', function () {

    /* La vista tiene <nav class="navbar-register"></nav>
       Insertamos el contenido del componente directamente dentro de ese <nav>
       El componente ya NO tiene el <nav> wrapper para evitar doble anidamiento */
    var navContainer = document.querySelector('.navbar-register');
    if (!navContainer) return;

    var url = '/frontend/public/views/components/navbar_register.html';

    fetch(url)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (html) {
            navContainer.innerHTML = html;
        })
        .catch(function (error) {
            console.error('Error cargando navbar_register:', error);
        });
});