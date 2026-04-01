document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".products__discount");

    if(heroElement){
        fetch("/static/views/components/products-discount.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});