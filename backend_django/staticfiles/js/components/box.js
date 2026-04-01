document.addEventListener("DOMContentLoaded", function(){
    const boxElement = document.querySelector(".box-container");

    if(boxElement){
        fetch("/static/views/components/box.html")
        .then(response => response.text())
        .then(data => {
            boxElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando box", error));
    }   
});