document.addEventListener('DOMContentLoaded', function () {

    const navContainer = document.querySelector('.navbar-bottom-product');
    if (!navContainer) return;

    const bodyURL = '/frontend/public/views/components/navbar-edit-product.html';

    fetch(bodyURL)
        .then(function (response) {
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return response.text();
        })
        .then(function (data) {
            navContainer.innerHTML = data;

            /* El HTML ya está en el DOM → aplicar nombre y foto */
            aplicarDatosNavbar();
        })
        .catch(function (error) {
            console.error('Error cargando el navbar:', error);
        });
});

function aplicarDatosNavbar() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        console.warn("No hay usuario logueado");
        return;
    }

    /* ── Nombre completo ── */
    const nameSpan = document.querySelector('[data-profile-name]');
    if (nameSpan) {
        const fullName = [
            currentUser.firstName,
            currentUser.secondName,
            currentUser.firstLastName,
            currentUser.secondLastName
        ].filter(Boolean).join(' ');

        nameSpan.textContent = fullName;
    }

    /* ── Foto de perfil ── */
    const avatarImg = document.querySelector('[data-profile-photo]');
    const avatarSvg = document.querySelector('[data-profile-svg]');
    const foto = localStorage.getItem('profilePhoto');

    if (foto && avatarImg) {
        avatarImg.src = foto;
        avatarImg.style.display = 'block';
        if (avatarSvg) avatarSvg.style.display = 'none';
    } else if (avatarSvg) {
        avatarSvg.style.display = 'block';
    }
}