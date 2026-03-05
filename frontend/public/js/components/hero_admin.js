document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".hero__content__admin");

    if(heroElement){
        fetch("/frontend/public/views/components/hero-admin.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});