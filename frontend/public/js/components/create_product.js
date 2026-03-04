document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content-create');
    if (!bodyContainer) return;

    const productURL = '/frontend/public/views/components/create_product.html';

    Promise.all([
        fetch(productURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando create_product.html');
            return r.text();
        }),
    ])
    .then(function (resultados) {
        bodyContainer.innerHTML = resultados[0];


        initProductCreate();
    })
    .catch(function (error) {
        console.error('Error cargando componentes:', error);
    });
});

function initProductCreate() {

    const photoInput       = document.getElementById('photoInput');
    const uploadBtn        = document.getElementById('uploadBtn');
    const avatarContainer  = document.getElementById('avatarContainer');
    const avatarImgProduct = document.getElementById('avatarImgProduct');
    const avatarSvgProduct = document.getElementById('avatarSvgProduct');
    const btnSiguiente     = document.getElementById('btnSiguiente');

    const FIELDS = ['nombreProducto', 'tipoProducto', 'pesoProducto', 'tipoPeso', 'precioProducto', 'descuento'];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && avatarImgProduct && avatarSvgProduct) {
        avatarImgProduct.src = savedPhoto;
        avatarImgProduct.style.display = 'block';
        avatarSvgProduct.style.display = 'none';
    }

    /* ── Restaurar campos guardados (prefijo cp_) ── */
    FIELDS.forEach(function (id) {
        const savedValue = localStorage.getItem('cp_' + id);
        if (savedValue !== null) {
            const el = document.getElementById(id);
            if (el) el.value = savedValue;
        }
    });

    /* ── Guardar valores originales para detectar cambios ── */
    const valoresOriginales = {};
    FIELDS.forEach(function (id) {
        const el = document.getElementById(id);
        valoresOriginales[id] = el ? el.value : '';
    });



    /* ── Guardar datos en localStorage con prefijo cp_ ── */
    function guardarDatos() {
        FIELDS.forEach(function (id) {
            const el = document.getElementById(id);
            if (el) localStorage.setItem('cp_' + id, el.value);
        });
    }



    /* ── Aplicar foto al avatar ── */
    function aplicarFoto(dataURL) {
        if (avatarImgProduct && avatarSvgProduct) {
            avatarImgProduct.src = dataURL;
            avatarImgProduct.style.display = 'block';
            avatarSvgProduct.style.display = 'none';
        }
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
            guardarDatos(); /* siempre guarda antes de ir al paso 2 */
            window.location.href = '/frontend/public/views/views_create_product_2.html';
        });
    }
}