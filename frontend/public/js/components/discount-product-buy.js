var UNA_HORA_MS = 60 * 60 * 1000;

/* Productos base con descuento para la sección superior */
var productosConDescuento = [
    { id: 'pina-01',    
    name: 'Piña Oro Miel',   
    price: 3600,  
    unit: 'und', 
    vendor: 'Finca el Porvenir',  
    img: '/frontend/public/img/piña.jpg',          
    tipo: 'fruta',   
    descuento: 10, 
    precioOriginal: 4000,  
    activo: true 
},

    { id: 'zanahoria-01', 
    name: 'Zanahoria',      
    price: 4410,  
    unit: 'lb',  
    vendor: 'Finca el Indio',      
    img: '/frontend/img/Buy/zanahoria.png',    
    tipo: 'verdura', 
    descuento: 10, 
    precioOriginal: 4900,  
    activo: true 
},

    { id: 'lomo-01',    
    name: 'Lomo de cerdo',    
    price: 11700, 
    unit: 'lb',  
    vendor: 'Finca la cristalina', 
    img: '/frontend/img/Buy/Carne.png',   
    tipo: 'carnes',  
    descuento: 10, 
    precioOriginal: 13000, 
    activo: true 
},

    { id: 'papaya-01',  
    name: 'Papaya',           
    price: 1710,  
    unit: 'lb',  
    vendor: 'Finca el Porvenir',   
    img: '/frontend/public/img/papaya.jpg',       
    tipo: 'fruta',   
    descuento: 10, 
    precioOriginal: 1900,  
    activo: true 
}

];

document.addEventListener('DOMContentLoaded', function () {

    var section = document.querySelector('.discounts');
    if (!section) return;

    section.innerHTML = `
        <h2 class="discounts__title">Productos en descuento</h2>
        <p class="discounts__subtitle">¡Aprovecha estas ofertas imperdibles!</p>
        <div class="discounts__grid" id="discountGrid"></div>
    `;

    var grid = document.getElementById('discountGrid');
    grid.innerHTML = productosConDescuento.map(buildCard).join('');

    section.addEventListener('click', function (e) {
        var btn  = e.target.closest('.product__button');
        var card = e.target.closest('.product');
        if (btn) {
            e.stopPropagation();
            /* Buscar el producto correspondiente y agregarlo al carrito */
            var pid = btn.dataset.id || card?.dataset.id;
            var prod = productosConDescuento.find(function (p) { return p.id === pid; });
            if (prod) cartAgregar(prod);
            /* Feedback visual en el botón */
            var spanBtn = btn.querySelector('span') || btn;
            var origText = btn.innerHTML;
            btn.style.background = '#059669';
            btn.innerHTML = '✓ Agregado';
            setTimeout(function () { btn.innerHTML = origText; btn.style.background = ''; }, 1200);
        } else if (card) {
            window.location.href = '/frontend/public/views/views_shopping_pineapple.html?id=' + card.dataset.id;
        }
    });
});

function buildCard(p) {
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