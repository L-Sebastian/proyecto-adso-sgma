document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content-create');
    if (!bodyContainer) return;

    const productURL = '/frontend/public/views/components/create_product.html';
    const modalURL   = '/frontend/public/views/components/modal_confirm.html';

    Promise.all([
        fetch(productURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando create_product.html');
            return r.text();
        }),
        fetch(modalURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando modal_confirm.html');
            return r.text();
        })
    ])
    .then(function (resultados) {
        bodyContainer.innerHTML = resultados[0];

        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = resultados[1];
        document.body.appendChild(modalWrapper);

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
    const modal            = document.getElementById('modalConfirmarSalida');
    const modalSi          = document.getElementById('modalSi');
    const modalNo          = document.getElementById('modalNo');

    const FIELDS = ['nombreProducto', 'tipoProducto', 'pesoProducto', 'tipoPeso', 'precioProducto', 'descuento'];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && avatarImgProduct && avatarSvgProduct) {
        avatarImgProduct.src = savedPhoto;
        avatarImgProduct.style.display = 'block';
        avatarSvgProduct.style.display = 'none';
    }

    /* ── Restaurar datos guardados en los campos ── */
    FIELDS.forEach(function (id) {
        const savedValue = localStorage.getItem('product_' + id);
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
            if (el) localStorage.setItem('product_' + id, el.value);
        });
      
        const fotoActual = localStorage.getItem('productPhoto');
        if (fotoActual) localStorage.setItem('productPhoto', fotoActual);
    }

    /* ── Mostrar / ocultar modal ── */
    function mostrarModal() {
        if (modal) modal.style.display = 'flex';
    }

    function ocultarModal() {
        if (modal) modal.style.display = 'none';
    }

    /* ── Función central para aplicar una foto al avatar ── */
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
        uploadBtn.addEventListener('click', function () {
            photoInput.click();
        });
    }

    /* ── Subir Foto — clic directo en el avatar ── */
    if (avatarContainer && photoInput) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', function () {
            photoInput.click();
        });
    }

    /* ── Leer el archivo seleccionado ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                aplicarFoto(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Botón Siguiente ── */
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function () {
            if (huboCambios()) {
                mostrarModal();
            } else {
                window.location.href = '/frontend/public/views/views_create_product_2.html';
            }
        });
    }

    /* ── Modal: Sí → guardar y continuar ── */
    if (modalSi) {
        modalSi.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_create_product_2.html';
        });
    }

    /* ── Modal: No → descartar y continuar ── */
    if (modalNo) {
        modalNo.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product_2.html';
        });
    }

    /* ── Cerrar modal al hacer clic en el fondo ── */
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) ocultarModal();
        });
    }
}