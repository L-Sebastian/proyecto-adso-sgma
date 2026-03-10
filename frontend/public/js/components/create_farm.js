document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content-finca');
    if (!container) return;

    fetch('/frontend/public/views/components/create_farm.html')
        .then(function (r) {
            if (!r.ok) throw new Error('Error cargando create_finca.html');
            return r.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initFincaCreate();
        })
        .catch(function (err) {
            console.error('Error cargando create_finca:', err);
        });
});

function initFincaCreate() {

    /* ── IDs del HTML actual ── */
    var photoInput      = document.getElementById('fpPhotoInput');
    var uploadBtn       = document.getElementById('fpBtnCambiarFoto');
    var eliminarBtn     = document.getElementById('fpBtnEliminarFoto');
    var avatarContainer = document.getElementById('fpAvatarContainer');
    var avatarImg       = document.getElementById('fpAvatarImg');
    var avatarSvg       = document.getElementById('fpAvatarSvg');
    var btnGuardar      = document.querySelector('.fp-btn-primary[type="submit"]');
    var btnVolver       = document.getElementById('epBtnVolver');

    var FIELDS = [
        'fpNombre', 'fpApellido', 'fpCorreoElectronico',
        'fpFinca', 'fpProduccion', 'fpDepartamento',
        'epDireccion', 'epDescripcion'
    ];

    /* ── Restaurar foto guardada ── */
    var savedPhoto = localStorage.getItem('cf_foto');
    if (savedPhoto && avatarImg && avatarSvg) {
        avatarImg.src = savedPhoto;
        avatarImg.style.display = 'block';
        avatarSvg.style.display = 'none';
    }

    /* ── Restaurar campos guardados ── */
    FIELDS.forEach(function (id) {
        var saved = localStorage.getItem(id);
        if (saved !== null) {
            var el = document.getElementById(id);
            if (el) el.value = saved;
        }
    });

    /* ── Aplicar foto al avatar ── */
    function aplicarFoto(dataURL) {
        if (avatarImg && avatarSvg) {
            avatarImg.src = dataURL;
            avatarImg.style.display = 'block';
            avatarSvg.style.display = 'none';
        }
        localStorage.setItem('cf_foto', dataURL);
    }

    /* ── Subir foto — botón Cambiar Foto ── */
    if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', function () { photoInput.click(); });
    }

    /* ── Subir foto — clic en avatar ── */
    if (avatarContainer && photoInput) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', function (e) {
            if (!e.target.closest('.fp-gallery-remove')) photoInput.click();
        });
    }

    /* ── Eliminar foto principal ── */
    if (eliminarBtn) {
        eliminarBtn.addEventListener('click', function () {
            if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
            if (avatarSvg) avatarSvg.style.display = '';
            localStorage.removeItem('cf_foto');
        });
    }

    /* ── Leer archivo ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) { aplicarFoto(e.target.result); };
            reader.readAsDataURL(file);
        });
    }

    /* ── Galería de 5 imágenes ── */
    initGallery();

    /* ── Guardar campos en localStorage en tiempo real ── */
    FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () {
                localStorage.setItem(id, el.value);
            });
        }
    });

    /* ── Botón Guardar ── */
    /* ── Volver ── */
    if (btnVolver) btnVolver.addEventListener('click', function () {
        window.location.href = '/frontend/public/views/views_finca.html';
    });

    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {

            /* Validar campos obligatorios */
            var nombre = document.getElementById('fpFinca');
            if (!nombre || nombre.value.trim() === '') {
                nombre.classList.add('error');
                nombre.focus();
                return;
            }
            nombre.classList.remove('error');

            /* Construir objeto finca */
            var galeria = [];
            try { galeria = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch(e) {}

            var finca = {
                id:             'finca-' + Date.now(),
                nombre:         getVal('fpNombre'),
                apellido:       getVal('fpApellido'),
                correo:         getVal('fpCorreoElectronico'),
                nombreFinca:    getVal('fpFinca'),
                tipoProduccion: getVal('fpProduccion'),
                departamento:   getVal('fpDepartamento'),
                direccion:      getVal('epDireccion'),
                descripcion:    getVal('epDescripcion'),
                foto:           localStorage.getItem('cf_foto') || '',
                galeria:        galeria,
                fechaCreacion:  new Date().toISOString()
            };

            /* Guardar en localStorage.misFincas */
            var fincas = [];
            try { fincas = JSON.parse(localStorage.getItem('misFincas')) || []; } catch (e) {}
            fincas.push(finca);
            localStorage.setItem('misFincas', JSON.stringify(fincas));

            /* Limpiar campos temporales */
            FIELDS.forEach(function (id) { localStorage.removeItem(id); });
            localStorage.removeItem('cf_foto');
            localStorage.removeItem('cf_galeria');

            /* Toast de confirmación */
            mostrarToast('✓ Finca creada exitosamente');

            setTimeout(function () {
                window.location.href = '/frontend/public/views/views_farm_new2.html';
            }, 1600);
        });
    }
}

function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function mostrarToast(msg) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = [
        'position:fixed', 'bottom:32px', 'left:50%', 'transform:translateX(-50%) translateY(20px)',
        'background:#10b981', 'color:#fff', 'padding:14px 28px', 'border-radius:8px',
        'font-size:1.6rem', 'font-weight:600', 'z-index:9999',
        'box-shadow:0 4px 16px rgba(16,185,129,0.4)',
        'transition:all 0.3s ease', 'opacity:0'
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () {
        toast.style.opacity = '0';
        setTimeout(function () { toast.remove(); }, 300);
    }, 1400);
}
function initGallery() {
    var slots = document.querySelectorAll('.fp-gallery-input');

    /* Restaurar galería guardada */
    var galeria = [];
    try { galeria = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch(e) {}
    galeria.forEach(function(dataURL, i) {
        if (dataURL) setSlotImage(i, dataURL);
    });

    slots.forEach(function(input) {
        input.addEventListener('change', function () {
            var slot = parseInt(input.dataset.slot);
            var file = input.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                setSlotImage(slot, e.target.result);
                saveGallery();
            };
            reader.readAsDataURL(file);
        });
    });
}

function setSlotImage(slot, dataURL) {
    var label = document.getElementById('fpSlot' + slot);
    if (!label) return;

    /* Limpiar contenido previo */
    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function(el){ el.remove(); });
    label.classList.add('has-image');

    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = 'none';

    var img = document.createElement('img');
    img.src = dataURL;
    img.className = 'fp-gallery-preview';
    label.appendChild(img);

    /* Botón eliminar */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fp-gallery-remove';
    btn.innerHTML = '×';
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearSlot(slot);
        saveGallery();
    });
    label.appendChild(btn);
}

function clearSlot(slot) {
    var label = document.getElementById('fpSlot' + slot);
    if (!label) return;
    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function(el){ el.remove(); });
    label.classList.remove('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = '';
    /* Reset input */
    var input = label.querySelector('.fp-gallery-input');
    if (input) input.value = '';
}

function saveGallery() {
    var galeria = [];
    for (var i = 0; i < 5; i++) {
        var label = document.getElementById('fpSlot' + i);
        var img = label ? label.querySelector('.fp-gallery-preview') : null;
        galeria.push(img ? img.src : '');
    }
    localStorage.setItem('cf_galeria', JSON.stringify(galeria));
}