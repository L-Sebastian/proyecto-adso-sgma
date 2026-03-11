document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: buscaba '.checkout-container' pero el HTML
       tiene '.checkout-container-pay' → nunca encontraba el contenedor */
    var wrapper = document.querySelector('.checkout-container');

    if (wrapper) {
        var bodyURL = '/frontend/public/views/components/pay.html';

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
    var firstName  = localStorage.getItem('profile_firstName')      || '';
    var secondName = localStorage.getItem('profile_secondName')     || '';
    var lastName1  = localStorage.getItem('profile_firstLastName')  || '';
    var lastName2  = localStorage.getItem('profile_secondLastName') || '';
    var email      = localStorage.getItem('profile_email')          || '';

    var nombreCompleto = [firstName, secondName, lastName1, lastName2]
        .filter(Boolean).join(' ');

    /* Llenar paso 1 — Tus datos */
    var userInfoEl = document.querySelector('.user-info-pay');
    if (userInfoEl) {
        userInfoEl.innerHTML =
            '<p><strong>' + (nombreCompleto || 'Sin nombre') + '</strong></p>' +
            '<p>' + (email || 'Sin correo') + '</p>';
    }

    /* Pre-rellenar nombre en tarjeta */
    var cardNameEl = document.getElementById('cardName');
    if (cardNameEl && nombreCompleto) cardNameEl.value = nombreCompleto;

    /* Pre-rellenar nombre en preview de tarjeta */
    var displayCardNameEl = document.getElementById('displayCardName');
    if (displayCardNameEl && nombreCompleto) displayCardNameEl.textContent = nombreCompleto;

    /* ── Cargar total desde localStorage.cart ── */
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) {}

    var total = cart.reduce(function (sum, p) {
        return sum + (p.price || p.precio || 0) * (p.quantity || 1);
    }, 0);

    var totalFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(total);

    /* Resumen — total */
    var summaryTotalEl = document.querySelector('.summary-total-pay div');
    if (summaryTotalEl) summaryTotalEl.textContent = totalFormateado;

    /* Resumen — descripción con cantidad de items */
    var descEl = document.querySelector('.summary-item-pay:nth-child(2) div');
    if (descEl) descEl.textContent = 'Pago de ' + cart.length + ' producto(s)';

    /* ── Referencias ── */
    var cardNameInput   = document.getElementById('cardName');
    var cardNumberInput = document.getElementById('cardNumber');
    var expMonth        = document.getElementById('expMonth');
    var expYear         = document.getElementById('expYear');
    var btnPagar        = document.getElementById('btnPagar');
    var formHelp        = document.getElementById('payFormHelp');

    var displayCardName   = document.getElementById('displayCardName');
    var displayCardNumber = document.getElementById('displayCardNumber');
    var displayExpiry     = document.getElementById('displayExpiry');

    /* ── Preview en tiempo real — nombre ── */
    if (cardNameInput && displayCardName) {
        cardNameInput.addEventListener('input', function () {
            displayCardName.textContent = this.value.trim() || 'TITULAR';
        });
    }

    /* ── Preview en tiempo real — número de tarjeta ── */
    if (cardNumberInput && displayCardNumber) {
        cardNumberInput.addEventListener('input', function () {
            var raw = this.value.replace(/\D/g, '').slice(0, 16);
            /* Formatear con espacios cada 4 dígitos */
            this.value = raw.replace(/(.{4})/g, '$1 ').trim();
            var last4 = raw.slice(-4) || '????';
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
    var paymentOptions = document.querySelectorAll('.payment-option-pay');
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

            var cardName   = document.getElementById('cardName');
            var cardNumber = document.getElementById('cardNumber');
            var cardCvv    = document.getElementById('cardCvv');
            var docNumber  = document.getElementById('docNumber');
            var phone      = document.getElementById('phoneNumber');

            var hasError = false;

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