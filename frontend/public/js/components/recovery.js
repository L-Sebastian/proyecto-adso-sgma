document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.main-content-recover');

    if (wrapper) {

        const bodyURL = '/frontend/public/views/components/recover.html';

        fetch(bodyURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error! status: ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                wrapper.innerHTML = data;
                initRecovery();
            })
            .catch(error => {
                console.error('Error cargando el cuerpo de la página:', error);
            });

    } else {
        initRecovery();
    }

});

function initRecovery() {

    const form = document.querySelector('.recovery-form-recover');
    const formHelp = document.querySelector('.form-help-recover');

    if (!form) return;

    form.addEventListener('submit', e => {

        e.preventDefault();

        clearHelp();
        clearErrors();

        const emailInput = form.querySelector('input[type="email"]');

        let hasError = false;

        if (!validateEmail(emailInput.value)) {
            setError(emailInput, 'Introduce un correo válido.');
            hasError = true;
        }

        if (hasError) {
            setHelp('Por favor corrige los errores.', 'error');
            return;
        }

        setHelp('Código enviado. Revisa tu correo.', 'success');

        setTimeout(() => {
            window.location.href = "/frontend/public/views/views_verification.html";
        }, 1000);

    });

    const setError = (inputEl, msg) => {

        const group = inputEl.closest('.form-group-recover');
        if (!group) return;

        group.classList.add('has-error');

        let help = group.querySelector('.field-help-recover');

        if (!help) {
            help = document.createElement('div');
            help.className = 'field-help-recover';
            group.appendChild(help);
        }

        help.textContent = msg;

        inputEl.setAttribute('aria-invalid', 'true');
    };

    const clearErrors = () => {

        const groups = document.querySelectorAll('.form-group-recover.has-error');

        groups.forEach(group => {

            group.classList.remove('has-error');

            const help = group.querySelector('.field-help-recover');

            if (help) help.remove();
        });

        const inputs = document.querySelectorAll('.form-group-recover input');

        inputs.forEach(input => {
            input.removeAttribute('aria-invalid');
        });
    };

    const setHelp = (msg, type = '') => {

        if (!formHelp) return;

        formHelp.textContent = msg;
        formHelp.className = `form-help-recover ${type}`;
    };

    const clearHelp = () => {

        if (!formHelp) return;

        formHelp.textContent = '';
        formHelp.className = 'form-help-recover';
    };

    const validateEmail = value => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

}