document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__product");

    if(headerElement){
        fetch("/frontend/public/views/components/header-product.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});