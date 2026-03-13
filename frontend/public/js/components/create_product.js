document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content-create');
    if (!bodyContainer) return;

    fetch('/frontend/public/views/components/create_product.html')
        .then(function (r) {
            if (!r.ok) throw new Error('Error cargando create_product.html');
            return r.text();
        })
        .then(function (html) {
            bodyContainer.innerHTML = html;
            initProductCreate();
        })
        .catch(function (error) {
            console.error('Error cargando componentes:', error);
        });
});

function initProductCreate() {

    const photoInput       = document.querySelector('.photoInput');
    const uploadBtn        = document.querySelector('.uploadBtn');
    const avatarContainer  = document.querySelector('.avatarContainer');
    const avatarImgProduct = document.querySelector('.avatarImgProduct');
    const avatarSvgProduct = document.querySelector('.avatarSvgProduct');
    const btnSiguiente     = document.querySelector('.btnSiguiente');
    const imageText        = document.querySelector('.avatarImageText');

    /* Mapeo: clave localStorage → clase del campo */
    const FIELDS = [
        { key: 'nombreProducto', cls: '.nombreProducto' },
        { key: 'tipoProducto',   cls: '.tipoProducto'   },
        { key: 'pesoProducto',   cls: '.pesoProducto'   },
        { key: 'tipoPeso',       cls: '.tipoPeso'       },
        { key: 'precioProducto', cls: '.precioProducto' },
        { key: 'descuento',      cls: '.descuento'      }
    ];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && avatarImgProduct && avatarSvgProduct) {
        avatarImgProduct.src = savedPhoto;
        avatarImgProduct.style.display = 'block';
        avatarSvgProduct.style.display = 'none';
        if (imageText) imageText.style.display = 'none';
    }

    /* ── Restaurar campos guardados (prefijo cp_) ── */
    FIELDS.forEach(function (field) {
        const saved = localStorage.getItem('cp_' + field.key);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) el.value = saved;
        }
    });

    /* ── Guardar valores originales ── */
    const valoresOriginales = {};
    FIELDS.forEach(function (field) {
        const el = document.querySelector(field.cls);
        valoresOriginales[field.key] = el ? el.value : '';
    });

    /* ── Guardar datos en localStorage con prefijo cp_ ── */
    function guardarDatos() {
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            if (el) localStorage.setItem('cp_' + field.key, el.value);
        });
    }

    /* ── Aplicar foto al avatar ── */
    function aplicarFoto(dataURL) {
        if (avatarImgProduct && avatarSvgProduct) {
            avatarImgProduct.src = dataURL;
            avatarImgProduct.style.display = 'block';
            avatarSvgProduct.style.display = 'none';
        }
        if (imageText) imageText.style.display = 'none';
        localStorage.setItem('productPhoto', dataURL);
    }

    /* ── Subir Foto — botón ── */
    if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', function () { photoInput.click(); });
    }

    /* ── Subir Foto — clic en avatar ── */
    if (avatarContainer && photoInput) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', function () { photoInput.click(); });
    }

    /* ── Leer archivo ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) { aplicarFoto(e.target.result); };
            reader.readAsDataURL(file);
        });
    }

    /* ── Botón Siguiente ── */
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_create_product_2.html';
        });
    }
}