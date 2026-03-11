document.addEventListener('DOMContentLoaded', function () {

    var photoInput      = document.getElementById('fpPhotoInput');
    var btnCambiarFoto  = document.getElementById('fpBtnCambiarFoto');
    var btnEliminarFoto = document.getElementById('fpBtnEliminarFoto');
    var avatarContainer = document.getElementById('fpAvatarContainer');
    var avatarImg       = document.getElementById('fpAvatarImg');
    var avatarSvg       = document.getElementById('fpAvatarSvg');
    var btnVolver       = document.getElementById('fpBtnVolver');
    var form            = document.getElementById('fpForm');

    if (!form) return;

    var foto = '';

    /* Campos que se guardan/restauran en localStorage (los del perfil se excluyen) */
    var FIELDS = ['fpFinca','fpProduccion','fpDepartamento','fpDireccion','fpDescripcion'];

    /* ── Cargar datos del perfil y bloquear campos ── */
    var firstName  = localStorage.getItem('profile_firstName')      || '';
    var secondName = localStorage.getItem('profile_secondName')     || '';
    var lastName1  = localStorage.getItem('profile_firstLastName')  || '';
    var lastName2  = localStorage.getItem('profile_secondLastName') || '';
    var email      = localStorage.getItem('profile_email')          || '';

    var nombreCompleto  = [firstName, secondName].filter(Boolean).join(' ');
    var apellidoCompleto = [lastName1, lastName2].filter(Boolean).join(' ');

    var elNombre  = document.getElementById('fpNombre');
    var elApellido = document.getElementById('fpApellido');
    var elCorreo  = document.getElementById('fpCorreoElectronico');

    if (elNombre)   { elNombre.value   = nombreCompleto;   elNombre.setAttribute('readonly', true);   elNombre.style.background   = '#f3f4f6'; elNombre.style.cursor = 'not-allowed'; }
    if (elApellido) { elApellido.value = apellidoCompleto; elApellido.setAttribute('readonly', true); elApellido.style.background = '#f3f4f6'; elApellido.style.cursor = 'not-allowed'; }
    if (elCorreo)   { elCorreo.value   = email;            elCorreo.setAttribute('readonly', true);   elCorreo.style.background   = '#f3f4f6'; elCorreo.style.cursor = 'not-allowed'; }

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
    try { galeriaGuardada = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch(e) {}
    galeriaGuardada.forEach(function (dataURL, i) {
        if (dataURL) cfSetSlotImage(i, dataURL);
    });

    /* ── Restaurar campos ── */
    FIELDS.forEach(function (id) {
        var saved = localStorage.getItem('cf_' + id);
        if (saved !== null) {
            var el = document.getElementById(id);
            if (el) el.value = saved;
        }
    });

    /* ── Guardar campos en tiempo real ── */
    FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () {
                localStorage.setItem('cf_' + id, el.value);
            });
        }
    });

    /* ── Foto — cambiar ── */
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (avatarImg) { avatarImg.src = foto; avatarImg.style.display = 'block'; }
        if (avatarSvg) avatarSvg.style.display = 'none';
        localStorage.setItem('cf_foto', foto);
    }

    if (btnCambiarFoto) {
        btnCambiarFoto.addEventListener('click', function () { photoInput.click(); });
    }
    if (avatarContainer) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', function (e) {
            if (!e.target.closest('.fp-gallery-remove')) photoInput.click();
        });
    }
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

    /* ── Galería ── */
    document.querySelectorAll('.fp-gallery-input').forEach(function (input) {
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

    /* ── Guardar ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var nombreFincaEl = document.getElementById('fpFinca');
        if (!nombreFincaEl || nombreFincaEl.value.trim() === '') {
            nombreFincaEl.classList.add('fp-error');
            nombreFincaEl.focus();
            return;
        }
        nombreFincaEl.classList.remove('fp-error');

        var galeria = [];
        try { galeria = JSON.parse(localStorage.getItem('cf_galeria')) || []; } catch(e) {}

        var finca = {
            id:             'finca-' + Date.now(),
            nombre:         nombreCompleto,
            apellido:       apellidoCompleto,
            correo:         email,
            nombreFinca:    document.getElementById('fpFinca').value.trim(),
            tipoProduccion: document.getElementById('fpProduccion').value,
            departamento:   document.getElementById('fpDepartamento').value,
            direccion:      document.getElementById('fpDireccion').value.trim(),
            descripcion:    document.getElementById('fpDescripcion').value.trim(),
            foto:           foto,
            galeria:        galeria,
            fechaCreacion:  new Date().toISOString()
        };

        var fincas = [];
        try { fincas = JSON.parse(localStorage.getItem('misFincas')) || []; } catch (e) {}
        fincas.push(finca);
        localStorage.setItem('misFincas', JSON.stringify(fincas));

        FIELDS.forEach(function (id) { localStorage.removeItem('cf_' + id); });
        localStorage.removeItem('cf_foto');
        localStorage.removeItem('cf_galeria');

        cfMostrarToast('✓ Finca creada exitosamente');
        setTimeout(function () {
            window.location.href = '/frontend/public/views/views_farm_new2.html';
        }, 1600);
    });
});

function cfSetSlotImage(slot, dataURL) {
    var label = document.getElementById('fpSlot' + slot);
    if (!label) return;
    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.add('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = 'none';
    var img = document.createElement('img');
    img.src = dataURL;
    img.className = 'fp-gallery-preview';
    label.appendChild(img);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fp-gallery-remove';
    btn.innerHTML = '×';
    btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        cfClearSlot(slot); cfSaveGallery();
    });
    label.appendChild(btn);
}
function cfClearSlot(slot) {
    var label = document.getElementById('fpSlot' + slot);
    if (!label) return;
    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.remove('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = '';
    var input = label.querySelector('.fp-gallery-input');
    if (input) input.value = '';
}
function cfSaveGallery() {
    var galeria = [];
    for (var i = 0; i < 4; i++) {
        var label = document.getElementById('fpSlot' + i);
        var img = label ? label.querySelector('.fp-gallery-preview') : null;
        galeria.push(img ? img.src : '');
    }
    localStorage.setItem('cf_galeria', JSON.stringify(galeria));
}
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