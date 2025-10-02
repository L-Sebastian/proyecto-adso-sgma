document.addEventListener("DOMContentLoaded", function(){
    const headerElement = document.querySelector(".header__blog");

    if(headerElement){
        fetch("/frontend/public/views/components/blog_components/header_blog.html")
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        })

    .catch(error => console.log("Error cargando el header", error));
    }   
});