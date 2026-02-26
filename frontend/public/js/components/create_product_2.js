document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    const productURL = '/frontend/public/views/components/create_product_2.html';
    const modalURL   = '/frontend/public/views/components/modal_confirm.html';

    /* Cargar los dos HTML en paralelo */
    Promise.all([
        fetch(productURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando create_product_2.html');
            return r.text();
        }),
        fetch(modalURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando modal_confirm.html');
            return r.text();
        })
    ])
    .then(function (resultados) {
        const productHTML = resultados[0];
        const modalHTML   = resultados[1];

        bodyContainer.innerHTML = productHTML;

        /* Insertar el modal al final del body */
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = modalHTML;
        document.body.appendChild(modalWrapper);

        initProductCreate2();
    })
    .catch(function (error) {
        console.error('Error cargando componentes:', error);
    });
});

function initProductCreate2() {

    const productImage    = document.getElementById('productImage');
    const productImageSvg = document.getElementById('productImageSvg');
    const btnVolver       = document.getElementById('btnVolver');
    const btnPublicar     = document.getElementById('btnPublicar');
    const modal           = document.getElementById('modalConfirmarSalida');
    const modalSi         = document.getElementById('modalSi');
    const modalNo         = document.getElementById('modalNo');

    const FIELDS = ['nombreFinca', 'stock', 'direccionFinca', 'tipoEnvio', 'descripcion'];

    /* ── Cargar imagen del producto desde localStorage ── */
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && productImage && productImageSvg) {
        productImage.src = savedPhoto;
        productImage.style.display = 'block';
        productImageSvg.style.display = 'none';
    } else if (productImage) {
        productImage.style.display = 'block';
    }

    /* ── Restaurar datos guardados ── */
    FIELDS.forEach(function (id) {
        const savedValue = localStorage.getItem('product2_' + id);
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

    /* ── Detectar si hubo cambios ── */
    function huboCambios() {
        return FIELDS.some(function (id) {
            const el = document.getElementById(id);
            return el && el.value !== valoresOriginales[id];
        });
    }

    /* ── Guardar datos en localStorage ── */
    function guardarDatos() {
        FIELDS.forEach(function (id) {
            const el = document.getElementById(id);
            if (el) localStorage.setItem('product2_' + id, el.value);
        });
    }

    /* ── Mostrar / ocultar modal ── */
    function mostrarModal() {
        if (modal) modal.style.display = 'flex';
    }

    function ocultarModal() {
        if (modal) modal.style.display = 'none';
    }

    /* ── Botón Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            if (huboCambios()) {
                mostrarModal();
            } else {
                window.location.href = '/frontend/public/views/views_create_product.html';
            }
        });
    }

    /* ── Modal: Sí → guardar y volver ── */
    if (modalSi) {
        modalSi.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    /* ── Modal: No → descartar y volver ── */
    if (modalNo) {
        modalNo.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }

    /* ── Cerrar modal al hacer clic en el fondo ── */
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) ocultarModal();
        });
    }

    /* ── Botón Publicar → guardar y continuar ── */
    if (btnPublicar) {
        btnPublicar.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/index.html';
        });
    }
}