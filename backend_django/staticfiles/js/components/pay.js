document.addEventListener('DOMContentLoaded', function () {

    /* BUG CORREGIDO: buscaba '.checkout-container' pero el HTML
       tiene '.checkout-container-pay' → nunca encontraba el contenedor */
    const wrapper = document.querySelector('.checkout-container');

    if (wrapper) {
        const bodyURL = '/static/views/components/pay.html';

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

    /* ── Cargar datos del usuario logeado ── */
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    let firstName = '';
    let secondName = '';
    let lastName1 = '';
    let lastName2 = '';
    let email = '';

    if (currentUser) {
        firstName  = currentUser.firstName || '';
        secondName = currentUser.secondName || '';
        lastName1  = currentUser.firstLastName || '';
        lastName2  = currentUser.secondLastName || '';
        email      = currentUser.email || '';
    }


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

                /* ── Guardar datos del resultado para result_traction ── */
                const selectedMethod = document.querySelector('.payment-option-pay.selected');
                const metodo = selectedMethod ? (selectedMethod.dataset.method || 'Tarjeta') : 'Tarjeta';

                /* Calcular total y finca desde cart */
                let cartData = [];
                try { cartData = JSON.parse(localStorage.getItem('cart')) || []; } catch (e2) {}

                const totalPago = cartData.reduce(function (sum, p) {
                    return sum + (p.price || p.precio || 0) * (p.quantity || 1);
                }, 0);

                const totalFormateado = new Intl.NumberFormat('es-CO', {
                    style: 'currency', currency: 'COP', maximumFractionDigits: 0
                }).format(totalPago);

                const fincaNombre = cartData.length > 0
                    ? (cartData[0].finca || cartData[0].nombreFinca || 'SGMA')
                    : 'SGMA';

                const now = new Date();
                const fechaStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
                    + ', ' + now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });

                const nitVal   = docNumber  && docNumber.value.trim()  ? docNumber.value.trim()  : '—';
                const telVal   = phone      && phone.value.trim()      ? phone.value.trim()      : '—';

                const paymentResult = {
                    nombre:      nombreCompleto || '—',
                    finca:       fincaNombre,
                    nit:         nitVal,
                    idTx:        Math.floor(1000 + Math.random() * 9000).toString(),
                    valor:       totalFormateado,
                    descripcion: 'Compra de productos - ' + fincaNombre.toUpperCase(),
                    ref:         '100',
                    banco:       metodo === 'pse' ? 'PSE' : 'Bancolombia',
                    telefono:    telVal,
                    fecha:       fechaStr
                };

                localStorage.setItem('payment_result', JSON.stringify(paymentResult));
                localStorage.removeItem('cart');

                /* Redirigir al resultado */
                setTimeout(function () {
                    window.location.href = '/static/views/views_result_traction.html';
                }, 800);
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