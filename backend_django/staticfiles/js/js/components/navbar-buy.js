document.addEventListener("DOMContentLoaded", function () {

    var navbarContainer = document.querySelector(".navbar__buy");
    if (!navbarContainer) return;

    fetch("/frontend/public/views/components/navbar-buy.html")
        .then(function (response) { return response.text(); })
        .then(function (data) {
            navbarContainer.innerHTML = data;
            cartBadgeInicializar();
            cartBadgeActualizar();
        })
        .catch(function (error) { console.error("Error cargando el navbar:", error); });
});
