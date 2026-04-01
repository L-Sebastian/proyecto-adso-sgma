document.addEventListener('DOMContentLoaded', function () {

    console.log('1. DOMContentLoaded disparado');
    const container = document.querySelector('.main-contentPro');
    console.log('2. Container encontrado:', container);
    if (!container) {
        console.error('ERROR: No se encontró .main-contentPro');
        return;
    }

    fetch('/static/views/components/product_admin.html')
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

// ✅ CORREGIDO: Ahora se llama UNA_HORA_MS
const UNA_HORA_MS = 60 * 60 * 1000;

const productosBase = [
    // { id: 'fresas-01',  name: 'Fresas',         price: 12140, unit: 'lb', vendor: 'Finca el Porvenir', img: '/static/img/fresas.jpeg',       activo: true },
    // { id: 'uva-01',     name: 'Uva Isabella',    price: 5260,  unit: 'lb', vendor: 'Finca el Indio',    img: '/static/img/uvas.jpeg',         activo: true },
    // { id: 'naranja-01', name: 'Naranja Tangelo', price: 6400,  unit: 'lb', vendor: 'Finca Imbachi',     img: '/static/img/naranja.jpeg',      activo: true },
    // { id: 'ciruela-01', name: 'Ciruela Roja',    price: 3600,  unit: 'lb', vendor: 'Finca Imbachi',     img: '/static/img/ciruela_roja.jpeg', activo: true }
];

const iconEdit  = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
const iconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

function cargarMisProductos() {
    try { return JSON.parse(localStorage.getItem('misProductos')) || []; }
    catch (e) { return []; }
}

function guardarMisProductos(lista) {
    localStorage.setItem('misProductos', JSON.stringify(lista));
}

function clasificar() {
    let todos = cargarMisProductos();
    let ahora = Date.now();
    const nuevos = [], maduros = [];
    todos.forEach(function (p) {
        const edad = ahora - (p.fechaCreacion ? new Date(p.fechaCreacion).getTime() : 0);
        (edad >= UNA_HORA_MS ? maduros : nuevos).push(p);  // ✅ Ahora UNA_HORA_MS está definida
    });
    return { nuevos: nuevos, maduros: maduros };
}

function buildCard(p, esMio) {
    const nombre = p.nombre || p.name   || 'Producto';
    const precio = p.precio || p.price  || 0;
    const unidad = p.tipoPeso || p.unit || '';
    const finca  = p.finca   || p.vendor || '';
    const foto   = p.foto    || p.img   || '';
    const activo = p.activo !== false;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.warn("No hay usuario logueado");
        return;
    }

    const nameSpan = document.querySelector('[data-profile-name]');
    if (nameSpan) {
        const fullName = [
            currentUser.firstName,
            currentUser.secondName,
            currentUser.firstLastName,
            currentUser.secondLastName
        ].filter(Boolean).join(' ');

        nameSpan.textContent = fullName;
    }
    const firstName  = currentUser.firstName      || '';
    const secondName = currentUser.secondName     || '';
    const lastName1  = currentUser.firstLastName  || '';
    const lastName2  = currentUser.secondLastName || '';
    const propietario = [firstName, secondName, lastName1, lastName2].filter(Boolean).join(' ') || 'Vendedor';

    const deleteBtn = esMio
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
        +   '<span class="product-vevo-card-owner">👤 Propietario: <strong>' + propietario + '</strong></span>'
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
    const c     = clasificar();
    let todos = productosBase.concat(c.maduros);

    const misNuevos = c.nuevos.filter(function (p) { return p.activo !== false; });

    let html = '';

    if (misNuevos.length > 0) {
        html += misNuevos.map(function (p) { return buildCard(p, true); }).join('');
    }

    html += todos
        .filter(function (p) { return p.activo !== false; })
        .map(function (p) {
            const esMio = !!c.maduros.find(function (m) { return m.id === p.id; });
            return buildCard(p, esMio);
        }).join('');

    console.log('Renderizando grid:', {
        productosBase: productosBase.length,
        misNuevos: misNuevos.length,
        maduros: c.maduros.length,
        htmlLength: html.length
    });

    grid.innerHTML = html || '<p style="text-align:center;color:#666;padding:24px;grid-column:1/-1;">No hay productos disponibles.</p>';
}

function initProductNew() {
    const grid = document.querySelector('.productGrid');
    const btnCrear = document.querySelector('.btnCrearProducto');
    const btnBack = document.querySelector('.btnGoBackFinca'); 

    if (!grid) {
        console.error('No se encontró .productGrid');
        return;
    }

    console.log('Grid encontrado, renderizando productos...');
    renderGrid(grid);
    programarMovimiento(function () { renderGrid(grid); });

    grid.addEventListener('click', function (e) {
        const btnEdit    = e.target.closest('.pn-btn-edit');
        const btnDisable = e.target.closest('.pn-btn-disable');
        const btnDelete  = e.target.closest('.pn-btn-delete');
        const card       = e.target.closest('.product-vevo-card');
        const misProductos = cargarMisProductos();

        if (btnDelete) {
            e.stopPropagation();
            let id = btnDelete.dataset.id;
            if (confirm('¿Eliminar este producto?')) {
                guardarMisProductos(misProductos.filter(function (p) { return p.id !== id; }));
                renderGrid(grid);
            }

        } else if (btnEdit) {
            e.stopPropagation();
            window.location.href = '/static/views/views_edit_product.html?id=' + btnEdit.dataset.id;

        } else if (btnDisable) {
            e.stopPropagation();
            let id   = btnDisable.dataset.id;
            const prod = misProductos.find(function (p) { return p.id === id; })
                    || productosBase.find(function (p) { return p.id === id; });
            if (!prod) return;
            prod.activo = !prod.activo;
            if (misProductos.find(function (p) { return p.id === id; })) {
                guardarMisProductos(misProductos);
            }
            btnDisable.textContent = prod.activo ? 'Deshabilitar' : 'Habilitar';
            btnDisable.classList.toggle('disabled', !prod.activo);

        } else if (card) {
            let id = card.dataset.id;
            window.location.href = '/static/views/views_shopping_pineapple.html?id=' + id;
        }
    });

    if (btnCrear) btnCrear.addEventListener('click', function () {
        window.location.href = '/static/views/views_create_product.html';
    });

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); 
        window.location.href = '/static/views/index_admin.html';
    });
}

function programarMovimiento(callback) {
    let todos = cargarMisProductos();
    let ahora = Date.now();
    const tiempos = todos
        .filter(function (p) {
            return ahora - (p.fechaCreacion ? new Date(p.fechaCreacion).getTime() : 0) < UNA_HORA_MS;  // ✅ Ahora funciona
        })
        .map(function (p) {
            return UNA_HORA_MS - (ahora - new Date(p.fechaCreacion).getTime());
        });
    if (tiempos.length === 0) return;
    setTimeout(function () { callback(); }, Math.min.apply(null, tiempos) + 100);
}