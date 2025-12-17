/**
 * Carga un archivo HTML y lo inyecta en un elemento placeholder en el DOM.
 * @param {string} url - La ruta relativa al archivo HTML (e.g., '/views/components/header.html').
 * @param {string} elementId - El ID del elemento donde se inyectará el contenido (e.g., 'header-placeholder').
 */
async function loadComponent(url, elementId) {
    try {
        // 1. Obtener el contenido HTML del archivo
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // 2. Inyectar el contenido en el placeholder
        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML = htmlContent;
        } else {
            console.error(`Error: No se encontró el elemento con ID: ${elementId}`);
        }
    } catch (error) {
        console.error('Fallo en la carga del componente:', error);
    }
}

// 3. Llamada principal para cargar los componentes
document.addEventListener('DOMContentLoaded', () => {
    // Definimos las rutas de tus componentes
    const headerPath = '/frontend/public/views/components/components/header_2.html';
    const navbarPath = '/frontend/public/views/components/components/navbar_register.html';
    const bodyPath = '/frontend/public/views/components/components/welcome.html';


    // Cargamos el header en el div con ID 'header-placeholder'
    loadComponent(headerPath, 'header-placeholder');

    // Cargamos la navbar en el div con ID 'navbar-placeholder'
    loadComponent(navbarPath, 'navbar-placeholder');

    loadComponent(bodyPath, 'body-placeholder');



});