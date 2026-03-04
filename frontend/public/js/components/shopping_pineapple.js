document.addEventListener("DOMContentLoaded", function () {

    // 1. Seleccionar el contenedor de la barra de navegación (NAVBAR)
    // CAMBIO CLAVE 1: Usar la clase del contenedor de la barra de navegación.
    const headerContainer = document.querySelector('.main-content-shopping-pineapple');

    // 2. Verificar si existe en el DOM
    if (headerContainer) {

        // Ruta del archivo HTML del header
        const headerURL = '/frontend/public/views/components/shopping_pineapple.html';

        // 3. Cargar el contenido del header
        fetch(headerURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {

                // Insertar el contenido en el contenedor
                headerContainer.innerHTML = data;

                // ================ LÓGICA PARA RESALTAR ENLACE ACTIVO ================

                // Obtener el nombre de la página actual
                const currentPage = window.location.pathname.split("/").pop() || "index.html";

                // Seleccionar los enlaces dentro del header 
                // CAMBIO CLAVE 2: Usar la clase correcta de tus enlaces.
                const headerLinks = headerContainer.querySelectorAll(".navbar__link-shopping");

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