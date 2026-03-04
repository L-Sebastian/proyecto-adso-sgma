document.addEventListener('DOMContentLoaded', function () {

    var bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    fetch('/frontend/public/views/components/create_product_2.html')
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            bodyContainer.innerHTML = data;
            initProductCreate2();
        })
        .catch(function (error) {
            console.error('Error cargando el cuerpo de la página:', error);
        });
});

function initProductCreate2() {

    var productImage    = document.getElementById('productImage');
    var photoInput      = document.getElementById('photoInputProduct2');
    var btnCambiarFoto  = document.getElementById('btnCambiarFoto');
    var btnEliminarFoto = document.getElementById('btnEliminarFoto');
    var form            = document.getElementById('fincaForm-product2'); /* ← declarado aquí */

    /* ── Restaurar foto ── */
    var savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && productImage) {
        productImage.src = savedPhoto;
    }

    /* ── Cambiar Foto ── */
    if (btnCambiarFoto && photoInput) {
        btnCambiarFoto.addEventListener('click', function () {
            photoInput.click();
        });
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                productImage.src = e.target.result;
                localStorage.setItem('productPhoto', e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Eliminar Foto ── */
    if (btnEliminarFoto && productImage) {
        btnEliminarFoto.addEventListener('click', function () {
            productImage.src = '';
            localStorage.removeItem('productPhoto');
            var imageText = document.querySelector('.image-text');
            if (imageText) imageText.textContent = 'Sin imagen';
        });
    }

    /* ── Volver ── */
    var btnVolver = document.querySelector('.btn-secondary-product2');
    if (btnVolver) {
        btnVolver.removeAttribute('onclick');
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    /* ── PUBLICAR ── */
    if (!form) {
        console.error('No se encontró el formulario #fincaForm-product2');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Paso 1 — datos guardados por create_product.js */
        var nombreProducto = localStorage.getItem('cp_nombreProducto') || 'Producto';
        var tipoProducto   = localStorage.getItem('cp_tipoProducto')   || 'Fruta';
        var pesoProducto   = localStorage.getItem('cp_pesoProducto')   || '';
        var tipoPeso       = localStorage.getItem('cp_tipoPeso')       || '';
        var precioRaw      = localStorage.getItem('cp_precioProducto') || '0';
        var descuento      = localStorage.getItem('cp_descuento')      || 'no';
        var foto           = localStorage.getItem('productPhoto')      || '';

        /* Paso 2 — campos de este formulario */
        var nombreFinca  = document.getElementById('nombreFinca')    ? document.getElementById('nombreFinca').value    : '';
        var stock        = document.getElementById('stock')          ? document.getElementById('stock').value          : '0';
        var direccion    = document.getElementById('direccionFinca') ? document.getElementById('direccionFinca').value : '';
        var tipoEnvio    = document.getElementById('tipoEnvio')      ? document.getElementById('tipoEnvio').value      : '';
        var descripcion  = document.getElementById('descripcion')    ? document.getElementById('descripcion').value    : '';

        /* Precio con descuento */
        var precioNum   = parseInt(precioRaw.replace(/[^0-9]/g, ''), 10) || 0;
        var descNum     = descuento === 'no' ? 0 : parseInt(descuento, 10);
        var precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        /* Objeto producto — con ambos formatos para compatibilidad */
        var nuevoProducto = {
            id:             'prod-' + Date.now(),
            nombre:         nombreProducto,
            name:           nombreProducto,
            tipo:           tipoProducto,
            peso:           pesoProducto,
            tipoPeso:       tipoPeso,
            unit:           tipoPeso,
            precioOriginal: precioNum,
            descuento:      descNum,
            precio:         precioFinal,
            price:          precioFinal,
            foto:           foto,
            img:            foto,
            finca:          nombreFinca,
            vendor:         nombreFinca,
            stock:          stock,
            direccion:      direccion,
            tipoEnvio:      tipoEnvio,
            descripcion:    descripcion,
            activo:         true,
            fechaCreacion:  new Date().toISOString()
        };

        /* Guardar en misProductos */
        var misProductos = [];
        try { misProductos = JSON.parse(localStorage.getItem('misProductos')) || []; }
        catch (err) { misProductos = []; }

        misProductos.push(nuevoProducto);
        localStorage.setItem('misProductos', JSON.stringify(misProductos));

        /* Limpiar temporales */
        ['cp_nombreProducto','cp_tipoProducto','cp_pesoProducto',
         'cp_tipoPeso','cp_precioProducto','cp_descuento','productPhoto']
            .forEach(function (k) { localStorage.removeItem(k); });

        /* Ir a product_new-2 */
        window.location.href = '/frontend/public/views/views_product_new-2.html';
    });
}

function volver() {
    window.location.href = '/frontend/public/views/views_create_product.html';
}