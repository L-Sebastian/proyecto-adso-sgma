/**
 * profile_data.js
 * Script global que actualiza nombre y foto de perfil en CUALQUIER navbar.
 * Incluirlo en todas las páginas que tengan navbar con estos selectores.
 *
 * Selectores que actualiza:
 *   - [data-profile-name]   → rellena con el nombre completo
 *   - [data-profile-photo]  → rellena src con la foto de perfil
 */

function aplicarDatosPerfil() {

    const first  = (localStorage.getItem('profile_firstName')      || '').trim();
    const second = (localStorage.getItem('profile_secondName')     || '').trim();
    const last1  = (localStorage.getItem('profile_firstLastName')  || '').trim();
    const last2  = (localStorage.getItem('profile_secondLastName') || '').trim();
    const foto   = localStorage.getItem('profilePhoto') || '';

    const fullName = [first, second, last1, last2].filter(Boolean).join(' ');

    /* Actualiza TODOS los elementos con data-profile-name */
    if (fullName) {
        document.querySelectorAll('[data-profile-name]').forEach(function (el) {
            el.textContent = fullName;
        });
    }

    /* Actualiza TODOS los elementos con data-profile-photo */
    if (foto) {
        document.querySelectorAll('[data-profile-photo]').forEach(function (el) {
            el.src = foto;
        });
    }
}

/* Se exporta para llamarla después de que el navbar se inserte en el DOM */
window.aplicarDatosPerfil = aplicarDatosPerfil;