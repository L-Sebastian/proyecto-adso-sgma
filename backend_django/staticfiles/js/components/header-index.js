document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__index");

    if(headerElement){
        fetch("/static/views/components/header-index.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});