document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.main-content-verification');

    if (wrapper) {

        const url = '/frontend/public/views/components/verification.html';

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar verification.html');
                return res.text();
            })
            .then(html => {
                wrapper.innerHTML = html;
                initVerification();
            })
            .catch(err => {
                console.error('Error cargando el componente de verificación:', err);
            });

    } else {
        initVerification();
    }

});


function initVerification() {

    const form = document.querySelector('.verification-form');
    if (!form) return;

    const inputs = Array.from(form.querySelectorAll('.code-input'));
    const help = document.querySelector('.field-help');
    const toast = document.querySelector('.verification-toast');

    const resendBtn = document.querySelector('.btn-resend-verification');
    const backBtn = document.querySelector('.btn-back-verification');

    if (inputs[0]) inputs[0].focus();

    inputs.forEach((input, idx) => {

        input.addEventListener('input', e => {

            const digit = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
            e.target.value = digit;

            if (digit) {
                input.classList.add('filled');
                if (idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            } else {
                input.classList.remove('filled');
            }
        });

        input.addEventListener('keydown', e => {

            if (e.key === 'Backspace' && !input.value && idx > 0) {
                inputs[idx - 1].focus();
                inputs[idx - 1].classList.remove('filled');
            }
        });

        input.addEventListener('focus', () => {
            input.select();
        });

    });

    form.addEventListener('submit', e => {

        e.preventDefault();

        const code = inputs.map(i => i.value.trim()).join('');

        /* verificar campos vacíos */
        if (inputs.some(i => i.value.trim() === '')) {
            setHelp('Debe ingresar los 6 dígitos.', true);
            inputs.forEach(i => i.classList.add('error'));
            return;
        }

        if (code !== '123456') {
            setHelp('Código incorrecto. Intente otra vez.', true);
            inputs.forEach(i => i.classList.add('error'));
            return;
        }

        clearHelp();
        inputs.forEach(i => i.classList.remove('error'));

        showToast('Código correcto. Redirigiendo...', 'success');

        setTimeout(() => {
            window.location.href = "/frontend/public/views/change_password.html";
        }, 1000);

    });

    if (resendBtn) {
        resendBtn.addEventListener('click', () => {
            showToast('Código reenviado a tu correo.', 'info');
        });
    }


    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '/frontend/public/views/views_recover.html';
        });
    }


    const setHelp = (msg, isError) => {
        if (!help) return;
        help.textContent = msg;
        if (isError) {
            help.classList.add('error');
        } else {
            help.classList.remove('error');
        }
    };


    const clearHelp = () => {
        if (!help) return;
        help.textContent = '';
        help.classList.remove('error');
    };


    const showToast = (msg, type) => {

        if (!toast) return;

        toast.textContent = msg;

        toast.className = 'verification-toast ' + (type || 'info');

        toast.offsetHeight;

        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3500);

    };

}