document.addEventListener("DOMContentLoaded", function(){
    const heroElement = document.querySelector(".marketed_products");

    if(heroElement){
        fetch("/frontend/public/views/components/index_components/marketed_products.html")
        .then(response => response.text())
        .then(data => {
            heroElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});