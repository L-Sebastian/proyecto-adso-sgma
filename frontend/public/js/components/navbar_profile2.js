document.addEventListener('DOMContentLoaded', function () {

    const navContainer = document.querySelector('.navbar-bottom-profile');
    if (!navContainer) return;

    const bodyURL = '/frontend/public/views/components/navbar_profile.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            navContainer.innerHTML = data;

            /* El HTML ya está en el DOM → aplicar nombre y foto desde localStorage */
            aplicarDatosNavbar();
        })
        .catch(function (error) {
            console.error('Error cargando el navbar:', error);
        });
});

function aplicarDatosNavbar() {

    /* ── Nombre completo ── */
    const nameSpan = document.querySelector('[data-profile-name]');
    if (nameSpan) {
        const first  = (localStorage.getItem('profile_firstName')      || '').trim();
        const second = (localStorage.getItem('profile_secondName')     || '').trim();
        const last1  = (localStorage.getItem('profile_firstLastName')  || '').trim();
        const last2  = (localStorage.getItem('profile_secondLastName') || '').trim();

        const fullName = [first, second, last1, last2].filter(Boolean).join(' ');
        if (fullName) nameSpan.textContent = fullName;
    }

    /* ── Foto de perfil ── */
    const avatarImg = document.querySelector('[data-profile-photo]');
    const avatarSvg = document.querySelector('[data-profile-svg]');
    const foto = localStorage.getItem('profilePhoto');

    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    }

    /* También llamar a la función global por si otros navbars están en el DOM */
    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }
}