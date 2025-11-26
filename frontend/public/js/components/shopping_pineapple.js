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
    const headerPath = '/frontend/public/views/components/header.html';
    const navbarPath = '/frontend/public/views/components/navbarshopping.html';
    const bodyPath = '/frontend/public/views/components/shopping_pineapple.html';
    const footerPath = '/frontend/public/views/components/footer.html';


    // Cargamos el header en el div con ID 'header-placeholder'
    loadComponent(headerPath, 'header-placeholder');

    // Cargamos la navbar en el div con ID 'navbar-placeholder'
    loadComponent(navbarPath, 'navbar-placeholder');

    loadComponent(bodyPath, 'body-placeholder');

    loadComponent(footerPath, 'footer-placeholder');



});

        function increaseQuantity() {
            const input = document.getElementById('quantity');
            input.value = parseInt(input.value) + 1;
        }

        function decreaseQuantity() {
            const input = document.getElementById('quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }

        function addToCart() {
            const quantity = document.getElementById('quantity').value;
            alert(`Se agregaron ${quantity} unidad(es) de Piña Oro Miel al carrito.\n\nPrecio total: $${3600 * quantity}`);
        }

        function goBack() {
            window.history.back();
        }

