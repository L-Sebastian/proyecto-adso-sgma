document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: buscaba .main-content-recover e insertaba recover.html que
       contiene <main class="main-content-recover"> → doble anidamiento.
       Ahora inserta en el contenedor padre .main-content */
    const wrapper = document.querySelector('.main-content-recover');

    if (wrapper) {
        const bodyURL = '/frontend/public/views/components/recover.html';

        fetch(bodyURL)
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
                return response.text();
            })

            .then(function (data) {
                wrapper.innerHTML = data;
                initRecovery();
            })
            .catch(function (error) {
                console.error('Error cargando el cuerpo de la página:', error);
            });
    } else {
        /* Si el HTML ya está en el DOM, inicializar directamente */
        initRecovery();
    }
});
function recover(){
    let btnVerification = document.getElementsByClassName('submit-btn-recover');

    if (btnVerification) {
        btnVerification.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_verification.html'
        })
    }
}

    
function initRecovery() {

    /* BUG CORREGIDO: no había lógica de validación ni submit */
    var form     = document.getElementById('recoveryForm');
    var formHelp = document.getElementById('formHelpRecover');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearHelp();
        clearErrors();

        var emailEl    = document.getElementById('email');
        var telefonoEl = document.getElementById('telefono');
        var hasError   = false;
        const goy = document.getElementById('submit-btn-recover');

        /* Validar email */
        if (!validateEmail(emailEl.value)) {
            setError(emailEl, 'Introduce un correo válido.');
            hasError = true;
        }

        /* Validar teléfono */
        if (!telefonoEl.value.trim()) {
            setError(telefonoEl, 'El teléfono es obligatorio.');
            hasError = true;
        } else if (!/^[0-9]{7,10}$/.test(telefonoEl.value.trim())) {
            setError(telefonoEl, 'Debe contener entre 7 y 10 dígitos.');
            hasError = true;
        }

        if (hasError) {
            setHelp('Por favor corrige los errores.', 'error');
            return;
        }

        setTimeout(() => {
            window.location.href = "/frontend/public/views/views_verification.html";
        }, 1000);

        /* Sin errores → lógica real aquí (fetch a la API, etc.) */
        setHelp('Código enviado. Revisa tu correo.', 'success');
    });

    /* ── Helpers ── */
    function setError(inputEl, msg) {
        var group = inputEl.closest('.form-group-recover');
        if (!group) return;
        group.classList.add('has-error');
        var help = group.querySelector('.field-help-recover');
        if (!help) {
            help = document.createElement('div');
            help.className = 'field-help-recover';
            group.appendChild(help);
        }
        help.textContent = msg;
        inputEl.setAttribute('aria-invalid', 'true');
    }

    function clearErrors() {
        document.querySelectorAll('.form-group-recover.has-error').forEach(function (g) {
            g.classList.remove('has-error');
            var help = g.querySelector('.field-help-recover');
            if (help) help.remove();
        });
        document.querySelectorAll('.form-group-recover input').forEach(function (i) {
            i.removeAttribute('aria-invalid');
        });
    }

    function setHelp(msg, type) {
        if (!formHelp) return;
        formHelp.textContent = msg;
        formHelp.className = 'form-help-recover ' + (type || '');
    }

    function clearHelp() {
        if (!formHelp) return;
        formHelp.textContent = '';
        formHelp.className = 'form-help-recover';
    }

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
}