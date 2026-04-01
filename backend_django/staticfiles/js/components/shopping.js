function formatCurrency(n) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(n);
}

function initShoppingLogic() {
    const listEl  = document.querySelector('.shoppingItems');
    const emptyEl = document.querySelector('.shoppingEmpty');
    const totalEl = document.querySelector('.checkoutTotal');
    const payBtn  = document.querySelector('.payBtn');
    const payHelp = document.querySelector('.payHelp');

    if (!listEl || !totalEl || !payBtn) {
        console.error('Error: Elementos del carrito no encontrados.');
        return;
    }

    /* ── Leer carrito desde localStorage ── */
    function cargarCart() {
        try { return JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { return []; }
    }
    function guardarCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    let cart = cargarCart();

    function discount(item) {
        let orig = item.originalPrice || item.precioOriginal;
        const price = item.price || item.precio || 0;
        if (!orig || orig <= price) return 0;
        return Math.round((1 - price / orig) * 100);
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
        /* Normalizar campos — compatibilidad con productos de buy.html */
        const nombre = item.name   || item.nombre || 'Producto';
        const precio = item.price  || item.precio || 0;
        // const unidad = item.unit   || item.tipoPeso || '';
        const finca  = item.vendor || item.finca  || '';
        const foto   = item.img    || item.foto   || '';
        let orig   = item.originalPrice || item.precioOriginal || 0;
        const qty    = item.quantity || 1;
        const pct    = discount(item);
        const idProd = item.id;

        let li = document.createElement('li');
        li.className = 'shopping__item';
        li.dataset.id = idProd;

        const discountRow = pct > 0
            ? '<div class="shopping__discount-row">' +
                '<span class="shopping__badge">-' + pct + '%</span>' +
                '<span class="shopping__original">' + formatCurrency(orig) + '</span>' +
              '</div>'
            : '';

        li.innerHTML =
            '<img class="shopping__img" src="' + foto + '" alt="' + nombre + '" onerror="this.style.opacity=0.3">' +

            '<div class="shopping__meta">' +
                '<div class="shopping__title">' + nombre + '</div>' +
                discountRow +
                '<a href="/static/views/views_shopping_pineapple.html?id=' + idProd + '" class="shopping__desc--link">Ver detalle</a>' +
                '<div class="shopping__desc--vendor">Vendido por: ' + finca + '</div>' +
            '</div>' +

            '<div class="shopping__controls">' +
                '<button class="shopping__remove" data-action="remove" aria-label="Eliminar producto">🗑</button>' +
                '<div class="shopping__bottom-row">' +
                    '<div class="qty" role="group" aria-label="Cantidad">' +
                        '<button class="qty__btn" data-action="decrease" aria-label="Disminuir">−</button>' +
                        '<div class="qty__value" aria-live="polite">' + qty + '</div>' +
                        '<button class="qty__btn" data-action="increase" aria-label="Aumentar">+</button>' +
                    '</div>' +
                    '<span class="shopping__price">' + formatCurrency(precio * qty) + '</span>' +
                '</div>' +
            '</div>';

        return li;
    }

    listEl.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        let li     = btn.closest('.shopping__item');
        let id     = li && li.dataset.id;
        let action = btn.dataset.action;
        if (!id || !action) return;
        if (action === 'increase') changeQty(id, +1);
        if (action === 'decrease') changeQty(id, -1);
        if (action === 'remove')   removeItem(id);
    });

    function changeQty(id, delta) {
        cart = cart.map(function (p) {
            return p.id === id ? Object.assign({}, p, { quantity: Math.max(1, (p.quantity || 1) + delta) }) : p;
        });
        guardarCart();
        render();
    }

    function removeItem(id) {
        cart = cart.filter(function (p) { return p.id !== id; });
        guardarCart();
        render();
    }

    function updateTotal() {
        const total = cart.reduce(function (s, p) {
            return s + (p.price || p.precio || 0) * (p.quantity || 1);
        }, 0);
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
            window.location.href = '/static/views/views_pay.html';
        }, 800);
    });

    render();
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.shopping');
    if (container) {
        fetch('/static/views/components/shopping.html')
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