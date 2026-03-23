// ============================================
// TOAST MODULE - Definición primero
// ============================================
const ToastModule = (function () {
    let toast = null;
    let toastIcon = null;
    let toastText = null;
    let timeoutId = null;

    function init() {
        toast = document.querySelector('.toastMessage');
        toastIcon = document.querySelector('.toastIcon');
        toastText = document.querySelector('.toastText');

        if (!toast) {
            // Crear e insertar el toast dinámicamente
            const el = document.createElement('div');
            el.className = 'toast-notification toastMessage';
            el.setAttribute('role', 'alert');
            el.setAttribute('aria-live', 'assertive');
            el.innerHTML = '<span class="toast-icon toastIcon"></span>' +
                '<span class="toast-text toastText"></span>';
            document.body.appendChild(el);
            toast = el;
            toastIcon = el.querySelector('.toastIcon');
            toastText = el.querySelector('.toastText');
        }

        // Agregar estilos si no existen
        if (!document.querySelector('#toastStyles')) {
            const styles = document.createElement('style');
            styles.id = 'toastStyles';
            styles.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    color: #333;
                    padding: 1.5rem 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    max-width: 350px;
                    border-left: 4px solid #e74c3c;
                    z-index: 10000;
                    transform: translateX(120%);
                    opacity: 0;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                
                .toast-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .toast-notification.error { border-left-color: #e74c3c; }
                .toast-notification.success { border-left-color: #10b981; }
                .toast-notification.warning { border-left-color: #f59e0b; }
                .toast-notification.info { border-left-color: #3b82f6; }
                
                .toast-icon { font-size: 2rem; line-height: 1; }
                .toast-text { font-size: 1.4rem; line-height: 1.4; flex: 1; }
                
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(120%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        return true;
    }

    function show(message, type, duration) {
        type = type || 'error';
        duration = duration || 3000;

        if (!toast) init();

        if (timeoutId) clearTimeout(timeoutId);

        const icons = { error: '❌', success: '✅', warning: '⚠️', info: 'info' };
        toastIcon.textContent = icons[type] || '⚠️';
        toastText.textContent = message;
        toast.className = 'toast-notification toastMessage ' + type;
        toast.classList.add('show');

        timeoutId = setTimeout(function () {
            toast.classList.remove('show');
            timeoutId = null;
        }, duration);
    }

    function hide() {
        if (toast) {
            toast.classList.remove('show');
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        }
    }

    return {
        init: init,
        show: show,
        hide: hide,
        error: function (msg) { show(msg, 'error'); },
        success: function (msg) { show(msg, 'success'); },
        warning: function (msg) { show(msg, 'warning'); },
        info: function (msg) { show(msg, 'info'); }
    };
})();

// ============================================
// LOGIN PRINCIPAL
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    console.log(" Inicializando login con Toast");

    // Inicializar Toast
    ToastModule.init();

    // ============================================
    // 1. CARGAR COMPONENTE HTML
    // ============================================
    const loginSection = document.querySelector(".login__content");

    if (loginSection) {
        fetch("/frontend/public/views/components/login-content.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el componente.");
                }
                return response.text();
            })
            .then(data => {
                loginSection.innerHTML = data;
                // Inicializar eventos después de cargar el HTML
                setTimeout(initLoginEvents, 100);
            })
            .catch(error => {
                console.error(" Error al cargar el componente:", error);
                initLoginEvents();
            });
    } else {
        console.warn(" No se encontró .login__content");
        initLoginEvents();
    }
});

// ============================================
// 2. FUNCIÓN PRINCIPAL DE EVENTOS
// ============================================
function initLoginEvents() {
    console.log(" Configurando eventos de login");

    // Obtener elementos del DOM
    const emailInput = document.getElementById('loginEmail') || document.querySelector('.user-input[type="email"]');
    const passwordInput = document.getElementById('loginPassword') || document.querySelector('.user-input[type="password"]');
    const loginButton = document.getElementById('loginButton') || document.querySelector('.form__login__form-button');

    console.log(" Elementos encontrados:", {
        emailInput: !!emailInput,
        passwordInput: !!passwordInput,
        loginButton: !!loginButton
    });

    // ============================================
    // 3. FUNCIÓN PARA VALIDAR FORMULARIO
    // ============================================
    function validateForm() {
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // Limpiar clases de error
        if (emailInput) emailInput.classList.remove('error');
        if (passwordInput) passwordInput.classList.remove('error');

        // Validar campos vacíos
        if (email === "") {
            if (emailInput) emailInput.classList.add('error');
            ToastModule.error(" El correo electrónico es obligatorio");
            return false;
        }

        if (password === "") {
            if (passwordInput) passwordInput.classList.add('error');
            ToastModule.error(" La contraseña es obligatoria");
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (emailInput) emailInput.classList.add('error');
            ToastModule.error(" Correo electrónico no válido");
            return false;
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            if (passwordInput) passwordInput.classList.add('error');
            ToastModule.error(" La contraseña debe tener mínimo 6 caracteres");
            return false;
        }

        return true;
    }

    // ============================================
    // 4. FUNCIÓN PARA SIMULAR LOGIN
    // ============================================
    function simulateLogin(email, password) {
        console.log(" Intentando login con:", { email, password: '******' });

        return new Promise((resolve) => {
            setTimeout(() => {
                // Para pruebas, cualquier email/password funciona
                // Puedes cambiar esta condición según necesites
                if (email === "test@test.com" && password === "123456") {
                    resolve({ success: true, message: " Inicio de sesión correcto" });
                } else {
                    // Por ahora, permitimos cualquier combinación para pruebas
                    resolve({ success: true, message: " Inicio de sesión correcto" });
                }
            }, 500);
        });
    }

    // ============================================
    // 5. MANEJAR LOGIN
    // ============================================
    function handleLogin(e) {
        if (e) e.preventDefault();

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // Mostrar mensaje de carga
        ToastModule.info(" Iniciando sesión...");

        // Simular login
        simulateLogin(email, password).then(result => {
            if (result.success) {
                // Ocultar mensaje de carga
                ToastModule.hide();
                
                // Mostrar éxito
                ToastModule.success(result.message);
                
                // Agregar clase success a inputs
                if (emailInput) emailInput.classList.add('success');
                if (passwordInput) passwordInput.classList.add('success');
                
                // Redirigir después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = "/frontend/public/views/index_user.html";
                }, 1500);
            } else {
                ToastModule.error(result.message);
            }
        });
    }

    // ============================================
    // 6. AGREGAR EVENT LISTENERS
    // ============================================

    // Botón de login
    if (loginButton) {
        // Clonar para evitar event listeners duplicados
        const newButton = loginButton.cloneNode(true);
        loginButton.parentNode.replaceChild(newButton, loginButton);
        
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(" Click en botón de login");
            handleLogin(e);
        });
        console.log(" Evento agregado al botón");
    }

    // Inputs - quitar error al escribir
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            this.classList.remove('error');
            this.classList.remove('success');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            this.classList.remove('error');
            this.classList.remove('success');
        });
        
        // Soporte para tecla Enter
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log("↵ Enter presionado");
                handleLogin(e);
            }
        });
    }

    console.log(" Login con Toast inicializado correctamente");
}

// ============================================
// 7. ESTILOS PARA INPUTS (opcional)
// ============================================
const inputStyles = document.createElement('style');
inputStyles.textContent = `
    .user-input.error {
        border-color: #e74c3c !important;
        background-color: #fff5f5 !important;
        animation: shake 0.3s ease;
    }
    
    .user-input.success {
        border-color: #10b981 !important;
        background-color: #f0fff4 !important;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(inputStyles);