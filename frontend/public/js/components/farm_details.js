document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content');
    if (!container) return;

    container.classList.add('finca-vevo-page');

    fetch('/frontend/public/views/components/farm_details.html')
        .then(function (res) {
            if (!res.ok) throw new Error('Error ' + res.status);
            return res.text();
        })
        .then(function (html) {

            container.innerHTML = html;

            cargarFinca();

        })
        .catch(function (err) {
            console.error('Error cargando finca:', err);
        });

});


document.addEventListener('DOMContentLoaded', function () {

    const container = document.querySelector('.main-content');
    if (!container) return;

    fetch('/frontend/public/views/components/farm_details.html')
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            container.innerHTML = data;
            cargarFinca(container);
        })
        .catch(function (error) {
            console.error('Error cargando farm_details:', error);
        });
});

function cargarFinca(container) {

    const params = new URLSearchParams(window.location.search);
    let id     = params.get('id');
    if (!id) return;

    let misFincas = [];
    try { misFincas = JSON.parse(localStorage.getItem('misFincas')) || []; } catch (e) {}

    const finca = misFincas.find(function (f) { return f.id === id; });
    if (!finca) return;

    /* ── Normalizar campos ── */
    const nombreFinca  = finca.nombreFinca    || 'Sin nombre';
    const propietario  = ((finca.nombre || '') + ' ' + (finca.apellido || '')).trim() || '—';
    const correo       = finca.correo         || '—';
    const tipo         = finca.tipoProduccion || '—';
    const departamento = finca.departamento   || '—';
    const direccion    = finca.direccion      || '—';
    const descripcion  = finca.descripcion    || '—';
    const foto         = finca.foto           || '';
    const galeria      = (finca.galeria || []).filter(function (g) { return g; });

    /* ── Nombre finca ── */
    const tituloEl = container.querySelector('.finca-title');
    if (tituloEl) tituloEl.textContent = nombreFinca;

    /* ── Propietario: primer .fdInfo .value ── */
    const fdInfoBlocks = container.querySelectorAll('.fdInfo');
    if (fdInfoBlocks[0]) {
        const valProp = fdInfoBlocks[0].querySelector('.value');
        if (valProp) valProp.textContent = propietario;
    }

    /* ── Correo: segundo .fdInfo .value ── */
    if (fdInfoBlocks[1]) {
        const valCorreo = fdInfoBlocks[1].querySelector('.value');
        if (valCorreo) valCorreo.textContent = correo;
    }

    /* ── Tipo, Departamento, Dirección ── */
    const detailValues = container.querySelectorAll('.details-grid .detail-item .value');
    if (detailValues[0]) detailValues[0].textContent = tipo;
    if (detailValues[1]) detailValues[1].textContent = departamento;
    if (detailValues[2]) detailValues[2].textContent = direccion;

    /* ── Descripción ── */
    const descEl = container.querySelector('.description-tex');
    if (descEl) descEl.textContent = descripcion;

    /* ── Foto principal ── */
    const mainImage = container.querySelector('#mainImage');
    if (mainImage) {
        if (foto) {
            mainImage.src = foto;
            mainImage.style.opacity = '0';
            mainImage.style.transition = 'opacity 0.3s';
            mainImage.onload = function () { mainImage.style.opacity = '1'; };
        } else {
            mainImage.removeAttribute('src');
        }
    }

    /* ── Galería ── */
    const galleryItems = container.querySelector('#galleryItems');
    if (galleryItems) {
        const todasFotos = foto
            ? [foto].concat(galeria.filter(function (g) { return g !== foto; }))
            : galeria;

        galleryItems.innerHTML = '';
        let currentIdx = 0;

        todasFotos.forEach(function (src, i) {
            const btn = document.createElement('button');
            btn.className = 'gallery-item' + (i === 0 ? ' active' : '');
            btn.dataset.index = i;
            btn.innerHTML = '<img src="' + src + '" alt="foto finca">';
            btn.addEventListener('click', function () {
                galleryItems.querySelectorAll('.gallery-item').forEach(function (el) { el.classList.remove('active'); });
                btn.classList.add('active');
                currentIdx = i;
                if (mainImage) {
                    mainImage.style.opacity = '0';
                    mainImage.src = src;
                    mainImage.onload = function () { mainImage.style.opacity = '1'; };
                }
            });
            galleryItems.appendChild(btn);
        });

        /* ── Prev / Next ── */
        const galleryPrev = container.querySelector('#galleryPrev');
        const galleryNext = container.querySelector('#galleryNext');

        function irA(idx) {
            const items = galleryItems.querySelectorAll('.gallery-item');
            if (!items.length) return;
            currentIdx = (idx + todasFotos.length) % todasFotos.length;
            items.forEach(function (el) { el.classList.remove('active'); });
            items[currentIdx].classList.add('active');
            if (mainImage) {
                mainImage.style.opacity = '0';
                mainImage.src = todasFotos[currentIdx];
                mainImage.onload = function () { mainImage.style.opacity = '1'; };
            }
        }

        if (galleryPrev) galleryPrev.addEventListener('click', function () { irA(currentIdx - 1); });
        if (galleryNext) galleryNext.addEventListener('click', function () { irA(currentIdx + 1); });
    }

    /* ── Botón Editar ── */
    const btnEditar = container.querySelector('#fdBtnEditar');
    if (btnEditar) {
        btnEditar.addEventListener('click', function () {
            const params = new URLSearchParams(window.location.search);
            window.location.href = '/frontend/public/views/views_edit_farm.html?id=' + params.get('id');
        });
    }

    /* ── Botón Volver ── */
    const btnVolver = container.querySelector('#fdBtnVolver');
    if (btnVolver) {
        btnVolver.addEventListener('click', function () { window.history.back(); });
    }
}