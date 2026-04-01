document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__events");

    if(headerElement){
        fetch("/frontend/public/views/components/header-events.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});