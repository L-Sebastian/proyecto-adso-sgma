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
    const bodyPath = '/frontend/public/views/components/edit_profile.html';
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
    secondName: '',
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
const profileName = document.getElementById('profileName');
const uploadBtn = document.getElementById('uploadBtn');
const editBtn = document.getElementById('editBtn');
const menuToggle = document.getElementById('menuToggle');
const userInfo = document.querySelector('.user-info');

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
    firstLastNameInput.addEventListener('input', updateProfileName);

    // Listeners para los botones
    uploadBtn.addEventListener('click', handlePhotoUpload);
    editBtn.addEventListener('click', handleEditProfile);
    menuToggle.addEventListener('click', toggleMenu);
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
    const firstLastName = firstLastNameInput.value || '';
    profileName.textContent = `${firstName} ${firstLastName}`.trim();
}

/**
 * Maneja el click en el botón "Subir Foto"
 */
function handlePhotoUpload() {
    // Crear un input file virtual
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                showAlert('Por favor selecciona un archivo de imagen válido.', 'error');
                return;
            }

            // Validar tamaño (máximo 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                showAlert('La imagen no debe superar 5MB.', 'error');
                return;
            }

            // Leer y mostrar la imagen
            const reader = new FileReader();
            reader.onload = function(event) {
                const avatarDiv = document.querySelector('.avatar');
                avatarDiv.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                showAlert('Foto actualizada correctamente.', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    fileInput.click();
}

/**
 * Maneja el click en el botón "Editar Perfil"
 */
function handleEditProfile() {
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

    // Mostrar resumen de datos
    const summary = `
Perfil Actualizado:

Nombre: ${firstNameInput.value} ${secondNameInput.value}
Apellido: ${firstLastNameInput.value} ${secondLastNameInput.value}
Email: ${emailInput.value}
Departamento: ${departmentInput.value}
Dirección: ${addressInput.value}
    `.trim();

    showAlert(summary, 'success');
    console.log('Perfil guardado:', formData);
}

/**
 * Alterna el menú móvil
 */
function toggleMenu() {
    userInfo.classList.toggle('show');
    menuToggle.classList.toggle('active');
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
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        word-wrap: break-word;
        white-space: pre-wrap;
        font-size: 0.875rem;
        animation: slideInRight 0.3s ease-out;
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
    formData.secondName = '';
    formData.firstLastName = 'de la Cruz';
    formData.secondLastName = '';
    formData.email = 'juandelosantoscruz11@gmail.com';
    formData.department = 'Risaralda';
    formData.address = 'Calle 18 #3-60, Pereira';

    initializeForm();
    updateProfileName();
    showAlert('Formulario restaurado a valores por defecto.', 'info');
}

// ==================== CONSOLE COMMANDS ==================== 
console.log('=== SGMA Profile Interface ===');
console.log('Comandos disponibles:');
console.log('- exportFormData(): Exporta los datos del formulario como JSON');
console.log('- downloadFormData(): Descarga los datos como archivo JSON');
console.log('- resetForm(): Restaura los valores por defecto');
console.log('- formData: Objeto con los datos actuales del formulario');