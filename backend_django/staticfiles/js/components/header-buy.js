document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__buy");

    if(headerElement){
        fetch("/static/views/components/header-buy.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});