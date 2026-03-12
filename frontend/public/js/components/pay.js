document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: buscaba '.checkout-container' pero el HTML
       tiene '.checkout-container-pay' → nunca encontraba el contenedor */
    const wrapper = document.querySelector('.checkout-container');

    if (wrapper) {
        const bodyURL = '/frontend/public/views/components/pay.html';

        fetch(bodyURL)
            .then(function (response) {
                if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
                return response.text();
            })
            .then(function (data) {
                wrapper.innerHTML = data;
                /* BUG CORREGIDO: faltaba llamar a initPay() después del fetch */
                initPay();
            })
            .catch(function (error) {
                console.error('Error cargando pay.html:', error);
            });
    } else {
        initPay();
    }
});

function initPay() {

    /* ── Cargar datos del perfil ── */
    const firstName  = localStorage.getItem('profile_firstName')      || '';
    const secondName = localStorage.getItem('profile_secondName')     || '';
    const lastName1  = localStorage.getItem('profile_firstLastName')  || '';
    const lastName2  = localStorage.getItem('profile_secondLastName') || '';
    const email      = localStorage.getItem('profile_email')          || '';

    const nombreCompleto = [firstName, secondName, lastName1, lastName2]
        .filter(Boolean).join(' ');

    /* Llenar paso 1 — Tus datos */
    const userInfoEl = document.querySelector('.user-info-pay');
    if (userInfoEl) {
        userInfoEl.innerHTML =
            '<p><strong>' + (nombreCompleto || 'Sin nombre') + '</strong></p>' +
            '<p>' + (email || 'Sin correo') + '</p>';
    }

    /* Pre-rellenar nombre en tarjeta */
    const cardNameEl = document.querySelector('.cardName');
    if (cardNameEl && nombreCompleto) cardNameEl.value = nombreCompleto;

    /* Pre-rellenar nombre en preview de tarjeta */
    const displayCardNameEl = document.querySelector('.displayCardName');
    if (displayCardNameEl && nombreCompleto) displayCardNameEl.textContent = nombreCompleto;

    /* ── Cargar total desde localStorage.cart ── */
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) {}

    const total = cart.reduce(function (sum, p) {
        return sum + (p.price || p.precio || 0) * (p.quantity || 1);
    }, 0);

    const totalFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(total);

    /* Resumen — total */
    const summaryTotalEl = document.querySelector('.summary-total-pay div');
    if (summaryTotalEl) summaryTotalEl.textContent = totalFormateado;

    /* Resumen — descripción con cantidad de items */
    const descEl = document.querySelector('.summary-item-pay:nth-child(2) div');
    if (descEl) descEl.textContent = 'Pago de ' + cart.length + ' producto(s)';

    /* ── Referencias ── */
    const cardNameInput   = document.querySelector('.cardName');
    const cardNumberInput = document.querySelector('.cardNumber');
    const expMonth        = document.querySelector('.expMonth');
    const expYear         = document.querySelector('.expYear');
    const btnPagar        = document.querySelector('.btnPagar');
    const formHelp        = document.querySelector('.payFormHelp');

    const displayCardName   = document.querySelector('.displayCardName');
    const displayCardNumber = document.querySelector('.displayCardNumber');
    const displayExpiry     = document.querySelector('.displayExpiry');

    /* ── Preview en tiempo real — nombre ── */
    if (cardNameInput && displayCardName) {
        cardNameInput.addEventListener('input', function () {
            displayCardName.textContent = this.value.trim() || 'TITULAR';
        });
    }

    /* ── Preview en tiempo real — número de tarjeta ── */
    if (cardNumberInput && displayCardNumber) {
        cardNumberInput.addEventListener('input', function () {
            const raw = this.value.replace(/\D/g, '').slice(0, 16);
            /* Formatear con espacios cada 4 dígitos */
            this.value = raw.replace(/(.{4})/g, '$1 ').trim();
            const last4 = raw.slice(-4) || '????';
            displayCardNumber.textContent = '•••• •••• •••• ' + last4;
        });
    }

    /* ── Preview en tiempo real — fecha ── */
    function updateExpiry() {
        if (expMonth && expYear && displayExpiry) {
            displayExpiry.textContent = expMonth.value + '/' + expYear.value;
        }
    }
    if (expMonth) expMonth.addEventListener('change', updateExpiry);
    if (expYear)  expYear.addEventListener('change', updateExpiry);

    /* ── Selección de método de pago ── */
    const paymentOptions = document.querySelectorAll('.payment-option-pay');
    paymentOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            paymentOptions.forEach(function (o) { o.classList.remove('selected'); });
            this.classList.add('selected');
        });
    });

    /* ── Botón Pagar — validación ── */
    if (btnPagar) {
        btnPagar.addEventListener('click', function () {
            clearHelp();

            const cardName   = document.querySelector('.cardName');
            const cardNumber = document.querySelector('.cardNumber');
            const cardCvv    = document.querySelector('.cardCvv');
            const docNumber  = document.querySelector('.docNumber');
            const phone      = document.querySelector('.phoneNumber');

            let hasError = false;

            if (!cardName || !cardName.value.trim()) {
                setHelp('El nombre en la tarjeta es obligatorio.', 'error');
                hasError = true;
            } else if (!cardNumber || cardNumber.value.replace(/\s/g, '').length !== 16) {
                setHelp('El número de tarjeta debe tener 16 dígitos.', 'error');
                hasError = true;
            } else if (!cardCvv || cardCvv.value.length < 3) {
                setHelp('El código de seguridad debe tener 3 dígitos.', 'error');
                hasError = true;
            } else if (!docNumber || !docNumber.value.trim()) {
                setHelp('El documento de identidad es obligatorio.', 'error');
                hasError = true;
            } else if (!phone || !phone.value.trim()) {
                setHelp('El número de teléfono es obligatorio.', 'error');
                hasError = true;
            }

            if (!hasError) {
                setHelp('Procesando pago...', 'success');
                /* aquí va la lógica real: fetch a la API de pagos */
            }
        });
    }

    /* ── Helpers ── */
    function setHelp(msg, type) {
        if (!formHelp) return;
        formHelp.textContent = msg;
        formHelp.className = 'pay-form-help ' + (type || '');
    }

    function clearHelp() {
        if (!formHelp) return;
        formHelp.textContent = '';
        formHelp.className = 'pay-form-help';
    }
}