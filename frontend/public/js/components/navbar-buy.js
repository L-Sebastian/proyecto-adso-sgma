document.addEventListener("DOMContentLoaded", function () {

    var navbarContainer = document.querySelector(".navbar__buy");
    if (!navbarContainer) return;

    fetch("/frontend/public/views/components/navbar-buy.html")
        .then(function (response) { return response.text(); })
        .then(function (data) {
            navbarContainer.innerHTML = data;
            cartBadgeInicializar();
            cartBadgeActualizar();
        })
        .catch(function (error) { console.error("Error cargando el navbar:", error); });
});

/* ════════════════════════════════════════════
   CARRITO — funciones globales compartidas
   ════════════════════════════════════════════ */

function cartAgregar(product, qty) {
    qty = qty || 1;
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) {}
    var found = cart.find(function (p) { return p.id === product.id; });
    if (found) { found.quantity += qty; }
    else { cart.push(Object.assign({}, product, { quantity: qty })); }
    localStorage.setItem('cart', JSON.stringify(cart));
    cartBadgeActualizar();
    cartAnimarBotón();
}

function cartConteo() {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) {}
    return cart.reduce(function (sum, p) { return sum + (p.quantity || 1); }, 0);
}

function cartBadgeInicializar() {
    if (document.getElementById('cartFloating')) return;

    var wrap = document.createElement('div');
    wrap.id = 'cartFloating';
    wrap.style.cssText = [
        'position:fixed',
        'bottom:28px',
        'right:28px',
        'z-index:9999',
        'cursor:pointer',
        'display:flex',
        'align-items:center',
        'justify-content:center'
    ].join(';');

    wrap.innerHTML = `
        <div id="cartBtn" style="
            background:#10b981;
            border-radius:50%;
            width:56px;
            height:56px;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 4px 18px rgba(16,185,129,0.45);
            transition:transform 0.2s, box-shadow 0.2s;
            position:relative;
        ">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
            </svg>

            <span id="cartBadge" style="
                position:absolute;
                top:-6px;
                right:-6px;
                background:#ef4444;
                color:#fff;
                border-radius:50%;
                min-width:20px;
                height:20px;
                padding:0 4px;
                font-size:11px;
                font-weight:700;
                display:none;
                align-items:center;
                justify-content:center;
                border:2px solid #fff;
                line-height:1;
            ">0</span>
        </div>
    `;

    document.body.appendChild(wrap);

    var btn = wrap.querySelector('#cartBtn');

    btn.addEventListener("click", function () {

        window.location.href = "/frontend/public/views/views_shopping.html";

    });

    /* Hover */
    btn.addEventListener('mouseenter', function () {
        btn.style.transform = 'scale(1.1)';
        btn.style.boxShadow = '0 6px 24px rgba(16,185,129,0.6)';
    });

    btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 4px 18px rgba(16,185,129,0.45)';
    });
}

function cartBadgeActualizar() {
    var badge = document.getElementById('cartBadge');
    if (!badge) return;
    var total = cartConteo();
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

function cartAnimarBotón() {
    var btn = document.getElementById('cartBtn');
    if (!btn) return;
    btn.style.transform = 'scale(1.25)';
    btn.style.boxShadow = '0 6px 28px rgba(16,185,129,0.7)';
    setTimeout(function () {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 4px 18px rgba(16,185,129,0.45)';
    }, 300);
}

/* Escuchar cambios desde otras pestañas */
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') cartBadgeActualizar();
});