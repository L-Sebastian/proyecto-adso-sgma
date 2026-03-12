document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/product_new-2.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initProductNew();
        })
        .catch(function (err) {
            console.error('Error cargando product_new-2:', err);
        });
});

const UNA_HORA_MS = 5 * 5 * 1000; /* 3600000 ms */

/* ── Productos fijos sección Frutas ── */
const productosBase = [
    { id: 'fresas-01', name: 'Fresas', price: 12140, unit: 'lb', vendor: 'Finca el Porvenir', img: '/frontend/public/img/fresas.jpeg', activo: true },
    { id: 'uva-01', name: 'Uva Isabella', price: 5260, unit: 'lb', vendor: 'Finca el Indio', img: '/frontend/public/img/uvas.jpeg', activo: true },
    { id: 'naranja-01', name: 'Naranja Tangelo', price: 6400, unit: 'lb', vendor: 'Finca Imbachi', img: '/frontend/public/img/naranja.jpeg', activo: true },
    { id: 'ciruela-01', name: 'Ciruela Roja', price: 3600, unit: 'lb', vendor: 'Finca Imbachi', img: '/frontend/public/img/ciruela_roja.jpeg', activo: true }
];

const iconEdit = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4l5 5L7 18H2v-5L11 4z"/><path d="M15 2l3 3"/></svg>';
const iconTrash = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

/* ── Separar productos: nuevos (< 1h) vs maduros (>= 1h) ── */
function clasificarProductos() {
    const todos = cargarMisProductos();
    let ahora = Date.now();
    let nuevos = [];
    const maduros = [];

    todos.forEach(function (p) {
        const fechaCreacion = p.fechaCreacion ? new Date(p.fechaCreacion).getTime() : 0;
        let edad = ahora - fechaCreacion;
        if (edad >= UNA_HORA_MS) {
            maduros.push(p);
        } else {
            nuevos.push(p);
        }
    });

    return { nuevos: nuevos, maduros: maduros };
}

function buildCard(p, esMio) {
    const nombre = p.nombre || p.name || 'Producto';
    const precio = p.precio || p.price || 0;
    const unidad = p.tipoPeso || p.unit || '';
    const finca = p.finca || p.vendor || '';
    const foto = p.foto || p.img || '';
    const activo = p.activo !== false;

    const acciones = '<button class="pn-btn-edit" data-id="' + p.id + '">' + iconEdit + ' Editar</button>'
        + '<button class="pn-btn-disable' + (activo ? '' : ' disabled') + '" data-id="' + p.id + '">'
        + (activo ? 'Deshabilitar' : 'Habilitar') + '</button>';

    const deleteBtn = esMio
        ? '<button class="pn-btn-delete" data-id="' + p.id + '" title="Eliminar">' + iconTrash + '</button>'
        : '';

    return '<div class="pn-card" data-id="' + p.id + '">'
        + deleteBtn
        + '<div class="pn-card-img-box">'
        + '<img src="' + foto + '" alt="' + nombre + '" class="pn-card-img" onerror="this.style.opacity=\'0.3\'">'
        + '</div>'
        + '<div class="pn-card-body">'
        + '<span class="pn-card-name">' + nombre + '</span>'
        + '<span class="pn-card-price">$' + Number(precio).toLocaleString('es-CO')
        + '<span class="pn-card-price-unit">' + unidad + '</span></span>'
        + '<span class="pn-card-vendor">Vendido por: <strong>' + finca + '</strong></span>'
        + '<div class="pn-card-actions">' + acciones + '</div>'
        + '</div>'
        + '</div>';
}

function cargarMisProductos() {
    try { return JSON.parse(localStorage.getItem('misProductos')) || []; }
    catch (e) { return []; }
}

function guardarMisProductos(lista) {
    localStorage.setItem('misProductos', JSON.stringify(lista));
}

function renderMyGrid(myGrid) {
    let clasificados = clasificarProductos();
    let nuevos = clasificados.nuevos;

    if (nuevos.length > 0) {
        myGrid.innerHTML = nuevos.map(function (p) { return buildCard(p, true); }).join('');
    } else {
        myGrid.innerHTML = '<p style="text-align:center;color:#666;padding:24px;grid-column:1/-1;">Aún no has publicado productos nuevos.</p>';
    }
}

function renderFruitGrid(fruitGrid) {
    let clasificados = clasificarProductos();
    /* Combinar: productos base fijos + mis productos maduros (>= 1h) */
    const todosAbajo = productosBase.concat(
        clasificados.maduros.map(function (p) { return p; })
    );
    fruitGrid.innerHTML = todosAbajo.map(function (p) {
        const esMio = !productosBase.find(function (b) { return b.id === p.id; });
        return buildCard(p, esMio);
    }).join('');
}

function initProductNew() {

    const myGrid = document.querySelector('.myProductGrid');
    const fruitGrid = document.querySelector('.fruitGrid');
    const btnBack = document.querySelector('.btnGoBack');

    /* ── Mis productos nuevos (< 1h) ── */
    if (myGrid) {
        renderMyGrid(myGrid);

        /* Actualizar automáticamente cuando un producto cumpla 1h */
        programarActualizacion(myGrid, fruitGrid);

        myGrid.addEventListener('click', function (e) {
            let btnEdit = e.target.closest('.pn-btn-edit');
            let btnDisable = e.target.closest('.pn-btn-disable');
            let btnDelete = e.target.closest('.pn-btn-delete');
            let misProductos = cargarMisProductos();

            if (btnDelete) {
                e.stopPropagation();
                let id = btnDelete.dataset.id;
                if (confirm('¿Eliminar este producto?')) {
                    guardarMisProductos(misProductos.filter(function (p) { return p.id !== id; }));
                    renderMyGrid(myGrid);
                    renderFruitGrid(fruitGrid);
                }

            } else if (btnEdit) {
                e.stopPropagation();
                window.location.href = '/frontend/public/views/views_edit_product.html?id=' + btnEdit.dataset.id;

            } else if (btnDisable) {
                e.stopPropagation();
                let id = btnDisable.dataset.id;
                let prod = misProductos.find(function (p) { return p.id === id; });
                if (!prod) return;
                prod.activo = !prod.activo;
                guardarMisProductos(misProductos);
                btnDisable.textContent = prod.activo ? 'Deshabilitar' : 'Habilitar';
                btnDisable.classList.toggle('disabled', !prod.activo);
            }
        });
    }

    /* ── Frutas (fijos + maduros) ── */
    if (fruitGrid) {
        renderFruitGrid(fruitGrid);

        fruitGrid.addEventListener('click', function (e) {
            let btnEdit = e.target.closest('.pn-btn-edit');
            let btnDisable = e.target.closest('.pn-btn-disable');
            let btnDelete = e.target.closest('.pn-btn-delete');
            const card = e.target.closest('.pn-card');
            let misProductos = cargarMisProductos();

            if (btnDelete) {
                e.stopPropagation();
                let id = btnDelete.dataset.id;
                if (confirm('¿Eliminar este producto?')) {
                    guardarMisProductos(misProductos.filter(function (p) { return p.id !== id; }));
                    renderFruitGrid(fruitGrid);
                }

            } else if (btnEdit) {
                e.stopPropagation();
                window.location.href = '/frontend/public/views/views_edit_product.html?id=' + btnEdit.dataset.id;

            } else if (btnDisable) {
                e.stopPropagation();
                let id = btnDisable.dataset.id;
                /* Buscar en mis productos primero, luego en base */
                let prod = misProductos.find(function (p) { return p.id === id; })
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
                let id = card.dataset.id;
                window.location.href = '/frontend/public/views/views_shopping_pineapple.html?id=' + id;
            }
        });
    }

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); });
}

/* ── Programa un setTimeout para mover el próximo producto que cumpla 1h ── */
function programarActualizacion(myGrid, fruitGrid) {
    let misProductos = cargarMisProductos();
    let ahora = Date.now();

    /* Encontrar el producto nuevo más cercano a cumplir 1h */
    const tiemposRestantes = misProductos
        .filter(function (p) {
            let edad = ahora - new Date(p.fechaCreacion).getTime();
            return edad < UNA_HORA_MS;
        })
        .map(function (p) {
            return UNA_HORA_MS - (ahora - new Date(p.fechaCreacion).getTime());
        });

    if (tiemposRestantes.length === 0) return;

    const masProximo = Math.min.apply(null, tiemposRestantes);

    setTimeout(function () {
        renderMyGrid(myGrid);
        renderFruitGrid(fruitGrid);
        /* Volver a programar por si hay más productos esperando */
        programarActualizacion(myGrid, fruitGrid);
    }, masProximo + 100); /* +100ms de margen */
}