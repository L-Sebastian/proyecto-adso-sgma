document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".community-hero");

    if(heroElement){
        fetch("/frontend/public/views/components/hero-tree.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});