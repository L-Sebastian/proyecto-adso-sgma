document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.main-content');
    if (!bodyContainer) return;

    const bodyURL = '/frontend/public/views/components/edit_profile.html';

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

    const photoInput  = document.getElementById('photoInput');
    const avatarImg   = document.getElementById('avatarImg');
    const avatarSvg   = document.getElementById('avatarSvg');
    const uploadBtn   = document.getElementById('uploadBtn');
    const editBtn     = document.getElementById('editBtn');
    const profileName = document.getElementById('profileName');

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

    /* ── Actualizar nombre debajo del avatar ── */
    if (profileName) {
        const first  = (localStorage.getItem('profile_firstName')      || '').trim();
        const second = (localStorage.getItem('profile_secondName')     || '').trim();
        const last1  = (localStorage.getItem('profile_firstLastName')  || '').trim();
        const last2  = (localStorage.getItem('profile_secondLastName') || '').trim();
        const full   = [first, second, last1, last2].filter(Boolean).join(' ');
        if (full) profileName.textContent = full;
    }

    /* ── Actualizar navbar con datos guardados ── */
    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }

    /* ── Subir Foto ── */
    if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', function () {
            photoInput.click();
        });

        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const dataURL = e.target.result;
                if (avatarImg && avatarSvg) {
                    avatarImg.src = dataURL;
                    avatarImg.style.display = 'block';
                    avatarSvg.style.display = 'none';
                }
                localStorage.setItem('profilePhoto', dataURL);

                /* Actualizar foto en el navbar también */
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
            window.location.href = '/frontend/public/views/views_edit_profile2.html';
        });
    }
}