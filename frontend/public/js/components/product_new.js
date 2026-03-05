document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content');
    if (!container) return;

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

var UNA_HORA_MS = 60 * 60 * 1000;

var productosBase = [
    { id: 'fresas-01',  name: 'Fresas',         price: 12140, unit: 'lb', vendor: 'Finca el Porvenir', img: '/frontend/public/img/fresas.jpeg',       activo: true },
    { id: 'uva-01',     name: 'Uva Isabella',    price: 5260,  unit: 'lb', vendor: 'Finca el Indio',    img: '/frontend/public/img/uvas.jpeg',         activo: true },
    { id: 'naranja-01', name: 'Naranja Tangelo', price: 6400,  unit: 'lb', vendor: 'Finca Imbachi',     img: '/frontend/public/img/naranja.jpeg',      activo: true },
    { id: 'ciruela-01', name: 'Ciruela Roja',    price: 3600,  unit: 'lb', vendor: 'Finca Imbachi',     img: '/frontend/public/img/ciruela_roja.jpeg', activo: true }
];

var iconEdit  = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
var iconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

function cargarMisProductos() {
    try { return JSON.parse(localStorage.getItem('misProductos')) || []; }
    catch (e) { return []; }
}

function guardarMisProductos(lista) {
    localStorage.setItem('misProductos', JSON.stringify(lista));
}

function clasificar() {
    var todos = cargarMisProductos();
    var ahora = Date.now();
    var nuevos = [], maduros = [];
    todos.forEach(function (p) {
        var edad = ahora - (p.fechaCreacion ? new Date(p.fechaCreacion).getTime() : 0);
        (edad >= UNA_HORA_MS ? maduros : nuevos).push(p);
    });
    return { nuevos: nuevos, maduros: maduros };
}

function buildCard(p, esMio) {
    var nombre = p.nombre || p.name   || 'Producto';
    var precio = p.precio || p.price  || 0;
    var unidad = p.tipoPeso || p.unit || '';
    var finca  = p.finca   || p.vendor || '';
    var foto   = p.foto    || p.img   || '';
    var activo = p.activo !== false;

    var deleteBtn = esMio
        ? '<button class="pn-btn-delete" data-id="' + p.id + '" title="Eliminar">' + iconTrash + '</button>'
        : '';

    return '<div class="product-vevo-card" data-id="' + p.id + '">'
        + deleteBtn
        + '<div class="product-vevo-card-img-box">'
        +   '<img src="' + foto + '" alt="' + nombre + '" class="product-vevo-card-img" onerror="this.style.opacity=\'0.3\'">'
        + '</div>'
        + '<div class="product-vevo-card-body">'
        +   '<span class="product-vevo-card-name">' + nombre + '</span>'
        +   '<span class="product-vevo-card-price">$' + Number(precio).toLocaleString('es-CO')
        +     '<span class="product-vevo-card-price-unit">' + unidad + '</span></span>'
        +   '<span class="product-vevo-card-vendor">Vendido por: <strong>' + finca + '</strong></span>'
        +   '<div class="pn-card-actions">'
        +     '<button class="pn-btn-edit" data-id="' + p.id + '">' + iconEdit + ' Editar</button>'
        +     '<button class="pn-btn-disable' + (activo ? '' : ' disabled') + '" data-id="' + p.id + '">'
        +       (activo ? 'Deshabilitar' : 'Habilitar')
        +     '</button>'
        +   '</div>'
        + '</div>'
        + '</div>';
}

function renderGrid(grid) {
    var c     = clasificar();
    var todos = productosBase.concat(c.maduros);

    /* Mis productos nuevos activos primero */
    var misNuevos = c.nuevos.filter(function (p) { return p.activo !== false; });

    var html = '';

    if (misNuevos.length > 0) {
        html += misNuevos.map(function (p) { return buildCard(p, true); }).join('');
    }

    /* Productos base + maduros — ocultar los deshabilitados */
    html += todos
        .filter(function (p) { return p.activo !== false; })
        .map(function (p) {
            var esMio = !!c.maduros.find(function (m) { return m.id === p.id; });
            return buildCard(p, esMio);
        }).join('');

    grid.innerHTML = html || '<p style="text-align:center;color:#666;padding:24px;grid-column:1/-1;">No hay productos disponibles.</p>';
}

function initProductNew() {

    var grid    = document.getElementById('productGrid');
    var btnCrear = document.getElementById('btnCrearProducto');
    var btnBack  = document.getElementById('btnGoBack');

    if (!grid) return;

    renderGrid(grid);
    programarMovimiento(function () { renderGrid(grid); });

    /* ── Delegación de eventos ── */
    grid.addEventListener('click', function (e) {
        var btnEdit    = e.target.closest('.pn-btn-edit');
        var btnDisable = e.target.closest('.pn-btn-disable');
        var btnDelete  = e.target.closest('.pn-btn-delete');
        var card       = e.target.closest('.product-vevo-card');
        var misProductos = cargarMisProductos();

        if (btnDelete) {
            e.stopPropagation();
            var id = btnDelete.dataset.id;
            if (confirm('¿Eliminar este producto?')) {
                guardarMisProductos(misProductos.filter(function (p) { return p.id !== id; }));
                renderGrid(grid);
            }

        } else if (btnEdit) {
            e.stopPropagation();
            window.location.href = '/frontend/public/views/views_edit_product.html?id=' + btnEdit.dataset.id;

        } else if (btnDisable) {
            e.stopPropagation();
            var id   = btnDisable.dataset.id;
            var prod = misProductos.find(function (p) { return p.id === id; })
                    || productosBase.find(function (p) { return p.id === id; });
            if (!prod) return;
            prod.activo = !prod.activo;
            if (misProductos.find(function (p) { return p.id === id; })) {
                guardarMisProductos(misProductos);
            }
            btnDisable.textContent = prod.activo ? 'Deshabilitar' : 'Habilitar';
            btnDisable.classList.toggle('disabled', !prod.activo);

        } else if (card) {
            /* Click en la card → ir al detalle del producto */
            var id = card.dataset.id;
            window.location.href = '/frontend/public/views/views_shopping_pineapple.html?id=' + id;
        }
    });

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_create_product.html';
    });

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });
}

function programarMovimiento(callback) {
    var todos = cargarMisProductos();
    var ahora = Date.now();
    var tiempos = todos
        .filter(function (p) {
            return ahora - (p.fechaCreacion ? new Date(p.fechaCreacion).getTime() : 0) < UNA_HORA_MS;
        })
        .map(function (p) {
            return UNA_HORA_MS - (ahora - new Date(p.fechaCreacion).getTime());
        });
    if (tiempos.length === 0) return;
    setTimeout(function () { callback(); }, Math.min.apply(null, tiempos) + 100);
}