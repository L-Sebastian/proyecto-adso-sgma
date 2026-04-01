document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content-finca');
    if (!container) return;

    fetch('/frontend/public/views/components/create_farm.html')
        .then(function (r) {
            if (!r.ok) throw new Error('Error ' + r.status);
            return r.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initCreateFarm();
        })
        .catch(function (err) {
            console.error('Error cargando create_farm:', err);
        });
});

function initCreateFarm() {

    /* ── Referencias DOM — clases del HTML actual (prefijo fpEd-) ── */
    var photoInput      = document.querySelector('.fpEdPhotoInput');
    var btnEliminarFoto = document.querySelector('.fpEdBtnEliminarFoto');
    var avatarImg       = document.querySelector('.fpEdAvatarImg');
    var avatarSvg       = document.querySelector('.fpEdAvatarSvg');
    var btnVolver       = document.querySelector('.fpEdBtnVolver');
    var form            = document.querySelector('.fpEdForm');

    if (!form) return;

    var foto = '';

    /* ── Campos que se guardan/restauran (clases del HTML) ── */
    var FIELDS = [
        'fpEdFinca',
        'fpEdProduccion',
        'fpEdDepartamento',
        'fpEdDireccion',
        'fpEdDescripcion'
    ];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.warn("No hay usuario logueado");
        return;
    }

    const nameSpan = document.querySelector('[data-profile-name]');
    if (nameSpan) {
        const fullName = [
            currentUser.firstName,
            currentUser.secondName,
            currentUser.firstLastName,
            currentUser.secondLastName
        ].filter(Boolean).join(' ');

        nameSpan.textContent = fullName;
    }

    const firstName  = currentUser.firstName      || '';
    const secondName = currentUser.secondName     || '';
    const lastName1  = currentUser.firstLastName  || '';
    const lastName2  = currentUser.secondLastName || '';
    const email      = currentUser.email          || '';

    /* ── Cargar datos del perfil desde localStorage y bloquear campos ── */
    var nombreCompleto   = [firstName, secondName].filter(Boolean).join(' ');
    var apellidoCompleto = [lastName1, lastName2].filter(Boolean).join(' ');

    /* nombre: el HTML usa .inputFirstName para el primer campo del propietario */
    var elNombre   = document.querySelector('.inputFirstName');
    var elApellido = document.querySelector('.fpEdApellido');
    var elCorreo   = document.querySelector('.fpEdCorreoElectronico');

    if (elNombre) {
        elNombre.value = nombreCompleto;
        elNombre.setAttribute('readonly', true);
        elNombre.style.background = '#f3f4f6';
        elNombre.style.cursor = 'not-allowed';
    }
    if (elApellido) {
        elApellido.value = apellidoCompleto;
        elApellido.setAttribute('readonly', true);
        elApellido.style.background = '#f3f4f6';
        elApellido.style.cursor = 'not-allowed';
    }
    if (elCorreo) {
        elCorreo.value = email;
        elCorreo.setAttribute('readonly', true);
        elCorreo.style.background = '#f3f4f6';
        elCorreo.style.cursor = 'not-allowed';
    }

    /* ── Restaurar foto ── */
    var savedPhoto = localStorage.getItem('cf_foto');
    if (savedPhoto && avatarImg) {
        foto = savedPhoto;
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* ── Restaurar galería ── */
    var galeriaGuardada = [];
    try { galeriaGuardada = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch (e) {}
    galeriaGuardada.forEach(function (dataURL, i) {
        if (dataURL) cfSetSlotImage(i, dataURL);
    });

    /* ── Restaurar campos ── */
    FIELDS.forEach(function (cls) {
        var saved = localStorage.getItem('cf_' + cls);
        if (saved !== null) {
            var el = document.querySelector('.' + cls);
            if (el) el.value = saved;
        }
    });

    /* ── Guardar campos en tiempo real ── */
    FIELDS.forEach(function (cls) {
        var el = document.querySelector('.' + cls);
        if (el) {
            el.addEventListener('input', function () {
                localStorage.setItem('cf_' + cls, el.value);
            });
        }
    });

    /* ── Foto — aplicar ── */
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (avatarImg) { avatarImg.src = foto; avatarImg.style.display = 'block'; }
        if (avatarSvg) avatarSvg.style.display = 'none';
        localStorage.setItem('cf_foto', foto);
    }

    /* ── Foto — label nativo, solo leer archivo ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) { aplicarFoto(e.target.result); };
            reader.readAsDataURL(file);
        });
    }

    /* ── Foto — eliminar ── */
    if (btnEliminarFoto) {
        btnEliminarFoto.addEventListener('click', function () {
            foto = '';
            if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
            if (avatarSvg) avatarSvg.style.display = '';
            localStorage.removeItem('cf_foto');
        });
    }

    /* ── Galería — clase del HTML: fpEd-gallery-input ── */
    document.querySelectorAll('.fpEd-gallery-input').forEach(function (input) {
        input.addEventListener('change', function () {
            var slot = parseInt(input.dataset.slot);
            var file = input.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                cfSetSlotImage(slot, e.target.result);
                cfSaveGallery();
            };
            reader.readAsDataURL(file);
        });
    });

    /* ── Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_farm_new.html';
        });
    }

    /* ── Guardar — evento submit en el form ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Validar nombre de finca obligatorio */
        var fincaInput = document.querySelector('.fpEdFinca');
        if (!fincaInput || fincaInput.value.trim() === '') {
            if (fincaInput) {
                fincaInput.classList.add('fpEd-error');
                fincaInput.focus();
            }
            return;
        }
        fincaInput.classList.remove('fpEd-error');

        /* Leer galería guardada */
        var galeria = [];
        try { galeria = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch (e) {}

        /* Construir objeto finca */
        var finca = {
            id:             'finca-' + Date.now(),
            nombre:         nombreCompleto,
            apellido:       apellidoCompleto,
            correo:         email,
            nombreFinca:    document.querySelector('.fpEdFinca')         ? document.querySelector('.fpEdFinca').value.trim()        : '',
            tipoProduccion: document.querySelector('.fpEdProduccion')    ? document.querySelector('.fpEdProduccion').value           : '',
            departamento:   document.querySelector('.fpEdDepartamento')  ? document.querySelector('.fpEdDepartamento').value         : '',
            direccion:      document.querySelector('.fpEdDireccion')     ? document.querySelector('.fpEdDireccion').value.trim()     : '',
            descripcion:    document.querySelector('.fpEdDescripcion')   ? document.querySelector('.fpEdDescripcion').value.trim()   : '',
            foto:           foto,
            galeria:        galeria,
            fechaCreacion:  new Date().toISOString()
        };

        /* Guardar en misFincas */
        var fincas = [];
        try { fincas = JSON.parse(localStorage.getItem('misFincas')) || []; } catch (e) {}
        fincas.push(finca);
        localStorage.setItem('misFincas', JSON.stringify(fincas));

        /* Limpiar temporales */
        FIELDS.forEach(function (cls) { localStorage.removeItem('cf_' + cls); });
        localStorage.removeItem('cf_foto');
        localStorage.removeItem('cf_galeria');

        cfMostrarToast('✓ Finca creada exitosamente');
        setTimeout(function () {
            window.location.href = '/frontend/public/views/views_farm_new.html';
        }, 1600);
    });
}

/* ── Helper: poner imagen en slot (clases fpEdSlot) ── */
function cfSetSlotImage(slot, dataURL) {
    var label = document.querySelector('.fpEdSlot[data-slot="' + slot + '"]');
    if (!label) return;
    label.querySelectorAll('.fpEd-gallery-preview, .fpEd-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.add('has-image');
    var plusEl = label.querySelector('.fpEd-gallery-plus');
    if (plusEl) plusEl.style.display = 'none';
    var img = document.createElement('img');
    img.src = dataURL;
    img.className = 'fpEd-gallery-preview';
    label.appendChild(img);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fpEd-gallery-remove';
    btn.innerHTML = '×';
    btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        cfClearSlot(slot); cfSaveGallery();
    });
    label.appendChild(btn);
}

/* ── Helper: limpiar slot ── */
function cfClearSlot(slot) {
    var label = document.querySelector('.fpEdSlot[data-slot="' + slot + '"]');
    if (!label) return;
    label.querySelectorAll('.fpEd-gallery-preview, .fpEd-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.remove('has-image');
    var plusEl = label.querySelector('.fpEd-gallery-plus');
    if (plusEl) plusEl.style.display = '';
    var input = label.querySelector('.fpEd-gallery-input');
    if (input) input.value = '';
}

/* ── Helper: guardar galería ── */
function cfSaveGallery() {
    var galeria = [];
    for (var i = 0; i < 4; i++) {
        var label = document.querySelector('.fpEdSlot[data-slot="' + i + '"]');
        var img = label ? label.querySelector('.fpEd-gallery-preview') : null;
        galeria.push(img ? img.src : '');
    }
    localStorage.setItem('cf_galeria', JSON.stringify(galeria));
}

/* ── Helper: toast ── */
function cfMostrarToast(msg) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:#10b981;color:#fff;padding:14px 28px;border-radius:8px;font-size:1.6rem;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(16,185,129,0.4);transition:all 0.3s ease;opacity:0';
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