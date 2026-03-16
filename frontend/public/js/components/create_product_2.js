document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content');
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
            console.error('Error cargando create_product_2:', error);
        });
});

function initProductCreate2() {

    const productImage  = document.querySelector('.productImage');
    const photoInput    = document.querySelector('.photoInputProduct2');
    const btnEliminar   = document.querySelector('.btnEliminarFoto');
    const btnVolver     = document.querySelector('.btnVolver');
    const form          = document.querySelector('.fincaFormProduct2');

    const FIELDS = [
        { key: 'nombreFinca',    cls: '.inputNombreFinca'    },
        { key: 'stock',          cls: '.inputStock'          },
        { key: 'direccionFinca', cls: '.inputDireccionFinca' },
        { key: 'tipoEnvio',      cls: '.selectTipoEnvio'     },
        { key: 'descripcion',    cls: '.inputDescripcion'    }
    ];

    /* ── Restaurar foto del paso 1 ── */
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && productImage) productImage.src = savedPhoto;

    /* ── Restaurar campos guardados (prefijo cp_) ── */
    FIELDS.forEach(function (field) {
        const saved = localStorage.getItem('cp_' + field.key);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) el.value = saved;
        }
    });

    /* ── Cambiar foto — label nativo ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                if (productImage) productImage.src = e.target.result;
                localStorage.setItem('productPhoto', e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Eliminar foto ── */
    if (btnEliminar && productImage) {
        btnEliminar.addEventListener('click', function () {
            productImage.src = '';
            localStorage.removeItem('productPhoto');
        });
    }

    /* ── Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    /* ── Publicar ── */
    if (!form) { console.error('No se encontró .fincaFormProduct2'); return; }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Guardar campos del paso 2 */
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            if (el) localStorage.setItem('cp_' + field.key, el.value);
        });

        /* Construir producto */
        const precioRaw   = localStorage.getItem('cp_precioProducto') || '0';
        const precioNum   = parseInt(String(precioRaw).replace(/[^0-9]/g, ''), 10) || 0;
        const descVal     = localStorage.getItem('cp_descuento') || 'no';
        const descNum     = descVal === 'no' ? 0 : parseInt(descVal, 10);
        const precioFinal = descNum > 0 ? Math.round(precioNum * (1 - descNum / 100)) : precioNum;

        const nuevoProducto = {
            id:             'prod-' + Date.now(),
            nombre:         localStorage.getItem('cp_nombreProducto') || '',
            name:           localStorage.getItem('cp_nombreProducto') || '',
            tipo:           localStorage.getItem('cp_tipoProducto')   || 'fruta',
            peso:           localStorage.getItem('cp_pesoProducto')   || '',
            tipoPeso:       localStorage.getItem('cp_tipoPeso')       || 'kilos',
            unit:           localStorage.getItem('cp_tipoPeso')       || 'kilos',
            precioOriginal: precioNum,
            descuento:      descNum,
            precio:         precioFinal,
            price:          precioFinal,
            foto:           localStorage.getItem('productPhoto')      || '',
            img:            localStorage.getItem('productPhoto')      || '',
            finca:          localStorage.getItem('cp_nombreFinca')    || '',
            vendor:         localStorage.getItem('cp_nombreFinca')    || '',
            stock:          localStorage.getItem('cp_stock')          || '',
            direccion:      localStorage.getItem('cp_direccionFinca') || '',
            tipoEnvio:      localStorage.getItem('cp_tipoEnvio')      || 'domicilio',
            descripcion:    localStorage.getItem('cp_descripcion')    || '',
            fechaCreacion:  new Date().toISOString(),
            activo:         true
        };

        let misProductos = [];
        try { misProductos = JSON.parse(localStorage.getItem('misProductos')) || []; } catch (e) {}
        misProductos.push(nuevoProducto);
        localStorage.setItem('misProductos', JSON.stringify(misProductos));

        /* Limpiar temporales */
        ['nombreProducto','tipoProducto','pesoProducto','tipoPeso','precioProducto',
         'descuento','nombreFinca','stock','direccionFinca','tipoEnvio','descripcion']
            .forEach(function (k) { localStorage.removeItem('cp_' + k); });
        localStorage.removeItem('productPhoto');

        /* Toast y redirección */
        const toast = document.createElement('div');
        toast.textContent = '✓ Producto publicado';
        toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:#10b981;color:#fff;padding:14px 28px;border-radius:8px;font-size:1.6rem;font-weight:600;z-index:9999;transition:all 0.3s ease;opacity:0';
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
        setTimeout(function () {
            toast.style.opacity = '0';
            setTimeout(function () {
                toast.remove();
                window.location.href = '/frontend/public/views/views_product_new-2.html';
            }, 300);
        }, 1600);
    });
}