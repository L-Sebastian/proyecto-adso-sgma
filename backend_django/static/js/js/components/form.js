document.addEventListener("DOMContentLoaded", function(){
    const formElement = document.querySelector(".form");

    if(formElement){
        fetch("/frontend/public/views/components/form.html")
        .then(response => response.text())
        .then(data => {
            formElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el form", error));
    }   
});