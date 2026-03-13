document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.container-main-profile');
    if (!bodyContainer) return;

    Promise.all([
        fetch('/frontend/public/views/components/edit_profile2.html').then(function (r) {
            if (!r.ok) throw new Error('Error cargando edit_profile2.html');
            return r.text();
        }),
        fetch('/frontend/public/views/components/modal_confirm.html').then(function (r) {
            if (!r.ok) throw new Error('Error cargando modal_confirm.html');
            return r.text();
        })
    ])
    .then(function (resultados) {
        bodyContainer.innerHTML = resultados[0];

        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = resultados[1];
        document.body.appendChild(modalWrapper);

        initProfileEdit();
    })
    .catch(function (error) {
        console.error('Error cargando componentes:', error);
    });
});

function initProfileEdit() {

    const avatarImg   = document.querySelector('.avatarImgProfile');
    const avatarSvg   = document.querySelector('.avatarSvgProfile');
    const avatarImg2  = document.querySelector('.avatarImgProfile22');
    const avatarSvg2  = document.querySelector('.avatarSvgProfile22');
    const nameDisplay = document.querySelector('.profileNameProfile');
    const btnVolver   = document.querySelector('.btnVolver');
    const btnGuardar  = document.querySelector('.btnGuardar');
    const modal       = document.querySelector('.modalConfirmarSalida');
    const modalSi     = document.querySelector('.modalSi');
    const modalNo     = document.querySelector('.modalNo');

    /* Mapeo: clave localStorage → clase del input */
    const FIELDS = [
        { key: 'firstName',      cls: '.inputFirstName'      },
        { key: 'secondName',     cls: '.inputSecondName'     },
        { key: 'firstLastName',  cls: '.inputFirstLastName'  },
        { key: 'secondLastName', cls: '.inputSecondLastName' },
        { key: 'email',          cls: '.inputEmail'          },
        { key: 'departamento',   cls: '.selectDepartamento'  },
        { key: 'address',        cls: '.inputAddress'        }
    ];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
        if (avatarImg)  { avatarImg.src  = savedPhoto; avatarImg.style.display  = 'block'; }
        if (avatarSvg)  { avatarSvg.style.display  = 'none'; }
        if (avatarImg2) { avatarImg2.src = savedPhoto; avatarImg2.style.display = 'block'; }
        if (avatarSvg2) { avatarSvg2.style.display = 'none'; }
    }

    /* ── Restaurar datos guardados en los campos ── */
    FIELDS.forEach(function (field) {
        const saved = localStorage.getItem('profile_' + field.key);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) el.value = saved;
        }
    });

    /* ── Guardar valores originales para detectar cambios ── */
    const valoresOriginales = {};
    FIELDS.forEach(function (field) {
        const el = document.querySelector(field.cls);
        valoresOriginales[field.key] = el ? el.value : '';
    });

    /* ── Detectar si hubo cambios ── */
    function huboCambios() {
        return FIELDS.some(function (field) {
            const el = document.querySelector(field.cls);
            return el && el.value !== valoresOriginales[field.key];
        });
    }

    /* ── Actualizar nombre en tiempo real ── */
    function updateName() {
        if (!nameDisplay) return;
        const first  = document.querySelector('.inputFirstName')?.value.trim()      || '';
        const second = document.querySelector('.inputSecondName')?.value.trim()     || '';
        const last1  = document.querySelector('.inputFirstLastName')?.value.trim()  || '';
        const last2  = document.querySelector('.inputSecondLastName')?.value.trim() || '';
        const line1  = [first, second].filter(Boolean).join(' ');
        const line2  = [last1, last2].filter(Boolean).join(' ');
        nameDisplay.innerHTML = line1 + (line2 ? '<br>' + line2 : '');
    }

    ['.inputFirstName', '.inputSecondName', '.inputFirstLastName', '.inputSecondLastName']
        .forEach(function (cls) {
            const el = document.querySelector(cls);
            if (el) el.addEventListener('input', updateName);
        });

    updateName();

    /* ── Mostrar / ocultar modal ── */
    function mostrarModal() { if (modal) modal.style.display = 'flex'; }
    function ocultarModal()  { if (modal) modal.style.display = 'none'; }

    /* ── Guardar datos ── */
    function guardarDatos() {
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            if (el) localStorage.setItem('profile_' + field.key, el.value);
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

    /* ── Botón Guardar ── */
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {
            guardarDatos();
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }
}