document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".hero__index");

    if(heroElement){
        fetch("/frontend/public/views/components/blog_components/hero_index.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});