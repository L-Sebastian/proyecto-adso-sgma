document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.container-main-profile');
    if (!bodyContainer) return;

    const profileURL = '/frontend/public/views/components/edit_profile2.html';
    const modalURL   = '/frontend/public/views/components/modal_confirm.html';

    /* Cargar los dos HTML en paralelo */
    Promise.all([
        fetch(profileURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando edit_profile2.html');
            return r.text();
        }),
        fetch(modalURL).then(function (r) {
            if (!r.ok) throw new Error('Error cargando modal_confirm.html');
            return r.text();
        })
    ])
    .then(function (resultados) {
        const profileHTML = resultados[0];
        const modalHTML   = resultados[1];

        /* Insertar el formulario en su contenedor */
        bodyContainer.innerHTML = profileHTML;

        /* Insertar el modal al final del body */
        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = modalHTML;
        document.body.appendChild(modalWrapper);

        initProfileEdit();
    })
    .catch(function (error) {
        console.error('Error cargando componentes:', error);
    });
});

function initProfileEdit() {

    const avatarImg   = document.getElementById('avatarImgProfile');
    const avatarSvg   = document.getElementById('avatarSvgProfile');
    const nameDisplay = document.getElementById('profileNameProfile');
    const btnVolver   = document.getElementById('btnVolver');
    const btnGuardar  = document.getElementById('btnGuardar');
    const modal       = document.getElementById('modalConfirmarSalida');
    const modalSi     = document.getElementById('modalSi');
    const modalNo     = document.getElementById('modalNo');

    const FIELDS = ['firstName', 'secondName', 'firstLastName', 'secondLastName', 'email', 'departamento', 'address'];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto && avatarImg && avatarSvg) {
        avatarImg.src = savedPhoto;
        avatarImg.style.display = 'block';
        avatarSvg.style.display = 'none';
    }

    /* ── Restaurar datos guardados en los campos ── */
    FIELDS.forEach(function (id) {
        const savedValue = localStorage.getItem('profile_' + id);
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

    /* ── Actualizar nombre en tiempo real ── */
    function updateName() {
        if (!nameDisplay) return;
        const first  = document.getElementById('firstName')?.value.trim()  || '';
        const second = document.getElementById('secondName')?.value.trim() || '';
        const last1  = document.getElementById('firstLastName')?.value.trim()  || '';
        const last2  = document.getElementById('secondLastName')?.value.trim() || '';
        const line1  = [first, second].filter(Boolean).join(' ');
        const line2  = [last1, last2].filter(Boolean).join(' ');
        nameDisplay.innerHTML = line1 + (line2 ? '<br>' + line2 : '');
    }

    ['firstName', 'secondName', 'firstLastName', 'secondLastName'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateName);
    });

    updateName();

    /* ── Mostrar / ocultar modal ── */
    function mostrarModal() {
        if (modal) modal.style.display = 'flex';
    }

    function ocultarModal() {
        if (modal) modal.style.display = 'none';
    }

    /* ── Guardar datos y actualizar navbar ── */
    function guardarDatos() {
        FIELDS.forEach(function (id) {
            const el = document.getElementById(id);
            if (el) localStorage.setItem('profile_' + id, el.value);
        });
        if (typeof window.aplicarDatosPerfil === 'function') {
            window.aplicarDatosPerfil();
        }
    }

    /* ── Botón Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            if (huboCambios()) {
                mostrarModal();
            } else {
                window.location.href = '/frontend/public/views/views_edit_profile.html';
            }
        });
    }

    /* ── Modal: Sí → guardar y volver ── */
    if (modalSi) {
        modalSi.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }

    /* ── Modal: No → descartar y volver ── */
    if (modalNo) {
        modalNo.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }

    /* ── Cerrar modal al hacer clic en el fondo ── */
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) ocultarModal();
        });
    }

    /* ── Botón Guardar → guardar y volver al perfil ── */
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }
}