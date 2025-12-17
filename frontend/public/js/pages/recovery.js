/**
 * Carga un archivo HTML y lo inyecta en un elemento placeholder en el DOM.
 * @param {string} url - La ruta relativa al archivo HTML
 * @param {string} elementId - El ID del elemento donde se inyectará el contenido
 */
async function loadComponent(url, elementId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar ${url}: ${response.status}`);
        }
        const htmlContent = await response.text();

        const placeholder = document.getElementById(elementId);
        if (placeholder) {
            placeholder.innerHTML = htmlContent;
        } else {
            console.error(`No se encontró el elemento con ID: ${elementId}`);
        }
    } catch (error) {
        console.error('Fallo en la carga del componente:', error);
    }
}

/**
 * Inicializa el formulario de recuperación
 */
function initializeForm() {
    const form = document.getElementById('recoveryForm');
    
    if (form) {
        console.log('✅ Formulario de recuperación encontrado');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();

            // Validaciones
            if (!email || !telefono) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Validar teléfono (7-10 dígitos)
            const telefonoRegex = /^[0-9]{7,10}$/;
            if (!telefonoRegex.test(telefono)) {
                alert('El número de teléfono debe contener entre 7 y 10 dígitos.');
                return;
            }

            // Si todo es válido
            const recoveryData = {
                email,
                telefono
            };

            console.log('Datos de recuperación:', recoveryData);

            // Aquí puedes agregar la lógica para enviar los datos al backend
            // Por ahora, redirigimos a la página de verificación
            alert('Código enviado exitosamente. Revisa tu correo.');
            window.location.href = '/frontend/public/views/views_verification.html';
        });
    } else {
        console.error('❌ Formulario no encontrado');
    }
}

/**
 * Carga los componentes al iniciar la página
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Cargando componentes...');
    
    const headerPath = '/frontend/public/views/components/components/header_2.html';
    const bodyPath = '/frontend/public/views/components/components/recover.html';

    await loadComponent(headerPath, 'header-placeholder');
    await loadComponent(bodyPath, 'body-placeholder');
    
    console.log('✅ Componentes cargados');
    
    // Inicializar formulario después de cargar componentes
    setTimeout(initializeForm, 150);
});