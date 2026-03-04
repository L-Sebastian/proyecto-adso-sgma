document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: el fetch cargaba login.html (que contiene .main-content-login)
       DENTRO de .main-content-login → doble anidamiento.
       Ahora se busca el contenedor padre (.main-content) y se inserta ahí,
       o si el HTML ya está en el DOM, se inicializa directamente. */

    const wrapper = document.querySelector('.main-content-login');

    if (wrapper) {
        const bodyURL = '/frontend/public/views/components/login.html';

        fetch(bodyURL)
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
                return response.text();
            })
            .then(function (html) {
                wrapper.innerHTML = html;
                attachLoginHandlers();
            })
            .catch(function (err) {
                console.error('Error cargando el cuerpo de la página:', err);
            });
    } else {
        /* Si .main-content no existe pero .main-content-login ya está en el DOM
           (renderizado estático), inicializar directamente */
        attachLoginHandlers();
    }
});

function attachLoginHandlers() {

    const form     = document.getElementById('loginForm');
    const emailEl  = document.getElementById('email');
    const passEl   = document.getElementById('password');

    if (!form || !emailEl || !passEl) return;

    /* ── Submit ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFieldErrors();

        let hasError = false;

        if (!validateEmail(emailEl.value)) {
            setFieldError(emailEl, 'Introduce un correo válido.');
            hasError = true;
        }
        if (passEl.value.trim().length < 6) {
            setFieldError(passEl, 'La contraseña debe tener al menos 6 caracteres.');
            hasError = true;
        }

        if (hasError) {
            showMessage('Por favor corrige los errores en el formulario.', 'error');
            return;
        }

        setTimeout(() => {
            window.location.href = "/frontend/public/views/index_user.html";
        }, 1000);

        showMessage('Inicio de sesión correcto. Redirigiendo...', 'success');
        /* aquí va la lógica real: fetch a la API, etc. */
    });

    /* ── Botones secundarios ── */
    var createBtn = document.getElementById('createAccountBtn');
    var recoverBtn = document.getElementById('recoverAccountBtn');

    if (createBtn) {
        createBtn.addEventListener('click', function () {
            showMessage('Formulario de creación de cuenta (pendiente).', 'info');
            window.location.href = "/frontend/public/views/views_register.html";
        });
    }

    if (recoverBtn) {
        recoverBtn.addEventListener('click', function () {
            showMessage('Recuperación de cuenta (pendiente).', 'info');
            window.location.href = "/frontend/public/views/views_recover.html";
        });
    }
}

/* ── Marcar campo con error ── */
function setFieldError(inputEl, msg) {
    const wrapper = inputEl.closest('.form-group-login');
    if (!wrapper) return;

    wrapper.classList.add('has-error');

    let help = wrapper.querySelector('.field-help');
    if (!help) {
        help = document.createElement('div');
        help.className = 'field-help';
        wrapper.appendChild(help);
    }
    help.textContent = msg;
    inputEl.setAttribute('aria-invalid', 'true');
}

/* ── Limpiar errores ── */
function clearFieldErrors() {
    document.querySelectorAll('.form-group-login.has-error').forEach(function (w) {
        w.classList.remove('has-error');
        var help = w.querySelector('.field-help');
        if (help) help.remove();
    });
    document.querySelectorAll('.form-group-login input').forEach(function (i) {
        i.removeAttribute('aria-invalid');
    });
}

/* ── Validar email ── */
function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ── Mostrar mensaje flotante ── */
function showMessage(text, type) {
    type = type || 'info';

    var existing = document.querySelector('.message-login');
    if (existing) existing.remove();

    var div = document.createElement('div');
    div.className = 'message-login ' + type;
    div.setAttribute('role', 'status');
    div.textContent = text;
    document.body.appendChild(div);

    setTimeout(function () {
        if (div && div.parentNode) div.remove();
    }, 4500);
}