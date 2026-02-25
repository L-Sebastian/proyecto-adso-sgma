/**
 * profile_data.js
 * Función global que actualiza nombre y foto en CUALQUIER elemento
 * del DOM que tenga los atributos data-profile-name / data-profile-photo / data-profile-svg
 */

function aplicarDatosPerfil() {

    const first  = (localStorage.getItem('profile_firstName')      || '').trim();
    const second = (localStorage.getItem('profile_secondName')     || '').trim();
    const last1  = (localStorage.getItem('profile_firstLastName')  || '').trim();
    const last2  = (localStorage.getItem('profile_secondLastName') || '').trim();
    const foto   = localStorage.getItem('profilePhoto') || '';

    const fullName = [first, second, last1, last2].filter(Boolean).join(' ');

    /* ── Nombre completo ── */
    if (fullName) {
        document.querySelectorAll('[data-profile-name]').forEach(function (el) {
            el.textContent = fullName;
        });
    }

    /* ── Foto de perfil: muestra img y oculta SVG si hay foto guardada ── */
    document.querySelectorAll('[data-profile-photo]').forEach(function (img) {
        if (foto) {
            img.src = foto;
            img.style.display = 'block';

            /* Ocultar el SVG hermano si existe */
            const svg = img.closest('.avatar-profile')?.querySelector('[data-profile-svg]');
            if (svg) svg.style.display = 'none';
        }
    });
}

window.aplicarDatosPerfil = aplicarDatosPerfil;