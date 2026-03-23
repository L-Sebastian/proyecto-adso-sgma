document.addEventListener('DOMContentLoaded', function () {
    const bodyContainer = document.querySelector('.container-main-profile');
    if (!bodyContainer) return;

    Promise.all([
        fetch('/frontend/public/views/components/edit_profile2.html').then(r => {
            if (!r.ok) throw new Error('Error cargando edit_profile2.html');
            return r.text();
        }),
        fetch('/frontend/public/views/components/modal_confirm.html').then(r => {
            if (!r.ok) throw new Error('Error cargando modal_confirm.html');
            return r.text();
        })
    ])
    .then(([profileHtml, modalHtml]) => {
        bodyContainer.innerHTML = profileHtml;

        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML = modalHtml;
        document.body.appendChild(modalWrapper);

        initProfileEdit();
    })
    .catch(error => console.error('Error cargando componentes:', error));
});

function initProfileEdit() {
    // ===== ELEMENTOS DEL DOM =====
    const elements = {
        // Avatar
        photoInput: document.querySelector('.photoInput'),
        avatarImg: document.querySelector('.avatarImg'),  
        avatarSvg: document.querySelector('.avatarSvg'), 
        nameDisplay: document.querySelector('.profileName'),
        
        // Botones
        btnVolver: document.querySelector('.btnvolver'), 
        btnGuardar: document.querySelector('.btnGuardar'),
        
        // Modal
        modal: document.querySelector('.modalConfirmarSalida'),
        modalSi: document.querySelector('.modalSi'),
        modalNo: document.querySelector('.modalNo')
    };

    // Verificar elementos críticos
    console.log('Elementos encontrados:', {
        avatarImg: !!elements.avatarImg,
        btnVolver: !!elements.btnVolver,
        modal: !!elements.modal
    });

    // ===== CAMPOS DEL FORMULARIO =====
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

    // ===== FUNCIONES PRINCIPALES =====
    
    /** Restaurar foto de perfil */
    function restaurarFoto() {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto && elements.avatarImg && elements.avatarSvg) {
            elements.avatarImg.src = savedPhoto;
            elements.avatarImg.style.display = 'block';
            elements.avatarSvg.style.display = 'none';
        }
    }

    /** Restaurar datos de los campos */
    function restaurarDatos() {
        FIELDS.forEach(field => {
            const saved = localStorage.getItem('profile_' + field.key);
            if (saved !== null) {
                const el = document.querySelector(field.cls);
                if (!el) return;
                
                if (el.tagName === 'SELECT') {
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
        });
    }

    /** Guardar valores originales */
    const valoresOriginales = {};
    function guardarValoresOriginales() {
        FIELDS.forEach(field => {
            const el = document.querySelector(field.cls);
            valoresOriginales[field.key] = el ? el.value : '';
        });
    }

    /** Detectar cambios */
    function huboCambios() {
        return FIELDS.some(field => {
            const el = document.querySelector(field.cls);
            return el && el.value !== valoresOriginales[field.key];
        });
    }

    /** Guardar datos en localStorage */
    function guardarDatos() {
        FIELDS.forEach(field => {
            const el = document.querySelector(field.cls);
            if (el) {
                localStorage.setItem('profile_' + field.key, el.value);
            }
        });
        
        // Actualizar valores originales
        guardarValoresOriginales();
        
        if (typeof window.aplicarDatosPerfil === 'function') {
            window.aplicarDatosPerfil();
        }
        
        console.log(' Datos guardados');
    }

    /** Actualizar nombre mostrado */
    function updateName() {
        if (!elements.nameDisplay) return;
        
        const first = document.querySelector('.inputFirstName')?.value.trim() || '';
        const second = document.querySelector('.inputSecondName')?.value.trim() || '';
        const last1 = document.querySelector('.inputFirstLastName')?.value.trim() || '';
        const last2 = document.querySelector('.inputSecondLastName')?.value.trim() || '';
        
        const nombres = [first, second].filter(Boolean).join(' ');
        const apellidos = [last1, last2].filter(Boolean).join(' ');
        
        elements.nameDisplay.innerHTML = apellidos 
            ? nombres + '<br>' + apellidos 
            : nombres;
    }

    /** Configurar actualización en tiempo real */
    function configurarActualizacionNombre() {
        const inputs = [
            '.inputFirstName',
            '.inputSecondName',
            '.inputFirstLastName',
            '.inputSecondLastName'
        ];
        
        inputs.forEach(cls => {
            const el = document.querySelector(cls);
            if (el) el.addEventListener('input', updateName);
        });
    }

    /** Configurar carga de foto */
    function configurarFoto() {
        if (!elements.photoInput || !elements.avatarImg) return;
        
        elements.photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = e => {
                const dataURL = e.target.result;
                elements.avatarImg.src = dataURL;
                elements.avatarImg.style.display = 'block';
                if (elements.avatarSvg) elements.avatarSvg.style.display = 'none';
                localStorage.setItem('profilePhoto', dataURL);
            };
            reader.readAsDataURL(file);
        });
    }

    /** Configurar modal */
    function configurarModal() {
        if (!elements.modal) return;
        
        // Mostrar modal
        window.mostrarModal = () => elements.modal.style.display = 'flex';
        window.ocultarModal = () => elements.modal.style.display = 'none';
        
        // Cerrar al hacer clic fuera
        elements.modal.addEventListener('click', e => {
            if (e.target === elements.modal) window.ocultarModal();
        });
    }

    /** Configurar botones */
    function configurarBotones() {
        // Botón Volver
        if (elements.btnVolver) {
            elements.btnVolver.addEventListener('click', () => {
                if (huboCambios()) {
                    window.mostrarModal();
                } else {
                    window.location.href = '/frontend/public/views/views_edit_profile.html';
                }
            });
        }

        // Botón Guardar
        if (elements.btnGuardar) {
            elements.btnGuardar.addEventListener('click', () => {
                guardarDatos();
                window.location.href = '/frontend/public/views/views_edit_profile.html';
            });
        }

        // Modal Sí
        if (elements.modalSi) {
            elements.modalSi.addEventListener('click', () => {
                guardarDatos();
                window.ocultarModal();
                window.location.href = '/frontend/public/views/views_edit_profile.html';
            });
        }

        // Modal No
        if (elements.modalNo) {
            elements.modalNo.addEventListener('click', () => {
                window.ocultarModal();
                window.location.href = '/frontend/public/views/views_edit_profile.html';
            });
        }
    }

    // ===== INICIALIZACIÓN =====
    restaurarFoto();
    restaurarDatos();
    guardarValoresOriginales();
    updateName();
    configurarActualizacionNombre();
    configurarFoto();
    configurarModal();
    configurarBotones();
    
    console.log(' Edit Profile 2 inicializado');
}