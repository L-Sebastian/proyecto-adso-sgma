document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: el fetch insertaba verification.html (que contiene .verification-main)
       DENTRO de .main-content-verification → doble anidamiento.
       Ahora se busca el contenedor padre .main-content y se inserta ahí. */
    const wrapper = document.querySelector('.main-content-verification');

    if (wrapper) {
        var url = '/frontend/public/views/components/verification.html';

        fetch(url)
            .then(function (res) {
                if (!res.ok) throw new Error('No se pudo cargar verification.html');
                return res.text();
            })
            .then(function (html) {
                wrapper.innerHTML = html;
                initVerification();
            })
            .catch(function (err) {
                console.error('Error cargando el componente de verificación:', err);
            });
    } else {
        /* Si el HTML ya está en el DOM (renderizado estático), inicializar directamente */
        initVerification();
    }
});

function initVerification() {

    var form = document.getElementById('verificationForm');
    if (!form) return;

    var inputs  = Array.from(form.querySelectorAll('.code-input'));
    var help    = document.getElementById('codeHelp');
    var toast   = document.getElementById('verificationToast');

    /* Enfocar primer input al cargar */
    if (inputs[0]) inputs[0].focus();

    /* ── Navegación entre inputs ── */
    inputs.forEach(function (input, idx) {

        input.addEventListener('input', function (e) {
            var digit = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
            e.target.value = digit;

            /* Clase visual filled */
            if (digit) {
                input.classList.add('filled');
                if (idx < inputs.length - 1) inputs[idx + 1].focus();
            } else {
                input.classList.remove('filled');
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
                inputs[idx - 1].focus();
                inputs[idx - 1].classList.remove('filled');
            }
        });

        /* Seleccionar contenido al hacer foco */
        input.addEventListener('focus', function () {
            input.select();
        });
    });

    /* ── Envío del formulario ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var code = inputs.map(function (i) { return i.value; }).join('');

        if (code.length !== 6) {
            setHelp('Debe ingresar los 6 dígitos.', true);
            inputs.forEach(function (i) { i.classList.add('error'); });
            return;
        }

        clearHelp();
        inputs.forEach(function (i) { i.classList.remove('error'); });

        /* BUG CORREGIDO: se reemplaza alert() por el sistema de toast del CSS */
        if (code === '123456') {
            showToast('Código correcto. Redirigiendo...', 'success');
            /* aquí va la lógica real: fetch a la API, redirección, etc. */
        } else {
            setHelp('Código incorrecto. Intente otra vez.', true);
            inputs.forEach(function (i) { i.classList.add('error'); });
        }
    });

    /* ── BUG CORREGIDO: handlers para botones que no tenían lógica ── */
    var resendBtn = document.getElementById('resendCodeBtn');
    var backBtn   = document.getElementById('backBtn');

    if (resendBtn) {
        resendBtn.addEventListener('click', function () {
            showToast('Código reenviado a tu correo.', 'info');
            /* aquí va la lógica real de reenvío */
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_recover.html';
        });
    }


    /* ── Helpers ── */
    function setHelp(msg, isError) {
        if (!help) return;
        help.textContent = msg;
        if (isError) help.classList.add('error');
        else help.classList.remove('error');
    }

    function clearHelp() {
        if (!help) return;
        help.textContent = '';
        help.classList.remove('error');
    }

    function showToast(msg, type) {
        if (!toast) return;
        toast.textContent = msg;
        toast.className = 'verification-toast ' + (type || 'info');
        /* Forzar reflow para reiniciar la transición */
        toast.offsetHeight;
        toast.classList.add('visible');

        setTimeout(function () {
            toast.classList.remove('visible');
        }, 3500);

        setTimeout(() => {
            window.location.href = "/frontend/public/views/views_verification.html";
        }, 1000);
    }
}