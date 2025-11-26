document.addEventListener("DOMContentLoaded", function () {

    // 1. Seleccionar el contenedor del cuerpo
    const bodyContainer = document.querySelector('.footer');

    // 2. Verificar si existe en el DOM
    if (bodyContainer) {

        // Ruta del archivo HTML del cuerpo
        const bodyURL = '/frontend/public/views/components/footer.html';

        // 3. Cargar el contenido del cuerpo
        fetch(bodyURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                // Insertar el contenido en la sección
                bodyContainer.innerHTML = data;
            })
            .catch(error => console.error('Error cargando el cuerpo de la página:', error));
    }
});
