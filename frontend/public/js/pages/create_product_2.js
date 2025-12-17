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
    const headerPath = '/frontend/public/views/components/components/header_create_product.html';
    const navbarPath = '/frontend/public/views/components/components/navbar_create_product.html';
    const bodyPath = '/frontend/public/views/components/components/create_product_2.html';
    const footerPath = '/frontend/public/views/components/components/footer.html';


    // Cargamos el header en el div con ID 'header-placeholder'
    loadComponent(headerPath, 'header-placeholder');

    // Cargamos la navbar en el div con ID 'navbar-placeholder'
    loadComponent(navbarPath, 'navbar-placeholder');

    loadComponent(bodyPath, 'body-placeholder');

    loadComponent(footerPath, 'footer-placeholder');



});
 
 // Handle image click to upload
        document.getElementById('productImage').addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('productImage').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });

        // Volver function
        function volver() {
            if (confirm('¿Está seguro que desea volver? Los cambios no guardados se perderán.')) {
                window.history.back();
            }
        }

        // Form submit
        document.getElementById('fincaForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                nombreFinca: document.getElementById('nombreFinca').value,
                stock: document.getElementById('stock').value,
                direccionFinca: document.getElementById('direccionFinca').value,
                tipoEnvio: document.getElementById('tipoEnvio').value,
                descripcion: document.getElementById('descripcion').value
            };

            console.log('Datos de la finca:', formData);
            
            // Show success message
            alert('¡Producto publicado exitosamente!\n\n' + 
                  'Nombre Finca: ' + formData.nombreFinca + '\n' +
                  'Stock: ' + formData.stock + '\n' +
                  'Dirección: ' + formData.direccionFinca + '\n' +
                  'Tipo de Envío: ' + formData.tipoEnvio + '\n' +
                  'Descripción: ' + formData.descripcion);
            
            // Here you would normally send the data to your backend
            // fetch('/api/finca', { method: 'POST', body: JSON.stringify(formData) })
        });