document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/edit_product.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initEditProduct();
        })
        .catch(function (err) {
            console.error('Error cargando edit_product:', err);
        });
});

function initEditProduct() {

    var params     = new URLSearchParams(window.location.search);
    var productoId = params.get('id');

    if (!productoId) { console.error('No se recibió ID de producto'); return; }

    var misProductos = [];
    try { misProductos = JSON.parse(localStorage.getItem('misProductos')) || []; }
    catch (e) { misProductos = []; }

    var producto = misProductos.find(function (p) { return p.id === productoId; });
    if (!producto) { console.error('Producto no encontrado:', productoId); return; }

    /* ── Referencias DOM ── */
    var epAvatarImg       = document.querySelector('.epAvatarImg');
    var epAvatarSvg       = document.querySelector('.epAvatarSvg');
    var epPhotoInput      = document.querySelector('.epPhotoInput');
    var epBtnEliminarFoto = document.querySelector('.epBtnEliminarFoto');
    var form              = document.querySelector('.editProductForm');
    var btnVolver         = document.querySelector('.epBtnVolver');

    /* ── Precargar foto ── */
    var foto = producto.foto || producto.img || '';
    if (foto && epAvatarImg) {
        epAvatarImg.src = foto;
        epAvatarImg.style.display = 'block';
        if (epAvatarSvg) epAvatarSvg.style.display = 'none';
    }

    /* ── Helpers para precargar campos ── */
    function setVal(cls, val) {
        var el = document.querySelector(cls);
        if (el && val !== undefined && val !== null) el.value = val;
    }
    function setSelect(cls, val) {
        var el = document.querySelector(cls);
        if (!el || !val) return;
        for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === String(val)) { el.selectedIndex = i; break; }
        }
    }

    setVal('.epNombre',      producto.nombre      || producto.name   || '');
    setVal('.epPeso',        producto.peso        || '');
    setVal('.epPrecio',      producto.precioOriginal || producto.price || producto.precio || '');
    setVal('.epFinca',       producto.finca       || producto.vendor || '');
    setVal('.epStock',       producto.stock       || '');
    setVal('.epDireccion',   producto.direccion   || '');
    setVal('.epDescripcion', producto.descripcion || '');
    setSelect('.epTipo',      producto.tipo       || 'fruta');
    setSelect('.epTipoPeso',  producto.tipoPeso   || producto.unit  || 'kilos');
    setSelect('.epDescuento', String(producto.descuento || 'no'));
    setSelect('.epTipoEnvio', producto.tipoEnvio  || 'domicilio');

    /* ── Cambiar foto — label nativo, solo leer archivo ── */
    if (epPhotoInput) {
        epPhotoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                if (epAvatarImg) { epAvatarImg.src = e.target.result; epAvatarImg.style.display = 'block'; }
                if (epAvatarSvg) epAvatarSvg.style.display = 'none';
                foto = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Eliminar foto ── */
    if (epBtnEliminarFoto) {
        epBtnEliminarFoto.addEventListener('click', function () {
            foto = '';
            if (epAvatarImg) { epAvatarImg.src = ''; epAvatarImg.style.display = 'none'; }
            if (epAvatarSvg) epAvatarSvg.style.display = 'block';
        });
    }

    /* ── Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () { window.history.back(); });
    }

    /* ── Guardar Cambios ── */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var precioRaw   = document.querySelector('.epPrecio').value;
            var precioNum   = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
            var descVal     = document.querySelector('.epDescuento').value;
            var descNum     = descVal === 'no' ? 0 : parseInt(descVal, 10);
            var precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

            producto.nombre         = document.querySelector('.epNombre').value;
            producto.name           = producto.nombre;
            producto.tipo           = document.querySelector('.epTipo').value;
            producto.peso           = document.querySelector('.epPeso').value;
            producto.tipoPeso       = document.querySelector('.epTipoPeso').value;
            producto.unit           = producto.tipoPeso;
            producto.precioOriginal = precioNum;
            producto.descuento      = descNum;
            producto.precio         = precioFinal;
            producto.price          = precioFinal;
            producto.foto           = foto;
            producto.img            = foto;
            producto.finca          = document.querySelector('.epFinca').value;
            producto.vendor         = producto.finca;
            producto.stock          = document.querySelector('.epStock').value;
            producto.direccion      = document.querySelector('.epDireccion').value;
            producto.tipoEnvio      = document.querySelector('.epTipoEnvio').value;
            producto.descripcion    = document.querySelector('.epDescripcion').value;

            var idx = misProductos.findIndex(function (p) { return p.id === productoId; });
            if (idx !== -1) misProductos[idx] = producto;
            localStorage.setItem('misProductos', JSON.stringify(misProductos));

            var toast = document.createElement('div');
            toast.className = 'ep-toast';
            toast.textContent = '✓ Cambios guardados';
            document.body.appendChild(toast);
            setTimeout(function () { toast.classList.add('show'); }, 50);
            setTimeout(function () {
                toast.classList.remove('show');
                setTimeout(function () {
                    document.body.removeChild(toast);
                    window.location.href = '/frontend/public/views/views_product_new-2.html';
                }, 300);
            }, 1800);
        });
    }
}