document.addEventListener('DOMContentLoaded', function () {

    var container = document.querySelector('.main-content-finca');
    if (!container) return;

    fetch('/frontend/public/views/components/create_farm_step1.html')
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
    // 1. ELEMENTOS DEL DOM (coinciden con HTML)
    // ============================================
    const photoInput = document.querySelector('.fpEdPhotoInput');
    const avatarLabel = document.querySelector('.fpEd-avatar');
    const avatarImg = document.querySelector('.fpEdAvatarImg');
    const avatarSvg = document.querySelector('.fpEdAvatarSvg');
    const btnSubirFoto = document.querySelector('.fpEdBtnsubirFoto');   // clase exacta
    const btnEliminarFoto = document.querySelector('.fpEdBtnEliminarFoto'); // clase exacta
    const btnVolver = document.querySelector('.fpEdBtnVolver');        // clase exacta
    const btnGuardar = document.querySelector('.fpEdBtnGuardar');      // clase exacta
    const form = document.querySelector('.fpEdForm');

    console.log('Elementos encontrados:', {
        photoInput: !!photoInput,
        avatarLabel: !!avatarLabel,
        btnSubirFoto: !!btnSubirFoto,
        btnEliminarFoto: !!btnEliminarFoto,
        btnVolver: !!btnVolver,
        btnGuardar: !!btnGuardar,
        form: !!form
    });

    let foto = localStorage.getItem('cf_foto') || '';

    // ============================================
    // 2. CAMPOS DEL FORMULARIO (clases del HTML)
    // ============================================
    const FIELDS = [
        { id: 'produccion', cls: '.fpEdProduccion', tag: 'select' },
        { id: 'departamento', cls: '.fpEdDepartamento', tag: 'select' },
        { id: 'direccion', cls: '.fpEdDireccion', tag: 'input' },
        { id: 'descripcion', cls: '.fpEdDescripcion', tag: 'textarea' }
    ];

    // ============================================
    // 3. CARGAR DATOS DEL PERFIL (si los campos existen)
    // ============================================
    // Nota: el HTML no tiene campos de nombre/apellido/correo, por lo que omitimos esa parte.
    // Si en el futuro se añaden, se pueden descomentar.

    // ============================================
    // 4. RESTAURAR DATOS GUARDADOS
    // ============================================
    // Foto
    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    // Restaurar galería
    let galeriaGuardada = [];
    try {
        galeriaGuardada = JSON.parse(localStorage.getItem('cf_galeria')) || [];
    } catch (e) {}
    galeriaGuardada.forEach((dataURL, i) => {
        if (dataURL) cfSetSlotImage(i, dataURL);
    });

    // Restaurar campos de texto
    FIELDS.forEach(field => {
        const saved = localStorage.getItem('cf_' + field.id);
        if (saved !== null) {
            const el = document.querySelector(field.cls);
            if (el) el.value = saved;
        }
    });

    // ============================================
    // 5. GUARDAR CAMPOS EN TIEMPO REAL
    // ============================================
    FIELDS.forEach(field => {
        const el = document.querySelector(field.cls);
        if (el) {
            el.addEventListener('input', () => localStorage.setItem('cf_' + field.id, el.value));
            if (field.tag === 'select') {
                el.addEventListener('change', () => localStorage.setItem('cf_' + field.id, el.value));
            }
        }
    });

    // ============================================
    // 6. FUNCIONES PARA MANEJO DE FOTO PRINCIPAL
    // ============================================
    function aplicarFoto(dataURL) {
        foto = dataURL;
        if (avatarImg) {
            avatarImg.src = foto;
            avatarImg.style.display = 'block';
        }
        if (avatarSvg) avatarSvg.style.display = 'none';
        localStorage.setItem('cf_foto', foto);
        console.log('Foto principal aplicada');
    }

    // ============================================
    // 7. BOTÓN SUBIR FOTO
    // ============================================
    if (btnSubirFoto && photoInput) {
        // Clonar para evitar duplicados
        const newBtn = btnSubirFoto.cloneNode(true);
        btnSubirFoto.parentNode.replaceChild(newBtn, btnSubirFoto);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            photoInput.click();
        });
    }

    // También el avatar puede abrir el input
    if (avatarLabel && photoInput) {
        avatarLabel.addEventListener('click', (e) => {
            e.preventDefault();
            photoInput.click();
        });
    }

    // ============================================
    // 8. INPUT FILE - FOTO PRINCIPAL
    // ============================================
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => aplicarFoto(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // ============================================
    // 9. ELIMINAR FOTO PRINCIPAL
    // ============================================
    if (btnEliminarFoto) {
        const newBtn = btnEliminarFoto.cloneNode(true);
        btnEliminarFoto.parentNode.replaceChild(newBtn, btnEliminarFoto);
        newBtn.addEventListener('click', () => {
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
    const gallerySlots = document.querySelectorAll('.fpEd-gallery-slot');
    gallerySlots.forEach(slot => {
        const input = slot.querySelector('.fpEd-gallery-input');
        if (!input) return;

        // Clonar para evitar listeners duplicados
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);

        newInput.addEventListener('change', function () {
            const slotIndex = parseInt(slot.dataset.slot);
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                cfSetSlotImage(slotIndex, e.target.result);
                cfSaveGallery();
            };
            reader.readAsDataURL(file);
        });
    });

    // ============================================
    // 11. BOTÓN VOLVER
    // ============================================
    if (btnVolver) {
        const newBtn = btnVolver.cloneNode(true);
        btnVolver.parentNode.replaceChild(newBtn, btnVolver);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/frontend/public/views/views_farm_new.html'; // ajusta según tu ruta
        });
    }

    // ============================================
    // 12. FUNCIÓN PARA VALIDAR FORMULARIO
    // ============================================
    function validarFormulario() {
        // No hay campo 'fpEdFinca' en el HTML, así que lo omitimos o usamos otro.
        // Según el HTML, el nombre de la finca no está en este formulario, solo tipo, depto, dirección, descripción.
        // Por tanto, no hay campo obligatorio que validar. Añadimos validación de dirección.
        const direccion = document.querySelector('.fpEdDireccion');
        if (!direccion || direccion.value.trim() === '') {
            cfMostrarToast('❌ La dirección de la finca es obligatoria', 'error');
            return false;
        }
        return true;
    }

    // ============================================
    // 13. FUNCIÓN PARA GUARDAR FINCA
    // ============================================
    function guardarFinca() {
        if (!validarFormulario()) return null;

        // Obtener datos del perfil (si no existen, usar valores por defecto)
        const firstName = localStorage.getItem('profile_firstName') || '';
        const secondName = localStorage.getItem('profile_secondName') || '';
        const lastName1 = localStorage.getItem('profile_firstLastName') || '';
        const lastName2 = localStorage.getItem('profile_secondLastName') || '';
        const email = localStorage.getItem('profile_email') || '';
        const nombreCompleto = [firstName, secondName].filter(Boolean).join(' ');
        const apellidoCompleto = [lastName1, lastName2].filter(Boolean).join(' ');

        // Obtener galería actualizada
        let galeria = [];
        for (let i = 0; i < 4; i++) {
            const slot = document.querySelector(`.fpEd-gallery-slot[data-slot="${i}"]`);
            const img = slot ? slot.querySelector('.fpEd-gallery-preview') : null;
            galeria.push(img ? img.src : '');
        }

        const finca = {
            id: 'finca-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            nombre: nombreCompleto,
            apellido: apellidoCompleto,
            correo: email,
            nombreFinca: '', // No hay campo en el formulario, se puede omitir
            tipoProduccion: document.querySelector('.fpEdProduccion')?.value || '',
            departamento: document.querySelector('.fpEdDepartamento')?.value || '',
            direccion: document.querySelector('.fpEdDireccion')?.value?.trim() || '',
            descripcion: document.querySelector('.fpEdDescripcion')?.value?.trim() || '',
            foto: foto,
            galeria: galeria,
            fechaCreacion: new Date().toISOString()
        };

        let fincas = [];
        try {
            fincas = JSON.parse(localStorage.getItem('misFincas')) || [];
        } catch (e) {}

        fincas.push(finca);
        localStorage.setItem('misFincas', JSON.stringify(fincas));

        // Limpiar datos temporales
        FIELDS.forEach(field => localStorage.removeItem('cf_' + field.id));
        localStorage.removeItem('cf_foto');
        localStorage.removeItem('cf_galeria');

        console.log('Finca guardada:', finca);
        return finca;
    }

    // ============================================
    // 14. BOTÓN GUARDAR
    // ============================================
    if (btnGuardar) {
        const newBtn = btnGuardar.cloneNode(true);
        btnGuardar.parentNode.replaceChild(newBtn, btnGuardar);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const finca = guardarFinca();
            if (finca) {
                cfMostrarToast('✅ Finca creada exitosamente', 'success');
                setTimeout(() => {
                    window.location.href = '/frontend/public/views/views_farm_new2.html'; // ajusta ruta
                }, 1600);
            }
        });
    }

    // ============================================
    // 15. SUBMIT DEL FORMULARIO
    // ============================================
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const finca = guardarFinca();
            if (finca) {
                cfMostrarToast('✅ Finca creada exitosamente', 'success');
                setTimeout(() => {
                    window.location.href = '/frontend/public/views/views_farm_new2.html';
                }, 1600);
            }
        });
    }
}

