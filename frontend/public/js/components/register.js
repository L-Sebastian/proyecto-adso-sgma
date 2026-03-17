document.addEventListener('DOMContentLoaded', function () {


    var wrapper = document.querySelector('.register');

    if (wrapper) {
        var bodyURL = '/frontend/public/views/components/register.html';

        fetch(bodyURL)
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
                return response.text();
            })
            .then(function (data) {
                wrapper.innerHTML = data;
                initRegister();
            })
            .catch(function (error) {
                console.error('Error cargando el cuerpo de la página:', error);
            });
    } else {
        /* Si el HTML ya está en el DOM, inicializar directamente */
        initRegister();
    }
});

function initRegister() {

    var form     = document.getElementById('formRegistro');
    var formHelp = document.getElementById('formHelp');
    if (!form) return;

    /* ── Submit con validación ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearHelp();
        clearErrors();

        let nombre      = document.querySelector('.nombre');
        var telefono    = document.getElementById('telefono');
        var departamento = document.getElementById('departamento');
        var email       = document.getElementById('email');
        var password    = document.getElementById('password');

        var hasError = false;

        /* Nombre */
        if (!nombre.value.trim()) {
            setError(nombre, 'El nombre es obligatorio.');
            hasError = true;
        }

        /* Teléfono */
        if (!telefono.value.trim()) {
            setError(telefono, 'El teléfono es obligatorio.');
            hasError = true;
        } else if (!/^[0-9]{7,10}$/.test(telefono.value.trim())) {
            setError(telefono, 'Debe contener entre 7 y 10 dígitos.');
            hasError = true;
        }

        /* Departamento */
        if (!departamento.value) {
            setError(departamento, 'Selecciona un departamento.');
            hasError = true;
        }

        /* Email */
        if (!validateEmail(email.value)) {
            setError(email, 'Introduce un correo válido.');
            hasError = true;
        }

        /* Contraseña */
        if (password.value.trim().length < 6) {
            setError(password, 'La contraseña debe tener al menos 6 caracteres.');
            hasError = true;
        }

        if (hasError) {
            setHelp('Por favor corrige los errores.', 'error');
            return;
        }

        setTimeout(() => {
            window.location.href = "/frontend/public/views/index_user.html";
        })
        /* Sin errores → lógica real aquí (fetch a la API, etc.) */
        setHelp('Cuenta creada correctamente. Redirigiendo...', 'success');
    });
}

/* ── Helpers ── */
function setError(inputEl, msg) {
    var group = inputEl.closest('.register__form-group');
    if (!group) return;
    group.classList.add('has-error');
    var help = group.querySelector('.register__field-help');
    if (!help) {
        help = document.createElement('div');
        help.className = 'register__field-help';
        group.appendChild(help);
    }
    help.textContent = msg;
    inputEl.setAttribute('aria-invalid', 'true');
}

function clearErrors() {
    document.querySelectorAll('.register__form-group.has-error').forEach(function (g) {
        g.classList.remove('has-error');
        var help = g.querySelector('.register__field-help');
        if (help) help.remove();
    });
    document.querySelectorAll('.register__form-input, .register__form-select').forEach(function (i) {
        i.removeAttribute('aria-invalid');
    });
}

function setHelp(msg, type) {
    var formHelp = document.getElementById('formHelp');
    if (!formHelp) return;
    formHelp.textContent = msg;
    formHelp.className = 'register__form-help ' + (type || '');
}

function clearHelp() {
    var formHelp = document.getElementById('formHelp');
    if (!formHelp) return;
    formHelp.textContent = '';
    formHelp.className = 'register__form-help';
}

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}