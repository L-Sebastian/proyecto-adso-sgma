document.addEventListener('DOMContentLoaded', function () {

    const navContainer = document.querySelector('.navbar-bottom-product');
    if (!navContainer) return;

    /* BUG CORREGIDO: la ruta decía 'navbar_create_profile.html' en vez de 'navbar_create_product.html' */
    const bodyURL = '/frontend/public/views/components/navbar_create_product.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            navContainer.innerHTML = data;
            aplicarDatosNavbar();
        })
        .catch(function (error) {
            console.error('Error cargando el navbar:', error);
        });
});

function aplicarDatosNavbar() {

    /* ── Nombre completo desde localStorage ── */
    const nameSpan = document.querySelector('[data-profile-name]');
    if (nameSpan) {
        const first  = (localStorage.getItem('profile_firstName')      || '').trim();
        const second = (localStorage.getItem('profile_secondName')     || '').trim();
        const last1  = (localStorage.getItem('profile_firstLastName')  || '').trim();
        const last2  = (localStorage.getItem('profile_secondLastName') || '').trim();

        const fullName = [first, second, last1, last2].filter(Boolean).join(' ');
        if (fullName) nameSpan.textContent = fullName;
    }

    /* ── Foto de perfil desde localStorage ── */
    const avatarImg = document.querySelector('[data-profile-photo]');
    const avatarSvg = document.querySelector('[data-profile-svg]');
    const foto = localStorage.getItem('profilePhoto');

    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    } else if (avatarSvg) {
        /* Sin foto → mostrar SVG por defecto */
        avatarSvg.style.display = 'block';
    }

    /* Llamar función global por si hay otros navbars en el DOM */
    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }
}