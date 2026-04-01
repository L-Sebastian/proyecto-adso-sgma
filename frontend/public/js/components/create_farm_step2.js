document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('.main-content-finca');
    if (!container) return;

    fetch('/frontend/public/views/components/create_farm_step2.html')
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
    // ============================================
    // 1. ELEMENTOS DEL DOM
    // ============================================
    var photoInput = document.querySelector('.fpPhotoInput');
    var btnSubirFoto = document.querySelector('.epBtnSubirFoto'); // Botón "Subir Foto"
    var btnEliminarFoto = document.querySelector('.fpBtnEliminarFoto');
    var avatarImg = document.querySelector('.fpAvatarImg');
    var avatarSvg = document.querySelector('.fpAvatarSvg');
    var btnVolver = document.querySelector('.epBtnVolver'); // Botón "Volver"
    var btnGuardar = document.querySelector('.btnGuardar'); // Botón "Guardar"
    var form = document.querySelector('.fpForm'); // Buscar el formulario

    console.log(' Elementos encontrados:', {
        photoInput: !!photoInput,
        btnSubirFoto: !!btnSubirFoto,
        btnEliminarFoto: !!btnEliminarFoto,
        btnVolver: !!btnVolver,
        btnGuardar: !!btnGuardar,
        form: !!form
    });

    // Si no hay formulario, crear uno virtual
    if (!form) {
        console.warn(' No se encontró .fpForm, usando botón Guardar directamente');
    }

    var foto = '';

    // ============================================
    // 2. CAMPOS DEL FORMULARIO
    // ============================================
    var FIELDS = [
        { id: 'fpFinca', cls: '.fpFinca' },
        { id: 'fpProduccion', cls: '.fpProduccion' },
        { id: 'fpDepartamento', cls: '.fpDepartamento' },
        { id: 'fpDireccion', cls: '.fpDireccion' },
        { id: 'fpDescripcion', cls: '.fpDescripcion' }
    ];

    // ============================================
    // 3. CARGAR DATOS DEL PERFIL
    // ============================================
    var firstName = localStorage.getItem('profile_firstName') || '';
    var secondName = localStorage.getItem('profile_secondName') || '';
    var lastName1 = localStorage.getItem('profile_firstLastName') || '';
    var lastName2 = localStorage.getItem('profile_secondLastName') || '';
    var email = localStorage.getItem('profile_email') || '';

    var nombreCompleto = [firstName, secondName].filter(Boolean).join(' ');
    var apellidoCompleto = [lastName1, lastName2].filter(Boolean).join(' ');

    var elNombre = document.querySelector('.fpNombre');
    var elApellido = document.querySelector('.fpApellido');
    var elCorreo = document.querySelector('.fpCorreoElectronico');

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

    // ============================================
    // 4. RESTAURAR DATOS GUARDADOS
    // ============================================

    // Restaurar foto
    var savedPhoto = localStorage.getItem('cf_foto');
    if (savedPhoto && avatarImg) {
        foto = savedPhoto;
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    // Restaurar galería
    var galeriaGuardada = [];
    try {
        galeriaGuardada = JSON.parse(localStorage.getItem('cf_galeria')) || [];
    } catch (e) {
        galeriaGuardada = [];
    }

    galeriaGuardada.forEach(function (dataURL, i) {
        if (dataURL) cfSetSlotImage(i, dataURL);
    });

    // Restaurar campos de texto
    FIELDS.forEach(function (field) {
        var saved = localStorage.getItem('cf_' + field.id);
        if (saved !== null) {
            var el = document.querySelector(field.cls);
            if (el) el.value = saved;
        }
    });

    // ============================================
    // 5. GUARDAR CAMPOS EN TIEMPO REAL
    // ============================================
    FIELDS.forEach(function (field) {
        var el = document.querySelector(field.cls);
        if (el) {
            el.addEventListener('input', function () {
                localStorage.setItem('cf_' + field.id, el.value);
            });
        }
    });

    // ============================================
    // 6. FUNCIONES PARA MANEJO DE FOTOS
    // ============================================

    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (avatarImg) {
            avatarImg.src = foto;
            avatarImg.style.display = 'block';
        }
        if (avatarSvg) avatarSvg.style.display = 'none';
        localStorage.setItem('cf_foto', foto);
        console.log(' Foto principal aplicada');
    }

    // ============================================
    // 7. BOTÓN SUBIR FOTO (CORREGIDO)
    // ============================================
    if (btnSubirFoto && photoInput) {
        // Clonar para evitar event listeners duplicados
        var nuevoBtnSubir = btnSubirFoto.cloneNode(true);
        btnSubirFoto.parentNode.replaceChild(nuevoBtnSubir, btnSubirFoto);

        nuevoBtnSubir.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('📸 Abriendo selector de fotos');
            photoInput.click();
        });
    } else if (photoInput) {
        // Fallback: si no hay botón, usar el label del avatar
        var avatarLabel = document.querySelector('.fpAvatarContainer');
        if (avatarLabel) {
            avatarLabel.addEventListener('click', function (e) {
                e.preventDefault();
                photoInput.click();
            });
        }
    }

    // ============================================
    // 8. INPUT FILE - FOTO PRINCIPAL
    // ============================================
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;

            console.log(' Archivo seleccionado:', file.name);

            var reader = new FileReader();
            reader.onload = function (e) {
                aplicarFoto(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // ============================================
    // 9. ELIMINAR FOTO
    // ============================================
    if (btnEliminarFoto) {
        btnEliminarFoto.addEventListener('click', function () {
            console.log(' Eliminando foto principal');
            foto = '';
            if (avatarImg) {
                avatarImg.src = '';
                avatarImg.style.display = 'none';
            }
            if (avatarSvg) avatarSvg.style.display = 'block';
            localStorage.removeItem('cf_foto');
            if (photoInput) photoInput.value = '';
        });
    }

    // ============================================
    // 10. GALERÍA DE FOTOS
    // ============================================
    document.querySelectorAll('.fp-gallery-input').forEach(function (input) {
        // Remover event listeners anteriores
        var nuevoInput = input.cloneNode(true);
        input.parentNode.replaceChild(nuevoInput, input);

        nuevoInput.addEventListener('change', function () {
            var slot = parseInt(this.dataset.slot);
            var file = this.files[0];
            if (!file) return;

            console.log(` Archivo seleccionado para slot ${slot + 1}:`, file.name);

            var reader = new FileReader();
            reader.onload = function (e) {
                cfSetSlotImage(slot, e.target.result);
                cfSaveGallery();
            };
            reader.readAsDataURL(file);
        });
    });

    // ============================================
    // 11. BOTÓN VOLVER
    // ============================================
    if (btnVolver) {
        var nuevoBtnVolver = btnVolver.cloneNode(true);
        btnVolver.parentNode.replaceChild(nuevoBtnVolver, btnVolver);

        nuevoBtnVolver.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(' Volviendo a farm_new');
            window.location.href = '/frontend/public/views/views_create_farm.html';
        });
    }

    // ============================================
    // 12. FUNCIÓN PARA VALIDAR FORMULARIO
    // ============================================
    function validarFormulario() {
        var fincaInput = document.querySelector('.fpFinca');
        if (!fincaInput || fincaInput.value.trim() === '') {
            if (fincaInput) {
                fincaInput.classList.add('fp-error');
                fincaInput.focus();
            }
            cfMostrarToast(' El nombre de la finca es obligatorio', 'error');
            return false;
        }
        if (fincaInput) fincaInput.classList.remove('fp-error');

        var direccionInput = document.querySelector('.fpDireccion');
        if (!direccionInput || direccionInput.value.trim() === '') {
            cfMostrarToast(' La dirección es obligatoria', 'error');
            return false;
        }

        return true;
    }

    // ============================================
    // 13. FUNCIÓN PARA GUARDAR FINCA
    // ============================================
    function guardarFinca() {
        if (!validarFormulario()) return null;

        console.log(' Guardando finca...');

        var galeria = [];
        try {
            galeria = JSON.parse(localStorage.getItem('cf_galeria')) || [];
        } catch (e) {
            galeria = [];
        }

        var finca = {
            id: 'finca-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            nombre: nombreCompleto,
            apellido: apellidoCompleto,
            correo: email,
            nombreFinca: document.querySelector('.fpFinca')?.value?.trim() || '',
            tipoProduccion: document.querySelector('.fpProduccion')?.value || '',
            departamento: document.querySelector('.fpDepartamento')?.value || '',
            direccion: document.querySelector('.fpDireccion')?.value?.trim() || '',
            descripcion: document.querySelector('.fpDescripcion')?.value?.trim() || '',
            foto: foto,
            galeria: galeria,
            fechaCreacion: new Date().toISOString()
        };

        var fincas = [];
        try {
            fincas = JSON.parse(localStorage.getItem('misFincas')) || [];
        } catch (e) {
            fincas = [];
        }

        fincas.push(finca);
        localStorage.setItem('misFincas', JSON.stringify(fincas));

        // Limpiar datos temporales
        FIELDS.forEach(function (field) {
            localStorage.removeItem('cf_' + field.id);
        });
        localStorage.removeItem('cf_foto');
        localStorage.removeItem('cf_galeria');

        console.log(' Finca guardada:', finca);
        return finca;
    }

    // ============================================
    // 14. BOTÓN GUARDAR (SI NO HAY FORMULARIO)
    // ============================================
    if (btnGuardar && !form) {
        var nuevoBtnGuardar = btnGuardar.cloneNode(true);
        btnGuardar.parentNode.replaceChild(nuevoBtnGuardar, btnGuardar);

        nuevoBtnGuardar.addEventListener('click', function (e) {
            e.preventDefault();

            var finca = guardarFinca();

            if (finca) {
                cfMostrarToast(' Finca creada exitosamente', 'success');
                setTimeout(function () {
                    window.location.href = '/frontend/public/views/views_farm_new2.html';
                }, 1600);
            }
        });
    }

    // ============================================
    // 15. SUBMIT DEL FORMULARIO (SI EXISTE)
    // ============================================
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var finca = guardarFinca();

            if (finca) {
                cfMostrarToast(' Finca creada exitosamente', 'success');
                setTimeout(function () {
                    window.location.href = '/frontend/public/views/views_farm_new2.html';
                }, 1600);
            }
        });
    }

    // ============================================
    // 16. FUNCIONES DE GALERÍA (mejoradas)
    // ============================================
}

// ============================================
// FUNCIONES GLOBALES DE GALERÍA
// ============================================

function cfSetSlotImage(slot, dataURL) {
    var label = document.querySelector('.fp-gallery-slot[data-slot="' + slot + '"]');
    if (!label) return;

    // Eliminar elementos previos
    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function (el) { el.remove(); });

    label.classList.add('has-image');
    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = 'none';

    var img = document.createElement('img');
    img.src = dataURL;
    img.className = 'fp-gallery-preview';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:8px;';
    label.appendChild(img);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fp-gallery-remove';
    btn.innerHTML = '×';
    btn.style.cssText = 'position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:rgba(255,0,0,0.8);color:white;border:none;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;';
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        cfClearSlot(slot);
        cfSaveGallery();
    });
    label.appendChild(btn);
}

function cfClearSlot(slot) {
    var label = document.querySelector('.fp-gallery-slot[data-slot="' + slot + '"]');
    if (!label) return;

    label.querySelectorAll('.fp-gallery-preview, .fp-gallery-remove').forEach(function (el) { el.remove(); });
    label.classList.remove('has-image');

    var plusEl = label.querySelector('.fp-gallery-plus');
    if (plusEl) plusEl.style.display = 'flex';

    var input = label.querySelector('.fp-gallery-input');
    if (input) input.value = '';
}

function cfSaveGallery() {
    var galeria = [];
    for (var i = 0; i < 4; i++) {
        var label = document.querySelector('.fp-gallery-slot[data-slot="' + i + '"]');
        var img = label ? label.querySelector('.fp-gallery-preview') : null;
        galeria.push(img ? img.src : '');
    }
    localStorage.setItem('cf_galeria', JSON.stringify(galeria));
    console.log(' Galería guardada:', galeria.filter(f => f !== '').length + ' fotos');
}

function cfMostrarToast(msg, tipo = 'success') {
    var toast = document.createElement('div');
    toast.textContent = msg;

    var color = tipo === 'success' ? '#10b981' : '#ef4444';

    toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:' + color + ';color:#fff;padding:14px 28px;border-radius:8px;font-size:1.6rem;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:all 0.3s ease;opacity:0';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(function () {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 2000);
}