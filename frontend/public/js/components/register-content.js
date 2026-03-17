document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.register__content');
    if (!container) return;

    fetch('/frontend/public/views/components/register-content.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            container.replaceWith(temp.firstElementChild);
            initRegisterContent();
        })
        .catch(function (err) {
            console.error('Error cargando register-content:', err);
            initRegisterContent();
        });
});

function initRegisterContent() {

    const form            = document.querySelector('.formRegistro');
    const inputFirstName  = document.querySelector('.inputFirstName');
    const inputSecondName = document.querySelector('.inputSecondName');
    const inputFirstLast  = document.querySelector('.inputFirstLastName');
    const inputSecondLast = document.querySelector('.inputSecondLastName');
    const inputEmail      = document.querySelector('.inputEmail');
    const selectDepto     = document.querySelector('.selectDepartamento');
    const inputAddress    = document.querySelector('.inputAddress');
    const inputTelefono   = document.querySelector('.inputTelefono');
    const inputPassword   = document.querySelector('.inputPassword');

    if (!form) return;

    /* ── Inicializar toast ── */
    if (typeof ToastModule !== 'undefined') ToastModule.init();

    /* ── Envío del formulario ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const firstName  = inputFirstName  ? inputFirstName.value.trim()  : '';
        const secondName = inputSecondName ? inputSecondName.value.trim() : '';
        const firstLast  = inputFirstLast  ? inputFirstLast.value.trim()  : '';
        const secondLast = inputSecondLast ? inputSecondLast.value.trim() : '';
        const email      = inputEmail      ? inputEmail.value.trim()      : '';
        const depto      = selectDepto     ? selectDepto.value            : '';
        const address    = inputAddress    ? inputAddress.value.trim()    : '';
        const telefono   = inputTelefono   ? inputTelefono.value.trim()   : '';
        const password   = inputPassword   ? inputPassword.value          : '';

        /* ── Validaciones con toast ── */
        if (!firstName) {
            return toast('El primer nombre es obligatorio.', 'error');
        }
        if (!firstLast) {
            return toast('El primer apellido es obligatorio.', 'error');
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return toast('Ingresa un correo electrónico válido.', 'error');
        }
        if (!depto) {
            return toast('Selecciona un departamento.', 'error');
        }
        if (!address) {
            return toast('La dirección es obligatoria.', 'error');
        }
        if (!telefono || !/^[0-9]{7,10}$/.test(telefono)) {
            return toast('El teléfono debe tener entre 7 y 10 dígitos.', 'error');
        }
        if (!password || password.length < 6) {
            return toast('La contraseña debe tener al menos 6 caracteres.', 'error');
        }

        /* ── Guardar perfil en localStorage ── */
        localStorage.setItem('profile_firstName',      firstName);
        localStorage.setItem('profile_secondName',     secondName);
        localStorage.setItem('profile_firstLastName',  firstLast);
        localStorage.setItem('profile_secondLastName', secondLast);
        localStorage.setItem('profile_email',          email);
        localStorage.setItem('profile_departamento',   depto);
        localStorage.setItem('profile_address',        address);
        localStorage.setItem('profile_telefono',       telefono);

        toast('¡Cuenta creada exitosamente! Redirigiendo...', 'success', 1500);

        setTimeout(function () {
            window.location.href = '/frontend/public/views/login.html';
        }, 1500);
    });

    /* ── Helper: usa ToastModule si existe, si no usa formHelp ── */
    function toast(msg, type, duration) {
        if (typeof ToastModule !== 'undefined') {
            ToastModule.show(msg, type, duration || 3000);
        } else {
            /* Fallback al formHelp inline */
            const formHelp = document.querySelector('.formHelp');
            if (formHelp) {
                formHelp.textContent = msg;
                formHelp.className = 'register__form-help formHelp ' + (type || '');
            }
        }
    }
}