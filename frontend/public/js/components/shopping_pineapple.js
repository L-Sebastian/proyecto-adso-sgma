document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content-shopping-pineapple');
    if (!container) return;

    /* Agregar la clase del componente para que apliquen los estilos */
    container.classList.add('main-content-shopping-pineapple');

    fetch('/frontend/public/views/components/shopping_pineapple.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initSP();
        })
        .catch(function (err) {
            console.error('Error cargando shopping_pineapple:', err);
        });
});

function initSP() {
    var qtyInput = document.getElementById('quantityInput');
    var btnDec   = document.getElementById('btnDecrease');
    var btnInc   = document.getElementById('btnIncrease');
    var btnAdd   = document.getElementById('btnAddToCart');
    var btnBack  = document.getElementById('btnGoBack');

    if (!qtyInput) return;

    btnDec.addEventListener('click', function () {
        var v = parseInt(qtyInput.value) || 1;
        if (v > 1) qtyInput.value = v - 1;
    });

    btnInc.addEventListener('click', function () {
        qtyInput.value = (parseInt(qtyInput.value) || 1) + 1;
    });

    btnAdd.addEventListener('click', function () {
        var qty = parseInt(qtyInput.value) || 1;
        var cart = [];
        try { cart = JSON.parse(localStorage.getItem('cart')) || []; }
        catch (e) { cart = []; }

        var product = {
            id: 'pina-01', name: 'Piña Oro Miel',
            price: 3600, originalPrice: 4000, quantity: qty,
            vendor: 'Finca el Porvenir', img: '/frontend/public/img/piña_g.jpg'
        };

        var found = cart.find(function (p) { return p.id === product.id; });
        if (found) { found.quantity += qty; } else { cart.push(product); }
        localStorage.setItem('cart', JSON.stringify(cart));

        btnAdd.querySelector('span').textContent = '✓ Agregado';
        btnAdd.style.background = '#059669';
        setTimeout(function () {
            btnAdd.querySelector('span').textContent = 'Agregar';
            btnAdd.style.background = '';
        }, 1500);
    });

    btnBack.addEventListener('click', function () { window.history.back(); });
}