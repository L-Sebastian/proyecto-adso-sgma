document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content');
    if (!container) return;

    /* Agregar clase para que aplique el fondo verde del CSS */
    container.classList.add('product-vevo-page');

    fetch('/frontend/public/views/components/product_new.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initProductNew();
        })
        .catch(function (err) {
            console.error('Error cargando product_new:', err);
        });
});

/* ── Datos de productos ── */
var productos = [
    {
        id: 'fresas-01',
        name: 'Fresas',
        price: 12140,
        unit: 'lb',
        vendor: 'Finca el Porvenir',
        img: '/frontend/public/img/fresas.jpeg'
    },
    {
        id: 'uva-01',
        name: 'Uva Isabella',
        price: 5260,
        unit: 'lb',
        vendor: 'Finca el Indio',
        img: '/frontend/public/img/uvas.jpeg'
    },
    {
        id: 'naranja-01',
        name: 'Naranja Tangelo',
        price: 6400,
        unit: 'lb',
        vendor: 'Finca Imbachi',
        img: '/frontend/public/img/naranja.jpeg'
    },
    {
        id: 'ciruela-01',
        name: 'Ciruela Roja',
        price: 3600,
        unit: 'lb',
        vendor: 'Finca Imbachi',
        img: '/frontend/public/img/ciruela_roja.jpeg'
    }
];

function initProductNew() {

    var grid    = document.getElementById('productGrid');
    var btnCrear = document.getElementById('btnCrearProducto');
    var btnBack  = document.getElementById('btnGoBack');

    if (!grid) return;

    /* Renderizar cards con clases product-vevo-* */
    grid.innerHTML = productos.map(function (p) {
        return [
            '<div class="product-vevo-card" data-id="' + p.id + '">',
            '  <div class="product-vevo-card-img-box">',
            '    <img src="' + p.img + '" alt="' + p.name + '" class="product-vevo-card-img"',
            '         onerror="this.style.opacity=\'0.3\'">',
            '  </div>',
            '  <div class="product-vevo-card-body">',
            '    <span class="product-vevo-card-name">' + p.name + '</span>',
            '    <span class="product-vevo-card-price">$' + p.price.toLocaleString('es-CO') +
                 '<span class="product-vevo-card-price-unit">' + p.unit + '</span></span>',
            '    <span class="product-vevo-card-vendor">Vendido por: <strong>' + p.vendor + '</strong></span>',
            '    <button class="product-vevo-card-add-btn" data-id="' + p.id + '">',
            '      Agregar',
            '      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">',
            '        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M9 17a1 1 0 100 2 1 1 0 000-2zM15 17a1 1 0 100 2 1 1 0 000-2z"/>',
            '      </svg>',
            '    </button>',
            '  </div>',
            '</div>'
        ].join('');
    }).join('');

    /* Delegación de eventos en la grilla */
    grid.addEventListener('click', function (e) {
        var btn  = e.target.closest('.product-vevo-card-add-btn');
        var card = e.target.closest('.product-vevo-card');

        if (btn) {
            e.stopPropagation();
            var id   = btn.dataset.id;
            var prod = productos.find(function (p) { return p.id === id; });
            if (!prod) return;

            addToCart(prod, 1);

            var original = btn.innerHTML;
            btn.textContent = '✓ Agregado';
            btn.style.background = '#059669';
            setTimeout(function () {
                btn.innerHTML = original;
                btn.style.background = '';
            }, 1400);

        } else if (card) {
            window.location.href = '/frontend/public/views/views_shopping_pineapple.html';
        }
    });

    if (btnCrear) {
        btnCrear.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    if (btnBack) {
        btnBack.addEventListener('click', function () { window.history.back(); });
    }
}

function addToCart(product, qty) {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; }
    catch (e) { cart = []; }

    var found = cart.find(function (p) { return p.id === product.id; });
    if (found) { found.quantity += qty; }
    else { cart.push(Object.assign({}, product, { quantity: qty })); }

    localStorage.setItem('cart', JSON.stringify(cart));
}