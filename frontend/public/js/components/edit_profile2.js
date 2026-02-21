document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.container-main-profile');
    if (!bodyContainer) return;

    const bodyURL = '/frontend/public/views/components/edit_profile2.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            bodyContainer.innerHTML = data;
            initProfileEdit();
        })
        .catch(function (error) {
            console.error('Error cargando el cuerpo de la página:', error);
        });
});

function initProfileEdit() {

    const avatarImg   = document.getElementById('avatarImgProfile');
    const avatarSvg   = document.getElementById('avatarSvgProfile');
    const nameDisplay = document.getElementById('profileNameProfile');
    const btnVolver   = document.getElementById('btnVolver');
    const btnGuardar  = document.getElementById('btnGuardar');

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

    /* ── Actualizar nombre mostrado en tiempo real ── */
    function updateName() {
        if (!nameDisplay) return;
        const first  = document.getElementById('firstName')?.value.trim()  || '';
        const second = document.getElementById('secondName')?.value.trim() || '';
        const last1  = document.getElementById('firstLastName')?.value.trim()  || '';
        const last2  = document.getElementById('secondLastName')?.value.trim() || '';
        const line1  = [first, second].filter(Boolean).join(' ');
        const line2  = [last1,  last2].filter(Boolean).join(' ');
        nameDisplay.innerHTML = line1 + (line2 ? '<br>' + line2 : '');
    }

    ['firstName', 'secondName', 'firstLastName', 'secondLastName'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateName);
    });

    updateName();

    /* ── Botón Volver ── */
    if (btnVolver) {
        btnVolver.addEventListener('click', function () {
            window.location.href = '/frontend/public/views/views_edit_profile.html';
        });
    }

    /* ── Botón Guardar ── */
    if (btnGuardar) {
        btnGuardar.addEventListener('click', function () {
            FIELDS.forEach(function (id) {
                const el = document.getElementById(id);
                if (el) localStorage.setItem('profile_' + id, el.value);
            });
            window.location.href = '/frontend/public/views/views_welcome.html';
        });
    }
}