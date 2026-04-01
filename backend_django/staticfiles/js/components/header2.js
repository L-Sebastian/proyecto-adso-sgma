document.addEventListener("DOMContentLoaded", function () {

    // 1. Seleccionar el contenedor del header
    const headerContainer = document.querySelector('.header__index__welcome');

    // 2. Verificar si existe en el DOM
    if (headerContainer) {

        // Ruta del archivo HTML del header
        // SUGERENCIA: Asegúrate de que esta ruta sea correcta en tu entorno de servidor.
        const headerURL = '/static/views/components/header_2.html';

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
                // Se ajusta el fallback a 'index.html' como un ejemplo más común para la página de inicio.
                const currentPage = window.location.pathname.split("/").pop() || "index.html";

                // Seleccionar los enlaces dentro del header (ajusta la clase según tu HTML)
                // NOTA: En el HTML proporcionado (header_2.html) no hay enlaces con la clase ".header_2__link".
                // Esta lógica solo funcionará si añades enlaces con esa clase.
                const headerLinks = headerContainer.querySelectorAll(".header_2__link");

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