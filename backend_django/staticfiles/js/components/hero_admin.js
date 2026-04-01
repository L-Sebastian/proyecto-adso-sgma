document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".hero__content__admin");

    if(heroElement){
        fetch("/static/views/components/hero-admin.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;

            aplicarDatosNavbar();
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});



// Avatar

function aplicarDatosNavbar() {

    const foto = localStorage.getItem('profilePhoto');

    const avatarImgs = document.querySelectorAll('[data-profile-photo]');
    const avatarSvgs = document.querySelectorAll('[data-profile-svg]');

    avatarImgs.forEach(function(img, index){

        const svg = avatarSvgs[index];

        if (foto) {
            img.src = foto;
            img.style.display = 'block';

            if (svg) svg.style.display = 'none';

        } else {

            img.style.display = 'none';

            if (svg) svg.style.display = 'block';
        }

    });

    if (typeof window.aplicarDatosPerfil === 'function') {
        window.aplicarDatosPerfil();
    }

}