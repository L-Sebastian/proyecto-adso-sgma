

var productosBaseF = [
    { id: 'fresas-01',  name: 'Fresas',         price: 12140, unit: 'lb', vendor: 'Finca el Porvenir',  img: '/frontend/public/img/fresas.jpeg',       tipo: 'fruta',   activo: true },
    { id: 'limon-01',   name: 'Limón Tahití',    price: 2500,  unit: 'lb', vendor: 'Finca el Porvenir',  img: '/frontend/img/Buy/limon_taiti.jpeg',        tipo: 'fruta',   activo: true },
    { id: 'uchuva-01',  name: 'Uchuva',          price: 5500,  unit: 'lb', vendor: 'Finca la esperanza', img: '/frontend/img/Buy/uchua.jpeg',       tipo: 'fruta',   activo: true },
    { id: 'uva-01',     name: 'Uva Isabella',    price: 5260,  unit: 'lb', vendor: 'Finca el Indio',     img: '/frontend/public/img/uvas.jpeg',         tipo: 'fruta',   activo: true },
    { id: 'naranja-01', name: 'Naranja Tangelo', price: 6400,  unit: 'lb', vendor: 'Finca Imbachi',      img: '/frontend/public/img/naranja.jpeg',      tipo: 'fruta',   activo: true },
    { id: 'ciruela-01', name: 'Ciruela Roja',    price: 3600,  unit: 'lb', vendor: 'Finca Imbachi',      img: '/frontend/public/img/ciruela_roja.jpeg', tipo: 'fruta',   activo: true }
];

document.addEventListener('DOMContentLoaded', function () {

    var section = document.querySelector('.filters');
    if (!section) return;

    section.innerHTML = `
        <h2 class="filters__title">Filtros</h2>
        <div class="filters__buttons">
            <button class="filter__btn" data-tipo="frutas">Frutas</button>
            <button class="filter__btn" data-tipo="verduras">Verduras</button>
            <button class="filter__btn" data-tipo="carnes">Carnes</button>
            <button class="filter__btn" data-tipo="fertilizantes">Fertilizantes</button>
        </div>
        <h3 class="filters__all-title" id="filtroTitulo">Todos los productos</h3>
        <div class="productsContainer" id="filteredGrid"></div>
    `;

    renderFiltrados('todos');

    /* ── Botones filtro ── */
    section.querySelectorAll('.filter__btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var yaActivo = btn.classList.contains('active');
            section.querySelectorAll('.filter__btn').forEach(function (b) { b.classList.remove('active'); });

            if (yaActivo) {
                /* Segundo click en el mismo → mostrar todos */
                renderFiltrados('todos');
            } else {
                btn.classList.add('active');
                renderFiltrados(btn.dataset.tipo);
            }
        });
    });

    /* ── Click en card ── */
    section.addEventListener('click', function (e) {
        var btn  = e.target.closest('.product__button');
        var card = e.target.closest('.product');
        if (btn) {
            e.stopPropagation();
            mostrarNotificacion();
        } else if (card) {
            window.location.href = '/frontend/public/views/views_shopping_pineapple.html?id=' + card.dataset.id;
        }
    });
});

function obtenerTodosProductos() {
    var mis = [];
    try { mis = JSON.parse(localStorage.getItem('misProductos')) || []; } catch (e) {}
    return productosBaseF.concat(mis).filter(function (p) { return p.activo !== false; });
}

function renderFiltrados(tipo) {
    var grid   = document.getElementById('filteredGrid');
    var titulo = document.getElementById('filtroTitulo');
    if (!grid) return;

    var todos = obtenerTodosProductos();

    var nombres = { frutas: 'Frutas', verduras: 'Verduras', carnes: 'Carnes', fertilizantes: 'Fertilizantes', todos: 'Todos los productos' };
    if (titulo) titulo.textContent = nombres[tipo] || 'Todos los productos';

    var filtrados = tipo === 'todos'
        ? todos
        : todos.filter(function (p) {
            var t = (p.tipo || p.tipoProducto || '').toLowerCase();
            /* normalizar: 'fruta' → 'frutas', 'verdura' → 'verduras', etc. */
            return t === tipo || t + 's' === tipo || t === tipo.slice(0, -1);
          });

    grid.innerHTML = filtrados.length > 0
        ? filtrados.map(buildFilterCard).join('')
        : '<p style="text-align:center;color:#666;padding:40px;grid-column:1/-1;">No hay productos en esta categoría.</p>';
}

function buildFilterCard(p) {
    var nombre = p.nombre || p.name    || 'Producto';
    var precio = p.precio || p.price   || 0;
    var unidad = p.tipoPeso || p.unit  || '';
    var finca  = p.finca   || p.vendor || '';
    var foto   = p.foto    || p.img    || '';
    var desc   = parseInt(p.descuento) || 0;
    var orig   = p.precioOriginal || precio;

    var precioHtml = desc > 0
        ? `<p class="product__price-info"><span class="product__discount">-${desc}%</span> <span class="product__old-price">$${Number(orig).toLocaleString('es-CO')}</span></p>
           <p class="product__price">$${Number(precio).toLocaleString('es-CO')} <span class="product__unit">${unidad}</span></p>`
        : `<p class="product__price">$${Number(precio).toLocaleString('es-CO')} <span class="product__unit">${unidad}</span></p>`;

    return `
        <div class="product" data-id="${p.id}">
            <img src="${foto}" alt="${nombre}" class="product__image" onerror="this.style.opacity='0.3'">
            <h3 class="product__title">${nombre}</h3>
            ${precioHtml}
            <p class="product__vendor">Vendido por: <strong>${finca}</strong></p>
            <button class="product__button" data-id="${p.id}">
                Agregar
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M9 17a1 1 0 100 2 1 1 0 000-2zM15 17a1 1 0 100 2 1 1 0 000-2z"/>
                </svg>
            </button>
        </div>`;
}

function mostrarNotificacion() {
    var n = document.querySelector('.notification');
    if (!n) {
        n = document.createElement('div');
        n.classList.add('notification');
        n.textContent = 'Debes iniciar sesión primero';
        document.body.appendChild(n);
    }
    n.classList.add('show');
    setTimeout(function () { n.classList.remove('show'); }, 3000);
}