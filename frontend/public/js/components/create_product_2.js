document.addEventListener('DOMContentLoaded', function () {

    var bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    var bodyURL = '/frontend/public/views/components/create_product_2.html';

    fetch(bodyURL)
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

    var productImage     = document.getElementById('productImage');
    var photoInput       = document.getElementById('photoInputProduct2');
    var btnCambiarFoto   = document.getElementById('btnCambiarFoto');
    var btnEliminarFoto  = document.getElementById('btnEliminarFoto');

    /* ── Restaurar foto guardada desde create_product ── */
    var savedPhoto = localStorage.getItem('productPhoto');
    if (savedPhoto && productImage) {
        productImage.src = savedPhoto;
    }

    /* ── Cambiar Foto → abre el selector de archivos ── */
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

    /* ── Eliminar Foto → vuelve al placeholder SVG ── */
    if (btnEliminarFoto && productImage) {
        btnEliminarFoto.addEventListener('click', function () {
            productImage.src = '';
            localStorage.removeItem('productPhoto');

            /* Mostrar texto de placeholder */
            var imageText = document.querySelector('.image-text');
            if (imageText) imageText.textContent = 'Sin imagen';
        });
    }

    /* ── Volver ── */
    var btnVolver = document.querySelector('.btn-secondary-product2[onclick]');
    /* Remover onclick inline y manejar con JS */
    if (btnVolver) {
        btnVolver.removeAttribute('onclick');
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_create_product.html';
        });
    }
}

/* Función global legacy por si el onclick="volver()" aún existe en algún lugar */
function volver() {
    window.location.href = '/frontend/public/views/views_create_product.html';
}