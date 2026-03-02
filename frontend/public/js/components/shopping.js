function formatCurrency(n) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(n);
}

function initShoppingLogic() {
    var listEl  = document.getElementById('shoppingItems');
    var emptyEl = document.getElementById('shoppingEmpty');
    var totalEl = document.getElementById('checkoutTotal');
    var payBtn  = document.getElementById('payBtn');
    var payHelp = document.getElementById('payHelp');

    if (!listEl || !totalEl || !payBtn) {
        console.error('Error: Elementos del carrito no encontrados.');
        return;
    }

    var cart = [
        {
            id: 'pina-01',
            name: 'Piña Oro Miel',
            price: 3600,
            originalPrice: 4000,
            quantity: 1,
            vendor: 'Finca el Porvenir',
            img: '/frontend/public/img/piña_g.jpg'
        }
    ];

    function discount(item) {
        return Math.round((1 - item.price / item.originalPrice) * 100);
    }

    function render() {
        listEl.innerHTML = '';
        if (!cart || cart.length === 0) {
            emptyEl.hidden = false;
            totalEl.textContent = '$0';
            payBtn.disabled = true;
            return;
        }
        emptyEl.hidden = true;
        payBtn.disabled = false;
        cart.forEach(function (item) { listEl.appendChild(createItemEl(item)); });
        updateTotal();
    }

    function createItemEl(item) {
        var pct = discount(item);
        var li = document.createElement('li');
        li.className = 'shopping__item';
        li.dataset.id = item.id;

        li.innerHTML =
            /* COLUMNA 1: imagen */
            '<img class="shopping__img" src="' + item.img + '" alt="' + item.name + '">' +

            /* COLUMNA 2: nombre → badge+precio tachado → descripción → vendedor */
            '<div class="shopping__meta">' +
                '<div class="shopping__title">' + item.name + '</div>' +
                '<div class="shopping__discount-row">' +
                    '<span class="shopping__badge">-' + pct + '%</span>' +
                    '<span class="shopping__original">' + formatCurrency(item.originalPrice) + '</span>' +
                '</div>' +
                '<a href="#" class="shopping__desc--link">Descripción</a>' +
                '<div class="shopping__desc--vendor">Vendido por: ' + item.vendor + '</div>' +
            '</div>' +

            /* COLUMNA 3: 🗑 arriba | qty+precio abajo en fila */
            '<div class="shopping__controls">' +
                '<button class="shopping__remove" data-action="remove" aria-label="Eliminar producto">🗑</button>' +
                '<div class="shopping__bottom-row">' +
                    '<div class="qty" role="group" aria-label="Cantidad">' +
                        '<button class="qty__btn" data-action="decrease" aria-label="Disminuir">−</button>' +
                        '<div class="qty__value" aria-live="polite">' + item.quantity + '</div>' +
                        '<button class="qty__btn" data-action="increase" aria-label="Aumentar">+</button>' +
                    '</div>' +
                    '<span class="shopping__price">' + formatCurrency(item.price * item.quantity) + '</span>' +
                '</div>' +
            '</div>';

        return li;
    }

    listEl.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var li     = btn.closest('.shopping__item');
        var id     = li && li.dataset.id;
        var action = btn.dataset.action;
        if (!id || !action) return;
        if (action === 'increase') changeQty(id, +1);
        if (action === 'decrease') changeQty(id, -1);
        if (action === 'remove')   removeItem(id);
    });

    function changeQty(id, delta) {
        cart = cart.map(function (p) {
            return p.id === id ? Object.assign({}, p, { quantity: Math.max(1, p.quantity + delta) }) : p;
        });
        render();
    }

    function removeItem(id) {
        cart = cart.filter(function (p) { return p.id !== id; });
        render();
    }

    function updateTotal() {
        var total = cart.reduce(function (s, p) { return s + p.price * p.quantity; }, 0);
        totalEl.textContent = formatCurrency(total);
    }

    payBtn.addEventListener('click', function () {
        if (!cart.length) return;
        if (payHelp) {
            payHelp.textContent = 'Redirigiendo al pago...';
            payHelp.className = 'shopping__pay-help success';
        }
        payBtn.disabled = true;
        setTimeout(function () {
            window.location.href = '/frontend/public/views/views_pay.html';
        }, 800);
    });

    render();
}

document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.shopping');
    if (container) {
        fetch('/frontend/public/views/components/shopping.html')
            .then(function (res) {
                if (!res.ok) throw new Error('Error ' + res.status);
                return res.text();
            })
            .then(function (html) {
                container.innerHTML = html;
                initShoppingLogic();
            })
            .catch(function (err) { console.error('Error cargando shopping:', err); });
    } else {
        initShoppingLogic();
    }
});