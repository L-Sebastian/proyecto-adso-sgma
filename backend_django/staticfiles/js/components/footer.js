document.addEventListener("DOMContentLoaded", function(){
    const footerElement = document.querySelector(".footer-container");

    if(footerElement){
        fetch("/static/views/components/footer.html")
        .then(response => response.text())
        .then(data => {
            footerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el footer", error));
    }   
});