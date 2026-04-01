document.addEventListener("DOMContentLoaded", function(){
    const login_componentElement = document.querySelector(".cuerpo");

    if(headerElement){
        fetch("/frontend/public/views/components/login_component.html")
        .then(response => response.text())
        .then(data => {
            login_componentElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el login", error));
    }   
});