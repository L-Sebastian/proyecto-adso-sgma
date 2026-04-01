var productosBaseF = [
    { id: 'fresas-01',  name: 'Fresas',         price: 12140, unit: 'lb', vendor: 'Finca el Porvenir',  img: '/static/img/fresas.jpeg',       tipo: 'fruta',   activo: true },
    { id: 'limon-01',   name: 'Limón Tahití',    price: 2500,  unit: 'lb', vendor: 'Finca el Porvenir',  img: '/frontend/img/Buy/limon_taiti.jpeg',        tipo: 'fruta',   activo: true },
    { id: 'uchuva-01',  name: 'Uchuva',          price: 5500,  unit: 'lb', vendor: 'Finca la esperanza', img: '/frontend/img/Buy/uchua.jpeg',       tipo: 'fruta',   activo: true },
    { id: 'uva-01',     name: 'Uva Isabella',    price: 5260,  unit: 'lb', vendor: 'Finca el Indio',     img: '/static/img/uvas.jpeg',         tipo: 'fruta',   activo: true },
    { id: 'naranja-01', name: 'Naranja Tangelo', price: 6400,  unit: 'lb', vendor: 'Finca Imbachi',      img: '/static/img/naranja.jpeg',      tipo: 'fruta',   activo: true },
    { id: 'ciruela-01', name: 'Ciruela Roja',    price: 3600,  unit: 'lb', vendor: 'Finca Imbachi',      img: '/static/img/ciruela_roja.jpeg', tipo: 'fruta',   activo: true }
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
        <h2 class="filters__all-title" id="filtroTitulo">Todos los productos</h2>
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
        const btn  = e.target.closest('.product__button');
        const card = e.target.closest('.product');

        if (btn) {
            e.stopPropagation();

            /* 🔥 VALIDAR LOGIN */
            const user = JSON.parse(localStorage.getItem("currentUser"));

            if (!user || !user.email) {
                mostrarNotificacion();
                return;
            }

            /* Buscar el producto correspondiente y agregarlo al carrito */
            const pid = btn.dataset.id || card?.dataset.id;

            agregarAlCarrito(pid);

            /* Feedback visual en el botón */
            const origText = btn.innerHTML;
            btn.style.background = '#059669';
            btn.innerHTML = '✓ Agregado';

            setTimeout(function () { 
                btn.innerHTML = origText; 
                btn.style.background = ''; 
            }, 1200);

        } else if (card) {
            window.location.href = '/static/views/views_shopping_pineapple.html?id=' + card.dataset.id;
        }
    });
});

/* ── Función agregar al carrito ── */
function agregarAlCarrito(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productos = obtenerTodosProductos();
    const producto = productos.find(p => p.id === productId);

    if (!producto) return;

    const existente = cart.find(p => p.id === productId);

    if (existente) {
        existente.quantity = (existente.quantity || 1) + 1;
    } else {
        producto.quantity = 1;
        cart.push(producto);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

/* ── Obtener productos ── */
function obtenerTodosProductos() {
    var mis = [];
    try { mis = JSON.parse(localStorage.getItem('misProductos')) || []; } catch (e) {}
    return productosBaseF.concat(mis).filter(function (p) { return p.activo !== false; });
}

/* ── Render productos ── */
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
            return t === tipo || t + 's' === tipo || t === tipo.slice(0, -1);
          });

    grid.innerHTML = filtrados.length > 0
        ? filtrados.map(buildFilterCard).join('')
        : '<p style="text-align:center;color:#666;padding:40px;grid-column:1/-1;font-size:1.6rem;">No hay productos en esta categoría.</p>';
}

/* ── Card producto ── */
function buildFilterCard(p) {
    var nombre = p.nombre || p.name    || 'Producto';
    var precio = p.precio || p.price   || 0;
    var unidad = p.tipoPeso || p.unit  || '';
    var finca  = p.finca   || p.vendor || '';
    var foto   = p.foto    || p.img    || '';

    return `
        <div class="product" data-id="${p.id}">
            <img src="${foto}" alt="${nombre}" class="product__image">
            <h3 class="product__title">${nombre}</h3>
            <p class="product__price">$${Number(precio).toLocaleString('es-CO')} <span>${unidad}</span></p>
            <p class="product__vendor">Vendido por: <strong>${finca}</strong></p>
            <button class="product__button" data-id="${p.id}">
                Agregar
            </button>
        </div>`;
}

/* ── Notificación login ── */
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