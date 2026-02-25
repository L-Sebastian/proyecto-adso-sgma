document.addEventListener("DOMContentLoaded", function () {

    const navContainer = document.querySelector('.navbar-bottom-product');
    if (!navContainer) return;

    const bodyURL = '/frontend/public/views/components/navbar_create_product.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            navContainer.innerHTML = data;

            /* Aplicar nombre y foto desde localStorage */
            window.aplicarDatosPerfil();
        })
        .catch(function (error) {
            console.error('Error cargando el navbar:', error);
        });
});
