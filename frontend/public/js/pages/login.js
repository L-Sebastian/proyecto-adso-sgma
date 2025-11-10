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
 * Inicializa el formulario de login
 */
function initializeForm() {
    const form = document.getElementById('loginForm');
    
    if (form) {
        console.log('✅ Formulario de login encontrado');
        
        // Manejar submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validaciones
            if (!email || !password) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Validar contraseña (mínimo 6 caracteres)
            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            // Si todo es válido
            const loginData = {
                email,
                password
            };

            console.log('Datos de login:', loginData);

            // Aquí puedes agregar la lógica para enviar los datos al backend
            // Por ahora, redirigimos a la página de bienvenida
            alert('Inicio de sesión exitoso');
            window.location.href = '/frontend/public/views/views_welcome.html';
        });

        // Botón Crear Cuenta
        const createAccountBtn = document.getElementById('createAccountBtn');
        if (createAccountBtn) {
            createAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/frontend/public/views/views_register.html';
            });
        }

        // Botón Recuperar Cuenta
        const recoverAccountBtn = document.getElementById('recoverAccountBtn');
        if (recoverAccountBtn) {
            recoverAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/frontend/public/views/views_recover.html';
            });
        }
    } else {
        console.error('❌ Formulario no encontrado');
    }
}

/**
 * Carga los componentes al iniciar la página
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Cargando componentes...');
    
    const headerPath = '/frontend/public/views/components/header_2.html';
    const bodyPath = '/frontend/public/views/components/login.html';

    await loadComponent(headerPath, 'header-placeholder');
    await loadComponent(bodyPath, 'body-placeholder');
    
    console.log('✅ Componentes cargados');
    
    // Inicializar formulario después de cargar componentes
    setTimeout(initializeForm, 150);
});