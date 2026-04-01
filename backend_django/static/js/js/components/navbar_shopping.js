function aplicarDatosNavbar() {

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

    /* 🔥 NUEVO: Nombre del usuario */
    const nameElement = document.querySelector('[data-profile-name]');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (nameElement && currentUser) {
        const first = (currentUser.firstName || '').trim();
        const last  = (currentUser.firstLastName || '').trim();

        nameElement.textContent = first + " " + last;
    }

    /* Llamar función global por si hay otros navbars en el DOM */
    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }
}