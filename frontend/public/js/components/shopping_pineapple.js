document.addEventListener("DOMContentLoaded", function () {

    const headerContainer = document.querySelector('.main-content-shopping-pineapple');
    if (!headerContainer) return;

    fetch('/frontend/public/views/components/shopping_pineapple.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            headerContainer.innerHTML = data;

            /* ── Resaltar enlace activo ── */
            const currentPage = window.location.pathname.split("/").pop() || "index.html";
            headerContainer.querySelectorAll(".navbar__link-shopping").forEach(link => {
                if (link.getAttribute("href")?.includes(currentPage)) {
                    link.classList.add("active");
                }
            });

            /* ── Cargar datos del producto ── */
            cargarProducto(headerContainer);
        })
        .catch(error => console.error('Error cargando shopping_pineapple:', error));
});

/* ── Productos base ── */
var productosBase = [
    { id: 'fresas-01',  
    name: 'Fresas',
    price: 12140, 
    unit: 'lb', 
    vendor: 'Finca el Porvenir', 
    img: '/frontend/public/img/fresas.jpeg',
    tipo: 'Fruta' 
},

    { id: 'uva-01',     
        name: 'Uva Isabella',    
        price: 5260,  unit: 'lb',
        vendor: 'Finca el Indio',
        img: '/frontend/public/img/uvas.jpeg',
        tipo: 'Fruta' 
        },
    { id: 'naranja-01', 
        name: 'Naranja Tangelo', 
        price: 6400,  unit: 'lb', 
        vendor: 'Finca Imbachi',     
        img: '/frontend/public/img/naranja.jpeg',
        tipo: 'Fruta' 
    }
    ,
    { id: 'ciruela-01', 
        name: 'Ciruela Roja',    
        price: 3600,  
        unit: 'lb',
         vendor: 'Finca Imbachi',
        img: '/frontend/public/img/ciruela_roja.jpeg', 
        tipo: 'Fruta' 
    }
];

function buscarProducto(id) {
    try {
        var mis = JSON.parse(localStorage.getItem('misProductos')) || [];
        var encontrado = mis.find(p => p.id === id);
        if (encontrado) return encontrado;
    } catch (e) {}
    return productosBase.find(p => p.id === id) || null;
}

function cargarProducto(container) {

    var params = new URLSearchParams(window.location.search);
    var id     = params.get('id');
    var prod   = id ? buscarProducto(id) : null;

    if (!prod) return; /* sin id → deja HTML estático */

    /* ── Normalizar campos ── */
    var nombre    = prod.nombre    || prod.name    || 'Producto';
    var unidad    = prod.tipoPeso  || prod.unit    || '';
    var finca     = prod.finca     || prod.vendor  || '';
    var foto      = prod.foto      || prod.img     || '';
    var tipo      = prod.tipo      || 'Fruta';
    var peso      = prod.peso      || '';
    var tipoEnvio = prod.tipoEnvio || '';
    var precioOriginal = prod.precioOriginal || prod.price || prod.precio || 0;
    var descuento      = prod.descuento || 0;
    var precioFinal    = prod.precio    || prod.price || 0;

    /* ── IMAGEN — clase correcta: product-image-shopping-pineapple ── */
    var imgEl = container.querySelector('.product-image-shopping-pineapple');
    if (imgEl) {
        imgEl.src = foto || '';
        imgEl.alt = nombre;
        imgEl.style.opacity = '0';
        imgEl.style.transition = 'opacity 0.3s';
        imgEl.onload = function () { imgEl.style.opacity = '1'; };
        if (!foto) imgEl.style.opacity = '1'; /* si no hay foto no queda invisible */
    }

    /* ── Título ── */
    var titleEl = container.querySelector('.product-title-shopping-pineapple');
    if (titleEl) titleEl.innerHTML = nombre + (unidad ? '<br>' + unidad : '');

    /* ── Precios ── */
    var oldPriceEl  = container.querySelector('.old-price-shopping-pineapple');
    var currPriceEl = container.querySelector('.current-price-shopping-pineapple');
    var badgeEl     = container.querySelector('.discount-badge-shopping-pineapple');

    if (descuento > 0) {
        if (oldPriceEl)  { oldPriceEl.textContent = '$' + Number(precioOriginal).toLocaleString('es-CO'); oldPriceEl.style.display = ''; }
        if (currPriceEl)   currPriceEl.textContent = '$' + Number(precioFinal).toLocaleString('es-CO');
        if (badgeEl)     { badgeEl.textContent = descuento + '%'; badgeEl.style.display = ''; }
    } else {
        if (oldPriceEl)  oldPriceEl.style.display = 'none';
        if (badgeEl)     badgeEl.style.display     = 'none';
        if (currPriceEl) currPriceEl.textContent   = '$' + Number(precioFinal).toLocaleString('es-CO');
    }

    /* ── Vendedor ── */
    var sellerEl = container.querySelector('.seller-info-shopping-pineapple strong');
    if (sellerEl) sellerEl.textContent = finca;

    /* ── Condiciones de entrega ── */
    var deliveryItems = container.querySelectorAll('.text-shopping-pineapple');
    if (deliveryItems[0]) deliveryItems[0].innerHTML = '<strong>Enviado por:</strong> ' + finca;
    if (deliveryItems[1]) {
        var envioTexto = {
            domicilio:  'Domicilio a tu dirección',
            recogida:   'Recogida en finca',
            transporte: 'Transporte propio',
            mensajeria: 'Mensajería'
        }[tipoEnvio] || tipoEnvio || 'Compra y recoge';
        deliveryItems[1].innerHTML = '<strong>Tipo de envío:</strong> ' + envioTexto;
    }

    /* ── Detalles — clases exactas del HTML ── */
    var detailValues = container.querySelectorAll('.detail-value-shopping-pineapple');
    if (detailValues[0]) detailValues[0].textContent = prod.id || 'SIN REF.';
    if (detailValues[1]) detailValues[1].textContent = tipo;
    if (detailValues[2]) detailValues[2].textContent = peso ? peso + ' ' + unidad : '—';

    /* ── Botón Agregar — id exacto del HTML: btnAddToCart ── */
    var btnAgregar = container.querySelector('#btnAddToCart');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function () {
            var qty  = parseInt(container.querySelector('#quantityInput')?.value || '1', 10);
            addToCart(prod, qty);
            var span = btnAgregar.querySelector('span') || btnAgregar;
            var orig = span.textContent;
            span.textContent = '✓ Agregado';
            btnAgregar.style.background = '#059669';
            setTimeout(function () { span.textContent = orig; btnAgregar.style.background = ''; }, 1400);
        });
    }

    /* ── Cantidad — ids exactos: btnIncrease, btnDecrease, quantityInput ── */
    var btnIncrease = container.querySelector('#btnIncrease');
    var btnDecrease = container.querySelector('#btnDecrease');
    var qtyInput    = container.querySelector('#quantityInput');

    if (btnIncrease) btnIncrease.addEventListener('click', function () {
        if (qtyInput) qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    if (btnDecrease) btnDecrease.addEventListener('click', function () {
        if (qtyInput && parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    /* ── Botón Volver — id exacto: btnGoBack ── */
    var btnBack = container.querySelector('#btnGoBack');
    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });

    var btnreport = container.querySelector('#btnreport');
    if (btnreport) btnreport.addEventListener('click', function () { window.history.report(); });
}

function addToCart(product, qty) {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { cart = []; }
    var found = cart.find(p => p.id === product.id);
    if (found) { found.quantity += qty; }
    else { cart.push(Object.assign({}, product, { quantity: qty })); }
    localStorage.setItem('cart', JSON.stringify(cart));
}