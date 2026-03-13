document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content-finca');
    if (!container) return;

    fetch('/frontend/public/views/components/edit_farm.html')
        .then(function (r) {
            if (!r.ok) throw new Error('Error ' + r.status);
            return r.text();
        })
        .then(function (html) {
            container.innerHTML = html;
            initEditFarm();
        })
        .catch(function (err) {
            console.error('Error cargando edit_farm:', err);
        });
});

function initEditFarm() {

    var params = new URLSearchParams(window.location.search);
    var fincaId = params.get('id');

    if (!fincaId) {
        window.location.href = '/frontend/public/views/views_create_farm.html';
        return;
    }

    var misFincas = [];
    try { misFincas = JSON.parse(localStorage.getItem('misFincas')) || []; } catch (e) { }

    var finca = misFincas.find(function (f) { return f.id === fincaId; });
    if (!finca) {
        window.location.href = '/frontend/public/views/views_farm_new2.html';
        return;
    }

    /* ── Referencias DOM (prefijo fpEd-) ── */
    var avatarImg = document.getElementById('fpEdAvatarImg');
    var avatarSvg = document.getElementById('fpEdAvatarSvg');
    var avatarContainer = document.getElementById('fpEdAvatarContainer');
    var photoInput = document.getElementById('fpEdPhotoInput');
    var btnCambiarFoto = document.getElementById('fpEdBtnCambiarFoto');
    var btnEliminarFoto = document.getElementById('fpEdBtnEliminarFoto');
    var form = document.getElementById('fpEdForm');
    var btnVolver = document.getElementById('fpEdBtnVolver');

    var foto = finca.foto || '';

    /* ── Precargar foto ── */
    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* ── Precargar galería ── */
    (finca.galeria || []).forEach(function (dataURL, i) {
        if (dataURL) efSetSlotImage(i, dataURL);
    });

    /* ── Precargar campos ── */
    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el && val != null) el.value = val;
    }
    function setSelect(id, val) {
        var el = document.getElementById(id);
        if (!el || !val) return;
        for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === String(val)) { el.selectedIndex = i; break; }
        }
    }

    setVal('fpEdNombre', finca.nombre || '');
    setVal('fpEdApellido', finca.apellido || '');
    setVal('fpEdCorreoElectronico', finca.correo || '');
    setVal('fpEdFinca', finca.nombreFinca || '');
    setVal('fpEdDireccion', finca.direccion || '');
    setVal('fpEdDescripcion', finca.descripcion || '');
    setSelect('fpEdProduccion', finca.tipoProduccion || 'frutas');
    setSelect('fpEdDepartamento', finca.departamento || 'risaralda');

    /* ── Foto — cambiar ── */
    if (btnCambiarFoto) {
        btnCambiarFoto.addEventListener('click', function () { photoInput.click(); });
    }
    if (avatarContainer) {
        avatarContainer.style.cursor = 'pointer';
        avatarContainer.addEventListener('click', function (e) {
            if (!e.target.closest('.fpEd-gallery-remove')) photoInput.click();
        });
    }
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                foto = e.target.result;
                if (avatarImg) { avatarImg.src = foto; avatarImg.style.display = 'block'; }
                if (avatarSvg) avatarSvg.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Foto — eliminar ── */
    if (btnEliminarFoto) {
        btnEliminarFoto.addEventListener('click', function () {
            foto = '';
            if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
            if (avatarSvg) avatarSvg.style.display = '';
        });
    }

    /* ── Galería ── */
    document.querySelectorAll('.fpEd-gallery-input').forEach(function (input) {
        input.addEventListener('change', function () {
            var slot = parseInt(input.dataset.slot);
            var file = input.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) { efSetSlotImage(slot, e.target.result); };
            reader.readAsDataURL(file);
        });
    });

    /* ── Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_farm_new2.html';
        });
    }

    /* ── Guardar ── */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nombreFincaEl = document.getElementById('fpEdFinca');
            if (!nombreFincaEl || nombreFincaEl.value.trim() === '') {
                nombreFincaEl.classList.add('fpEd-error');
                nombreFincaEl.focus();
                return;
            }
            nombreFincaEl.classList.remove('fpEd-error');

            var galeriaActualizada = [];
            for (var i = 0; i < 4; i++) {
                var label = document.getElementById('fpEdSlot' + i);
                var img = label ? label.querySelector('.fpEd-gallery-preview') : null;
                galeriaActualizada.push(img ? img.src : '');
            }

            finca.nombre = document.getElementById('fpEdNombre').value.trim();
            finca.apellido = document.getElementById('fpEdApellido').value.trim();
            finca.correo = document.getElementById('fpEdCorreoElectronico').value.trim();
            finca.nombreFinca = document.getElementById('fpEdFinca').value.trim();
            finca.tipoProduccion = document.getElementById('fpEdProduccion').value;
            finca.departamento = document.getElementById('fpEdDepartamento').value;
            finca.direccion = document.getElementById('fpEdDireccion').value.trim();
            finca.descripcion = document.getElementById('fpEdDescripcion').value.trim();
            finca.foto = foto;
            finca.galeria = galeriaActualizada;

            var idx = misFincas.findIndex(function (f) { return f.id === fincaId; });
            if (idx !== -1) misFincas[idx] = finca;
            localStorage.setItem('misFincas', JSON.stringify(misFincas));

            efMostrarToast('✓ Cambios guardados');
            setTimeout(function () {
                window.location.href = '/frontend/public/views/views_farm_new2.html';
            }, 1600);
        });
    }
}

/* ── Helpers galería (fpEd-) ── */
function efSetSlotImage(slot, dataURL) {
    var label = document.getElementById('fpEdSlot' + slot);
    if (!label) return;
    label.querySelectorAll('.fpEd-gallery-preview, .fpEd-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.add('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
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
        efClearSlot(slot);
    });
    label.appendChild(btn);
}
function efClearSlot(slot) {
    var label = document.getElementById('fpEdSlot' + slot);
    if (!label) return;
    label.querySelectorAll('.fpEd-gallery-preview, .fpEd-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.remove('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = '';
    var input = label.querySelector('.fpEd-gallery-input');
    if (input) input.value = '';
}
function efSaveGallery() {
    var galeria = [];
    for (var i = 0; i < 4; i++) {
        var label = document.getElementById('fpSlot' + i);
        var img = label ? label.querySelector('.fp-gallery-preview') : null;
        galeria.push(img ? img.src : '');
    }
    localStorage.setItem('cf_galeria', JSON.stringify(galeria));
}
function efMostrarToast(msg) {
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