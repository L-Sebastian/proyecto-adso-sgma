document.addEventListener("DOMContentLoaded", function() {
    const navbarContainer = document.querySelector(".navbar__events");

    if (navbarContainer) {
        fetch("/frontend/public/views/components/navbar-events.html")
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
        })
        .catch(error => console.error("Error cargando el navbar:", error));
    }
});

