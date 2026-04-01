document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".hero__blog");

    if(heroElement){
        fetch("/static/views/components/hero-blog.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});