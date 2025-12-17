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
    const navbarPath = '/frontend/public/views/components/navbar_profile.html';
    const bodyPath = '/frontend/public/views/components/edit_profile2.html';
    const footerPath = '/frontend/public/views/components/footer.html';


    // Cargamos el header en el div con ID 'header-placeholder'
    loadComponent(headerPath, 'header-placeholder');

    // Cargamos la navbar en el div con ID 'navbar-placeholder'
    loadComponent(navbarPath, 'navbar-placeholder');

    loadComponent(bodyPath, 'body-placeholder');

    loadComponent(footerPath, 'footer-placeholder');



});

// ==================== ESTADO DEL FORMULARIO ==================== 
const formData = {
    firstName: 'Juan',
    secondName: 'Antonio',
    firstLastName: 'de la Cruz',
    secondLastName: '',
    email: 'juandelosantoscruz11@gmail.com',
    department: 'Risaralda',
    address: 'Calle 18 #3-60, Pereira'
};

// ==================== ELEMENTOS DEL DOM ==================== 
const firstNameInput = document.getElementById('firstName');
const secondNameInput = document.getElementById('secondName');
const firstLastNameInput = document.getElementById('firstLastName');
const secondLastNameInput = document.getElementById('secondLastName');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const addressInput = document.getElementById('address');
const profileName = document.querySelector('.profile-name');
const backBtn = document.getElementById('backBtn');
const saveBtn = document.getElementById('saveBtn');
const deptBtn = document.getElementById('deptBtn');
const settingsBtn = document.getElementById('settingsBtn');
const userMenuBtn = document.getElementById('userMenuBtn');

// ==================== INICIALIZACIÓN ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    attachEventListeners();
    updateProfileName();
});

// ==================== FUNCIONES PRINCIPALES ==================== 

/**
 * Inicializa los valores del formulario desde el objeto formData
 */
function initializeForm() {
    firstNameInput.value = formData.firstName;
    secondNameInput.value = formData.secondName;
    firstLastNameInput.value = formData.firstLastName;
    secondLastNameInput.value = formData.secondLastName;
    emailInput.value = formData.email;
    departmentInput.value = formData.department;
    addressInput.value = formData.address;
}

/**
 * Adjunta los event listeners a los elementos interactivos
 */
function attachEventListeners() {
    // Listeners para cambios en los inputs
    firstNameInput.addEventListener('change', handleInputChange);
    secondNameInput.addEventListener('change', handleInputChange);
    firstLastNameInput.addEventListener('change', handleInputChange);
    secondLastNameInput.addEventListener('change', handleInputChange);
    emailInput.addEventListener('change', handleInputChange);
    departmentInput.addEventListener('change', handleInputChange);
    addressInput.addEventListener('change', handleInputChange);

    // Listeners para actualizar el nombre en tiempo real
    firstNameInput.addEventListener('input', updateProfileName);
    secondNameInput.addEventListener('input', updateProfileName);
    firstLastNameInput.addEventListener('input', updateProfileName);

    // Listeners para los botones
    backBtn.addEventListener('click', handleBackClick);
    saveBtn.addEventListener('click', handleSaveProfile);
    deptBtn.addEventListener('click', handleDepartmentChange);
    settingsBtn.addEventListener('click', handleSettings);
    userMenuBtn.addEventListener('click', handleUserMenu);
}

/**
 * Maneja los cambios en los inputs del formulario
 */
function handleInputChange(event) {
    const { id, value } = event.target;
    
    // Mapear el id del input al nombre de la propiedad en formData
    const fieldMap = {
        'firstName': 'firstName',
        'secondName': 'secondName',
        'firstLastName': 'firstLastName',
        'secondLastName': 'secondLastName',
        'email': 'email',
        'department': 'department',
        'address': 'address'
    };

    if (fieldMap[id]) {
        formData[fieldMap[id]] = value;
    }

    console.log('Datos actualizados:', formData);
}

/**
 * Actualiza el nombre mostrado en el perfil
 */
function updateProfileName() {
    const firstName = firstNameInput.value || 'Usuario';
    const secondName = secondNameInput.value ? ' ' + secondNameInput.value : '';
    const firstLastName = firstLastNameInput.value || '';
    profileName.innerHTML = `${firstName}${secondName}<br>${firstLastName}`.trim();
}

/**
 * Maneja el click en el botón "Volver"
 */
function handleBackClick() {
    showAlert('Volviendo a la pantalla anterior...', 'info');
    console.log('Botón Volver presionado');
    // Aquí puedes agregar lógica para volver a otra página
}

/**
 * Maneja el click en el botón "Guardar"
 */
function handleSaveProfile() {
    // Validar que los campos no estén vacíos
    if (!firstNameInput.value.trim()) {
        showAlert('Por favor completa el primer nombre.', 'error');
        firstNameInput.focus();
        return;
    }

    if (!firstLastNameInput.value.trim()) {
        showAlert('Por favor completa el primer apellido.', 'error');
        firstLastNameInput.focus();
        return;
    }

    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showAlert('Por favor ingresa un correo electrónico válido.', 'error');
        emailInput.focus();
        return;
    }

    // Mostrar resumen de datos guardados
    const summary = `✓ Perfil Guardado Exitosamente

Nombre: ${firstNameInput.value} ${secondNameInput.value}
Apellido: ${firstLastNameInput.value} ${secondLastNameInput.value}
Email: ${emailInput.value}
Departamento: ${departmentInput.value}
Dirección: ${addressInput.value}`;

    showAlert(summary, 'success');
    console.log('Perfil guardado:', formData);
}

/**
 * Maneja el cambio de departamento
 */
function handleDepartmentChange() {
    const departments = [
        'Risaralda',
        'Bogotá',
        'Medellín',
        'Cali',
        'Barranquilla',
        'Cartagena',
        'Bucaramanga',
        'Santa Marta'
    ];

    const currentDept = departmentInput.value;
    const currentIndex = departments.indexOf(currentDept);
    const nextIndex = (currentIndex + 1) % departments.length;
    
    departmentInput.value = departments[nextIndex];
    formData.department = departments[nextIndex];
    
    showAlert(`Departamento cambiado a: ${departments[nextIndex]}`, 'info');
}

/**
 * Maneja el click en el botón de configuración
 */
function handleSettings() {
    showAlert('⚙️ Panel de Configuración\n\nFuncionalidad próximamente disponible', 'info');
    console.log('Configuración presionada');
}

/**
 * Maneja el click en el menú de usuario
 */
function handleUserMenu() {
    showAlert('👤 Menú de Usuario\n\nOpciones:\n- Mi Perfil\n- Cerrar Sesión\n\nFuncionalidad próximamente disponible', 'info');
    console.log('Menú de usuario presionado');
}

/**
 * Valida si un email es válido
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Muestra una alerta personalizada
 */
function showAlert(message, type = 'info') {
    // Crear contenedor de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const bgColor = type === 'success' ? '#10b981' : 
                    type === 'error' ? '#ef4444' : 
                    '#3b82f6';
    
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 450px;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.875rem;
        animation: slideInRight 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.5;
    `;

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    // Remover alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// ==================== ANIMACIONES CSS DINÁMICAS ==================== 
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ==================== FUNCIONES AUXILIARES ==================== 

/**
 * Exporta los datos del formulario como JSON
 */
function exportFormData() {
    return JSON.stringify(formData, null, 2);
}

/**
 * Descarga los datos del formulario como archivo JSON
 */
function downloadFormData() {
    const dataStr = exportFormData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'perfil-sgma.json';
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Limpia el formulario y restaura los valores por defecto
 */
function resetForm() {
    formData.firstName = 'Juan';
    formData.secondName = 'Antonio';
    formData.firstLastName = 'de la Cruz';
    formData.secondLastName = '';
    formData.email = 'juandelosantoscruz11@gmail.com';
    formData.department = 'Risaralda';
    formData.address = 'Calle 18 #3-60, Pereira';

    initializeForm();
    updateProfileName();
    showAlert('✓ Formulario restaurado a valores por defecto.', 'info');
}

/**
 * Obtiene el estado actual del formulario
 */
function getFormState() {
    return {
        ...formData,
        timestamp: new Date().toISOString()
    };
}

// ==================== CONSOLE COMMANDS ==================== 
console.log('%c=== SGMA Profile Interface v2 ===', 'color: #0d9488; font-size: 14px; font-weight: bold;');
console.log('%cComandos disponibles:', 'color: #0d9488; font-weight: bold;');
console.log('- exportFormData(): Exporta los datos del formulario como JSON');
console.log('- downloadFormData(): Descarga los datos como archivo JSON');
console.log('- resetForm(): Restaura los valores por defecto');
console.log('- getFormState(): Obtiene el estado actual del formulario');
console.log('- formData: Objeto con los datos actuales del formulario');