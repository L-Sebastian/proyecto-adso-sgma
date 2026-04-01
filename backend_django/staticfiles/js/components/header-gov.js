document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__gov");

    if(headerElement){
        fetch("/static/views/components/header-gov.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});