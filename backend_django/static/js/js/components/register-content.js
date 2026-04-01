document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.register__content');
    if (!container) return;

    fetch('/frontend/public/views/components/register-content.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            /* outerHTML reemplaza el main completo con el componente */
            const temp = document.createElement('div');
            temp.innerHTML = html;
            container.replaceWith(temp.firstElementChild);
            initRegisterContent();
        })
        .catch(function (err) {
            console.error('Error cargando register-content:', err);
            initRegisterContent(); /* intentar con DOM existente */
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
    const formHelp        = document.querySelector('.formHelp');

    if (!form) return;

    /* ── Envío del formulario ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearHelp();

        const firstName  = inputFirstName  ? inputFirstName.value.trim()  : '';
        const secondName = inputSecondName ? inputSecondName.value.trim() : '';
        const firstLast  = inputFirstLast  ? inputFirstLast.value.trim()  : '';
        const secondLast = inputSecondLast ? inputSecondLast.value.trim() : '';
        const email      = inputEmail      ? inputEmail.value.trim()      : '';
        const depto      = selectDepto     ? selectDepto.value            : '';
        const address    = inputAddress    ? inputAddress.value.trim()    : '';
        const telefono   = inputTelefono   ? inputTelefono.value.trim()   : '';
        const password   = inputPassword   ? inputPassword.value          : '';

        /* ── Validaciones ── */
        if (!firstName) {
            return setHelp('El primer nombre es obligatorio.', 'error');
        }
        if (!firstLast) {
            return setHelp('El primer apellido es obligatorio.', 'error');
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setHelp('Ingresa un correo electrónico válido.', 'error');
        }
        if (!depto) {
            return setHelp('Selecciona un departamento.', 'error');
        }
        if (!address) {
            return setHelp('La direccion es obligatoria .', 'error');
        }
        if (!telefono || !/^[0-9]{7,10}$/.test(telefono)) {
            return setHelp('El teléfono debe tener entre 7 y 10 dígitos.', 'error');
        }
        if (!password || password.length < 6) {
            return setHelp('La contraseña debe tener al menos 6 caracteres.', 'error');
        }

        /* ── Guardar usuario en array (CRUD real) ── */
        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = {
            firstName,
            secondName,
            firstLastName: firstLast,
            secondLastName: secondLast,
            email,
            password, 
            departamento: depto,
            address,
            telefono
        };

        users.push(user);

        localStorage.setItem("users", JSON.stringify(users));

        setHelp('¡Cuenta creada! Redirigiendo...', 'success');

        setTimeout(function () {
            window.location.href = '/frontend/public/views/login.html';
        }, 1200);
    });

    /* ── Helpers ── */
    function setHelp(msg, type) {
        if (!formHelp) return;
        formHelp.textContent = msg;
        formHelp.className = 'register__form-help formHelp ' + (type || '');
    }

    function clearHelp() {
        if (!formHelp) return;
        formHelp.textContent = '';
        formHelp.className = 'register__form-help formHelp';
    }
}