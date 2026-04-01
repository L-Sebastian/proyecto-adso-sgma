document.addEventListener('DOMContentLoaded', function () {
    const bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    const bodyURL = '/static/views/components/edit_profile.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            bodyContainer.innerHTML = data;
            initProfileView();
        })
        .catch(function (error) {
            console.error('Error cargando el cuerpo de la página:', error);
        });
});

function initProfileView() {
    // Usar clases en lugar de IDs
    const photoInput = document.querySelector('.photoInput');
    const avatarImg = document.querySelector('.avatarImg');
    const avatarSvg = document.querySelector('.avatarSvg');
    const uploadBtn = document.querySelector('.uploadBtn');
    const editBtn   = document.querySelector('.editBtn');
    const profileName = document.querySelector('.profileName');
    const btnBack = document.querySelector('.btnGoBack');

    // 🔥 OBTENER USUARIO LOGUEADO
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.error("No hay usuario logueado");
        return;
    }

    // Mapeo de clases para cada campo
    const fieldClasses = {
        'firstName'         : '.inputFirstName',
        'secondName'        : '.inputSecondName',
        'firstLastName'     : '.inputFirstLastName',
        'secondLastName'    : '.inputSecondLastName',
        'email'             : '.inputEmail',
        'departamento'      : '.selectDepartamento',
        'address'           : '.inputAddress',
        'telefono'          : '.inputTelefono',
        'password'          : '.inputPassword'
    };

    /* ── Restaurar foto guardada ── */
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto && avatarImg && avatarSvg) {
        avatarImg.src = savedPhoto;
        avatarImg.style.display = 'block';
        avatarSvg.style.display = 'none';
    }

    /* ── Restaurar datos del usuario logueado ── */
    for (const [fieldName, className] of Object.entries(fieldClasses)) {
        const element = document.querySelector(className);

        if (element && currentUser[fieldName] !== undefined) {
            if (element.tagName === 'SELECT') {
                for (let i = 0; i < element.options.length; i++) {
                    if (element.options[i].value === currentUser[fieldName]) {
                        element.selectedIndex = i;
                        break;
                    }
                }
            } else {
                element.value = currentUser[fieldName];
            }
        }
    }

    /* ── Actualizar nombre debajo del avatar ── */
    if (profileName) {
        const first = (currentUser.firstName || '').trim();
        const second = (currentUser.secondName || '').trim();
        const last1 = (currentUser.firstLastName || '').trim();
        const last2 = (currentUser.secondLastName || '').trim();
        const full = [first, second, last1, last2].filter(Boolean).join(' ');
        if (full) profileName.textContent = full;
    }

    /* ── Actualizar navbar con datos guardados ── */
    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }

    /* ── Subir Foto ── */
    if (uploadBtn && photoInput) {
        // Limpiar event listeners anteriores
        const newUploadBtn = uploadBtn.cloneNode(true);
        uploadBtn.parentNode.replaceChild(newUploadBtn, uploadBtn);
        
        newUploadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            photoInput.click();
        });

        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const dataURL = e.target.result;

                // Actualizar la imagen (usar los selectores actualizados)
                const currentAvatarImg = document.querySelector('.avatarImg');
                const currentAvatarSvg = document.querySelector('.avatarSvg');
                
                if (currentAvatarImg && currentAvatarSvg) {
                    currentAvatarImg.src = dataURL;
                    currentAvatarImg.style.display = 'block';
                    currentAvatarSvg.style.display = 'none';
                }

                localStorage.setItem('profilePhoto', dataURL);

                /* Actualizar navbar */
                if (typeof window.aplicarDatosPerfil === 'function') {
                    window.aplicarDatosPerfil();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    /* ── Editar Perfil ── */
    if (editBtn) {
        editBtn.addEventListener('click', function () {
            window.location.href = '/static/views/views_edit_profile2.html';
        });
    }
    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); 
        window.location.href = '/static/views/index_seller.html';
    });
}