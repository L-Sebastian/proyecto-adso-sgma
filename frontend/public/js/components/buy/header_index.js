document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__buy");

    if(headerElement){
        fetch("/frontend/public/views/components/Buy/header.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});