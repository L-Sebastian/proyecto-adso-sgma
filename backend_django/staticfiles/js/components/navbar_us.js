document.addEventListener("DOMContentLoaded", function() {
    const navbarContainer = document.querySelector(".navbar__us");

    if (navbarContainer) {
        fetch("/static/views/components/navbar_us.html")
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
        })
        .catch(error => console.error("Error cargando el navbar:", error));
    }
});

