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
 * Inicializa el formulario de registro
 */
function initializeForm() {
    const form = document.getElementById('formRegistro');
    
    if (form) {
        console.log('✅ Formulario de registro encontrado');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const departamento = document.getElementById('departamento').value;
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validaciones básicas
            if (!nombre || !telefono || !departamento || !email || !password) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Validar teléfono (7-10 dígitos)
            const telefonoRegex = /^[0-9]{7,10}$/;
            if (!telefonoRegex.test(telefono)) {
                alert('El número de teléfono debe contener entre 7 y 10 dígitos.');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido.');
                return;
            }

            // Validar contraseña (mínimo 6 caracteres - ajusta según necesites)
            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            // Si todo es válido, crear objeto con los datos
            const userData = {
                nombre,
                telefono,
                departamento,
                email,
                password
            };

            console.log('Datos del usuario:', userData);

            // Aquí puedes agregar la lógica para enviar los datos al backend
            // Por ahora, redirigimos al login
            alert('Cuenta creada exitosamente');
            window.location.href = './views_login.html';
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
    
    // Rutas relativas de los componentes
    const headerPath = './components/header.html';
    const navbarPath = './components/navbar_register.html';
    const bodyPath = './components/register.html';
    const footerPath = './components/footer.html';

    // Cargar componentes
    await loadComponent(headerPath, 'header-placeholder');
    await loadComponent(navbarPath, 'navbar-placeholder');
    await loadComponent(bodyPath, 'body-placeholder');
    await loadComponent(footerPath, 'footer-placeholder');
    
    console.log('✅ Componentes cargados');
    
    // Inicializar formulario después de cargar componentes
    setTimeout(initializeForm, 150);
});