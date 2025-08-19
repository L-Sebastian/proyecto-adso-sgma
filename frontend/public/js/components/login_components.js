document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".cuerpo");

    if(headerElement){
        fetch("/frontend/public/views/components/login_components.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el hero", error));
    }   
});