document.addEventListener("DOMContentLoaded", function () {

    // 1. Seleccionar el contenedor del header
    const headerContainer = document.querySelector('.header__index__producto');

    // 2. Verificar si existe en el DOM
    if (headerContainer) {

        // Ruta del archivo HTML del header
        const headerURL = '/frontend/public/views/components/header_create_product.html';

        // 3. Cargar el contenido del header
        fetch(headerURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {

                // Insertar el contenido en el <header>
                headerContainer.innerHTML = data;


                // ================ LÓGICA PARA RESALTAR ENLACE ACTIVO ================

                // Obtener el nombre de la página actual
                const currentPage = window.location.pathname.split("/").pop() || "index.html";

                // Seleccionar los enlaces dentro del header (ajusta la clase según tu HTML)
                const headerLinks = headerContainer.querySelectorAll(".header__link");

                // Recorrer cada enlace
                headerLinks.forEach(link => {

                    // Comparar el href con la página actual
                    if (link.getAttribute("href")?.includes(currentPage)) {
                        link.classList.add("active"); // resaltar
                    }

                });

                // =====================================================================

            })
            .catch(error => console.error('Error cargando el header:', error));
    }
});