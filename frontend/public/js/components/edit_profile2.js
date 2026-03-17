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

        // Insertar modal al final del body
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
    console.log('initProfileEdit ejecutado');

    const photoInput = document.querySelector('.photoInput');
    const avatarImg = document.querySelector('.avatarImgProfile');
    const avatarSvg = document.querySelector('.avatarSvgProfile');
    const nameDisplay = document.querySelector('.profileNameProfile');
    const btnVolver = document.querySelector('.btnVolver');
    const btnGuardar = document.querySelector('.btnGuardar');

    // Modal
    const modal = document.querySelector('.modalConfirmarSalida');
    const modalSi = document.querySelector('.modalSi');
    const modalNo = document.querySelector('.modalNo');

    console.log('Elementos encontrados:', {
        btnVolver: !!btnVolver,
        modal: !!modal,
        modalSi: !!modalSi,
        modalNo: !!modalNo
    });

    const FIELDS = [
        { key: 'firstName',      cls: '.inputFirstName'      },
        { key: 'secondName',     cls: '.inputSecondName'     },
        { key: 'firstLastName',  cls: '.inputFirstLastName'  },
        { key: 'secondLastName', cls: '.inputSecondLastName' },
        { key: 'email',          cls: '.inputEmail'          },
        { key: 'departamento',   cls: '.selectDepartamento'  },
        { key: 'address',        cls: '.inputAddress'        },
        { key: 'telefono',       cls: '.inputTelefono'       },
        { key: 'password',       cls: '.inputPassword'       }
    ];

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
        if (avatarImg) { 
            avatarImg.src = savedPhoto; 
            avatarImg.style.display = 'block'; 
        }
        if (avatarSvg) { 
            avatarSvg.style.display = 'none'; 
        }
    }

    /* ── Restaurar datos guardados en los campos ── */
    FIELDS.forEach(function (field) {
        const saved = localStorage.getItem('profile_' + field.key);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) {
                if (el.tagName === 'SELECT') {
                    // Para selects
                    for (let i = 0; i < el.options.length; i++) {
                        if (el.options[i].value === saved) {
                            el.selectedIndex = i;
                            break;
                        }
                    }
                } else {
                    el.value = saved;
                }
            }
        }
    });

    /* ── Guardar valores originales para detectar cambios ── */
    const valoresOriginales = {};
    FIELDS.forEach(function (field) {
        const el = document.querySelector(field.cls);
        valoresOriginales[field.key] = el ? el.value : '';
    });

    /* ── Función para detectar cambios ── */
    function huboCambios() {
        return FIELDS.some(function (field) {
            const el = document.querySelector(field.cls);
            return el && el.value !== valoresOriginales[field.key];
        });
    }

    /* ── Función para guardar datos ── */
    function guardarDatos() {
        console.log('Guardando datos...');
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            if (el) {
                localStorage.setItem('profile_' + field.key, el.value);
            }
        });
        
        // Actualizar valores originales después de guardar
        FIELDS.forEach(function (field) {
            const el = document.querySelector(field.cls);
            valoresOriginales[field.key] = el ? el.value : '';
        });
        
        if (typeof window.aplicarDatosPerfil === 'function') {
            window.aplicarDatosPerfil();
        }
    }

    /* ── Actualizar nombre en tiempo real ── */
    function updateName() {
        if (!nameDisplay) return;
        const first = document.querySelector('.inputFirstName')?.value.trim() || '';
        const second = document.querySelector('.inputSecondName')?.value.trim() || '';
        const last1 = document.querySelector('.inputFirstLastName')?.value.trim() || '';
        const last2 = document.querySelector('.inputSecondLastName')?.value.trim() || '';
        const line1 = [first, second].filter(Boolean).join(' ');
        const line2 = [last1, last2].filter(Boolean).join(' ');
        nameDisplay.innerHTML = line1 + (line2 ? '<br>' + line2 : '');
    }

    // Event listeners para actualizar nombre
    ['.inputFirstName', '.inputSecondName', '.inputFirstLastName', '.inputSecondLastName']
        .forEach(function (cls) {
            const el = document.querySelector(cls);
            if (el) el.addEventListener('input', updateName);
        });

    updateName();

    /* ── Subir foto ── */
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataURL = e.target.result;
                if (avatarImg) { 
                    avatarImg.src = dataURL; 
                    avatarImg.style.display = 'block'; 
                }
                if (avatarSvg) avatarSvg.style.display = 'none';
                localStorage.setItem('profilePhoto', dataURL);
                if (typeof window.aplicarDatosPerfil === 'function') {
                    window.aplicarDatosPerfil();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Botón Volver con modal ── */
    if (btnVolver && modal) {
        btnVolver.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón Volver clickeado');
            
            if (huboCambios()) {
                console.log('Hay cambios, mostrando modal');
                modal.style.display = 'flex';
            } else {
                console.log('Sin cambios, redirigiendo');
                window.location.href = '/frontend/public/views/views_edit_profile.html';
            }
        });
    } else {
        console.error('Faltan elementos:', { btnVolver: !!btnVolver, modal: !!modal });
    }

    /* ── Botón Sí del modal ── */
    if (modalSi && modal) {
        modalSi.addEventListener('click', function() {
            console.log('Modal Sí clickeado');
            guardarDatos();
            modal.style.display = 'none';
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }

    /* ── Botón No del modal ── */
    if (modalNo && modal) {
        modalNo.addEventListener('click', function() {
            console.log('Modal No clickeado');
            modal.style.display = 'none';
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }

    /* ── Cerrar modal al hacer clic fuera ── */
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Clic fuera del modal');
                modal.style.display = 'none';
            }
        });
    }

    /* ── Botón Guardar ── */
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function() {
            console.log('Botón Guardar clickeado');
            guardarDatos();
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }
}